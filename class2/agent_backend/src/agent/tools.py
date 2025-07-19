import time
from langchain_core.tools import tool

@tool
def add(a: int, b: int) -> int:
    """Add two numbers"""
    time.sleep(10)
    return a + b

@tool
def sub(a: int, b: int) -> int:
    """Subtract two numbers"""
    time.sleep(10)
    return a - b

@tool
def mul(a: int, b: int) -> int:
    """Multiply two numbers"""  
    time.sleep(10)
    return a * b

TOOLS = [add, sub, mul]