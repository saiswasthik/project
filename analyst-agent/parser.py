import pandas as pd
import PyPDF2
from docx import Document
import io

def parse_file(file) -> str:
    """
    Parses an uploaded Streamlit file based on its extension and returns the extracted text or markdown.
    """
    filename = file.name.lower()
    
    try:
        if filename.endswith('.csv'):
            df = pd.read_csv(file)
            return f"Data from {file.name}:\n\n" + df.to_markdown(index=False)
            
        elif filename.endswith(('.xls', '.xlsx')):
            df = pd.read_excel(file)
            return f"Data from {file.name}:\n\n" + df.to_markdown(index=False)
            
        elif filename.endswith('.pdf'):
            reader = PyPDF2.PdfReader(file)
            text = f"Text from {file.name}:\n\n"
            for page in reader.pages:
                text += page.extract_text() + "\n"
            return text
            
        elif filename.endswith('.docx'):
            doc = Document(file)
            text = f"Text from {file.name}:\n\n"
            for para in doc.paragraphs:
                text += para.text + "\n"
            return text
            
        elif filename.endswith('.txt'):
            return f"Text from {file.name}:\n\n" + file.getvalue().decode('utf-8')
            
        else:
            return f"Unsupported file type: {filename}"
            
    except Exception as e:
        return f"Error parsing file {file.name}: {str(e)}"
