# PowerShell script to build ConversationAI Docker Image for Azure Deployment

Write-Host "🚀 Building ConversationAI Docker Image for Azure Deployment" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green

# Set image name and tag
$IMAGE_NAME = "conversationai"
$TAG = "latest"
$FULL_IMAGE_NAME = "${IMAGE_NAME}:${TAG}"

Write-Host "📦 Building Docker image: ${FULL_IMAGE_NAME}" -ForegroundColor Yellow

# Build the production Docker image
docker build -t $FULL_IMAGE_NAME .

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Docker image built successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Image Details:" -ForegroundColor Cyan
    docker images $FULL_IMAGE_NAME
    Write-Host ""
    
    Write-Host "🧪 Testing the image locally..." -ForegroundColor Yellow
    Write-Host "Starting container on port 8080..." -ForegroundColor Yellow
    
    # Run the container for testing
    $CONTAINER_ID = docker run -d -p 8080:80 $FULL_IMAGE_NAME
    
    Write-Host "Container started with ID: ${CONTAINER_ID}" -ForegroundColor Cyan
    Write-Host "Waiting for application to start..." -ForegroundColor Yellow
    
    # Wait for the application to start
    Start-Sleep -Seconds 30
    
    # Test the health endpoint
    Write-Host "Testing health endpoint..." -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8080/health" -UseBasicParsing -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Health check passed!" -ForegroundColor Green
        } else {
            Write-Host "❌ Health check failed!" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ Health check failed!" -ForegroundColor Red
    }
    
    # Test the main application
    Write-Host "Testing main application..." -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8080/" -UseBasicParsing -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Application is running!" -ForegroundColor Green
        } else {
            Write-Host "❌ Application failed to start!" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ Application failed to start!" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "🛑 Stopping test container..." -ForegroundColor Yellow
    docker stop $CONTAINER_ID
    docker rm $CONTAINER_ID
    
    Write-Host ""
    Write-Host "🎯 Azure Deployment Instructions:" -ForegroundColor Magenta
    Write-Host "==================================" -ForegroundColor Magenta
    Write-Host ""
    Write-Host "1. Tag the image for Azure Container Registry:" -ForegroundColor White
    Write-Host "   docker tag ${FULL_IMAGE_NAME} <your-acr-name>.azurecr.io/${FULL_IMAGE_NAME}" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Login to Azure Container Registry:" -ForegroundColor White
    Write-Host "   az acr login --name <your-acr-name>" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. Push the image to Azure Container Registry:" -ForegroundColor White
    Write-Host "   docker push <your-acr-name>.azurecr.io/${FULL_IMAGE_NAME}" -ForegroundColor Gray
    Write-Host ""
    Write-Host "4. Deploy to Azure Container Instances:" -ForegroundColor White
    Write-Host "   az container create --resource-group <your-resource-group> --name conversationai --image <your-acr-name>.azurecr.io/${FULL_IMAGE_NAME} --dns-name-label conversationai --ports 80 --environment-variables PYTHONPATH=/app/backend PYTHONUNBUFFERED=1" -ForegroundColor Gray
    Write-Host ""
    Write-Host "5. Or deploy to Azure App Service:" -ForegroundColor White
    Write-Host "   - Create an App Service with Container support" -ForegroundColor Gray
    Write-Host "   - Set the image to: <your-acr-name>.azurecr.io/${FULL_IMAGE_NAME}" -ForegroundColor Gray
    Write-Host "   - Configure environment variables as needed" -ForegroundColor Gray
    Write-Host ""
    Write-Host "🔧 Environment Variables for Azure:" -ForegroundColor Magenta
    Write-Host "===================================" -ForegroundColor Magenta
    Write-Host "Make sure to set these environment variables in your Azure deployment:" -ForegroundColor White
    Write-Host "- GOOGLE_API_KEY: Your Google Gemini API key" -ForegroundColor Gray
    Write-Host "- FIREBASE_API_KEY: Your Firebase API key" -ForegroundColor Gray
    Write-Host "- FIREBASE_AUTH_DOMAIN: Your Firebase auth domain" -ForegroundColor Gray
    Write-Host "- FIREBASE_PROJECT_ID: Your Firebase project ID" -ForegroundColor Gray
    Write-Host "- FIREBASE_STORAGE_BUCKET: Your Firebase storage bucket" -ForegroundColor Gray
    Write-Host "- FIREBASE_MESSAGING_SENDER_ID: Your Firebase messaging sender ID" -ForegroundColor Gray
    Write-Host "- FIREBASE_APP_ID: Your Firebase app ID" -ForegroundColor Gray
    Write-Host ""
    Write-Host "📝 Next Steps:" -ForegroundColor Magenta
    Write-Host "==============" -ForegroundColor Magenta
    Write-Host "1. Create an Azure Container Registry (ACR)" -ForegroundColor White
    Write-Host "2. Tag and push your image to ACR" -ForegroundColor White
    Write-Host "3. Deploy to Azure Container Instances or App Service" -ForegroundColor White
    Write-Host "4. Configure environment variables in Azure" -ForegroundColor White
    Write-Host "5. Set up custom domain and SSL if needed" -ForegroundColor White
    Write-Host ""
    Write-Host "🎉 Your Docker image is ready for Azure deployment!" -ForegroundColor Green
} else {
    Write-Host "❌ Docker build failed!" -ForegroundColor Red
    exit 1
} 