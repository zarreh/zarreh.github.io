"""Corpus loading and hybrid retrieval (BM25, optionally fused with embeddings)."""

from __future__ import annotations

import hashlib
import json
import math
import re
from collections import Counter
from collections.abc import Callable, Sequence
from dataclasses import dataclass
from pathlib import Path

import httpx
import numpy as np

STOPWORDS = frozenset(
    (
        "a an and are as at be by did does do for from has have he his how i in is it its me my "
        "of on or our so that the their them they this to was we what when where which who why "
        "will with you your ali zarreh about tell"
    ).split()
)
TOKEN = re.compile(r"[a-z0-9][a-z0-9\-\+\.]*[a-z0-9]|[a-z0-9]")

Embedder = Callable[[Sequence[str]], np.ndarray]


@dataclass(frozen=True)
class Chunk:
    id: str
    url: str
    title: str
    section: str
    text: str

    @property
    def content(self) -> str:
        return f"{self.title} — {self.section}\n{self.text}"


@dataclass(frozen=True)
class Hit:
    chunk: Chunk
    score: float
    lexical: float
    semantic: float | None


def tokenize(text: str) -> list[str]:
    return [t for t in TOKEN.findall(text.lower()) if t not in STOPWORDS]


def load_corpus(path: str | None, url: str, timeout: float = 20.0) -> tuple[list[Chunk], str]:
    """Returns the chunks and the corpus generation timestamp."""
    if path:
        raw = json.loads(Path(path).read_text(encoding="utf-8"))
    else:
        response = httpx.get(url, timeout=timeout, follow_redirects=True)
        response.raise_for_status()
        raw = response.json()
    chunks = [
        Chunk(**{k: c[k] for k in ("id", "url", "title", "section", "text")}) for c in raw["chunks"]
    ]
    if not chunks:
        raise ValueError("corpus is empty")
    return chunks, str(raw.get("generated", ""))


class Index:
    """BM25 over all chunks; when an embedder is available, results are fused with cosine
    similarity using reciprocal-rank fusion."""

    def __init__(
        self,
        chunks: Sequence[Chunk],
        embedder: Embedder | None = None,
        k1: float = 1.4,
        b: float = 0.75,
    ):
        self.chunks = list(chunks)
        self.k1, self.b = k1, b
        self.docs = [tokenize(c.content) for c in self.chunks]
        self.doc_len = np.array([len(d) for d in self.docs], dtype=float)
        self.avg_len = float(self.doc_len.mean()) if len(self.docs) else 0.0
        self.tf = [Counter(d) for d in self.docs]
        df: Counter[str] = Counter()
        for d in self.docs:
            df.update(set(d))
        n = len(self.docs)
        self.idf = {t: math.log(1 + (n - f + 0.5) / (f + 0.5)) for t, f in df.items()}
        self.embedder = embedder
        self.vectors: np.ndarray | None = None
        if embedder is not None:
            self.vectors = _normalize(embedder([c.content for c in self.chunks]))
        self.fingerprint = hashlib.sha256(
            "".join(c.id + c.text for c in self.chunks).encode()
        ).hexdigest()[:12]

    def __len__(self) -> int:
        return len(self.chunks)

    def bm25(self, query: str) -> np.ndarray:
        terms = tokenize(query)
        scores = np.zeros(len(self.chunks))
        for i, tf in enumerate(self.tf):
            norm = self.k1 * (1 - self.b + self.b * self.doc_len[i] / (self.avg_len or 1))
            for t in terms:
                f = tf.get(t)
                if f:
                    scores[i] += self.idf.get(t, 0.0) * f * (self.k1 + 1) / (f + norm)
        return scores

    def search(self, query: str, k: int = 6, min_cosine: float = 0.22) -> list[Hit]:
        lexical = self.bm25(query)
        semantic: np.ndarray | None = None
        if self.embedder is not None and self.vectors is not None:
            q = _normalize(self.embedder([query]))[0]
            semantic = self.vectors @ q

        if semantic is None:
            order = [i for i in np.argsort(-lexical) if lexical[i] > 0][:k]
            return [Hit(self.chunks[i], float(lexical[i]), float(lexical[i]), None) for i in order]

        # Reciprocal-rank fusion of both rankings; keep only chunks with some real signal.
        fused = np.zeros(len(self.chunks))
        for scores in (lexical, semantic):
            ranks = np.argsort(np.argsort(-scores))
            fused += 1.0 / (60 + ranks)
        candidates = [i for i in np.argsort(-fused) if lexical[i] > 0 or semantic[i] >= min_cosine][
            :k
        ]
        return [
            Hit(self.chunks[i], float(fused[i]), float(lexical[i]), float(semantic[i]))
            for i in candidates
        ]


def _normalize(m: np.ndarray) -> np.ndarray:
    m = np.asarray(m, dtype=float)
    norms = np.linalg.norm(m, axis=1, keepdims=True)
    norms[norms == 0] = 1.0
    return m / norms
