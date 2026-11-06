from __future__ import annotations

import json
from collections.abc import AsyncIterator
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from ask_api.app import create_app
from ask_api.llm import Usage
from ask_api.settings import Settings

CORPUS = str(Path(__file__).parent / "corpus.json")


class FakeProvider:
    name = "fake"

    def __init__(
        self, answer: str = "Ali increased markdown revenue by 11% [1].", fail: bool = False
    ):
        self.answer, self.fail = answer, fail
        self.calls = 0
        self.last_messages: list[dict] = []

    async def stream(
        self, messages: list[dict], max_tokens: int, usage: Usage
    ) -> AsyncIterator[str]:
        self.calls += 1
        self.last_messages = messages
        if self.fail:
            raise RuntimeError("provider down")
        usage.tokens_in += 500
        usage.tokens_out += 40
        for word in self.answer.split(" "):
            yield word + " "


def make_settings(**overrides) -> Settings:
    base = dict(
        corpus_path=CORPUS,
        openai_api_key=None,
        rate_per_minute=100,
        rate_per_day=1000,
        refresh_minutes=60,
        allowed_origins=["https://zarreh.ai"],
    )
    base.update(overrides)
    return Settings(**base)


@pytest.fixture
def provider() -> FakeProvider:
    return FakeProvider()


@pytest.fixture
def client(provider: FakeProvider):
    app = create_app(make_settings(), provider=provider, embedder_factory=lambda _: None)
    with TestClient(app) as c:
        yield c


def parse_sse(text: str) -> list[tuple[str, object]]:
    events = []
    for block in text.strip().split("\n\n"):
        lines = dict(line.split(": ", 1) for line in block.splitlines() if ": " in line)
        events.append((lines["event"], json.loads(lines["data"])))
    return events
