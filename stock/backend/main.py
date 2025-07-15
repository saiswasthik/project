from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import fundamental
from routes import technical
from routes import sentiment
from routes import news
from routes import screener
from routes import home
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Stock Market Research API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://stockmarketlivedata.vercel.app" ],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(fundamental.router, prefix="/api")
app.include_router(technical.router, prefix="/api")
app.include_router(sentiment.router, prefix="/api")
app.include_router(news.router, prefix="/api")
app.include_router(screener.router, prefix="/api")
app.include_router(home.router, prefix="/api")


@app.get("/")
async def read_root():
    logger.info("Root endpoint accessed")
    return {"message": "Stock Market Research Backend", "status": "running"}

@app.get("/health")
async def health_check():
    logger.info("Health check endpoint accessed")
    return {"status": "healthy", "message": "Backend is running"}

import os

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    logger.info(f"Starting server on port {port}")
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True, log_level="info")
