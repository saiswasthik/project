# Render Deployment Guide

## Issue
The deployment fails due to Rust compilation requirements for `tiktoken` package on Render's read-only file system.

## Solutions

### Solution 1: Use the updated requirements.txt (Recommended)
The `requirements.txt` has been updated to use `tiktoken==0.4.0` which has better pre-compiled wheel support.

### Solution 2: Use alternative requirements for Render
If Solution 1 doesn't work, use `requirements-render.txt` instead:

1. In your Render dashboard, change the build command to:
   ```
   pip install -r requirements-render.txt
   ```

2. This uses `transformers` instead of `tiktoken` for token counting.

### Solution 3: Update your service to use the alternative token calculator
If using Solution 2, update your PDF service to use the alternative token calculator:

```python
# In your pdf_service.py, change the import from:
from app.utils.token_calculator import calculate_tokens

# To:
from app.utils.token_calculator_alt import calculate_tokens
```

### Solution 4: Render-specific configuration
1. Make sure you have `runtime.txt` in your backend directory
2. Set the build command in Render to: `pip install -r requirements.txt`
3. Set the start command to: `cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Solution 5: Use a different deployment platform
If Render continues to have issues, consider:
- Railway
- Heroku
- DigitalOcean App Platform
- AWS Elastic Beanstalk

## Testing the deployment
After deployment, test your endpoints:
- `GET /api/health` (if you add a health check)
- `POST /api/calculate-tokens` with a PDF file

## Environment Variables
Make sure to set any required environment variables in your Render dashboard. 