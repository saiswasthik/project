import base64
import mimetypes
import os
import re
import struct
import uuid
import json
import google.generativeai as genai
from google.generativeai import types
from dotenv import load_dotenv
from gtts import gTTS

load_dotenv()

# IMPORTANT: Make sure you have a .env file in the backend directory 
# with your GEMINI_API_KEY.
# Example .env file:
# GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

try:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not found in environment variables.")
    genai.configure(api_key=api_key)
except ValueError as e:
    print(f"Error: {e}")
    # You might want to handle this more gracefully
    exit()

def save_binary_file(file_name, data):
    """Save binary data to a file."""
    f = open(file_name, "wb")
    f.write(data)
    f.close()
    print(f"File saved to: {file_name}")

def convert_to_wav(audio_data: bytes, mime_type: str) -> bytes:
    """Generates a WAV file header for the given audio data and parameters."""
    parameters = parse_audio_mime_type(mime_type)
    bits_per_sample = parameters["bits_per_sample"]
    sample_rate = parameters["rate"]
    num_channels = 1
    data_size = len(audio_data)
    bytes_per_sample = bits_per_sample // 8
    block_align = num_channels * bytes_per_sample
    byte_rate = sample_rate * block_align
    chunk_size = 36 + data_size

    header = struct.pack(
        "<4sI4s4sIHHIIHH4sI",
        b"RIFF",          # ChunkID
        chunk_size,       # ChunkSize
        b"WAVE",          # Format
        b"fmt ",          # Subchunk1ID
        16,               # Subchunk1Size
        1,                # AudioFormat
        num_channels,     # NumChannels
        sample_rate,      # SampleRate
        byte_rate,        # ByteRate
        block_align,      # BlockAlign
        bits_per_sample,  # BitsPerSample
        b"data",          # Subchunk2ID
        data_size         # Subchunk2Size
    )
    return header + audio_data

def parse_audio_mime_type(mime_type: str) -> dict[str, int | None]:
    """Parses bits per sample and rate from an audio MIME type string."""
    bits_per_sample = 16
    rate = 24000

    parts = mime_type.split(";")
    for param in parts:
        param = param.strip()
        if param.lower().startswith("rate="):
            try:
                rate_str = param.split("=", 1)[1]
                rate = int(rate_str)
            except (ValueError, IndexError):
                pass
        elif param.startswith("audio/L"):
            try:
                bits_per_sample = int(param.split("L", 1)[1])
            except (ValueError, IndexError):
                pass

    return {"bits_per_sample": bits_per_sample, "rate": rate}

def text_to_speech(script_json: str):
    """
    Converts a script (JSON string) into speech using gTTS (Google Text-to-Speech).
    """
    try:
        print(f"Starting TTS conversion for script: {script_json[:100]}...")
        
        # Create a directory for audio files if it doesn't exist
        audio_dir = "temp_audio"
        os.makedirs(audio_dir, exist_ok=True)
        print(f"Audio directory: {audio_dir}")

        # Parse the script JSON
        try:
            script_data = json.loads(script_json)
            person_a_lines = script_data.get("person_a", [])
            person_b_lines = script_data.get("person_b", [])
            print(f"Parsed script - Person A: {len(person_a_lines)} lines, Person B: {len(person_b_lines)} lines")
        except json.JSONDecodeError:
            print("Error: Invalid JSON script format")
            return {"status": "error", "message": "Invalid JSON script format"}

        # Create the conversation text
        conversation_text = ""
        len_a = len(person_a_lines)
        len_b = len(person_b_lines)
        
        for i in range(max(len_a, len_b)):
            if i < len_a:
                conversation_text += f"{person_a_lines[i]}\n"
            if i < len_b:
                conversation_text += f"{person_b_lines[i]}\n"

        print(f"Generated conversation text length: {len(conversation_text)} characters")
        print(f"First 200 characters: {conversation_text[:200]}...")

        # Generate audio using gTTS
        print("Generating audio using gTTS...")
        
        # Create a unique filename
        file_name = f"conversation_{uuid.uuid4()}.mp3"
        audio_path = os.path.join(audio_dir, file_name)
        print(f"Audio file path: {audio_path}")
        
        try:
            # Generate speech using gTTS
            print("Creating gTTS object...")
            tts = gTTS(text=conversation_text, lang='en', slow=False)
            print("gTTS object created, saving file...")
            tts.save(audio_path)
            print(f"Audio file saved successfully: {audio_path}")
            
            # Check if file was created successfully
            if os.path.exists(audio_path):
                file_size = os.path.getsize(audio_path)
                print(f"Audio file size: {file_size} bytes")
                print(f"Audio file exists and is readable")
                return {"status": "success", "path": audio_path, "message": "Audio generated successfully"}
            else:
                print("Error: Audio file was not created")
                return {"status": "error", "message": "Failed to create audio file"}
                
        except Exception as gtts_error:
            print(f"Error in gTTS generation: {gtts_error}")
            return {"status": "error", "message": f"gTTS error: {str(gtts_error)}"}
            
    except Exception as e:
        print(f"Error in text_to_speech: {e}")
        return {"status": "error", "message": f"An error occurred during text-to-speech conversion: {e}"} 