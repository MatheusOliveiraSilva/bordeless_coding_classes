from typing import Literal, Any
from src.common.types import LLMConfig, LLMProvider, LangchainConfig
from src.settings import AZURE_OPENAI_PARAMS, OPENAI_PARAMS, ANTHROPIC_PARAMS
from langchain_core.language_models.chat_models import BaseChatModel
from langchain_openai import AzureChatOpenAI, ChatOpenAI
from langchain_anthropic import ChatAnthropic

class LLM():
    """"
    Factory class for LLM models.
    This class is used to check configuration, sanitize it and return a LangChain chat model.

    Args:
        config: LLMConfig
        provider: LLMProvider
    """
    langchain_map: dict[LLMProvider, LangchainConfig] = {
        "azure_openai": {
            "default_model": "gpt-4o-mini",
            "params": AZURE_OPENAI_PARAMS,
            "langchain_chat_model": AzureChatOpenAI,
        },
        "openai": {
            "default_model": "gpt-4o-mini",
            "params": OPENAI_PARAMS,
            "langchain_chat_model": ChatOpenAI,
        },
        "anthropic": {
            "default_model": "claude-3-5-sonnet",
            "params": ANTHROPIC_PARAMS,
            "langchain_chat_model": ChatAnthropic,
        },
    }
    
    def __init__(
        self, 
        config: LLMConfig, 
        provider: LLMProvider
    ) -> None:
        self.provider: LLMProvider = provider
        self.config = config

    def get_llm(self) -> BaseChatModel:
        """
        Uses this class map to get the correct LangChain chat model given a provider.

        Returns:
            BaseChatModel: A LangChain chat model.
        """

        kwargs = self._sanitize_config(self.config, self.provider)
        return self.langchain_map[self.provider]["langchain_chat_model"](
            **self.langchain_map[self.provider]["params"],
            **kwargs,
        )

    # TODO: This is a temporary solution to avoid type conflicts.
    # We should find a better way to handle this (remove Any from output type).
    def _sanitize_config(self, config: LLMConfig, provider: LLMProvider) -> dict[str, Any]:
        sanitized_config: dict[str, Any] = {}
        config.pop("reasoning", None)
        
        return sanitized_config
