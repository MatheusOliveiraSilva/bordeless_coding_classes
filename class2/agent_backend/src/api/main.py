from fastapi import FastAPI
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
from src.settings import API_CONFIG

from src.api.routers.agent import router as agent_router

app = FastAPI(
    title=API_CONFIG["name"],
    description="API for the Agent Backend",
    version=API_CONFIG["version"],
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=API_CONFIG["cors"]["origins"],
    allow_credentials=True,
    allow_methods=API_CONFIG["cors"]["methods"],
    allow_headers=API_CONFIG["cors"]["headers"],
)

app.include_router(agent_router)

@app.get("/status")
def status():
    return {
        "status": "ok",
        "timestamp": datetime.now().isoformat(),
    }