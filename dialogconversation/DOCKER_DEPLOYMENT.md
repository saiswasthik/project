# Docker Deployment Guide for ConversationAI

This guide will help you build and deploy your ConversationAI application to Azure using Docker.

## 🐳 Docker Setup

### Prerequisites

- Docker Desktop installed and running
- Azure CLI installed and logged in
- Azure Container Registry (ACR) created

### Quick Start

1. **Build the Docker image:**
   ```powershell
   # On Windows
   .\build-docker.ps1
   
   # On Linux/Mac
   ./build-docker.sh
   ```

2. **Test locally:**
   ```bash
   docker run -p 8080:80 conversationai:latest
   ```

3. **Access the application:**
   - Frontend: http://localhost:8080
   - Health check: http://localhost:8080/health
   - API: http://localhost:8080/api/

## 🚀 Azure Deployment

### Option 1: Azure Container Instances (ACI)

1. **Create Azure Container Registry:**
   ```bash
   az group create --name conversationai-rg --location eastus
   az acr create --resource-group conversationai-rg --name conversationaiacr --sku Basic
   az acr update -n conversationaiacr --admin-enabled true
   ```

2. **Get ACR credentials:**
   ```bash
   az acr credential show --name conversationaiacr
   ```

3. **Tag and push the image:**
   ```bash
   docker tag conversationai:latest conversationaiacr.azurecr.io/conversationai:latest
   az acr login --name conversationaiacr
   docker push conversationaiacr.azurecr.io/conversationai:latest
   ```

4. **Deploy to ACI:**
   ```bash
   az container create \
     --resource-group conversationai-rg \
     --name conversationai \
     --image conversationaiacr.azurecr.io/conversationai:latest \
     --dns-name-label conversationai \
     --ports 80 \
     --environment-variables \
       PYTHONPATH=/app/backend \
       PYTHONUNBUFFERED=1 \
       GOOGLE_API_KEY=your_google_api_key \
       FIREBASE_API_KEY=your_firebase_api_key \
       FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com \
       FIREBASE_PROJECT_ID=your_project_id \
       FIREBASE_STORAGE_BUCKET=your_project.appspot.com \
       FIREBASE_MESSAGING_SENDER_ID=your_sender_id \
       FIREBASE_APP_ID=your_app_id
   ```

### Option 2: Azure App Service

1. **Create App Service with Container support:**
   ```bash
   az appservice plan create --name conversationai-plan --resource-group conversationai-rg --sku B1 --is-linux
   az webapp create --resource-group conversationai-rg --plan conversationai-plan --name conversationai-app --deployment-local-git
   ```

2. **Configure the container:**
   ```bash
   az webapp config container set \
     --name conversationai-app \
     --resource-group conversationai-rg \
     --docker-custom-image-name conversationaiacr.azurecr.io/conversationai:latest
   ```

3. **Set environment variables:**
   ```bash
   az webapp config appsettings set \
     --resource-group conversationai-rg \
     --name conversationai-app \
     --settings \
       PYTHONPATH=/app/backend \
       PYTHONUNBUFFERED=1 \
       GOOGLE_API_KEY=your_google_api_key \
       FIREBASE_API_KEY=your_firebase_api_key \
       FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com \
       FIREBASE_PROJECT_ID=your_project_id \
       FIREBASE_STORAGE_BUCKET=your_project.appspot.com \
       FIREBASE_MESSAGING_SENDER_ID=your_sender_id \
       FIREBASE_APP_ID=your_app_id
   ```

### Option 3: Azure Kubernetes Service (AKS)

1. **Create AKS cluster:**
   ```bash
   az aks create \
     --resource-group conversationai-rg \
     --name conversationai-aks \
     --node-count 1 \
     --enable-addons monitoring \
     --generate-ssh-keys
   ```

2. **Create deployment YAML:**
   ```yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: conversationai
   spec:
     replicas: 2
     selector:
       matchLabels:
         app: conversationai
     template:
       metadata:
         labels:
           app: conversationai
       spec:
         containers:
         - name: conversationai
           image: conversationaiacr.azurecr.io/conversationai:latest
           ports:
           - containerPort: 80
           env:
           - name: PYTHONPATH
             value: "/app/backend"
           - name: PYTHONUNBUFFERED
             value: "1"
           - name: GOOGLE_API_KEY
             valueFrom:
               secretKeyRef:
                 name: conversationai-secrets
                 key: google-api-key
   ---
   apiVersion: v1
   kind: Service
   metadata:
     name: conversationai-service
   spec:
     selector:
       app: conversationai
     ports:
     - port: 80
       targetPort: 80
     type: LoadBalancer
   ```

