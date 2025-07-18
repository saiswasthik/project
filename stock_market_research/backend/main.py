from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import fundamental
from routes import technical
from routes import sentiment
from routes import news
from routes import screener

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://project-hvgn.vercel.app"],  # Frontend URL for local development "http://localhost:5173",
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(fundamental.router, prefix="/api")
app.include_router(technical.router, prefix="/api")
app.include_router(sentiment.router, prefix="/api")
app.include_router(news.router, prefix="/api")
app.include_router(screener.router, prefix="/api")


@app.get("/")
async def read_root():
    return {"message": "Stock Market Research Backend"} 

import os

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.environ.get("PORT", 9000)))
