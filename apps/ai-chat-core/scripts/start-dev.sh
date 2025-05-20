#!/bin/bash
# Script to start the AI Chat Core service in development mode

# Navigate to the script's directory to ensure relative paths are correct,
# then navigate to the application root directory.
cd "$(dirname "$0")/.."

echo "Starting FastAPI development server on http://0.0.0.0:4000..."
# Assuming your FastAPI application instance is named 'app' in a file named 'main.py'
# in the 'apps/ai-chat-core' directory.
uvicorn app.main:app --reload --host 0.0.0.0 --port 4000

echo "FastAPI server stopped."