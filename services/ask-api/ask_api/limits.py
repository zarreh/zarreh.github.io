"""In-memory rate limiting and a daily spend ceiling. Single-process by design (one container)."""

from __future__ import annotations

import time
from collections import defaultdict, deque
from datetime import UTC, datetime
from threading import Lock


class RateLimiter:
    def __init__(self, per_minute: int, per_day: int, clock=time.monotonic):
        self.per_minute, self.per_day = per_minute, per_day
        self.clock = clock
        self.hits: dict[str, deque[float]] = defaultdict(deque)
        self.lock = Lock()

    def allow(self, key: str) -> tuple[bool, int]:
        """Returns (allowed, retry_after_seconds)."""
        now = self.clock()
        with self.lock:
            q = self.hits[key]
            while q and now - q[0] > 86_400:
                q.popleft()
            last_minute = sum(1 for t in q if now - t <= 60)
            if last_minute >= self.per_minute:
                oldest = next(t for t in q if now - t <= 60)
                return False, max(1, int(60 - (now - oldest)) + 1)
            if len(q) >= self.per_day:
                return False, max(1, int(86_400 - (now - q[0])) + 1)
            q.append(now)
            if len(self.hits) > 50_000:  # bound memory under abuse
                self.hits = defaultdict(deque, {k: v for k, v in self.hits.items() if v})
            return True, 0


class Budget:
    """Tracks estimated model spend per UTC day and refuses work once the ceiling is reached."""

    def __init__(
        self, daily_usd: float, price_in_per_1k: float, price_out_per_1k: float, today=None
    ):
        self.daily_usd = daily_usd
        self.price_in, self.price_out = price_in_per_1k, price_out_per_1k
        self.today = today or (lambda: datetime.now(UTC).date().isoformat())
        self.day = self.today()
        self.spent = 0.0
        self.lock = Lock()

    def _roll(self) -> None:
        day = self.today()
        if day != self.day:
            self.day, self.spent = day, 0.0

    def available(self) -> bool:
        with self.lock:
            self._roll()
            return self.spent < self.daily_usd

    def record(self, tokens_in: int, tokens_out: int) -> float:
        cost = tokens_in / 1000 * self.price_in + tokens_out / 1000 * self.price_out
        with self.lock:
            self._roll()
            self.spent += cost
        return cost
