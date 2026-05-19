# PowerShell script to build ConversationAI Docker Image
Write-Host "🚀 Building ConversationAI Docker Image" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green

# Set image name and tag
$IMAGE_NAME = "conversationai"
$TAG = "latest"
$FULL_IMAGE_NAME = "${IMAGE_NAME}:${TAG}"

Write-Host "📦 Building Docker image: ${FULL_IMAGE_NAME}" -ForegroundColor Yellow

# Build the Docker image
docker build -t $FULL_IMAGE_NAME .

# Check if build was successful
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Docker image built successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Image Details:" -ForegroundColor Cyan
    docker images $FULL_IMAGE_NAME
    Write-Host ""
    Write-Host "🎉 Your Docker image is ready!" -ForegroundColor Green
} else {
    Write-Host "❌ Docker build failed!" -ForegroundColor Red
    exit 1
} 