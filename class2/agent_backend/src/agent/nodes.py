import json
import traceback

from langchain_core.messages import ToolMessage
from langchain_core.tools import BaseTool
from langgraph.config import get_stream_writer
from src.agent.state import AgentState

class BasicToolNode:
    def __init__(self, tools: list[BaseTool]) -> None:
        self.tools_by_name = {tool.name: tool for tool in tools}

    def __call__(self, inputs: AgentState):
        if messages := inputs.get("messages", []):
            message = messages[-1]
        else:
            raise ValueError("No messages found in inputs")
        writer = get_stream_writer()

        outputs = []
        for tool_call in message.tool_calls:
            writer({"Tool_call": tool_call})

            try:
                tool_result = self.tools_by_name[
                    tool_call["name"]
                ].invoke(tool_call["args"])

                writer({"Tool_result": tool_result})

                outputs.append(
                    ToolMessage(
                        content=json.dumps(tool_result),
                        name=tool_call["name"],
                        tool_call_id=tool_call.get("id", "unknown"),
                    )
                )

            except Exception as e:
                print("Error during tool execution:") # TODO: change to logging in case of production
                traceback.print_exc()

                # Add error message to the output, so LLM can have a chance to retry.
                outputs.append(
                    ToolMessage(
                        content=f"Error: {e}",
                        name=tool_call["name"],
                        tool_call_id=tool_call.get("id", "unknown"),
                    )
                )

        return {"messages": outputs}