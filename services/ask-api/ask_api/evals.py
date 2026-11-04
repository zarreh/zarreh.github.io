"""Golden-question evaluation against the live model.

Usage (from services/ask-api):
    OPENAI_API_KEY=... uv run python -m ask_api.evals                     # corpus from zarreh.ai
    OPENAI_API_KEY=... uv run python -m ask_api.evals --corpus ../../dist/ask/corpus.json

Each case checks deterministic properties only: the expected page is among the cited sources,
the answer contains required facts, and out-of-scope questions are refused.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from fastapi.testclient import TestClient

from .app import create_app
from .settings import Settings

GOLDEN = Path(__file__).resolve().parent.parent / "evals" / "golden.json"


def parse(text: str) -> tuple[str, list[dict], dict]:
    answer, sources, done = [], [], {}
    for block in text.strip().split("\n\n"):
        fields = dict(line.split(": ", 1) for line in block.splitlines() if ": " in line)
        data = json.loads(fields.get("data", "null"))
        if fields.get("event") == "sources":
            sources = data
        elif fields.get("event") == "token":
            answer.append(data["t"])
        elif fields.get("event") in ("done", "error"):
            done = data | {"event": fields["event"]}
    return "".join(answer), sources, done


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--corpus", help="local corpus.json (defaults to ASK_CORPUS_URL)")
    parser.add_argument("--min-pass", type=float, default=0.85)
    args = parser.parse_args()

    settings = Settings(
        corpus_path=args.corpus, rate_per_minute=1000, rate_per_day=10_000, log_questions=False
    )
    if not settings.openai_api_key:
        print("OPENAI_API_KEY (or ASK_OPENAI_API_KEY) is required for live evals", file=sys.stderr)
        return 2

    cases = json.loads(GOLDEN.read_text())
    passed = 0
    with TestClient(create_app(settings)) as client:
        for case in cases:
            text, sources, done = parse(client.post("/ask", json={"question": case["q"]}).text)
            cited_urls = {sources[n - 1]["url"] for n in done.get("cited", []) if n <= len(sources)}
            problems = []
            if case.get("refuse"):
                declined = any(
                    phrase in text.lower()
                    for phrase in (
                        "don't have",
                        "do not have",
                        "couldn't find",
                        "not something",
                        "only answer",
                    )
                )
                guarded = done.get("reason") in ("sensitive", "injection", "no_context")
                if not (guarded or (declined and not done.get("cited"))):
                    problems.append(f"expected refusal, got: {text[:120]!r}")
            else:
                if not any(case["url"] in u for u in cited_urls):
                    problems.append(
                        f"expected citation of {case['url']}, cited {sorted(cited_urls)}"
                    )
                for needle in case.get("contains", []):
                    if needle.lower() not in text.lower():
                        problems.append(f"missing '{needle}'")
                if not done.get("grounded"):
                    problems.append("answer not grounded")
            ok = not problems
            passed += ok
            print(f"{'PASS' if ok else 'FAIL'}  {case['q']}")
            for p in problems:
                print(f"      - {p}")

    rate = passed / len(cases)
    print(f"\n{passed}/{len(cases)} passed ({rate:.0%}); threshold {args.min_pass:.0%}")
    return 0 if rate >= args.min_pass else 1


if __name__ == "__main__":
    raise SystemExit(main())
