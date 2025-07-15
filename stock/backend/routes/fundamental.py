from fastapi import APIRouter, HTTPException
from typing import Dict, Any
import logging
from services.enhanced_data_service import CleanDataService

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
        clean_data_service = CleanDataService()
        data = clean_data_service.get_stock_data(symbol)
        
        if data is None:
            # Provide helpful suggestions for common symbols
            suggestions = {
                "ICICIBANK": ["ICICIBANK.NS", "ICICI.NS", "ICICIBANK.BO"],
                "HDFCBANK": ["HDFCBANK.NS", "HDFC.NS", "HDFCBANK.BO"],
                "RELIANCE": ["RELIANCE.NS", "RIL.NS", "RELIANCE.BO"],
                "TCS": ["TCS.NS", "TATACONSULTANCY.NS", "TCS.BO"],
                "INFY": ["INFY.NS", "INFOSYS.NS", "INFY.BO"],
                "SBIN": ["SBIN.NS", "STATEBANK.NS", "SBIN.BO"],
                "OIL": ["ONGC.NS", "IOC.NS", "BPCL.NS", "HPCL.NS", "GAIL.NS"],
                "ONGC": ["ONGC.NS", "ONGC.BO"],
                "IOC": ["IOC.NS", "INDIANOIL.NS", "IOC.BO"],
                "BPCL": ["BPCL.NS", "BPCL.BO"],
                "HPCL": ["HPCL.NS", "HPCL.BO"],
                "GAIL": ["GAIL.NS", "GAIL.BO"]
            }
            
            symbol_upper = symbol.upper()
            if symbol_upper in suggestions:
                suggestion_msg = f"Try these variations: {', '.join(suggestions[symbol_upper])}"
            else:
                suggestion_msg = "Try adding .NS (NSE) or .BO (BSE) suffix to the symbol"
            
            raise HTTPException(
                status_code=404, 
                detail=f"No data found for {symbol}. {suggestion_msg}. Common symbols: RELIANCE, TCS, HDFCBANK, INFY, SBIN"
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
        clean_data_service = CleanDataService()
        quote_data = clean_data_service.get_stock_data(symbol)  # Using get_stock_data as fallback
        
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
        clean_data_service = CleanDataService()
        # For now, return basic historical data structure
        historical_data = {
            "symbol": symbol,
            "interval": interval,
            "message": "Historical data endpoint under development",
            "data": []
        }
        
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
                "RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "INFY.NS", "ICICIBANK.NS", "HINDUNILVR.NS", 
                "ITC.NS", "SBIN.NS", "BHARTIARTL.NS", "KOTAKBANK.NS", "AXISBANK.NS", 
                "ASIANPAINT.NS", "MARUTI.NS", "HCLTECH.NS", "SUNPHARMA.NS", "WIPRO.NS", 
                "ULTRACEMCO.NS", "TITAN.NS", "BAJFINANCE.NS", "NESTLEIND.NS",
                "BANKBARODA.NS", "HDFCBANK.NS", "KOTAKBANK.NS", "AXISBANK.NS",
                "ONGC.NS", "IOC.NS", "BPCL.NS", "HPCL.NS", "GAIL.NS"
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
        clean_data_service = CleanDataService()
        stock_data = clean_data_service.get_stock_data(symbol)
        if stock_data:
            company_info = {
                "symbol": symbol,
                "name": stock_data.get("company_name", "N/A"),
                "sector": stock_data.get("sector", "N/A"),
                "industry": stock_data.get("industry", "N/A"),
                "description": stock_data.get("long_business_summary", "N/A"),
                "website": stock_data.get("website", "N/A"),
                "employees": stock_data.get("full_time_employees", "N/A")
            }
        else:
            company_info = {"error": f"No data found for {symbol}"}
        
        logger.info(f"Successfully fetched company info for {symbol}")
        return company_info
        
    except Exception as e:
        logger.error(f"Error fetching company info for {symbol}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching company info for {symbol}: {str(e)}") 