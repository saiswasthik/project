import base64
import mimetypes
import os
import re
import struct
import uuid
import json
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

# IMPORTANT: Make sure you have a .env file in the backend directory 
# with your GEMINI_API_KEY.
# Example .env file:
# GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

try:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not found in environment variables.")
    client = genai.Client(api_key=api_key)
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
    Converts a script (JSON string) into speech using Google's Generative Media TTS.
    """
    try:
        print(f"Starting TTS conversion for script: {script_json[:100]}...")
        
        # Create a directory for audio files if it doesn't exist
        audio_dir = "temp_audio"
        os.makedirs(audio_dir, exist_ok=True)

        # Parse the script JSON
        try:
            script_data = json.loads(script_json)
            person_a_lines = script_data.get("person_a", [])
            person_b_lines = script_data.get("person_b", [])
            print(f"Parsed script - Person A: {len(person_a_lines)} lines, Person B: {len(person_b_lines)} lines")
        except json.JSONDecodeError:
            return {"status": "error", "message": "Invalid JSON script format"}

        # Create the conversation text with speaker labels
        conversation_text = ""
        len_a = len(person_a_lines)
        len_b = len(person_b_lines)
        
        for i in range(max(len_a, len_b)):
            if i < len_a:
                conversation_text += f"Speaker 1: {person_a_lines[i]}\n"
            if i < len_b:
                conversation_text += f"Speaker 2: {person_b_lines[i]}\n"

        print(f"Generated conversation text: {conversation_text[:200]}...")

        # Generate audio using Gemini TTS - simplified to match working test
        model = "models/gemini-2.5-flash-preview-tts"
        print(f"Using model: {model}")
        
        contents = [
            types.Content(
                role="user",
                parts=[
                    types.Part.from_text(text=conversation_text),
                ],
            ),
        ]
        
        generate_content_config = types.GenerateContentConfig(
            temperature=1,
            response_modalities=["audio"],
            speech_config=types.SpeechConfig(
                multi_speaker_voice_config=types.MultiSpeakerVoiceConfig(
                    speaker_voice_configs=[
                        types.SpeakerVoiceConfig(
                            speaker="Speaker 1",
                            voice_config=types.VoiceConfig(
                                prebuilt_voice_config=types.PrebuiltVoiceConfig(
                                    voice_name="Zephyr"
                                )
                            ),
                        ),
                        types.SpeakerVoiceConfig(
                            speaker="Speaker 2",
                            voice_config=types.VoiceConfig(
                                prebuilt_voice_config=types.PrebuiltVoiceConfig(
                                    voice_name="Puck"
                                )
                            ),
                        ),
                    ]
                ),
            ),
        )

        print("Starting audio generation...")
        
        # Simplified approach matching the working test
        chunk_count = 0
        audio_files = []
        
        for chunk in client.models.generate_content_stream(
            model=model,
            contents=contents,
            config=generate_content_config,
        ):
            chunk_count += 1
            print(f"Chunk {chunk_count}: {type(chunk)}")
            
            if (
                chunk.candidates
                and chunk.candidates[0].content
                and chunk.candidates[0].content.parts
                and chunk.candidates[0].content.parts[0].inline_data
                and chunk.candidates[0].content.parts[0].inline_data.data
            ):
                print("Found audio data!")
                inline_data = chunk.candidates[0].content.parts[0].inline_data
                data_buffer = inline_data.data
                mime_type = inline_data.mime_type
                print(f"Audio MIME type: {mime_type}")
                
                # Determine correct file extension
                file_extension = mimetypes.guess_extension(mime_type)
                if file_extension is None or mime_type not in ["audio/mpeg", "audio/mp3"]:
                    file_extension = ".wav"
                    data_buffer = convert_to_wav(data_buffer, mime_type)
                    print("Converted to WAV format")
                else:
                    print("Audio is in MP3 format")
                
                file_name = f"conversation_{uuid.uuid4()}{file_extension}"
                audio_path = os.path.join(audio_dir, file_name)
                
                with open(audio_path, "wb") as f:
                    f.write(data_buffer)
                
                audio_files.append(audio_path)
                print(f"Saved audio file: {audio_path} ({len(data_buffer)} bytes)")
            else:
                print("No audio data in this chunk.")

        if audio_files:
            print(f"Successfully generated {len(audio_files)} audio files")
            return {"status": "success", "path": audio_files[0], "files": audio_files}
        else:
            print("No audio files were generated")
            return {"status": "error", "message": "No audio was generated"}
            
    except Exception as e:
        print(f"Error in text_to_speech: {e}")
        return {"status": "error", "message": f"An error occurred during text-to-speech conversion: {e}"} 