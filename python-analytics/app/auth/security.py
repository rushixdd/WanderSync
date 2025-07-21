from fastapi import Security, HTTPException, status
from fastapi.security import APIKeyHeader
import os # Import os

API_KEY_NAME = "X-API-Key"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=True)

# Read the allowed API key from environment variables
# ALLOWED_API_KEY = os.getenv("ALLOWED_API_KEY")
ALLOWED_API_KEY = "your-very-secret-key"

async def verify_api_key(api_key: str = Security(api_key_header)):
    if not ALLOWED_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="API key not configured on server."
        )
    if api_key != ALLOWED_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API Key"
        )