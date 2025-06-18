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

@router.get("/sentiment-analysis/{symbol}")
async def get_sentiment_analysis(symbol: str):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API key not found. Please add it to your .env file.")

    genai.configure(api_key=GEMINI_API_KEY)

    prompt = f"""
You are a sentiment analyst. Provide a detailed JSON output for sentiment analysis of stock symbol {symbol.upper()} (Indian stock market).
Return the most recent and accurate estimates based on your latest knowledge of the Indian stock market. If unsure, return 'N/A'.


Return the result as a valid JSON object (no markdown or explanations, only JSON).
IMPORTANT: For sentiment_trend, return an array of objects for each week with keys: week, bullish, neutral, bearish (all as percent values, e.g. 48). Do NOT include a score field in sentiment_trend. For other fields, follow the structure below. Use the latest real data for the symbol {symbol.upper()} from your knowledge. If unavailable, use 'N/A'.

Additionally, include a 'news' field as an array of articles. Each article should have:
- category (string, e.g. 'earnings', 'products', 'analyst', 'regulatory', etc.)
- priority (string, e.g. 'high', 'medium', 'low')
- source (string)
- time (string, e.g. '2 hours ago')
- title (string)
- key_points (array of strings, 2-5 bullet points summarizing the article)

Structure:
{{
  "symbol": "{symbol.upper()}",
  "sentiment_distribution": {{
    "bullish": (number, percent bullish, e.g. 48),
    "neutral": (number, percent neutral, e.g. 32),
    "bearish": (number, percent bearish, e.g. 20)
  }},
  "sentiment_trend": [
    {{"week": "Week 1", "bullish": (number, percent), "neutral": (number, percent), "bearish": (number, percent)}}
    ... (4 weeks)
  ],
  "overall_metrics": {{
    "sentiment_score": (number, -1 to 1),
    "articles_analyzed": (number),
    "sentiment_accuracy": (number, %),
    "confidence_level": (string)
  }},
  "recent_news": [
    {{
      "title": (string),
      "summary": (string),
      "source": (string),
      "time": (string, e.g. '2 hours ago'),
      "sentiment": (string, bullish/bearish/neutral),
      "score": (number, -1 to 1)
    }},
    ...
  ],
  "news": [
    {{
      "category": (string, e.g. 'earnings', 'products', 'analyst', 'regulatory'),
      "priority": (string, e.g. 'high', 'medium', 'low'),
      "source": (string),
      "time": (string, e.g. '2 hours ago'),
      "title": (string),
      "key_points": [ (string), ... ]
    }},
    ...
  ],
  "sentiment_guide": {{
    "bullish": (string, what bullish means),
    "neutral": (string, what neutral means),
    "bearish": (string, what bearish means),
    "note": (string, any extra notes)
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
        logger.error(f"Error in sentiment analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching sentiment analysis for {symbol}: {str(e)}") 