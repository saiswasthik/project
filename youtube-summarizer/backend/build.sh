#!/bin/bash

# Build script for Render deployment
set -e

echo "Starting build process..."

# Install packages one by one to identify problematic ones
echo "Installing packages..."

pip install fastapi==0.88.0
pip install uvicorn==0.20.0
pip install python-dotenv==0.21.1
pip install requests==2.28.2
pip install youtube-transcript-api==0.6.1
pip install google-api-python-client==2.86.0
pip install google-generativeai==0.2.0
pip install pydantic==1.10.4

echo "All packages installed successfully!" 