# Dockerfile (for production)
FROM python:3.13-slim

# Set environment
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY ./app ./app

# Expose port
EXPOSE 8000

# Start FastAPI with Uvicorn (no --reload in prod)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

# Build and run commands:
# docker build -f Dockerfile -t python-analytics-prod .
# docker run -p 8000:8000 python-analytics-prod