from fastapi import APIRouter, HTTPException
import logging
from services.enhanced_data_service import clean_data_service
from typing import Dict, Any

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/technical/{symbol}")
async def get_technical_analysis(symbol: str) -> Dict[str, Any]:
    """
    Get technical analysis data for a stock symbol
    Returns real data from APIs
    """
    try:
        logger.info(f"Fetching technical data for {symbol}")
        
        # Get real data from clean service
        data = clean_data_service.get_stock_data(symbol)
        
        if data is None:
            raise HTTPException(
                status_code=404, 
                detail=f"No real data available for {symbol}. Please check the symbol or try again later."
            )
        
        # Format as technical analysis data using real API data
        technical_data = {
            "symbol": symbol,
            "source": data.get("source", "Yahoo Finance"),
            "timestamp": data.get("timestamp"),
            "price_data": {
                "current_price": data.get("real_time_data", {}).get("current_price"),
                "change": data.get("real_time_data", {}).get("change"),
                "change_percent": data.get("real_time_data", {}).get("change_percent"),
                "volume": data.get("real_time_data", {}).get("volume"),
                "high": data.get("real_time_data", {}).get("high"),
                "low": data.get("real_time_data", {}).get("low"),
                "open": data.get("real_time_data", {}).get("open"),
                "previous_close": data.get("real_time_data", {}).get("previous_close")
            },
            "technical_indicators": {
                "pe_ratio": data.get("major_metrics", {}).get("pe_ratio", {}).get("value"),
                "pb_ratio": data.get("major_metrics", {}).get("pb_ratio", {}).get("value"),
                "market_cap": data.get("major_metrics", {}).get("market_cap", {}).get("value"),
                "dividend_yield": data.get("major_metrics", {}).get("dividend_yield", {}).get("value"),
                "roe": data.get("major_metrics", {}).get("roe", {}).get("value"),
                "debt_to_equity": data.get("major_metrics", {}).get("debt_to_equity", {}).get("value"),
                "current_ratio": data.get("major_metrics", {}).get("current_ratio", {}).get("value"),
                "quick_ratio": data.get("major_metrics", {}).get("quick_ratio", {}).get("value"),
                "inventory_turnover": data.get("major_metrics", {}).get("inventory_turnover", {}).get("value"),
                "asset_turnover": data.get("major_metrics", {}).get("asset_turnover", {}).get("value"),
                "price_to_sales": data.get("major_metrics", {}).get("price_to_sales", {}).get("value"),
                "price_to_cash_flow": data.get("major_metrics", {}).get("price_to_cash_flow", {}).get("value"),
                "enterprise_value": data.get("major_metrics", {}).get("enterprise_value", {}).get("value"),
                "ev_to_ebitda": data.get("major_metrics", {}).get("ev_to_ebitda", {}).get("value"),
                "roa": data.get("major_metrics", {}).get("roa", {}).get("value"),
                "gross_margin": data.get("major_metrics", {}).get("gross_margin", {}).get("value"),
                "operating_margin": data.get("major_metrics", {}).get("operating_margin", {}).get("value"),
                "net_margin": data.get("major_metrics", {}).get("net_margin", {}).get("value")
            },
            "growth_performance": {
                "revenue_growth": data.get("growth_performance", {}).get("revenue_growth", {}).get("value"),
                "earnings_growth": data.get("growth_performance", {}).get("earnings_growth", {}).get("value"),
                "profit_margin": data.get("growth_performance", {}).get("profit_margin", {}).get("value"),
                "operating_margin": data.get("growth_performance", {}).get("operating_margin", {}).get("value"),
                "return_on_equity": data.get("major_metrics", {}).get("roe", {}).get("value"),
                "return_on_assets": data.get("major_metrics", {}).get("roa", {}).get("value")
            },
            "summary": {
                "valuation_grade": data.get("investment_summary", {}).get("valuation_grade"),
                "overall_rating": data.get("investment_summary", {}).get("overall_rating"),
                "risk_assessment": data.get("investment_summary", {}).get("risk_assessment"),
                "investment_recommendation": data.get("investment_summary", {}).get("investment_recommendation")
            }
        }
        
        logger.info(f"✅ Successfully retrieved technical data for {symbol}")
        return technical_data
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching technical data for {symbol}: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch technical data for {symbol}. Please try again later."
        ) 