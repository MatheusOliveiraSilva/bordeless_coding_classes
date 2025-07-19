from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Generator
import json
from langchain_core.messages import HumanMessage, AIMessage,BaseMessage, ToolMessage
from src.common.types import LLMConfig, LLMProvider
from src.agent.state import AgentState
from src.agent.graph import build_graph
from src.agent.tools import TOOLS

router = APIRouter(
    prefix="/agent",
    tags=["Agent"],
)

graph = build_graph(TOOLS)

class ChatMessage(BaseModel):
    role: str
    content: str

class AgentRequest(BaseModel):
    chat_history: List[ChatMessage]
    llm_config: LLMConfig
    llm_provider: LLMProvider
    thread_id: str

def parse_chat_history(chat_history: List[ChatMessage]) -> List[BaseMessage]:
    messages = []
    for message in chat_history:
        if message.role == "user":
            messages.append(HumanMessage(content=message.content))
        elif message.role == "assistant":
            messages.append(AIMessage(content=message.content))
    return messages

def stream_response(graph, agent_input: AgentState) -> Generator[str, None, None]:
    for type, chunk in graph.stream(
        agent_input, 
        stream_mode=["custom", "messages"]
        ):
        yield f"{type}: {chunk}\n\n"

@router.post("/chat")
def chat(agent_request: AgentRequest):
    chat_history = parse_chat_history(agent_request.chat_history)
    
    agent_input: AgentState = {
        "messages": chat_history,
        "llm_config": agent_request.llm_config,
        "llm_provider": agent_request.llm_provider,
        "thread_id": agent_request.thread_id,
    }

    return StreamingResponse(stream_response(graph, agent_input), media_type="text/event-stream")