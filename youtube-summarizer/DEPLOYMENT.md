# Deployment Guide for YouTube Summarizer

## Deploying to Render

### Prerequisites
1. A Render account
2. Your YouTube API key
3. Your Gemini API key

### Step 1: Prepare Your Repository
Make sure your repository has the following files:
- `backend/requirements.txt` - Python dependencies
- `backend/main.py` - FastAPI application
- `backend/runtime.txt` - Python version specification
- `render.yaml` - Render configuration (optional)

### Step 2: Deploy to Render

#### Option A: Using Render Dashboard
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `youtube-summarizer-backend`
   - **Environment**: `Python`
   - **Build Command**: `cd backend && pip install -r requirements.txt`
   - **Start Command**: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free

#### Option B: Using render.yaml (Blueprints)
1. Push your code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click "New +" and select "Blueprint"
4. Connect your GitHub repository
5. Render will automatically detect the `render.yaml` file and configure the service

### Step 3: Set Environment Variables
In your Render service dashboard, add these environment variables:
- `YOUTUBE_API_KEY`: Your YouTube Data API key
- `GEMINI_API_KEY`: Your Google Gemini API key

### Step 4: Deploy
Click "Create Web Service" and wait for the deployment to complete.

### Troubleshooting

#### Common Issues:

1. **Build Failures**: 
   - Make sure all dependencies are in `requirements.txt`
   - Check that Python version in `runtime.txt` is compatible

2. **Import Errors**:
   - Verify all imports in `main.py` are available in `requirements.txt`
   - Remove any unused imports

3. **API Key Issues**:
   - Ensure environment variables are set correctly
   - Check that API keys are valid and have proper permissions

4. **Port Issues**:
   - Make sure the application listens on `0.0.0.0` and uses `$PORT`

### Testing Your Deployment

Once deployed, test these endpoints:
- `GET /test-gemini` - Test Gemini API
- `GET /test-transcript/{video_id}` - Test transcript retrieval
- `GET /search-videos?query=test` - Test video search
- `POST /summarize-videos` - Test summary generation

### Alternative Deployment Methods

#### Using Docker
If you prefer Docker deployment:
1. Use the provided `Dockerfile`
2. Build and push to a container registry
3. Deploy using Render's Docker option

#### Using Heroku
1. Add `Procfile` to your backend directory
2. Deploy using Heroku CLI or GitHub integration

### Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `YOUTUBE_API_KEY` | YouTube Data API v3 key | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `PORT` | Port for the application (set by Render) | Auto |

### API Endpoints

- `GET /search-videos` - Search for YouTube videos
- `POST /summarize-videos` - Generate video summaries
- `GET /test-gemini` - Test Gemini API
- `GET /test-transcript/{video_id}` - Test transcript retrieval 