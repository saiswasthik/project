from fastapi import APIRouter, HTTPException
import os
from dotenv import load_dotenv
import google.generativeai as genai
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv()

router = APIRouter()

# Get API key from environment variable
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

@router.get("/fundamental-analysis/{symbol}")
async def get_fundamental_analysis(symbol: str):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API key not found. Please add it to your .env file.")

    # Configure the generative AI model
    genai.configure(api_key=GEMINI_API_KEY)

    # Construct the detailed prompt for the LLM
    prompt = f"""
You are a financial analyst. Provide a detailed JSON output for fundamental analysis of stock symbol {symbol.upper()} (Indian stock market). 
Return the most recent and accurate estimates based on your latest knowledge of the Indian stock market. If unsure, return 'N/A'.

Return the result as a **valid JSON** object (no markdown or explanations, only JSON). Follow these rules:

- Use ₹ for all monetary values (e.g., ₹500 Cr).
- Use '%' for percentages (e.g., 12.5%).
- Prefix change values with + or - (e.g., +3.2% or -1.1%).
- Dates should be in the format: "Month YYYY" (e.g., "March 2024").

Structure:
{{
  "symbol": "{symbol.upper()}",
  "basic_metrics": {{
    "revenue_ttm": {{"value": "₹...", "change": "..."}},
    "eps_ttm": {{"value": "₹...", "change": "..."}},
    "pe_ratio": {{"value": "...", "change": "..."}},
    "market_cap": {{"value": "₹...", "change": "..."}}
  }},
  "financial_health": {{
    "gross_margin": {{"value": "...", "change": "..."}},
    "net_margin": {{"value": "...", "change": "..."}},
    "roe": {{"value": "...", "change": "..."}},
    "total_debt": {{"value": "₹...", "change": "..."}}
  }},
  "valuation_ratios": {{
    "price_ratios": [
      {{"metric": "P/E Ratio", "value": "..."}},
      {{"metric": "P/B Ratio", "value": "..."}},
      {{"metric": "P/S Ratio", "value": "..."}}
    ],
    "enterprise_ratios": [
      {{"metric": "EV/Revenue", "value": "..."}},
      {{"metric": "EV/EBITDA", "value": "..."}},
      {{"metric": "EV/FCF", "value": "..."}}
    ],
    "yield_metrics": [
      {{"metric": "Dividend Yield", "value": "..."}},
      {{"metric": "FCF Yield", "value": "..."}},
      {{"metric": "Earnings Yield", "value": "..."}}
    ]
  }},
  "growth_factors": {{
    "revenue_growth": [
      {{"period": "Q4 2023", "value": "..."}},
      {{"period": "Q3 2023", "value": "..."}},
      {{"period": "Q2 2023", "value": "..."}}
    ]
  }},
  "risk_assessment": {{
    "moderate_risks": ["...", "..."],
    "strengths": ["...", "..."]
  }},
  "news_catalysts": {{
    "bull_case": ["...", "..."],
    "bear_case": ["...", "..."],
    "upcoming_catalysts": [
      {{"event": "...", "date": "..." }},
      {{"event": "...", "date": "..." }}
    ]
  }}
}}
Only return valid JSON with real values or 'N/A'. Do not wrap in markdown (no ```json).
"""


    try:
        # Initialize the model
        model = genai.GenerativeModel('gemini-1.5-flash')

        # Make the API call
        response = model.generate_content(prompt)
        
        # Log the raw response
        logger.info(f"Raw Gemini API response: {response.text}")

        # Extract the text and parse as JSON
        analysis_data_text = response.text

        # Clean up the text - sometimes models wrap JSON in markdown or extra text
        # Find the first and last curly braces to extract the JSON string
        json_start = analysis_data_text.find('{')
        json_end = analysis_data_text.rfind('}')

        if json_start == -1 or json_end == -1:
            logger.error("Could not find JSON object in model response")
            # Attempt to return the raw text if JSON parsing failed to help debugging
            return {"error": "Failed to parse LLM response as JSON.", "raw_response": analysis_data_text}

        json_string = analysis_data_text[json_start : json_end + 1]
        
        # Log the extracted JSON string
        logger.info(f"Extracted JSON string: {json_string}")

        analysis_data = json.loads(json_string)
        
        # Log the parsed data
        logger.info(f"Parsed analysis data: {json.dumps(analysis_data, indent=2)}")

        return analysis_data

    except json.JSONDecodeError as e:
        logger.error(f"JSON Decode Error: {e} in response: {analysis_data_text}")
        # Return the raw text on JSON decode error as well
        return {"error": f"JSON Decode Error: {e}", "raw_response": analysis_data_text}
    except Exception as e:
        logger.error(f"Error in fundamental analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching fundamental analysis for {symbol}: {str(e)}") 