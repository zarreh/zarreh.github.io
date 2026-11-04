"""FastAPI app: POST /ask streams a cited answer as server-sent events."""

from __future__ import annotations

import asyncio
import contextlib
import json
import logging
import time
from collections.abc import AsyncIterator, Callable
from contextlib import asynccontextmanager
from dataclasses import dataclass, field

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel, Field

from .corpus import Embedder, Index, load_corpus
from .guardrails import (
    BUSY_REPLY,
    NO_CONTEXT_REPLY,
    SYSTEM_PROMPT,
    build_context,
    cited_sources,
    invalid_citations,
    screen_input,
)
from .limits import Budget, RateLimiter
from .llm import FailoverChain, OpenAICompatible, Provider, Usage, openai_embedder
from .settings import Settings, get_settings

log = logging.getLogger("ask_api")


class Turn(BaseModel):
    role: str = Field(pattern="^(user|assistant)$")
    content: str = Field(max_length=2000)


class AskRequest(BaseModel):
    question: str = Field(min_length=1, max_length=2000)
    history: list[Turn] = Field(default_factory=list, max_length=6)


@dataclass
class State:
    settings: Settings
    provider: Provider | None
    embedder: Embedder | None
    index: Index | None = None
    generated: str = ""
    limiter: RateLimiter = field(init=False)
    budget: Budget = field(init=False)

    def __post_init__(self) -> None:
        s = self.settings
        self.limiter = RateLimiter(s.rate_per_minute, s.rate_per_day)
        self.budget = Budget(s.daily_budget_usd, s.price_in_per_1k, s.price_out_per_1k)

    def reload(self) -> None:
        chunks, generated = load_corpus(self.settings.corpus_path, self.settings.corpus_url)
        index = Index(chunks, self.embedder)
        self.index, self.generated = index, generated
        log.info("corpus loaded: %d chunks (%s, %s)", len(index), index.fingerprint, generated)


def default_provider(s: Settings) -> Provider | None:
    providers: list[Provider] = []
    if s.openai_api_key:
        providers.append(
            OpenAICompatible(
                s.openai_api_key.get_secret_value(), s.model, s.openai_base_url, "primary"
            )
        )
    if s.fallback_api_key and s.fallback_model:
        providers.append(
            OpenAICompatible(
                s.fallback_api_key.get_secret_value(),
                s.fallback_model,
                s.fallback_base_url,
                "fallback",
            )
        )
    return FailoverChain(providers) if providers else None


def default_embedder(s: Settings) -> Embedder | None:
    if s.openai_api_key and s.embedding_model:
        return openai_embedder(
            s.openai_api_key.get_secret_value(), s.embedding_model, s.openai_base_url
        )
    return None


def sse(event: str, data: object) -> str:
    return f"event: {event}\ndata: {json.dumps(data, ensure_ascii=False)}\n\n"


