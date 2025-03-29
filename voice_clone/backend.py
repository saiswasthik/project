from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import os
import re
import tempfile
import asyncio
from dotenv import load_dotenv
import groq
from PyPDF2 import PdfReader
from TTS.api import TTS

# Load environment variables
load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Groq client
groq_client = groq.Client(api_key=os.getenv("GROQ_API_KEY"))

# PDF Text Extraction with Email Fix
@app.post("/process-pdf")
async def process_pdf(file: UploadFile = File(...)):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name

        pdf_reader = PdfReader(temp_file_path)

        # Extract text and restore missing '@' in emails
        text = "\n".join([page.extract_text() for page in pdf_reader.pages if page.extract_text()])
        text = re.sub(r"(\w+)\s+(gmail|yahoo|outlook|hotmail)\s+(\.com)", r"\1@\2\3", text)

        os.unlink(temp_file_path)  # Delete temporary file

        return {"text": text}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")

# Improved Text Cleaning Function
def clean_text(text):
    """Removes unwanted characters while keeping essential symbols"""
    text = re.sub(r"[^a-zA-Z0-9@#,.!? ]", " ", text)  # Replace unsupported chars with space
    text = re.sub(r"\s+", " ", text).strip()  # Remove extra spaces
    return text

# Voice Cloning with Speaker Adaptation (Higher Accuracy)
@app.post("/clone-voice")
async def clone_voice(voice_sample: UploadFile = File(...), text: str = Form(...)):
    text = clean_text(text).replace("@", " at ")  # Clean text and fix '@' issue

    try:
        # Save uploaded voice sample to a temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_file:
            content = await voice_sample.read()
            temp_file.write(content)
            temp_file_path = temp_file.name  # Store the path for later use

        # Use a speaker-adaptive TTS model
        tts = TTS(model_name="tts_models/multilingual/multi-dataset/your_tts", progress_bar=False)

        output_path = "output.mp3"

        # Improved Voice Cloning for Higher Similarity
        await asyncio.to_thread(
            tts.tts_to_file, 
            text=text, 
            file_path=output_path, 
            speaker_wav=temp_file_path, 
            language="en",
            use_speaker_embedding=True,  # 🔹 Enables speaker embedding
            speaker_similarity=0.75  # 🔹 Adjust for higher similarity (0.7 - 0.85 recommended)
        )

        # Ensure temp file is deleted after processing
        os.unlink(temp_file_path)

        return {"audio_url": "http://localhost:8000/download-audio"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error cloning voice: {str(e)}")

# Audio File Download Endpoint
@app.get("/download-audio")
async def download_audio():
    if os.path.exists("output.mp3"):
        return FileResponse("output.mp3", media_type="audio/mpeg", filename="output.mp3")
    raise HTTPException(status_code=404, detail="Audio file not found")
