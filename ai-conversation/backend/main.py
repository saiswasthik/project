from fastapi import FastAPI, Body
from routes import dialog, pdf
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from services.gemini import generate_summary


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://conversation-zeta.vercel.app/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dialog.router)
app.include_router(pdf.router)

app.mount("/temp_audio", StaticFiles(directory="temp_audio"), name="temp_audio")

@app.post("/generate-summary")
def generate_summary_endpoint(topic: str = Body(..., embed=True)):
    print(f"=== GENERATING SUMMARY FOR TOPIC: {topic} ===")
    
    # Create a better formatted summary prompt
    prompt = (
        f"You are a knowledgeable teacher creating a comprehensive summary for students.\n\n"
        f"Topic: {topic}\n\n"
        f"Requirements:\n"
        f"- Create a well-structured summary with clear headings and bullet points.\n"
        f"- Use HTML-like formatting with <h3> for headings and <ul><li> for bullet points.\n"
        f"- Include main concepts, key points, and important details.\n"
        f"- Organize information logically with sections.\n"
        f"- Keep the summary informative but concise (around 300-500 words).\n"
        f"- Use this format:\n"
        f"<h3>Main Topic</h3>\n"
        f"<ul>\n"
        f"<li>Key point 1</li>\n"
        f"<li>Key point 2</li>\n"
        f"</ul>\n"
        f"<h3>Important Details</h3>\n"
        f"<ul>\n"
        f"<li>Detail 1</li>\n"
        f"<li>Detail 2</li>\n"
        f"</ul>\n"
    )
    
    summary = generate_summary(prompt)
    print(f"Summary generated: {summary[:100]}..." if summary else "No summary generated")
    return {"summary": summary}

@app.get("/")
def read_root():
    return {"message": "Welcome to the Dialog Conversation API"} 

