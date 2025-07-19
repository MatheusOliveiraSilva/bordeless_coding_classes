from typing import Optional, TypedDict, Literal
from langchain_core.language_models.chat_models import BaseChatModel

ReasoningConfig = Literal["thinking", "high", "medium", "low"]
LLMProvider = Literal["azure_openai", "openai", "anthropic"]

class LLMConfig(TypedDict):
    model: str
    reasoning: Optional[ReasoningConfig]

class LangchainConfig(TypedDict):
    default_model: str
    params: dict[str, str | None]
    langchain_chat_model: type[BaseChatModel]