#!/bin/bash

# Exit on any error
set -e

echo "Starting ConversationAI application..."

# Create necessary directories
mkdir -p /app/backend/temp_audio
mkdir -p /var/log/nginx

# Set proper permissions
chmod 755 /app/backend/temp_audio

# Start nginx in background
echo "Starting nginx..."
nginx -g "daemon off;" &
NGINX_PID=$!

# Wait a moment for nginx to start
sleep 2

# Check if nginx started successfully
if ! kill -0 $NGINX_PID 2>/dev/null; then
    echo "Failed to start nginx"
    exit 1
fi

echo "Nginx started successfully (PID: $NGINX_PID)"

# Start FastAPI backend
echo "Starting FastAPI backend..."
cd /app/backend

# Set environment variables for production
export PYTHONPATH=/app/backend
export PYTHONUNBUFFERED=1

# Start uvicorn with production settings
exec uvicorn main:app \
    --host 127.0.0.1 \
    --port 8000 \
    --workers 1 \
    --log-level info \
    --access-log \
    --timeout-keep-alive 65 