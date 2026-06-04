FROM python:3.10.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    libcairo2 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libgdk-pixbuf2.0-0 \
    libffi-dev \
    shared-mime-info \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# AI_REPORT_PORT is injected from AI-Report/.env via docker-compose env_file.

COPY app/ ./app/

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3002", "--reload"]