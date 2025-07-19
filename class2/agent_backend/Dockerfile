# Use Python 3.12 slim image as base
FROM python:3.12-slim

# Install uv package manager
RUN pip install uv

# Set working directory
WORKDIR /app

# Copy pyproject.toml first for dependency caching
COPY pyproject.toml ./pyproject.toml
COPY README.md ./README.md

# Create virtual environment using uv
RUN uv venv .venv

# Activate virtual environment and install dependencies
RUN uv pip install -e .

# Copy the class2 directory
COPY class2 ./class2

# Set working directory to the agent_backend
WORKDIR /app/class2/agent_backend

# Expose port 8000
EXPOSE 8000

# Set environment variables
ENV PYTHONPATH=/app/class2/agent_backend
ENV PATH="/app/.venv/bin:$PATH"

# Command to run the FastAPI application using uvicorn
CMD ["python", "-m", "uvicorn", "src.api.main:app", "--host", "0.0.0.0", "--port", "8000"]