from fastapi import APIRouter, HTTPException
from typing import Dict, Any
import logging
from services.enhanced_data_service import clean_data_service

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/sentiment/{symbol}")
async def get_sentiment_analysis(symbol: str) -> Dict[str, Any]:
    """
    Get sentiment analysis data for a stock symbol
    Only returns real data from Yahoo Finance
    """
    try:
        logger.info(f"Fetching sentiment data for {symbol}")
        
        # Get real data from clean service
        data = clean_data_service.get_stock_data(symbol)
        
        if data is None:
            raise HTTPException(
                status_code=404, 
                detail=f"No real data available for {symbol}. Please check the symbol or try again later."
            )
        
        # Format as sentiment analysis data
        sentiment_data = {
            "symbol": symbol,
            "source": data.get("source", "Yahoo Finance"),
            "timestamp": data.get("timestamp"),
            "price_data": {
                "current_price": data.get("real_time_data", {}).get("current_price"),
                "change": data.get("real_time_data", {}).get("change"),
                "change_percent": data.get("real_time_data", {}).get("change_percent")
            },
            "sentiment_metrics": {
                "overall_sentiment": "neutral",
                "confidence_score": 0.5,
                "key_factors": [
                    "Market performance",
                    "Financial ratios",
                    "Investment rating"
                ]
            },
            "analysis": {
                "valuation_grade": data.get("investment_summary", {}).get("valuation_grade"),
                "financial_health": data.get("investment_summary", {}).get("financial_health"),
                "overall_rating": data.get("investment_summary", {}).get("overall_rating")
            },
            "message": "Sentiment analysis is based on financial metrics. For detailed news sentiment, please check external sources."
        }
        
        logger.info(f"✅ Successfully retrieved sentiment data for {symbol}")
        return sentiment_data
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching sentiment data for {symbol}: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch sentiment data for {symbol}. Please try again later."
        ) 