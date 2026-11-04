import numpy as np

from ask_api.corpus import Index, load_corpus
from ask_api.limits import Budget, RateLimiter
from tests.conftest import CORPUS


def test_bm25_finds_the_right_chunk():
    chunks, generated = load_corpus(CORPUS, "")
    assert generated
    index = Index(chunks)
    hits = index.search("adverse action notice verifier", k=3)
    assert hits[0].chunk.url == "/work/credit-decisioning/"


def test_unrelated_query_returns_nothing_without_embeddings():
    chunks, _ = load_corpus(CORPUS, "")
    assert Index(chunks).search("quantum chromodynamics lattice", k=3) == []


def test_hybrid_search_uses_semantic_signal():
    chunks, _ = load_corpus(CORPUS, "")
    vocab = ["board", "advisory", "markdown", "credit", "clinical"]

    def embed(texts):
        return np.array([[t.lower().count(w) + 0.01 for w in vocab] for t in texts])

    hits = Index(chunks, embedder=embed).search("board seat", k=2)
    assert hits[0].chunk.url == "/advisory/"
    assert hits[0].semantic is not None


def test_rate_limiter_minute_and_day_windows():
    now = [0.0]
    limiter = RateLimiter(per_minute=2, per_day=3, clock=lambda: now[0])
    assert limiter.allow("a")[0] and limiter.allow("a")[0]
    allowed, retry = limiter.allow("a")
    assert not allowed and retry > 0
    assert limiter.allow("b")[0]  # keys are independent
    now[0] = 61
    assert limiter.allow("a")[0]
    now[0] = 130
    assert not limiter.allow("a")[0]  # daily cap of 3 reached


def test_budget_rolls_over_daily():
    day = ["2026-11-03"]
    budget = Budget(daily_usd=0.01, price_in_per_1k=1.0, price_out_per_1k=1.0, today=lambda: day[0])
    assert budget.available()
    budget.record(10, 0)
    assert not budget.available()
    day[0] = "2026-11-04"
    assert budget.available()
