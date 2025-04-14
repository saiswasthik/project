from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks, Form
from fastapi.responses import JSONResponse
import os
from pathlib import Path
from typing import List
import logging
from ..services.utils import save_upload_file, ensure_directories, get_file_size
from ..services.tts import tts_service

# Configure logging
logger = logging.getLogger(__name__)

# Create router
router = APIRouter()

@router.post("/upload")
async def upload_voice(
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = None
) -> JSONResponse:
    """
    Upload a voice sample for cloning
    """
    try:
        # Ensure directories exist
        ensure_directories()
        
        # Validate file type
        if not file.content_type.startswith('audio/'):
            raise HTTPException(
                status_code=400,
                detail="File must be an audio file"
            )
        
        # Save the uploaded file
        upload_dir = os.getenv("VOICE_UPLOAD_DIR")
        file_path = await save_upload_file(file, upload_dir)
        
        # Start voice cloning in background
        if background_tasks:
            background_tasks.add_task(
                tts_service.clone_voice,
                audio_path=file_path,
                language="en"  # Explicitly set language to English
            )
        
        return JSONResponse(
            status_code=202,
            content={
                "message": "Voice sample uploaded successfully",
                "file_path": file_path
            }
        )
        
    except Exception as e:
        logger.error(f"Error uploading voice sample: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Error uploading voice sample: {str(e)}"
        )

@router.get("/list")
async def list_voices() -> JSONResponse:
    """
    List all available voice models
    """
    try:
        voice_models_dir = os.getenv("VOICE_MODELS_DIR")
        models = []
        
        # Get all .npy files (voice model embeddings)
        for file in Path(voice_models_dir).glob("*.npy"):
            models.append({
                "name": file.stem,
                "path": str(file),
                "size": get_file_size(str(file)),
                "created_at": file.stat().st_ctime
            })
        
        return JSONResponse(
            content={
                "models": models
            }
        )
        
    except Exception as e:
        logger.error(f"Error listing voice models: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Error listing voice models: {str(e)}"
        )

@router.post("/clone")
async def clone_voice_endpoint(
    file: UploadFile = File(...),
    language: str = Form("en")  # Add language parameter with default value "en"
):
    """
    Clone a voice from an uploaded audio file
    """
    try:
        # Ensure required directories exist
        upload_dir = os.getenv("VOICE_UPLOAD_DIR", "uploads/voice")
        os.makedirs(upload_dir, exist_ok=True)
        
        # Save the uploaded file
        file_path = os.path.join(upload_dir, file.filename)
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Clone the voice with explicit language parameter
        voice_path = await tts_service.clone_voice(
            audio_path=file_path,
            language=language  # Explicitly pass the language parameter
        )
        
        if not voice_path:
            raise HTTPException(
                status_code=500,
                detail="Failed to clone voice"
            )
        
        return JSONResponse(
            content={
                "message": "Voice cloned successfully",
                "voice_path": voice_path
            },
            status_code=200
        )
        
    except Exception as e:
        logger.error(f"Error cloning voice: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=str(e)
        ) 