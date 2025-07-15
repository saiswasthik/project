#!/usr/bin/env python3
"""
Enhanced Data Service with Multiple Sources
Fetches from Yahoo Finance, Screener.in, and other sources
Fills missing data from alternative sources
"""

import requests
import yfinance as yf
import logging
from typing import Dict, Any, Optional
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CleanDataService:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })

    def get_stock_data(self, symbol: str) -> Optional[Dict[str, Any]]:
        """
        Get stock data from multiple sources
        Fills missing data from alternative sources
        """
        try:
            # Start with Yahoo Finance
            yahoo_data = self._get_yahoo_data(symbol)
            
            # Get Screener.in data for missing fields
            screener_data = self._get_screener_data(symbol)
            
            # Merge data from both sources
            combined_data = self._merge_data_sources(yahoo_data, screener_data, symbol)
            
            if combined_data:
                logger.info(f"✅ Successfully retrieved data for {symbol}")
                return combined_data
            else:
                logger.error(f"❌ No data found for {symbol} from any source")
                
                # Try with .NS suffix as fallback
                if not symbol.endswith('.NS'):
                    logger.info(f"🔄 Trying fallback with .NS suffix for {symbol}")
                    fallback_symbol = f"{symbol}.NS"
                    yahoo_data = self._get_yahoo_data(fallback_symbol)
                    screener_data = self._get_screener_data(fallback_symbol)
                    combined_data = self._merge_data_sources(yahoo_data, screener_data, fallback_symbol)
                    
                    if combined_data:
                        logger.info(f"✅ Successfully retrieved data for {fallback_symbol}")
                        return combined_data
                
                return None
                
        except Exception as e:
            logger.error(f"Error fetching data for {symbol}: {e}")
            return None

    def _get_yahoo_data(self, symbol: str) -> Optional[Dict[str, Any]]:
        """Get data from Yahoo Finance"""
        try:
            # Common Indian stock symbol variations
            symbol_variations = [
                f"{symbol}.NS",  # NSE format
                symbol,
                f"{symbol}.BO",  # BSE format
                f"{symbol}.NSE",  # Alternative NSE format
                f"{symbol}.BSE",  # Alternative BSE format
            ]
            
            # Add common variations for specific stocks
            if symbol.upper() in ["ICICIBANK", "ICICI"]:
                symbol_variations.extend(["ICICIBANK.NS", "ICICIBANK.BO", "ICICI.NS", "ICICI.BO"])
            elif symbol.upper() in ["HDFCBANK", "HDFC"]:
                symbol_variations.extend(["HDFCBANK.NS", "HDFCBANK.BO", "HDFC.NS", "HDFC.BO"])
            elif symbol.upper() in ["RELIANCE", "RIL"]:
                symbol_variations.extend(["RELIANCE.NS", "RELIANCE.BO", "RIL.NS", "RIL.BO"])
            elif symbol.upper() in ["TCS", "TATACONSULTANCY"]:
                symbol_variations.extend(["TCS.NS", "TCS.BO", "TATACONSULTANCY.NS", "TATACONSULTANCY.BO"])
            elif symbol.upper() in ["OIL", "ONGC"]:
                symbol_variations.extend(["ONGC.NS", "ONGC.BO", "OIL.NS", "OIL.BO"])
            elif symbol.upper() in ["IOC", "INDIANOIL"]:
                symbol_variations.extend(["IOC.NS", "IOC.BO", "INDIANOIL.NS", "INDIANOIL.BO"])
            elif symbol.upper() in ["BPCL", "BHARATPETRO"]:
                symbol_variations.extend(["BPCL.NS", "BPCL.BO", "BHARATPETRO.NS", "BHARATPETRO.BO"])
            elif symbol.upper() in ["HPCL", "HINDPETRO"]:
                symbol_variations.extend(["HPCL.NS", "HPCL.BO", "HINDPETRO.NS", "HINDPETRO.BO"])
            elif symbol.upper() in ["GAIL"]:
                symbol_variations.extend(["GAIL.NS", "GAIL.BO"])
            
            for symbol_var in symbol_variations:
                try:
                    logger.info(f"Trying Yahoo Finance: {symbol_var}")
                    ticker = yf.Ticker(symbol_var)
                    info = ticker.info
                    
                    if self._is_valid_yahoo_data(info):
                        logger.info(f"✅ Got Yahoo Finance data: {symbol_var}")
                        return info
                        
                except Exception as e:
                    logger.debug(f"Yahoo Finance failed for {symbol_var}: {e}")
                    continue
            
            return None
            
        except Exception as e:
            logger.error(f"Yahoo Finance error: {e}")
            return None

    def _get_screener_data(self, symbol: str) -> Optional[Dict[str, Any]]:
        """Get data from Screener.in API"""
        try:
            # Try different case variations for Screener.in
            symbol_variations = [
                symbol.upper(),  # RELIANCE
                symbol.lower(),  # reliance
                symbol.title(),  # Reliance
                symbol          # Original
            ]
            
            for symbol_var in symbol_variations:
                try:
                    url = f"https://www.screener.in/api/companies/{symbol_var}/"
                    logger.info(f"Trying Screener.in: {symbol_var}")
                    response = self.session.get(url, timeout=10)
                    
                    if response.status_code == 200:
                        data = response.json()
                        logger.info(f"✅ Got Screener.in data for {symbol_var}")
                        return data
                    elif response.status_code == 404:
                        logger.debug(f"Screener.in 404 for {symbol_var}")
                        continue
                    else:
                        logger.warning(f"Screener.in returned {response.status_code} for {symbol_var}")
                        continue
                        
                except Exception as e:
                    logger.debug(f"Screener.in failed for {symbol_var}: {e}")
                    continue
            
            logger.warning(f"No Screener.in data found for {symbol} in any case variation")
            return None
                
        except Exception as e:
            logger.error(f"Screener.in error for {symbol}: {e}")
            return None

    def _merge_data_sources(self, yahoo_data: Optional[Dict], screener_data: Optional[Dict], symbol: str) -> Optional[Dict[str, Any]]:
        """Merge data from multiple sources, filling missing fields"""
        
        # Start with Yahoo Finance data
        if yahoo_data:
            formatted_data = self._format_yahoo_data(yahoo_data, symbol)
        else:
            # If no Yahoo data, try to create from Screener data
            if screener_data:
                formatted_data = self._format_screener_data(screener_data, symbol)
            else:
                return None
        
        # Fill missing data from Screener.in
        if screener_data and formatted_data:
            formatted_data = self._fill_missing_data(formatted_data, screener_data)
        
        return formatted_data

    def _fill_missing_data(self, formatted_data: Dict[str, Any], screener_data: Dict[str, Any]) -> Dict[str, Any]:
        """Fill missing data from Screener.in"""
        
        try:
            # Extract Screener.in data
            screener_info = screener_data.get('info', {})
            ratios = screener_data.get('ratios', {})
            financials = screener_data.get('financials', {})
            
            # Fill missing major metrics
            major_metrics = formatted_data.get('major_metrics', {})
            
            # PE Ratio
            if not major_metrics.get('pe_ratio', {}).get('value') or major_metrics['pe_ratio']['value'] == 'N/A':
                pe_ratio = ratios.get('PE Ratio')
                if pe_ratio:
                    major_metrics['pe_ratio'] = {"label": "P/E Ratio", "value": f"{pe_ratio:.2f}"}
            
            # PB Ratio
            if not major_metrics.get('pb_ratio', {}).get('value') or major_metrics['pb_ratio']['value'] == 'N/A':
                pb_ratio = ratios.get('Book Value')
                if pb_ratio:
                    major_metrics['pb_ratio'] = {"label": "P/B Ratio", "value": f"{pb_ratio:.2f}"}
            
            # ROE
            if not major_metrics.get('roe', {}).get('value') or major_metrics['roe']['value'] == 'N/A':
                roe = ratios.get('ROE')
                if roe:
                    major_metrics['roe'] = {"label": "ROE", "value": f"{roe:.2f}%"}
            
            # Debt to Equity
            if not major_metrics.get('debt_to_equity', {}).get('value') or major_metrics['debt_to_equity']['value'] == 'N/A':
                debt_equity = ratios.get('Debt to equity')
                if debt_equity:
                    major_metrics['debt_to_equity'] = {"label": "Debt/Equity", "value": f"{debt_equity:.2f}"}
            
            # Current Ratio
            if not major_metrics.get('current_ratio', {}).get('value') or major_metrics['current_ratio']['value'] == 'N/A':
                current_ratio = ratios.get('Current ratio')
                if current_ratio:
                    major_metrics['current_ratio'] = {"label": "Current Ratio", "value": f"{current_ratio:.2f}"}
            
            # Market Cap
            if not major_metrics.get('market_cap', {}).get('value') or major_metrics['market_cap']['value'] == 'N/A':
                market_cap = screener_info.get('marketCap')
                if market_cap:
                    if market_cap >= 1e12:
                        market_cap_str = f"₹{market_cap/1e12:.2f}T"
                    elif market_cap >= 1e9:
                        market_cap_str = f"₹{market_cap/1e9:.2f}B"
                    elif market_cap >= 1e6:
                        market_cap_str = f"₹{market_cap/1e6:.2f}M"
                    else:
                        market_cap_str = f"₹{market_cap:,.0f}"
                    major_metrics['market_cap'] = {"label": "Market Cap", "value": market_cap_str}
            
            # Add additional metrics from Screener.in
            additional_metrics = {
                "quick_ratio": {"label": "Quick Ratio", "value": f"{ratios.get('Quick ratio', 'N/A')}"},
                "inventory_turnover": {"label": "Inventory Turnover", "value": f"{ratios.get('Inventory turnover', 'N/A')}"},
                "asset_turnover": {"label": "Asset Turnover", "value": f"{ratios.get('Asset turnover', 'N/A')}"},
                "price_to_sales": {"label": "Price to Sales", "value": f"{ratios.get('Price to sales', 'N/A')}"},
                "price_to_cash_flow": {"label": "Price to Cash Flow", "value": f"{ratios.get('Price to cash flow', 'N/A')}"},
                "enterprise_value": {"label": "Enterprise Value", "value": f"₹{screener_info.get('enterpriseValue', 'N/A')}"},
                "ev_to_ebitda": {"label": "EV/EBITDA", "value": f"{ratios.get('EV/EBITDA', 'N/A')}"},
                "roa": {"label": "ROA", "value": f"{ratios.get('ROA', 'N/A')}"},
                "gross_margin": {"label": "Gross Margin", "value": f"{ratios.get('Gross margin', 'N/A')}"},
                "operating_margin": {"label": "Operating Margin", "value": f"{ratios.get('Operating margin', 'N/A')}"},
                "net_margin": {"label": "Net Margin", "value": f"{ratios.get('Net margin', 'N/A')}"}
            }
            
            # Add only non-N/A metrics
            for key, value in additional_metrics.items():
                if value['value'] != 'N/A':
                    major_metrics[key] = value
            
            formatted_data['major_metrics'] = major_metrics
            
            # Add growth performance data
            if financials:
                growth_performance = {
                    "revenue_growth": {"label": "Revenue Growth", "value": f"{financials.get('Revenue growth', 'N/A')}"},
                    "earnings_growth": {"label": "Earnings Growth", "value": f"{financials.get('Earnings growth', 'N/A')}"},
                    "profit_margin": {"label": "Profit Margin", "value": f"{financials.get('Profit margin', 'N/A')}"},
                    "operating_margin": {"label": "Operating Margin", "value": f"{financials.get('Operating margin', 'N/A')}"}
                }
                formatted_data['growth_performance'] = growth_performance
            
            logger.info(f"✅ Filled missing data from Screener.in")
            
        except Exception as e:
            logger.error(f"Error filling missing data: {e}")
        
        return formatted_data

    def _format_screener_data(self, screener_data: Dict[str, Any], symbol: str) -> Dict[str, Any]:
        """Format Screener.in data when Yahoo Finance is not available"""
        try:
            info = screener_data.get('info', {})
            ratios = screener_data.get('ratios', {})
            
            current_price = info.get('currentPrice', 0)
            previous_close = info.get('previousClose', current_price)
            change = current_price - previous_close if previous_close > 0 else 0
            change_percent = (change / previous_close * 100) if previous_close > 0 else 0
            
            return {
                "symbol": symbol,
                "source": "Screener.in",
                "timestamp": datetime.now().isoformat(),
                "real_time_data": {
                    "current_price": f"₹{current_price:.2f}",
                    "change": f"₹{change:+.2f}",
                    "change_percent": f"{change_percent:+.2f}%"
                },
                "major_metrics": {
                    "market_cap": {"label": "Market Cap", "value": f"₹{info.get('marketCap', 'N/A')}"},
                    "pe_ratio": {"label": "P/E Ratio", "value": f"{ratios.get('PE Ratio', 'N/A')}"},
                    "pb_ratio": {"label": "P/B Ratio", "value": f"{ratios.get('Book Value', 'N/A')}"},
                    "roe": {"label": "ROE", "value": f"{ratios.get('ROE', 'N/A')}"},
                    "debt_equity": {"label": "Debt/Equity", "value": f"{ratios.get('Debt to equity', 'N/A')}"}
                }
            }
        except Exception as e:
            logger.error(f"Error formatting Screener data: {e}")
            return None

    def _is_valid_yahoo_data(self, info: Dict[str, Any]) -> bool:
        """Check if Yahoo Finance data is valid and real"""
        if not info:
            return False
            
        # Must have current price
        current_price = info.get('regularMarketPrice')
        if not current_price or current_price <= 0:
            return False
            
        # Must have market cap
        market_cap = info.get('marketCap')
        if not market_cap or market_cap <= 0:
            return False
            
        # Must have at least 3 other meaningful fields
        meaningful_fields = [
            info.get('trailingPE'),
            info.get('priceToBook'),
            info.get('returnOnEquity'),
            info.get('trailingEps'),
            info.get('totalRevenue'),
            info.get('marketCap')
        ]
        
        valid_fields = sum(1 for field in meaningful_fields if field is not None and field > 0)
        return valid_fields >= 3

    def _format_yahoo_data(self, info: Dict[str, Any], symbol: str) -> Dict[str, Any]:
        """Format Yahoo Finance data into our standard format"""
        
        # Calculate change and change percent
        current_price = info.get('regularMarketPrice', 0)
        previous_close = info.get('previousClose', 0)
        change = current_price - previous_close if previous_close > 0 else 0
        change_percent = (change / previous_close * 100) if previous_close > 0 else 0
        
        # Format market cap
        market_cap = info.get('marketCap', 0)
        if market_cap >= 1e12:
            market_cap_str = f"₹{market_cap/1e12:.2f}T"
        elif market_cap >= 1e9:
            market_cap_str = f"₹{market_cap/1e9:.2f}B"
        elif market_cap >= 1e6:
            market_cap_str = f"₹{market_cap/1e6:.2f}M"
        else:
            market_cap_str = f"₹{market_cap:,.0f}"
        
        return {
            "symbol": symbol,
            "source": "Yahoo Finance",
            "timestamp": datetime.now().isoformat(),
            "real_time_data": {
                "current_price": f"₹{current_price:.2f}",
                "change": f"₹{change:+.2f}",
                "change_percent": f"{change_percent:+.2f}%"
            },
            "major_metrics": {
                "market_cap": {"label": "Market Cap", "value": market_cap_str},
                "pe_ratio": {"label": "P/E Ratio", "value": f"{info.get('trailingPE', 0):.2f}" if info.get('trailingPE') else "N/A"},
                "pb_ratio": {"label": "P/B Ratio", "value": f"{info.get('priceToBook', 0):.2f}" if info.get('priceToBook') else "N/A"},
                "dividend_yield": {"label": "Dividend Yield", "value": f"{info.get('dividendYield', 0)*100:.2f}%" if info.get('dividendYield') else "N/A"},
                "roe": {"label": "ROE", "value": f"{info.get('returnOnEquity', 0)*100:.2f}%" if info.get('returnOnEquity') else "N/A"},
                "debt_to_equity": {"label": "Debt/Equity", "value": f"{info.get('debtToEquity', 0):.2f}" if info.get('debtToEquity') else "N/A"},
                "current_ratio": {"label": "Current Ratio", "value": f"{info.get('currentRatio', 0):.2f}" if info.get('currentRatio') else "N/A"},
                "quick_ratio": {"label": "Quick Ratio", "value": f"{info.get('quickRatio', 0):.2f}" if info.get('quickRatio') else "N/A"},
                "inventory_turnover": {"label": "Inventory Turnover", "value": f"{info.get('inventoryTurnover', 0):.2f}" if info.get('inventoryTurnover') else "N/A"},
                "asset_turnover": {"label": "Asset Turnover", "value": f"{info.get('assetTurnover', 0):.2f}" if info.get('assetTurnover') else "N/A"},
                "price_to_sales": {"label": "Price to Sales", "value": f"{info.get('priceToSalesTrailing12Months', 0):.2f}" if info.get('priceToSalesTrailing12Months') else "N/A"},
                "price_to_cash_flow": {"label": "Price to Cash Flow", "value": f"{info.get('priceToCashflowTrailing12Months', 0):.2f}" if info.get('priceToCashflowTrailing12Months') else "N/A"},
                "enterprise_value": {"label": "Enterprise Value", "value": f"₹{info.get('enterpriseValue', 0)/1e9:.2f}B" if info.get('enterpriseValue') else "N/A"},
                "ev_to_ebitda": {"label": "EV/EBITDA", "value": f"{info.get('enterpriseToEbitda', 0):.2f}" if info.get('enterpriseToEbitda') else "N/A"},
                "roa": {"label": "ROA", "value": f"{info.get('returnOnAssets', 0)*100:.2f}%" if info.get('returnOnAssets') else "N/A"},
                "gross_margin": {"label": "Gross Margin", "value": f"{info.get('grossMargins', 0)*100:.2f}%" if info.get('grossMargins') else "N/A"},
                "operating_margin": {"label": "Operating Margin", "value": f"{info.get('operatingMargins', 0)*100:.2f}%" if info.get('operatingMargins') else "N/A"},
                "net_margin": {"label": "Net Margin", "value": f"{info.get('netIncomeToCommon', 0)*100:.2f}%" if info.get('netIncomeToCommon') else "N/A"},
                "eps_ttm": {"label": "EPS (TTM)", "value": f"₹{info.get('trailingEps', 0):.2f}" if info.get('trailingEps') else "N/A"},
                "revenue_ttm": {"label": "Revenue (TTM)", "value": f"₹{info.get('totalRevenue', 0)/1e9:.2f}B" if info.get('totalRevenue') else "N/A"}
            },
            "growth_performance": {
                "earnings_yield": {"label": "Earnings Yield", "value": f"{(1/info.get('trailingPE', 999))*100:.2f}%" if info.get('trailingPE') and info.get('trailingPE') > 0 else "N/A"}
            },
            "risk_assessment": {
                "key_risks": self._assess_risks(info),
                "key_strengths": self._assess_strengths(info)
            },
            "investment_summary": {
                "valuation_grade": self._grade_valuation(info),
                "financial_health": self._grade_financial_health(info),
                "growth_grade": self._grade_growth(info),
                "overall_rating": self._get_overall_rating(info)
            }
        }

    def _assess_risks(self, info: Dict[str, Any]) -> list:
        """Assess key risks based on financial data"""
        risks = []
        
        pe_ratio = info.get('trailingPE', 0)
        if pe_ratio > 25:
            risks.append("High valuation (P/E > 25)")
        elif pe_ratio > 15:
            risks.append("Moderate valuation")
            
        debt_equity = info.get('debtToEquity', 0)
        if debt_equity > 1:
            risks.append("High debt levels")
        elif debt_equity > 0.5:
            risks.append("Moderate debt levels")
            
        roe = info.get('returnOnEquity', 0)
        if roe < 0.1:
            risks.append("Low profitability")
            
        return risks if risks else ["Standard market risks"]

    def _assess_strengths(self, info: Dict[str, Any]) -> list:
        """Assess key strengths based on financial data"""
        strengths = []
        
        roe = info.get('returnOnEquity', 0)
        if roe > 0.15:
            strengths.append("High ROE")
        elif roe > 0.1:
            strengths.append("Good profitability")
            
        debt_equity = info.get('debtToEquity', 0)
        if debt_equity < 0.3:
            strengths.append("Strong balance sheet")
        elif debt_equity < 0.5:
            strengths.append("Reasonable debt levels")
            
        market_cap = info.get('marketCap', 0)
        if market_cap > 1e12:  # > 1 trillion
            strengths.append("Large market cap")
        elif market_cap > 1e10:  # > 10 billion
            strengths.append("Established company")
            
        return strengths if strengths else ["Market presence"]

    def _grade_valuation(self, info: Dict[str, Any]) -> str:
        """Grade valuation based on P/E and P/B ratios"""
        pe_ratio = info.get('trailingPE', 0)
        pb_ratio = info.get('priceToBook', 0)
        
        if pe_ratio <= 15 and pb_ratio <= 2:
            return "A (Undervalued)"
        elif pe_ratio <= 20 and pb_ratio <= 3:
            return "B (Fair Value)"
        elif pe_ratio <= 25 and pb_ratio <= 4:
            return "C (Slightly Overvalued)"
        else:
            return "D (Overvalued)"

    def _grade_financial_health(self, info: Dict[str, Any]) -> str:
        """Grade financial health"""
        debt_equity = info.get('debtToEquity', 0)
        current_ratio = info.get('currentRatio', 0)
        roe = info.get('returnOnEquity', 0)
        
        if debt_equity < 0.3 and current_ratio > 1.5 and roe > 0.15:
            return "A (Excellent)"
        elif debt_equity < 0.5 and current_ratio > 1.2 and roe > 0.1:
            return "B (Good)"
        elif debt_equity < 0.7 and current_ratio > 1.0 and roe > 0.05:
            return "C (Average)"
        else:
            return "D (Poor)"

    def _grade_growth(self, info: Dict[str, Any]) -> str:
        """Grade growth potential"""
        roe = info.get('returnOnEquity', 0)
        earnings_yield = (1/info.get('trailingPE', 999)) if info.get('trailingPE') and info.get('trailingPE') > 0 else 0
        
        if roe > 0.2 and earnings_yield > 0.06:
            return "A (High Growth)"
        elif roe > 0.15 and earnings_yield > 0.05:
            return "B (Good Growth)"
        elif roe > 0.1 and earnings_yield > 0.04:
            return "C (Moderate Growth)"
        else:
            return "D (Low Growth)"

    def _get_overall_rating(self, info: Dict[str, Any]) -> str:
        """Get overall investment rating"""
        pe_ratio = info.get('trailingPE', 0)
        roe = info.get('returnOnEquity', 0)
        debt_equity = info.get('debtToEquity', 0)
        
        if pe_ratio <= 15 and roe > 0.15 and debt_equity < 0.5:
            return "Strong Buy"
        elif pe_ratio <= 20 and roe > 0.1 and debt_equity < 0.7:
            return "Buy"
        elif pe_ratio <= 25 and roe > 0.05:
            return "Hold"
        else:
            return "Sell"

# Create service instance
clean_data_service = CleanDataService()