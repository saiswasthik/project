import base64
import requests
import json
from fastapi import HTTPException
from config import GEMINI_API_KEY, GEMINI_API_URL
from dotenv import load_dotenv
import os
import re
import google.generativeai as genai
from pydantic import BaseModel, ValidationError
import io
from PyPDF2 import PdfReader

load_dotenv()

# Re-fetch the key after loading .env
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")


class Contract(BaseModel):
    company: str
    status: str
    priority: str = 'TBD'
    service: str = 'TBD'
    category: str = 'TBD'
    ends: str = 'TBD'
    value: str = 'TBD'
    action: str = 'TBD'

# Load Gemini API key from environment
if not os.getenv("GEMINI_API_KEY"):
    from dotenv import load_dotenv
    load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


def call_gemini_llm(text):
    prompt = f"""
Extract the following contract details from the text below and return as JSON with keys: company, status, priority, service, category, ends, value, action. If a field is missing, use 'TBD'.

Text:
{text}
"""
    headers = {"Content-Type": "application/json"}
    params = {"key": GEMINI_API_KEY}
    data = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"responseMimeType": "application/json"}
    }
    response = requests.post(GEMINI_API_URL, headers=headers, params=params, json=data)
    print("Gemini raw response:", response.status_code, response.text)  # Debug print
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Gemini LLM API error")
    try:
        data = response.json()["candidates"][0]["content"]["parts"][0]["text"]
        contract_data = json.loads(data)
        validated_contract = Contract(**contract_data)
        return validated_contract.dict()
    except (ValidationError, json.JSONDecodeError) as e:
        raise HTTPException(status_code=500, detail=f"Gemini LLM parsing or validation error: {e}")


def extract_text_from_pdf(pdf_bytes):
    reader = PdfReader(io.BytesIO(pdf_bytes))
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text

def call_gemini_llm_with_pdf(pdf_bytes):
    # Extract text from PDF
    text = extract_text_from_pdf(pdf_bytes)
    prompt = (
        "Extract the following contract details from the text below and return as JSON with keys: "
        "company, status, priority, service, category, ends, value, action. "
        "If a field is missing, use 'TBD'.\n\nText:\n" + text
    )
    model = genai.GenerativeModel("models/gemini-2.0-flash")
    response = model.generate_content(
        contents=[prompt],
        generation_config={
            "response_mime_type": "application/json"
        }
    )
    print("Gemini SDK response:", response.text)
    try:
        contract_data = json.loads(response.text)
        validated_contract = Contract(**contract_data)
        return validated_contract.dict()
    except (ValidationError, json.JSONDecodeError) as e:
        print(f"Error parsing or validating Gemini response: {e}\nRaw response: {response.text}")
        raise HTTPException(status_code=500, detail=f"Data validation failed: {e}") 