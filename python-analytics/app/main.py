# src/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.analyze import router as analyze_proximity
from app.routers.monitoring import router as monitoring_router
import os

app = FastAPI(
    title="WanderSync Analytics Microservice",
    version="1.0.0"
)
    
# Optional: Root endpoint for welcome or status check
@app.get("/")
def read_root():
    return {"message": "WanderSync API is up and running 🚀"}

# Include routers
app.include_router(analyze_proximity)
app.include_router(monitoring_router)

# Serve static maps
from fastapi.staticfiles import StaticFiles
os.makedirs("output", exist_ok=True)
app.mount("/static", StaticFiles(directory="output"), name="static")

# Optional: Allow frontend dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
