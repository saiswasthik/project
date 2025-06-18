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
    allow_origins=["http://localhost:5173"],  # Frontend URL
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