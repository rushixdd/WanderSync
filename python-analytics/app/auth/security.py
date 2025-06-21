# app/auth/api_key.py
from fastapi import Header, HTTPException, status
import os

# API_KEY = os.getenv("WANDERSYNC_API_KEY", "your-very-secret-key")
API_KEY = "your-very-secret-key"

async def verify_api_key(x_api_key: str = Header(...)):
    if x_api_key != API_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API Key"
        )
# This function can be used as a dependency in your routes to enforce API key validation.
# Example usage in a route: