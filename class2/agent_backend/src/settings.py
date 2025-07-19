import os
from dotenv import load_dotenv

load_dotenv()

# === Azure OpenAI ===
AZURE_OPENAI_API_KEY: str | None = os.getenv("AZURE_OPENAI_API_KEY")
AZURE_OPENAI_ENDPOINT: str | None = os.getenv("AZURE_OPENAI_BASE_URL")
AZURE_OPENAI_API_VERSION: str | None = os.getenv("AZURE_OPENAI_API_VERSION")

AZURE_OPENAI_PARAMS: dict[str, str | None] = {
    "openai_api_key": AZURE_OPENAI_API_KEY,
    "openai_api_version": AZURE_OPENAI_API_VERSION,
    "azure_endpoint": AZURE_OPENAI_ENDPOINT,
}

# === OpenAI ===
OPENAI_API_KEY: str | None = os.getenv("OPENAI_API_KEY")

OPENAI_PARAMS: dict[str, str | None] = {
    "openai_api_key": OPENAI_API_KEY,
}

# === Anthropic ===
ANTHROPIC_API_KEY: str | None = os.getenv("ANTHROPIC_API_KEY")

ANTHROPIC_PARAMS: dict[str, str | None] = {
    "anthropic_api_key": ANTHROPIC_API_KEY,
}