def create_app(
    settings: Settings | None = None,
    provider: Provider | None = None,
    embedder: Embedder | None = None,
    provider_factory: Callable[[Settings], Provider | None] = default_provider,
    embedder_factory: Callable[[Settings], Embedder | None] = default_embedder,
) -> FastAPI:
    s = settings or get_settings()
    state = State(
        settings=s,
        provider=provider if provider is not None else provider_factory(s),
        embedder=embedder if embedder is not None else embedder_factory(s),
    )

    @asynccontextmanager
    async def lifespan(_: FastAPI):
        await asyncio.to_thread(state.reload)
        task = asyncio.create_task(_refresh_forever())
        yield
        task.cancel()
        with contextlib.suppress(asyncio.CancelledError):
            await task

    async def _refresh_forever() -> None:
        while True:
            await asyncio.sleep(max(1, s.refresh_minutes) * 60)
            try:
                await asyncio.to_thread(state.reload)
            except Exception as exc:  # noqa: BLE001 — keep serving the previous index
                log.warning("corpus refresh failed: %s", exc)

    app = FastAPI(title="zarreh.ai ask-api", docs_url=None, redoc_url=None, lifespan=lifespan)
    app.state.ask = state
    app.add_middleware(
        CORSMiddleware,
        allow_origins=s.allowed_origins,
        allow_methods=["GET", "POST"],
        allow_headers=["Content-Type"],
        max_age=600,
    )

    def client_key(request: Request) -> str:
        if s.trust_proxy:
            real = request.headers.get("x-real-ip") or request.headers.get("x-forwarded-for", "")
            if real:
                return real.split(",")[0].strip()
        return request.client.host if request.client else "unknown"

    @app.get("/healthz")
    async def healthz():
        return {
            "status": "ok" if state.index and state.provider else "degraded",
            "chunks": len(state.index) if state.index else 0,
            "corpus_generated": state.generated,
            "model": bool(state.provider),
            "available": state.budget.available(),
        }

    @app.post("/ask")
    async def ask(body: AskRequest, request: Request):
        allowed, retry_after = state.limiter.allow(client_key(request))
        if not allowed:
            return JSONResponse(
                {
                    "error": "rate_limited",
                    "message": "Too many questions — please try again shortly.",
                },
                status_code=429,
                headers={"Retry-After": str(retry_after)},
            )
        if state.index is None or state.provider is None:
            return JSONResponse({"error": "unavailable", "message": BUSY_REPLY}, status_code=503)
        if not state.budget.available():
            return JSONResponse({"error": "budget", "message": BUSY_REPLY}, status_code=503)

        verdict = screen_input(body.question, s.max_question_chars)
        if s.log_questions:
            log.info("question=%r verdict=%s", body.question[:200], verdict.reason or "ok")
        if not verdict.allowed:
            return StreamingResponse(
                _canned(verdict.reply or "", verdict.reason or "refused"),
                media_type="text/event-stream",
            )

        retrieval_query = " ".join(
            [t.content for t in body.history if t.role == "user"][-2:] + [body.question]
        )
        hits = state.index.search(retrieval_query, k=s.top_k, min_cosine=s.min_cosine)
        if not hits:
            return StreamingResponse(
                _canned(NO_CONTEXT_REPLY, "no_context"), media_type="text/event-stream"
            )

        sources = [
            {"n": i, "title": h.chunk.title, "section": h.chunk.section, "url": h.chunk.url}
            for i, h in enumerate(hits, 1)
        ]
        context = build_context([(h.chunk.title, h.chunk.section, h.chunk.text) for h in hits])
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            *[{"role": t.role, "content": t.content} for t in body.history[-4:]],
            {
                "role": "user",
                "content": f"Sources:\n{context}\n\nQuestion: {body.question.strip()}",
            },
        ]
        return StreamingResponse(_answer(messages, sources), media_type="text/event-stream")

    async def _canned(text: str, reason: str) -> AsyncIterator[str]:
        yield sse("sources", [])
        yield sse("token", {"t": text})
        yield sse("done", {"cited": [], "grounded": False, "reason": reason})

    async def _answer(messages: list[dict], sources: list[dict]) -> AsyncIterator[str]:
        assert state.provider is not None
        usage = Usage()
        answer: list[str] = []
        started = time.perf_counter()
        yield sse("sources", sources)
        try:
            async for token in state.provider.stream(messages, s.max_answer_tokens, usage):
                answer.append(token)
                yield sse("token", {"t": token})
        except Exception as exc:  # noqa: BLE001
            log.warning("generation failed: %s", type(exc).__name__)
            yield sse("error", {"message": "Something went wrong. Please try again in a moment."})
            return
        finally:
            state.budget.record(usage.tokens_in, usage.tokens_out)
        text = "".join(answer)
        cited = cited_sources(text, len(sources))
        bad = invalid_citations(text, len(sources))
        yield sse(
            "done",
            {
                "cited": cited,
                "grounded": bool(cited) and not bad,
                "invalid": bad,
                "ms": int((time.perf_counter() - started) * 1000),
            },
        )

    return app


def app_factory() -> FastAPI:
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s")
    return create_app()
