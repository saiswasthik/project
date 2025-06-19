#!/bin/bash

# Build script for Render deployment
set -e

echo "Starting build process..."

# Install packages one by one to identify problematic ones
echo "Installing packages..."

pip install fastapi==0.78.0
pip install uvicorn==0.17.6
pip install python-dotenv==0.20.0
pip install requests==2.28.1
pip install youtube-transcript-api==0.6.1
pip install google-api-python-client==2.54.0
pip install google-generativeai==0.1.0
pip install pydantic==1.9.1

echo "All packages installed successfully!" 