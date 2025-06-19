from PyPDF2 import PdfReader
import os
import re
import time
from typing import Dict, Any

def extract_numbers(text: str) -> Dict[str, Any]:
    """
    Extract number fields from text.
    
    Args:
        text (str): Input text
        
    Returns:
        dict: Dictionary containing extracted number fields
    """
    numbers = {
        'total_numbers': 0,
        'numbers_list': [],
        'sum': 0,
        'average': 0,
        'max': 0,
        'min': float('inf')
    }
    
    # Find all numbers in the text (including decimals)
    number_pattern = r'-?\d*\.?\d+'
    found_numbers = re.findall(number_pattern, text)
    
    if found_numbers:
        # Convert strings to floats
        numbers_list = [float(num) for num in found_numbers]
        
        numbers['total_numbers'] = len(numbers_list)
        numbers['numbers_list'] = numbers_list
        numbers['sum'] = sum(numbers_list)
        numbers['average'] = sum(numbers_list) / len(numbers_list)
        numbers['max'] = max(numbers_list)
        numbers['min'] = min(numbers_list)
    
    return numbers

def clean_text(text: str) -> str:
    """
    Clean extracted text from PDF.
    
    Args:
        text (str): Raw text from PDF
        
    Returns:
        str: Cleaned text
    """
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text)
    
    # Remove special characters but keep basic punctuation
    text = re.sub(r'[^\w\s.,!?-]', '', text)
    
    # Remove multiple newlines
    text = re.sub(r'\n+', '\n', text)
    
    # Remove multiple spaces
    text = re.sub(r' +', ' ', text)
    
    return text.strip()

def process_pdf(file_path: str) -> Dict[str, Any]:
    """
    Extract text from a PDF file and calculate processing time.
    
    Args:
        file_path (str): Path to the PDF file
        
    Returns:
        dict: Dictionary containing extracted text and processing information
    """
    start_time = time.time()
    
    try:
        reader = PdfReader(file_path)
        text = ""
        page_count = len(reader.pages)
        
        for page in reader.pages:
            # Extract text from page
            page_text = page.extract_text()
            
            # Clean the extracted text
            cleaned_text = clean_text(page_text)
            
            # Add to total text
            text += cleaned_text + "\n"
            
        # Final cleaning of the complete text
        final_text = clean_text(text)
        
        if not final_text:
            raise Exception("No text could be extracted from the PDF")
        
        # Extract numbers from the text
        numbers = extract_numbers(final_text)
        
        # Calculate processing time
        processing_time = time.time() - start_time
        
        return {
            'text': final_text,
            'processing_time': round(processing_time, 2),
            'numbers': numbers,
            'page_count': page_count
        }
            
    except Exception as e:
        processing_time = time.time() - start_time
        raise Exception(f"Error processing PDF: {str(e)} (Processing time: {round(processing_time, 2)}s)")

def process_pdf_folder(folder_path: str) -> dict:
    """
    Process all PDF files in a folder.
    
    Args:
        folder_path (str): Path to the folder containing PDFs
        
    Returns:
        dict: Dictionary containing results for each PDF
    """
    results = {}
    total_processing_time = 0
    
    for filename in os.listdir(folder_path):
        if filename.endswith('.pdf'):
            file_path = os.path.join(folder_path, filename)
            try:
                result = process_pdf(file_path)
                total_processing_time += result['processing_time']
                results[filename] = {
                    "success": True,
                    "text": result['text'],
                    "processing_time": result['processing_time'],
                    "numbers": result['numbers']
                }
            except Exception as e:
                results[filename] = {
                    "success": False,
                    "error": str(e)
                }
    
    return {
        "results": results,
        "total_processing_time": round(total_processing_time, 2)
    } 