# ask-api — "Ask my portfolio"

A small FastAPI service that answers visitors' questions about Ali's work **only from the
published site**, with numbered citations that link back to the source pages.

```
zarreh.ai build ──► /ask/corpus.json ──► ask-api (VPS) ──► widget on zarreh.ai
                     (regenerated on           │
                      every deploy)            ├─ BM25 + embeddings (RRF) retrieval
                                               ├─ guardrails before the model
                                               ├─ OpenAI-compatible model, optional fallback
                                               └─ citations checked after the model
```

## What keeps it safe and cheap

| Control | Where |
| --- | --- |
| Scope: answers only from retrieved site content; "I don't know" otherwise | `guardrails.SYSTEM_PROMPT`, no-context short-circuit |
| Prompt-injection screen (named regex rules) — never reaches the model | `guardrails.INJECTION_PATTERNS` |
| Personal/sensitive questions declined (family, pay, address, age…) | `guardrails.SENSITIVE_PATTERNS` |
| Citations parsed after generation; uncited or invalid answers flagged as ungrounded | `guardrails.cited_sources` |
| Per-IP rate limit (default 6/min, 60/day) + nginx `limit_req` | `limits.RateLimiter`, nginx conf |
| Daily spend ceiling (default $2) → "resting" message | `limits.Budget` |
| CORS locked to zarreh.ai | `ASK_ALLOWED_ORIGINS` |
| Provider failover before the first token | `llm.FailoverChain` |
| Questions are not logged (opt-in with `ASK_LOG_QUESTIONS`) | `settings.log_questions` |
| Read-only container, non-root user, localhost-only port, memory cap | `Dockerfile`, `docker-compose.yml` |

The site never depends on the service: the widget is only rendered when `PUBLIC_ASK_API_URL` is
set, and it stays hidden unless `/healthz` reports the service healthy and within budget.

## Develop

```bash
cd services/ask-api
uv sync
uv run pytest -q          # unit + API tests with a fake model (no key needed)
uv run ruff check . && uv run ruff format --check .

# Run against a local build of the site
(cd ../.. && npm run build)
OPENAI_API_KEY=sk-... ASK_CORPUS_PATH=../../dist/ask/corpus.json \
  ASK_ALLOWED_ORIGINS='["http://localhost:4321"]' \
  uv run uvicorn ask_api.app:app_factory --factory --port 8090
```

Then build the site with `PUBLIC_ASK_API_URL=http://localhost:8090 npm run build && npm run preview`.

## Evaluate

`evals/golden.json` holds golden questions with the page each answer must cite, facts it must
contain, and questions it must refuse. Run against the live model:

```bash
OPENAI_API_KEY=sk-... uv run python -m ask_api.evals --corpus ../../dist/ask/corpus.json
```

The run fails below an 85% pass rate. Re-run it whenever prompts, models or site content change
materially.

## Deploy to the VPS (ask.zarreh.ai)

Prerequisites: Docker with the compose plugin, nginx and certbot on the server (the same host
that serves the demo subdomains).

1. **DNS** — add an `A` record `ask.zarreh.ai → <VPS IP>` (same as `credit.zarreh.ai`).
2. **Code and secrets**
   ```bash
   git clone https://github.com/zarreh/zarreh.github.io.git && cd zarreh.github.io/services/ask-api
   cp deploy/settings.example ask.env     # add OPENAI_API_KEY; never commit ask.env
   chmod 600 ask.env
   ```
3. **Start** — `deploy/deploy.sh` (builds the image, starts it on `127.0.0.1:8090`, waits for health).
4. **nginx + TLS**
   ```bash
   sudo cp deploy/nginx-ask.zarreh.ai.conf /etc/nginx/sites-available/ask.zarreh.ai
   sudo ln -s /etc/nginx/sites-available/ask.zarreh.ai /etc/nginx/sites-enabled/
   sudo nginx -t && sudo systemctl reload nginx
   sudo certbot --nginx -d ask.zarreh.ai
   curl https://ask.zarreh.ai/healthz
   ```
5. **Turn on the widget** — set the repository variable `PUBLIC_ASK_API_URL=https://ask.zarreh.ai`
   and re-run the *Deploy site* workflow.

**Update:** `git pull && deploy/deploy.sh`. The service reloads the corpus from zarreh.ai every
hour, so content changes need no redeploy.
**Logs:** `docker compose logs -f ask-api`. **Stop:** `docker compose down`.

## Configuration

All settings are environment variables (see `deploy/settings.example` and `ask_api/settings.py`).
The most relevant: `OPENAI_API_KEY`, `ASK_MODEL`, `ASK_EMBEDDING_MODEL`, `ASK_FALLBACK_*`,
`ASK_RATE_PER_MINUTE`, `ASK_RATE_PER_DAY`, `ASK_DAILY_BUDGET_USD`, `ASK_ALLOWED_ORIGINS`.
