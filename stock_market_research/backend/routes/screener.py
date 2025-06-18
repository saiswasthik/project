from fastapi import APIRouter, HTTPException, Request
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

@router.post("/screener")
async def stock_screener(request: Request):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API key not found. Please add it to your .env file.")

    filters = await request.json()
    genai.configure(api_key=GEMINI_API_KEY)

    # If symbol is provided, return details for that symbol 
    symbol = filters.get('symbol')
    if symbol:
        prompt = f"""
You are a stock screener and analyst for the Indian stock market. Provide detailed screener information for the stock symbol {symbol.upper()}.
Return a JSON object with these fields: symbol, company, price, change, pe, pb, growth, div_yield, market_cap, rating (Strong Buy/Buy/Hold/Sell), forum_link (URL string or 'N/A').
Return the most recent and accurate estimates based on your latest knowledge of the Indian stock market. If unsure, return 'N/A'.
. Use 'N/A' if data is not available.

Example format (no markdown, only JSON):
{{
  "symbol": "{symbol.upper()}",
  "company": "...",
  "price": ...,
  "change": "...",
  "pe": ...,
  "pb": ...,
  "growth": "...",
  "div_yield": "...",
  "market_cap": "...",
  "rating": "...",
  "forum_link": ""
}}
Only return valid JSON with real values or 'N/A'. Do not wrap in markdown.
"""
        try:
            model = genai.GenerativeModel('gemini-1.5-flash')
            response = model.generate_content(prompt)
            logger.info(f"Raw Gemini API response: {response.text}")
            data_text = response.text
            json_start = data_text.find('{')
            json_end = data_text.rfind('}')
            if json_start == -1 or json_end == -1:
                logger.error("Could not find JSON object in model response")
                return {"error": "Failed to parse LLM response as JSON.", "raw_response": data_text}
            json_string = data_text[json_start : json_end + 1]
            logger.info(f"Extracted JSON string: {json_string}")
            stock = json.loads(json_string)
            return {"result": stock}
        except json.JSONDecodeError as e:
            logger.error(f"JSON Decode Error: {e} in response: {data_text}")
            return {"error": f"JSON Decode Error: {e}", "raw_response": data_text}
        except Exception as e:
            logger.error(f"Error in screener: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error fetching screener result: {str(e)}")

    # Otherwise, return a list as before
    prompt = f"""
You are a stock screener for the Indian stock market. Given the following filters, return a JSON array of up to 10 Indian stocks that match the criteria. 
Each stock should have: symbol, company, price, change, pe, pb, growth, div_yield, market_cap, rating (Strong Buy/Buy/Hold/Sell), and a forum_link (URL string or 'N/A').
Return the most recent and accurate estimates based on your latest knowledge of the Indian stock market. If unsure, return 'N/A'.


Filters:
P/E Ratio: {filters.get('pe_min', 0)} - {filters.get('pe_max', 50)}
P/B Ratio: {filters.get('pb_min', 0)} - {filters.get('pb_max', 10)}
Revenue Growth: {filters.get('growth_min', 0)}% - {filters.get('growth_max', 100)}%
Dividend Yield: {filters.get('div_yield_min', 0)}% - {filters.get('div_yield_max', 10)}%
Debt/Equity: {filters.get('de_min', 0)}% - {filters.get('de_max', 200)}%
Sectors: {', '.join(filters.get('sectors', [])) or 'Any'}
Countries: {', '.join(filters.get('countries', [])) or 'India'}

Return JSON in this format (no markdown, only JSON):
[
  {{
    \"symbol\": \"RELIANCE\",
    \"company\": \"Reliance Industries Ltd.\",
    \"price\": 2850.25,
    \"change\": "+1.2%\",
    \"pe\": 24.5,
    \"pb\": 3.2,
    \"growth\": \"12.5%\",
    \"div_yield\": \"0.8%\",
    \"market_cap\": \"₹19.2T\",
    \"rating\": \"Strong Buy\",
    \"forum_link\": \"N/A\"
  }},
  ...
]
Only return valid JSON with real values or 'N/A'. Do not wrap in markdown.
"""

    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        logger.info(f"Raw Gemini API response: {response.text}")
        data_text = response.text
        json_start = data_text.find('[')
        json_end = data_text.rfind(']')
        if json_start == -1 or json_end == -1:
            logger.error("Could not find JSON array in model response")
            return {"error": "Failed to parse LLM response as JSON.", "raw_response": data_text}
        json_string = data_text[json_start : json_end + 1]
        logger.info(f"Extracted JSON string: {json_string}")
        stocks = json.loads(json_string)
        return {"results": stocks}
    except json.JSONDecodeError as e:
        logger.error(f"JSON Decode Error: {e} in response: {data_text}")
        return {"error": f"JSON Decode Error: {e}", "raw_response": data_text}
    except Exception as e:
        logger.error(f"Error in screener: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching screener results: {str(e)}") 