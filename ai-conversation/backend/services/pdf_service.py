import PyPDF2
import io
import os
from typing import Optional, Dict, Any

def extract_text_from_pdf(pdf_file) -> Dict[str, Any]:
    """
    Extract text from uploaded PDF file.
    
    Args:
        pdf_file: Uploaded PDF file object
        
    Returns:
        Dict containing extracted text and metadata
    """
    try:
        # Read the PDF file
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(pdf_file.file.read()))
        
        # Extract text from all pages
        text_content = ""
        total_pages = len(pdf_reader.pages)
        
        for page_num in range(total_pages):
            page = pdf_reader.pages[page_num]
            page_text = page.extract_text()
            if page_text:
                text_content += f"\n--- Page {page_num + 1} ---\n"
                text_content += page_text
                text_content += "\n"
        
        # Get PDF metadata
        metadata = {
            "filename": pdf_file.filename,
            "total_pages": total_pages,
            "file_size": len(pdf_file.file.read()) if hasattr(pdf_file.file, 'read') else 0
        }
        
        # Reset file pointer for potential future reads
        pdf_file.file.seek(0)
        
        return {
            "success": True,
            "text": text_content.strip(),
            "metadata": metadata,
            "error": None
        }
        
    except Exception as e:
        return {
            "success": False,
            "text": "",
            "metadata": {},
            "error": f"Failed to extract text from PDF: {str(e)}"
        }

def clean_extracted_text(text: str) -> str:
    """
    Clean and format extracted text for better processing.
    
    Args:
        text: Raw extracted text from PDF
        
    Returns:
        Cleaned and formatted text
    """
    if not text:
        return ""
    
    # Remove excessive whitespace
    lines = text.split('\n')
    cleaned_lines = []
    
    for line in lines:
        # Remove page markers
        if line.startswith('--- Page') and line.endswith('---'):
            continue
        
        # Clean the line
        cleaned_line = ' '.join(line.split())
        if cleaned_line:
            cleaned_lines.append(cleaned_line)
    
    return '\n'.join(cleaned_lines)

def extract_key_topics_from_text(text: str, max_topics: int = 5) -> list:
    """
    Extract key topics from the text content.
    
    Args:
        text: Cleaned text content
        max_topics: Maximum number of topics to extract
        
    Returns:
        List of key topics
    """
    try:
        # Simple topic extraction based on common patterns
        # This is a basic implementation - could be enhanced with NLP
        lines = text.split('\n')
        topics = []
        
        for line in lines:
            line = line.strip()
            if len(line) > 10 and len(line) < 100:  # Reasonable length for a topic
                # Look for lines that might be headings or key concepts
                if any(keyword in line.lower() for keyword in ['introduction', 'conclusion', 'summary', 'overview', 'background']):
                    topics.append(line)
                elif line.endswith(':') or line.isupper():
                    topics.append(line)
        
        # If we don't have enough topics, take some meaningful sentences
        if len(topics) < max_topics:
            sentences = text.split('.')
            for sentence in sentences:
                sentence = sentence.strip()
                if len(sentence) > 20 and len(sentence) < 200:
                    topics.append(sentence)
                    if len(topics) >= max_topics:
                        break
        
        return topics[:max_topics]
        
    except Exception as e:
        print(f"Error extracting topics: {e}")
        return [] 