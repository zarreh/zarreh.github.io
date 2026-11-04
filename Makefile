# Shortcuts for the site (npm) and the assistant API (uv).
# The real commands live in package.json and services/ask-api/pyproject.toml;
# these targets only wrap them. Run `make` to list targets.

.DEFAULT_GOAL := help
.PHONY: help install browsers dev build preview check format test ci \
        covers icons clean api-install api-test api-format api-dev api-eval

API_DIR := services/ask-api
PORT ?= 4321
API_PORT ?= 8090

help: ## List available targets
	@grep -hE '^[a-zA-Z_-]+:.*## ' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

# ---- Site ------------------------------------------------------------------

install: ## Install site + API dependencies
	npm install
	cd $(API_DIR) && uv sync

browsers: ## One-time: install the Playwright browser for tests
	npm run test:install

dev: ## Dev server with hot reload (search needs a build)
	npm run dev -- --port $(PORT)

build: ## Production build to dist/ (Astro + Pagefind)
	npm run build

preview: build ## Build, then serve dist/ locally (PORT, default 4321)
	npm run preview -- --port $(PORT)

check: ## Type-check and verify formatting
	npm run check
	npm run format:check

format: ## Format site and API code
	npm run format
	cd $(API_DIR) && uv run ruff format .

test: build ## Build, then run Playwright e2e + accessibility tests
	npm test

ci: check test api-test ## Run the same checks as CI (minus link check and Lighthouse)

covers: ## Re-capture live-demo screenshots for case-study covers
	npm run capture:covers

icons: ## Regenerate favicons and app icons
	node scripts/generate-icons.mjs

clean: ## Remove build and test output
	rm -rf dist .astro test-results playwright-report

# ---- Ask API (services/ask-api) ---------------------------------------------

api-install: ## Install API dependencies
	cd $(API_DIR) && uv sync

api-test: ## Lint, format-check and test the API
	cd $(API_DIR) && uv run ruff check . && uv run ruff format --check . && uv run pytest -q

api-format: ## Format and auto-fix the API
	cd $(API_DIR) && uv run ruff format . && uv run ruff check --fix .

api-dev: ## Run the API against dist/ (API_PORT, default 8090; needs OPENAI_API_KEY)
	@test -f dist/ask/corpus.json || { echo "dist/ask/corpus.json missing - run 'make build' first"; exit 1; }
	cd $(API_DIR) && ASK_CORPUS_PATH=../../dist/ask/corpus.json \
		ASK_ALLOWED_ORIGINS='["http://localhost:$(PORT)","http://127.0.0.1:$(PORT)"]' \
		uv run uvicorn ask_api.app:app_factory --factory --reload --port $(API_PORT)

api-eval: ## Golden-question eval against the live model (needs OPENAI_API_KEY and a build)
	cd $(API_DIR) && uv run python -m ask_api.evals --corpus ../../dist/ask/corpus.json
