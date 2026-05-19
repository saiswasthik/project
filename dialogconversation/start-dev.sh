#!/bin/bash

# Exit on any error
set -e

echo "Starting ConversationAI development environment..."

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

# Start React development server in background
echo "Starting React development server..."
cd /app/frontend
npm start &
REACT_PID=$!

# Wait for React to start
sleep 10

# Check if React started successfully
if ! kill -0 $REACT_PID 2>/dev/null; then
    echo "Failed to start React development server"
    exit 1
fi

echo "React development server started successfully (PID: $REACT_PID)"

# Start FastAPI backend in development mode
echo "Starting FastAPI backend in development mode..."
cd /app/backend

# Set environment variables for development
export PYTHONPATH=/app/backend
export PYTHONUNBUFFERED=1

# Start uvicorn with development settings
exec uvicorn main:app \
    --host 127.0.0.1 \
    --port 8000 \
    --reload \
    --log-level debug \
    --access-log \
    --timeout-keep-alive 65 