from functools import lru_cache

from pydantic import AliasChoices, Field, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """All configuration comes from environment variables prefixed with ASK_ (or a .env file)."""

    model_config = SettingsConfigDict(env_prefix="ASK_", env_file=".env", extra="ignore")

    # Knowledge base: the site publishes /ask/corpus.json on every build.
    corpus_url: str = "https://zarreh.ai/ask/corpus.json"
    corpus_path: str | None = None
    refresh_minutes: int = 60

    # Primary model provider (any OpenAI-compatible API).
    openai_api_key: SecretStr | None = Field(
        default=None, validation_alias=AliasChoices("ASK_OPENAI_API_KEY", "OPENAI_API_KEY")
    )
    openai_base_url: str | None = None
    model: str = "gpt-4o-mini"
    embedding_model: str | None = "text-embedding-3-small"

    # Optional fallback provider, used when the primary fails before streaming starts.
    fallback_api_key: SecretStr | None = None
    fallback_base_url: str | None = None
    fallback_model: str | None = None

    # Abuse and cost controls.
    allowed_origins: list[str] = ["https://zarreh.ai", "https://www.zarreh.ai"]
    trust_proxy: bool = True
    rate_per_minute: int = 6
    rate_per_day: int = 60
    daily_budget_usd: float = 2.0
    price_in_per_1k: float = 0.00015
    price_out_per_1k: float = 0.0006
    max_question_chars: int = 500
    max_answer_tokens: int = 450

    # Retrieval.
    top_k: int = 6
    min_cosine: float = 0.22

    # Privacy: questions are not logged unless explicitly enabled.
    log_questions: bool = False


@lru_cache
def get_settings() -> Settings:
    return Settings()
