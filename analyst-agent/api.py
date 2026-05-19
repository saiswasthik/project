from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import json
from llm import get_llm_response
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()

class ProcessRequest(BaseModel):
    task: str
    data: str

class AnalyzeRequest(BaseModel):
    task: str
    data: str

@app.post("/process")
def process_data(req: ProcessRequest):
    """
    📊 Data Processing Agent
    Keep it dumb but reliable: drop nulls, type conversion, normalization.
    No business logic.
    """
    prompt = f"""You are the Data Processing Agent.
Keep it dumb but reliable. Focus ONLY on:
- drop nulls
- type conversion
- normalization
👉 No business logic here.

Task: {req.task}
Data Snippet: {req.data[:50000]} 

CRITICAL: The data may contain multiple files separated by '--- File: filename ---'. You MUST process and return ALL files.

Respond in pure JSON format exactly like this:
{{
  "cleaned_data_markdown": "The fully cleaned data for ALL files, formatted as Markdown tables. MUST preserve the '--- File: ... ---' headers.",
  "summary": "Brief summary of what was cleaned across all files"
}}
"""
    try:
        res = get_llm_response(prompt, is_json=True)
        return json.loads(res)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze")
def analyze_data(req: AnalyzeRequest):
    """
    📈 Analysis Agent
    This is your "brain": mean, median, trends, group-by analysis, anomaly detection.
    """
    prompt = f"""You are the Advanced Analysis Agent.
You are an expert Data Analyst. Your goal is to dynamically fulfill the requested task perfectly based on the user's specific request.

CRITICAL INSTRUCTIONS:
- If the task asks for a SPECIFIC question or graph, answer THAT specific question directly and precisely.
- If the task asks for GENERAL insights, perform a DEEP analysis focusing on correlations, anomalies, and multi-dimensional group-bys.

Task: {req.task}
Data: {req.data[:50000]} 

Respond in pure JSON format exactly like this:
{{
  "insights": [
    "Insight directly answering the user query...",
    "make the deep analysis about the data and provide the clear responce about the data...",
    "after analysis clearly explain the reason and report about the data..."
    "Another relevant insight..."
  ],
  "graph_code": "Optional advanced Streamlit Python code wrapped in ```python ... ``` if user requested a graph"
}}
"""
    try:
        res = get_llm_response(prompt, is_json=True)
        return json.loads(res)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
