from langgraph import graph
from langgraph.graph import END, StateGraph, START
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode, tools_condition
from langchain_core.language_models.chat_models import BaseChatModel
from langchain_core.tools import BaseTool

from langgraph.graph import END, StateGraph, START
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode

from src.agent.nodes import BasicToolNode
from src.agent.state import AgentState
from src.common.llm import LLM
from src.agent.prompt import AGENT_SYSTEM_PROMPT

def build_graph(tools: list[BaseTool]):

    graph_builder = StateGraph(AgentState)

    def chatbot(state: AgentState, config):
        llm_factory = LLM(provider=state["llm_provider"], config=state["llm_config"])
        llm: BaseChatModel = llm_factory.get_llm()
        llm_with_tools = llm.bind_tools(tools)

        response = llm_with_tools.invoke(
            [AGENT_SYSTEM_PROMPT] + state["messages"],
            config
        )
        return {"messages": [response]}

    graph_builder.add_node("chatbot", chatbot)

    tool_node = BasicToolNode(tools)
    graph_builder.add_node("tools", tool_node)

    graph_builder.add_edge(START, "chatbot")
    graph_builder.add_conditional_edges(
        "chatbot",
        tools_condition,
        {
            "tools": "tools",
            END: END
        }
    )
    graph_builder.add_edge("tools", "chatbot")

    return graph_builder.compile()