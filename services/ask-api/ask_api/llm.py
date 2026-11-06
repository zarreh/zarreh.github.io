"""Model providers behind one streaming interface, with failover before the first token."""

from __future__ import annotations

import logging
from collections.abc import AsyncIterator, Sequence
from dataclasses import dataclass
from typing import Protocol

import numpy as np

log = logging.getLogger("ask_api.llm")


@dataclass
class Usage:
    tokens_in: int = 0
    tokens_out: int = 0


class Provider(Protocol):
    name: str

    def stream(self, messages: list[dict], max_tokens: int, usage: Usage) -> AsyncIterator[str]: ...


class OpenAICompatible:
    """Any OpenAI-compatible chat API (OpenAI, Azure OpenAI, Gemini's OpenAI endpoint, vLLM...)."""

    def __init__(self, api_key: str, model: str, base_url: str | None = None, name: str = "openai"):
        from openai import AsyncOpenAI

        self.client = AsyncOpenAI(api_key=api_key, base_url=base_url, timeout=30, max_retries=1)
        self.model, self.name = model, name

    async def stream(
        self, messages: list[dict], max_tokens: int, usage: Usage
    ) -> AsyncIterator[str]:
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=0.1,
            max_tokens=max_tokens,
            stream=True,
            stream_options={"include_usage": True},
        )
        async for event in response:
            if event.usage:
                usage.tokens_in += event.usage.prompt_tokens or 0
                usage.tokens_out += event.usage.completion_tokens or 0
            for choice in event.choices:
                if choice.delta and choice.delta.content:
                    yield choice.delta.content


class FailoverChain:
    """Tries providers in order. Failover only happens before any text has been streamed,
    so a visitor never sees two half-answers stitched together."""

    def __init__(self, providers: Sequence[Provider]):
        if not providers:
            raise ValueError("at least one provider is required")
        self.providers = list(providers)
        self.name = "+".join(p.name for p in self.providers)

    async def stream(
        self, messages: list[dict], max_tokens: int, usage: Usage
    ) -> AsyncIterator[str]:
        last_error: Exception | None = None
        for provider in self.providers:
            started = False
            try:
                async for token in provider.stream(messages, max_tokens, usage):
                    started = True
                    yield token
                return
            except Exception as exc:  # noqa: BLE001 — any provider error triggers failover
                if started:
                    raise
                last_error = exc
                log.warning(
                    "provider %s failed before streaming: %s", provider.name, type(exc).__name__
                )
        raise RuntimeError("all providers failed") from last_error


def openai_embedder(api_key: str, model: str, base_url: str | None = None):
    from openai import OpenAI

    client = OpenAI(api_key=api_key, base_url=base_url, timeout=60, max_retries=2)

    def embed(texts: Sequence[str]) -> np.ndarray:
        vectors: list[list[float]] = []
        for start in range(0, len(texts), 96):
            batch = [t[:8000] for t in texts[start : start + 96]]
            result = client.embeddings.create(model=model, input=batch)
            vectors.extend(d.embedding for d in result.data)
        return np.array(vectors, dtype=float)

    return embed
