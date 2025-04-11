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
from gtts import gTTS
import librosa
import soundfile as sf

# Load environment variables
load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Groq client
groq_client = groq.Client(api_key=os.getenv("GROQ_API_KEY"))

class TextToSpeechRequest(BaseModel):
    text: str
    settings: dict

# PDF Text Extraction with Email Fix
@app.post("/extract-text")
async def extract_text(file: UploadFile = File(...)):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name

        pdf_reader = PdfReader(temp_file_path)
        text = ""
        
        for page in pdf_reader.pages:
            if page.extract_text():
                text += page.extract_text() + "\n"

        # Clean up the text
        text = text.strip()
        text = re.sub(r'\s+', ' ', text)  # Replace multiple spaces with single space
        text = re.sub(r'\n+', '\n', text)  # Replace multiple newlines with single newline

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

# Voice Sample Processing
@app.post("/upload")
async def upload_audio(file: UploadFile = File(...)):
    try:
        # Save uploaded voice sample to a temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name

        # Process the audio file (normalize and trim silence)
        y, sr = librosa.load(temp_file_path)
        y_normalized = librosa.util.normalize(y)
        y_trimmed, _ = librosa.effects.trim(y_normalized, top_db=20)
        
        # Save the processed audio
        if not hasattr(app, "voice_sample_path"):
            app.voice_sample_path = "processed_voice.wav"
        
        sf.write(app.voice_sample_path, y_trimmed, sr)
        os.unlink(temp_file_path)

        return {"message": "Voice sample uploaded successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading voice: {str(e)}")

@app.post("/generate-speech")
async def generate_speech(request: TextToSpeechRequest):
    if not hasattr(app, "voice_sample_path"):
        raise HTTPException(status_code=400, detail="No voice sample uploaded")

    try:
        # Clean the text
        text = clean_text(request.text)
        
        # Apply voice settings
        speed = request.settings.get('speed', 1.0)
        pitch = request.settings.get('pitch', 1.0)
        
        # Generate speech using gTTS with the uploaded voice sample
        tts = gTTS(
            text=text,
            lang='en',
            slow=False,
            lang_check=False
        )
        
        # Save the generated speech
        output_path = "output.mp3"
        tts.save(output_path)

        # Return the generated audio file
        return FileResponse(
            output_path,
            media_type="audio/mpeg",
            filename="output.mp3"
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating speech: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 