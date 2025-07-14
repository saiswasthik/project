from fastapi import APIRouter, HTTPException
from typing import Dict, Any
import logging
from services.enhanced_data_service import clean_data_service

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/fundamental/{symbol}")
async def get_fundamental_data(symbol: str) -> Dict[str, Any]:
    """
    Get fundamental data for a stock symbol
    Only returns real data from Yahoo Finance
    """
    try:
        logger.info(f"Fetching fundamental data for {symbol}")
        
        # Get real data from clean service
        data = clean_data_service.get_stock_data(symbol)
        
        if data is None:
            raise HTTPException(
                status_code=404, 
                detail=f"No real data available for {symbol}. Please check the symbol or try again later."
            )
        
        logger.info(f"✅ Successfully retrieved real data for {symbol}")
        return data
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching fundamental data for {symbol}: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch data for {symbol}. Please try again later."
        )

@router.get("/stock-quote/{symbol}")
async def get_stock_quote(symbol: str):
    """Get real-time stock quote from multiple sources"""
    try:
        logger.info(f"Fetching stock quote for symbol: {symbol}")
        
        # Use the enhanced data service for real-time quotes from multiple sources
        quote_data = enhanced_data_service.get_stock_quote(symbol)
        
        logger.info(f"Successfully fetched quote for {symbol} from {quote_data.get('source', 'Unknown')}")
        return quote_data
        
    except Exception as e:
        logger.error(f"Error fetching stock quote for {symbol}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching stock quote for {symbol}: {str(e)}")



@router.get("/historical-data/{symbol}")
async def get_historical_data(symbol: str, interval: str = "1D", from_date: str = None, to_date: str = None):
    """Get historical data for a stock from multiple sources"""
    try:
        logger.info(f"Fetching historical data for symbol: {symbol}")
        
        # Use the enhanced data service for historical data
        historical_data = enhanced_data_service.get_historical_data(symbol, interval, from_date, to_date)
        
        logger.info(f"Successfully fetched historical data for {symbol}")
        return historical_data
        
    except Exception as e:
        logger.error(f"Error fetching historical data for {symbol}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching historical data for {symbol}: {str(e)}")

@router.get("/available-symbols")
async def get_available_symbols():
    """Get list of available stock symbols"""
    try:
        # Return a message explaining that any valid Indian stock symbol can be used
        return {
            "message": "Any valid Indian stock symbol can be used",
            "examples": [
                "RELIANCE", "TCS", "HDFC", "INFY", "ICICIBANK", "HINDUNILVR", 
                "ITC", "SBIN", "BHARTIARTL", "KOTAKBANK", "AXISBANK", 
                "ASIANPAINT", "MARUTI", "HCLTECH", "SUNPHARMA", "WIPRO", 
                "ULTRACEMCO", "TITAN", "BAJFINANCE", "NESTLEIND",
                "BANKBARODA", "HDFCBANK", "KOTAKBANK", "AXISBANK"
            ],
            "note": "Use NSE symbol format. For banks, try variations like BANKBARODA, BANKOFBARODA, or BARODA"
        }
        
    except Exception as e:
        logger.error(f"Error fetching available symbols: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching available symbols: {str(e)}")

@router.get("/company-info/{symbol}")
async def get_company_info(symbol: str):
    """Get company information using AI"""
    try:
        logger.info(f"Fetching company info for symbol: {symbol}")
        
        # Use the enhanced data service for company information
        company_info = enhanced_data_service.get_company_info(symbol)
        
        logger.info(f"Successfully fetched company info for {symbol}")
        return company_info
        
    except Exception as e:
        logger.error(f"Error fetching company info for {symbol}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching company info for {symbol}: {str(e)}") 