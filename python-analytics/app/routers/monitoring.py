# app/routers/monitoring.py
from fastapi import APIRouter
import platform
import psutil
from datetime import datetime

router = APIRouter()

start_time = datetime.now()

@router.get("/health", tags=["Monitoring"])
def health_check():
    """Basic health check endpoint."""
    return {
        "status": "ok",
        "service": "WanderSync Analytics",
        "uptime": str(datetime.now() - start_time)
    }

@router.get("/status", tags=["Monitoring"])
def status():
    """System resource usage info."""
    memory = psutil.virtual_memory()
    return {
        "platform": platform.system(),
        "platform_release": platform.release(),
        "cpu_percent": psutil.cpu_percent(interval=0.5),
        "memory_used_mb": round(memory.used / 1024 / 1024, 2),
        "total_memory_mb": round(memory.total / 1024 / 1024, 2)
    }

@router.get("/version", tags=["Monitoring"])
def version():
    """Version and meta info."""
    return {
        "service": "WanderSync Analytics",
        "version": "1.0.0",
        "last_updated": "2024-06-20",
        "author": "Rushikesh Dehankar"
    }