3. **Deploy to AKS:**
   ```bash
   az aks get-credentials --resource-group conversationai-rg --name conversationai-aks
   kubectl apply -f deployment.yaml
   ```

## 🔧 Environment Variables

Make sure to set these environment variables in your Azure deployment:

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_API_KEY` | Google Gemini API key | Yes |
| `FIREBASE_API_KEY` | Firebase API key | Yes |
| `FIREBASE_AUTH_DOMAIN` | Firebase auth domain | Yes |
| `FIREBASE_PROJECT_ID` | Firebase project ID | Yes |
| `FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | Yes |
| `FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | Yes |
| `FIREBASE_APP_ID` | Firebase app ID | Yes |
| `PYTHONPATH` | Python path for backend | No (set automatically) |
| `PYTHONUNBUFFERED` | Python unbuffered output | No (set automatically) |

## 📁 Project Structure

```
conversationai/
├── Dockerfile              # Production Docker image
├── Dockerfile.dev          # Development Docker image
├── docker-compose.yml      # Local development setup
├── nginx.conf             # Production nginx configuration
├── nginx.dev.conf         # Development nginx configuration
├── start.sh               # Production startup script
├── start-dev.sh           # Development startup script
├── build-docker.ps1       # Windows build script
├── build-docker.sh        # Linux/Mac build script
├── .dockerignore          # Docker ignore file
├── backend/               # FastAPI backend
│   ├── main.py
│   ├── requirements.txt
│   ├── routes/
│   └── services/
└── frontend/              # React frontend
    ├── package.json
    ├── src/
    └── public/
```

## 🧪 Testing

### Local Testing

1. **Build and test the image:**
   ```bash
   docker build -t conversationai:test .
   docker run -p 8080:80 conversationai:test
   ```

2. **Test endpoints:**
   ```bash
   # Health check
   curl http://localhost:8080/health
   
   # Main application
   curl http://localhost:8080/
   
   # API endpoint
   curl http://localhost:8080/api/
   ```

### Development Mode

1. **Start development environment:**
   ```bash
   docker-compose --profile dev up
   ```

2. **Access development servers:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8000
   - Nginx proxy: http://localhost:80

## 🔍 Troubleshooting

### Common Issues

1. **Port conflicts:**
   - Change ports in docker-compose.yml or use different ports
   - Check if ports 80, 3000, 8000 are available

2. **Build failures:**
   - Ensure all dependencies are in requirements.txt and package.json
   - Check Dockerfile syntax and paths

3. **Environment variables:**
   - Verify all required environment variables are set
   - Check Azure App Service configuration

4. **Firebase issues:**
   - Ensure Firebase project is properly configured
   - Check Firebase security rules

### Logs

1. **Docker logs:**
   ```bash
   docker logs <container_id>
   ```

2. **Azure App Service logs:**
   ```bash
   az webapp log tail --name conversationai-app --resource-group conversationai-rg
   ```

3. **AKS logs:**
   ```bash
   kubectl logs -f deployment/conversationai
   ```

## 📊 Monitoring

### Health Checks

The application includes a health check endpoint at `/health` that returns:
- HTTP 200: Application is healthy
- HTTP 500: Application is unhealthy

### Metrics

Monitor your application using:
- Azure Monitor
- Application Insights
- Custom metrics in your application

## 🔒 Security

### Best Practices

1. **Use Azure Key Vault for secrets:**
   ```bash
   az keyvault create --name conversationai-kv --resource-group conversationai-rg
   az keyvault secret set --vault-name conversationai-kv --name google-api-key --value "your-api-key"
   ```

2. **Enable HTTPS:**
   - Configure SSL certificates in Azure App Service
   - Use Azure Application Gateway for AKS

3. **Network Security:**
   - Use Azure Virtual Network
   - Configure Network Security Groups
   - Enable Azure Firewall if needed

## 📈 Scaling

### Horizontal Scaling

1. **Azure App Service:**
   - Configure auto-scaling rules
   - Set minimum and maximum instances

2. **AKS:**
   - Use Horizontal Pod Autoscaler (HPA)
   - Configure cluster autoscaler

3. **ACI:**
   - Deploy multiple instances
   - Use Azure Load Balancer

## 🎯 Next Steps

1. Set up CI/CD pipeline with Azure DevOps or GitHub Actions
2. Configure monitoring and alerting
3. Set up backup and disaster recovery
4. Implement blue-green deployment strategy
5. Add custom domain and SSL certificate

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review Azure documentation
3. Check application logs
4. Verify environment configuration

---

**Happy Deploying! 🚀** 