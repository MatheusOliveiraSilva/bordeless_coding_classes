from typing import Annotated, TypedDict
from langgraph.graph.message import add_messages
from src.common.types import LLMConfig, LLMProvider

class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
    llm_config: LLMConfig
    llm_provider: LLMProvider
    thread_id: str