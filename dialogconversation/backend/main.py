from fastapi import FastAPI, Body
from routes import dialog
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from services.gemini import generate_summary


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://ai-coversation.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dialog.router)

app.mount("/temp_audio", StaticFiles(directory="temp_audio"), name="temp_audio")

@app.post("/generate-summary")
def generate_summary_endpoint(topic: str = Body(..., embed=True)):
    print(f"=== GENERATING SUMMARY FOR TOPIC: {topic} ===")
    summary = generate_summary(topic)
    print(f"Summary generated: {summary[:100]}..." if summary else "No summary generated")
    return {"summary": summary}

@app.get("/")
def read_root():
    return {"message": "Welcome to the Dialog Conversation API"} 

