# Troubleshooting Render Deployment

## Rust/Cargo Compilation Error

If you're getting the error:
```
error: failed to create directory `/usr/local/cargo/registry/cache/index.crates.io-1949cf8c6b5b557f`
Caused by: Read-only file system (os error 30)
```

This means one of the Python packages is trying to compile Rust code, which isn't allowed on Render's free tier.

## Solutions

### Solution 1: Use the Build Script (Recommended)
The `build.sh` script installs packages one by one to avoid conflicts:

1. Make sure `render.yaml` uses:
   ```yaml
   buildCommand: cd backend && chmod +x build.sh && ./build.sh
   ```

2. Deploy using the blueprint method

### Solution 2: Use Minimal Requirements
Use `requirements-render.txt` which contains only essential packages:

1. In Render dashboard, set build command to:
   ```
   cd backend && pip install -r requirements-render.txt
   ```

### Solution 3: Manual Package Installation
Install packages individually in Render dashboard:

1. Set build command to:
   ```bash
   cd backend && pip install fastapi==0.88.0 uvicorn==0.20.0 python-dotenv==0.21.1 requests==2.28.2 youtube-transcript-api==0.6.1 google-api-python-client==2.86.0 google-generativeai==0.2.0 pydantic==1.10.4
   ```

### Solution 4: Use Docker (Alternative)
If the above solutions don't work:

1. Use the provided `Dockerfile`
2. In Render, choose "Docker" as the environment
3. Set the Docker image path

## Package Versions That Work

These specific versions are known to work on Render without Rust compilation:

- `fastapi==0.88.0`
- `uvicorn==0.20.0`
- `python-dotenv==0.21.1`
- `requests==2.28.2`
- `youtube-transcript-api==0.6.1`
- `google-api-python-client==2.86.0`
- `google-generativeai==0.2.0`
- `pydantic==1.10.4`

## Environment Variables

Make sure these are set in Render:
- `YOUTUBE_API_KEY`
- `GEMINI_API_KEY`

## Testing After Deployment

Once deployed, test these endpoints:
- `GET /test-gemini`
- `GET /test-transcript/dQw4w9WgXcQ`
- `GET /search-videos?query=test`

## Common Issues

1. **Build Timeout**: Use the minimal requirements
2. **Memory Issues**: Upgrade to paid plan if needed
3. **Port Issues**: Make sure app listens on `0.0.0.0` and uses `$PORT`

## Alternative Deployment Platforms

If Render continues to have issues:

1. **Heroku**: Use the `Procfile`
2. **Railway**: Similar to Render but different build process
3. **Vercel**: Good for Python apps
4. **DigitalOcean App Platform**: More control over build process 