from fastapi import APIRouter, HTTPException
import os
from dotenv import load_dotenv
import google.generativeai as genai
import json
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

router = APIRouter()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

@router.get("/technical-analysis/{symbol}")
async def get_technical_analysis(symbol: str):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API key not found. Please add it to your .env file.")

    genai.configure(api_key=GEMINI_API_KEY)

    prompt = f"""
You are a technical analyst. Provide a detailed JSON output for technical analysis of stock symbol {symbol.upper()} (Indian stock market).
Return the most recent and accurate estimates based on your latest knowledge of the Indian stock market. If unsure, return 'N/A'.


Return the result as a valid JSON object (no markdown or explanations, only JSON). Follow these rules:
- Dates should be in the format: \"YYYY-MM-DD\".
- All price/volume values should be numbers (not strings).
- For indicators, include both the signal (bullish, bearish, neutral, overbought, oversold, etc.) and the value.
- For patterns, include name, timeframe, probability (as %), and status (forming, completed, confirmed, etc.).
- For summary, provide a short paragraph and key support/resistance levels.
- IMPORTANT: Provide exactly 10 days of data for both price_chart and volume_analysis arrays.

Structure:
{{
  "symbol": "{symbol.upper()}",
  "price_chart": [
    {{"date": "YYYY-MM-DD", "price": number}},
    // Must include exactly 10 days of data
    ...
  ],
  "volume_analysis": [
    {{"date": "YYYY-MM-DD", "volume": number}},
    // Must include exactly 10 days of data
    ...
  ],
  "technical_indicators": [
    {{"name": "RSI (14)", "signal": "...", "value": ...}},
    {{"name": "MACD", "signal": "...", "value": ...}},
    ...
  ],
  "pattern_recognition": [
    {{"pattern": "...", "timeframe": "...", "probability": "...", "status": "..."}},
    ...
  ],
  "technical_summary": {{
    "short_term_outlook": "...",
    "key_levels": {{
      "support": ...,
      "resistance": ...
    }}
  }}
}}
Only return valid JSON with real values or 'N/A'. Do not wrap in markdown (no ```json).
"""

    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        logger.info(f"Raw Gemini API response: {response.text}")
        analysis_data_text = response.text
        json_start = analysis_data_text.find('{')
        json_end = analysis_data_text.rfind('}')
        if json_start == -1 or json_end == -1:
            logger.error("Could not find JSON object in model response")
            return {"error": "Failed to parse LLM response as JSON.", "raw_response": analysis_data_text}
        json_string = analysis_data_text[json_start : json_end + 1]
        logger.info(f"Extracted JSON string: {json_string}")
        analysis_data = json.loads(json_string)
        logger.info(f"Parsed analysis data: {json.dumps(analysis_data, indent=2)}")
        return analysis_data
    except json.JSONDecodeError as e:
        logger.error(f"JSON Decode Error: {e} in response: {analysis_data_text}")
        return {"error": f"JSON Decode Error: {e}", "raw_response": analysis_data_text}
    except Exception as e:
        logger.error(f"Error in technical analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching technical analysis for {symbol}: {str(e)}") 