from fastapi import APIRouter, HTTPException
from typing import Dict, Any
import logging
import yfinance as yf

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/top-stocks")
async def get_top_stocks() -> Dict[str, Any]:
    """
    Get top stocks by market cap and highest price
    """
    try:
        logger.info("Fetching top stocks data...")
        
        # Top Indian stocks by market cap
        top_market_cap_stocks = [
            "RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "INFY.NS", "ICICIBANK.NS", 
            "HINDUNILVR.NS", "ITC.NS", "SBIN.NS", "BHARTIARTL.NS", "KOTAKBANK.NS"
        ]
        
        # Top stocks that often have high prices
        high_price_stocks = [
            "MRF.NS", "PAGEIND.NS", "SHREECEM.NS", "NESTLEIND.NS", "BRITANNIA.NS",
            "COLPAL.NS", "MARUTI.NS", "TITAN.NS", "ASIANPAINT.NS", "ULTRACEMCO.NS"
        ]
        
        market_cap_data = []
        high_price_data = []
        
        # Get market cap data
        for symbol in top_market_cap_stocks[:6]:  # Get 6 stocks, we'll take top 3
            try:
                ticker = yf.Ticker(symbol)
                info = ticker.info
                if info.get('marketCap') and info.get('regularMarketPrice'):
                    market_cap_data.append({
                        "symbol": symbol.replace('.NS', ''),
                        "name": info.get('longName', symbol.replace('.NS', '')),
                        "market_cap": info.get('marketCap', 0),
                        "price": info.get('regularMarketPrice', 0),
                        "change": info.get('regularMarketChangePercent', 0)
                    })
            except Exception as e:
                logger.debug(f"Error fetching {symbol}: {e}")
                continue
        
        # Get high price data
        for symbol in high_price_stocks[:6]:  # Get 6 stocks, we'll take top 3
            try:
                ticker = yf.Ticker(symbol)
                info = ticker.info
                if info.get('regularMarketPrice'):
                    high_price_data.append({
                        "symbol": symbol.replace('.NS', ''),
                        "name": info.get('longName', symbol.replace('.NS', '')),
                        "market_cap": info.get('marketCap', 0),
                        "price": info.get('regularMarketPrice', 0),
                        "change": info.get('regularMarketChangePercent', 0)
                    })
            except Exception as e:
                logger.debug(f"Error fetching {symbol}: {e}")
                continue
        
        # Sort by market cap and price
        market_cap_data.sort(key=lambda x: x['market_cap'], reverse=True)
        high_price_data.sort(key=lambda x: x['price'], reverse=True)
        
        # Format market cap
        def format_market_cap(market_cap):
            if market_cap >= 1e12:
                return f"₹{market_cap/1e12:.2f}T"
            elif market_cap >= 1e9:
                return f"₹{market_cap/1e9:.2f}B"
            elif market_cap >= 1e6:
                return f"₹{market_cap/1e6:.2f}M"
            else:
                return f"₹{market_cap:,.0f}"
        
        # Format price
        def format_price(price):
            return f"₹{price:,.2f}"
        
        # Format change
        def format_change(change):
            if change is None:
                return "0.00%"
            return f"{change:.2f}%"
        
        result = {
            "highest_market_cap": [
                {
                    "symbol": stock["symbol"],
                    "name": stock["name"],
                    "market_cap": format_market_cap(stock["market_cap"]),
                    "price": format_price(stock["price"]),
                    "change": format_change(stock["change"]),
                    "change_color": "text-green-600" if stock["change"] and stock["change"] > 0 else "text-red-600"
                }
                for stock in market_cap_data[:3]
            ],
            "highest_price": [
                {
                    "symbol": stock["symbol"],
                    "name": stock["name"],
                    "market_cap": format_market_cap(stock["market_cap"]),
                    "price": format_price(stock["price"]),
                    "change": format_change(stock["change"]),
                    "change_color": "text-green-600" if stock["change"] and stock["change"] > 0 else "text-red-600"
                }
                for stock in high_price_data[:3]
            ]
        }
        
        logger.info(f"✅ Successfully retrieved top stocks data")
        return result
        
    except Exception as e:
        logger.error(f"Error fetching top stocks: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch top stocks data. Please try again later."
        ) 