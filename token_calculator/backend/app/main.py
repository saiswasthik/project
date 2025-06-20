from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import pdf_routes

app = FastAPI(title="PDF Token Calculator")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[ "http://localhost:3000",
            "https://llm-token-calculator-phi.vercel.app"],  # React app URL for local host "http://localhost:3000",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"], 
)

# Include routers
app.include_router(pdf_routes.router, prefix="/api", tags=["pdf"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 