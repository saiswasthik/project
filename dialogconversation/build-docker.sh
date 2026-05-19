#!/bin/bash

# Exit on any error
set -e

echo "🚀 Building ConversationAI Docker Image for Azure Deployment"
echo "=========================================================="

# Set image name and tag
IMAGE_NAME="conversationai"
TAG="latest"
FULL_IMAGE_NAME="${IMAGE_NAME}:${TAG}"

echo "📦 Building Docker image: ${FULL_IMAGE_NAME}"

# Build the production Docker image
docker build -t ${FULL_IMAGE_NAME} .

if [ $? -eq 0 ]; then
    echo "✅ Docker image built successfully!"
    echo ""
    echo "📋 Image Details:"
    docker images ${FULL_IMAGE_NAME}
    echo ""
    
    echo "🧪 Testing the image locally..."
    echo "Starting container on port 8080..."
    
    # Run the container for testing
    CONTAINER_ID=$(docker run -d -p 8080:80 ${FULL_IMAGE_NAME})
    
    echo "Container started with ID: ${CONTAINER_ID}"
    echo "Waiting for application to start..."
    
    # Wait for the application to start
    sleep 30
    
    # Test the health endpoint
    echo "Testing health endpoint..."
    if curl -f http://localhost:8080/health > /dev/null 2>&1; then
        echo "✅ Health check passed!"
    else
        echo "❌ Health check failed!"
    fi
    
    # Test the main application
    echo "Testing main application..."
    if curl -f http://localhost:8080/ > /dev/null 2>&1; then
        echo "✅ Application is running!"
    else
        echo "❌ Application failed to start!"
    fi
    
    echo ""
    echo "🛑 Stopping test container..."
    docker stop ${CONTAINER_ID}
    docker rm ${CONTAINER_ID}
    
    echo ""
    echo "🎯 Azure Deployment Instructions:"
    echo "=================================="
    echo ""
    echo "1. Tag the image for Azure Container Registry:"
    echo "   docker tag ${FULL_IMAGE_NAME} <your-acr-name>.azurecr.io/${FULL_IMAGE_NAME}"
    echo ""
    echo "2. Login to Azure Container Registry:"
    echo "   az acr login --name <your-acr-name>"
    echo ""
    echo "3. Push the image to Azure Container Registry:"
    echo "   docker push <your-acr-name>.azurecr.io/${FULL_IMAGE_NAME}"
    echo ""
    echo "4. Deploy to Azure Container Instances:"
    echo "   az container create \\"
    echo "     --resource-group <your-resource-group> \\"
    echo "     --name conversationai \\"
    echo "     --image <your-acr-name>.azurecr.io/${FULL_IMAGE_NAME} \\"
    echo "     --dns-name-label conversationai \\"
    echo "     --ports 80 \\"
    echo "     --environment-variables PYTHONPATH=/app/backend PYTHONUNBUFFERED=1"
    echo ""
    echo "5. Or deploy to Azure App Service:"
    echo "   - Create an App Service with Container support"
    echo "   - Set the image to: <your-acr-name>.azurecr.io/${FULL_IMAGE_NAME}"
    echo "   - Configure environment variables as needed"
    echo ""
    echo "🔧 Environment Variables for Azure:"
    echo "==================================="
    echo "Make sure to set these environment variables in your Azure deployment:"
    echo "- GOOGLE_API_KEY: Your Google Gemini API key"
    echo "- FIREBASE_API_KEY: Your Firebase API key"
    echo "- FIREBASE_AUTH_DOMAIN: Your Firebase auth domain"
    echo "- FIREBASE_PROJECT_ID: Your Firebase project ID"
    echo "- FIREBASE_STORAGE_BUCKET: Your Firebase storage bucket"
    echo "- FIREBASE_MESSAGING_SENDER_ID: Your Firebase messaging sender ID"
    echo "- FIREBASE_APP_ID: Your Firebase app ID"
    echo ""
    echo "📝 Next Steps:"
    echo "=============="
    echo "1. Create an Azure Container Registry (ACR)"
    echo "2. Tag and push your image to ACR"
    echo "3. Deploy to Azure Container Instances or App Service"
    echo "4. Configure environment variables in Azure"
    echo "5. Set up custom domain and SSL if needed"
    echo ""
    echo "🎉 Your Docker image is ready for Azure deployment!"
    
else
    echo "❌ Docker build failed!"
    exit 1
fi 