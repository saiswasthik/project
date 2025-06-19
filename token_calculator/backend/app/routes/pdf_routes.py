from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List
import os
from app.services.pdf_service import process_pdf, process_pdf_folder
from app.utils.token_calculator import calculate_tokens

router = APIRouter()

@router.post("/calculate-single-pdf")
async def calculate_single_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    try:
        # Save the uploaded file temporarily
        temp_path = f"temp_{file.filename}"
        with open(temp_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Process the PDF and calculate tokens
        result = process_pdf(temp_path)
        token_count = calculate_tokens(result['text'])
        word_count = len(result['text'].split())
        
        # Clean up
        os.remove(temp_path)
        
        return {
            "filename": file.filename,
            "token_count": token_count,
            "text_length": len(result['text']),
            "word_count": word_count,
            "processing_time": result['processing_time'],
            "numbers": result['numbers'],
            "page_count": result['page_count']
        }
    except Exception as e:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/calculate-folder")
async def calculate_folder(files: List[UploadFile] = File(...)):
    results = []
    total_processing_time = 0
    total_pages = 0
    
    for file in files:
        if not file.filename.endswith('.pdf'):
            continue
            
        try:
            # Save the uploaded file temporarily
            temp_path = f"temp_{file.filename}"
            with open(temp_path, "wb") as buffer:
                content = await file.read()
                buffer.write(content)
            
            # Process the PDF and calculate tokens
            result = process_pdf(temp_path)
            token_count = calculate_tokens(result['text'])
            word_count = len(result['text'].split())
            
            total_processing_time += result['processing_time']
            total_pages += result['page_count']
            
            results.append({
                "filename": file.filename,
                "token_count": token_count,
                "text_length": len(result['text']),
                "word_count": word_count,
                "processing_time": result['processing_time'],
                "numbers": result['numbers'],
                "page_count": result['page_count']
            })
            
            # Clean up
            os.remove(temp_path)
            
        except Exception as e:
            if os.path.exists(temp_path):
                os.remove(temp_path)
            results.append({
                "filename": file.filename,
                "error": str(e)
            })
    
    return {
        "results": results,
        "total_files": len(results),
        "successful_files": len([r for r in results if "error" not in r]),
        "total_processing_time": round(total_processing_time, 2),
        "total_pages": total_pages
    } 