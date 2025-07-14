from fastapi import APIRouter, HTTPException, Query
from typing import Dict, Any, List, Optional
import logging
from services.enhanced_data_service import clean_data_service

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/filter")
async def get_screener_results(
    sector: Optional[str] = Query(None, description="Filter by sector"),
    market_cap_min: Optional[float] = Query(None, description="Minimum market cap in billions"),
    pe_max: Optional[float] = Query(None, description="Maximum P/E ratio"),
    roe_min: Optional[float] = Query(None, description="Minimum ROE percentage")
) -> Dict[str, Any]:
    """
    Get stock screener results based on filters
    Only returns real data from Yahoo Finance
"""
    try:
        logger.info(f"Running screener with filters: sector={sector}, market_cap_min={market_cap_min}, pe_max={pe_max}, roe_min={roe_min}")
        
        # For now, return a simple response since we don't have bulk screening capability
        # In a real implementation, you would query multiple stocks and filter them
        
        screener_data = {
            "filters_applied": {
                "sector": sector,
                "market_cap_min": market_cap_min,
                "pe_max": pe_max,
                "roe_min": roe_min
            },
            "results": [],
            "total_count": 0,
            "message": "Stock screener functionality is limited. Please search for individual stocks instead."
        }
        
        logger.info(f"✅ Screener completed with {screener_data['total_count']} results")
        return screener_data
        
    except Exception as e:
        logger.error(f"Error in stock screener: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to run stock screener. Please try again later."
        ) 