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

@router.get("/news/{symbol}")
async def get_stock_news(symbol: str):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API key not found. Please add it to your .env file.")

    genai.configure(api_key=GEMINI_API_KEY)

    prompt = f"""
You are a financial news analyst. Provide a detailed JSON output for news analysis of stock symbol {symbol.upper()}.
Return the most recent and accurate estimates based on your latest knowledge of the Indian stock market. If unsure, return 'N/A'.


Return the result as a valid JSON object (no markdown or explanations, only JSON). Follow these rules:
- Include 4-6 recent news articles across different categories
- Each article should have a clear category, priority, source, and timestamp
- Key points should be concise and informative
- Use realistic sources like Bloomberg, Reuters, CNBC, etc.
- Times should be relative (e.g., "2 hours ago", "1 day ago")

Structure:
{{
  "symbol": "{symbol.upper()}",
  "live_updates": [
    {{
      "time": "string (e.g., '2 hours ago')",
      "update": "string",
      "impact": "string (high/medium/low)"
    }}
  ],
  "news_categories": [
    "Earnings",
    "Products",
    "Analyst",
    "Regulatory",
    "Market",
    "Partnerships"
  ],
  "articles": [
    {{
      "title": "string",
      "category": "string (e.g., 'earnings', 'products', 'analyst', 'regulatory')",
      "priority": "string (high/medium/low)",
      "source": "string",
      "time": "string (e.g., '2 hours ago')",
      "key_points": [
        "string",
        "string",
        "string"
      ],
      "sentiment": "string (bullish/bearish/neutral)",
      "impact_score": "number (-1 to 1)"
    }}
  ],
  "daily_digest": {{
    "summary": "string",
    "key_developments": [
      "string",
      "string"
    ],
    "market_reaction": "string"
  }}
}}
Only return valid JSON with real values or 'N/A'. Do not wrap in markdown (no ```json).
"""

    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        logger.info(f"Raw Gemini API response: {response.text}")
        news_data_text = response.text
        json_start = news_data_text.find('{')
        json_end = news_data_text.rfind('}')
        if json_start == -1 or json_end == -1:
            logger.error("Could not find JSON object in model response")
            return {"error": "Failed to parse LLM response as JSON.", "raw_response": news_data_text}
        json_string = news_data_text[json_start : json_end + 1]
        logger.info(f"Extracted JSON string: {json_string}")
        news_data = json.loads(json_string)
        logger.info(f"Parsed news data: {json.dumps(news_data, indent=2)}")
        return news_data
    except json.JSONDecodeError as e:
        logger.error(f"JSON Decode Error: {e} in response: {news_data_text}")
        return {"error": f"JSON Decode Error: {e}", "raw_response": news_data_text}
    except Exception as e:
        logger.error(f"Error in news analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching news for {symbol}: {str(e)}") 