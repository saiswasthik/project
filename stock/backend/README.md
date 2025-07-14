# Stock Market Research Backend

This backend provides real-time stock data using multiple sources with AI-powered symbol identification for Indian stocks.

## Setup Instructions

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Environment Variables Setup

Create a `.env` file in the backend directory with the following variables:

```env
# Required: For AI-powered symbol identification and company info
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: For real-time data from Upstox (fallback)
UPSTOX_API_KEY=your_upstox_api_key_here
UPSTOX_BEARER_TOKEN=your_upstox_bearer_token_here

# Server Configuration
PORT=8000
```

### 3. Get Gemini API Key (Required)
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key and add it to your `.env` file

### 4. Get Upstox API Credentials (Optional)
1. Sign up for a free account at [Upstox](https://upstox.com/)
2. Go to the API section in your account
3. Generate an API key and Bearer token
4. Add both credentials to your `.env` file

**Important Security Notes:**
- Never commit your `.env` file to git
- Keep your API credentials secure
- The `.env` file is already in `.gitignore` to prevent accidental commits

### 5. Run the Server
```bash
python main.py
```

The server will start on `http://localhost:8000`

### 6. Test the AI Integration
```bash
python test_gemini_integration.py
```

This will test the Gemini AI symbol identification and company information features.

## API Endpoints

### Fundamental Analysis
- `GET /api/fundamental-analysis/{symbol}` - Get fundamental analysis for a stock
- `GET /api/stock-quote/{symbol}` - Get real-time stock quote
- `GET /api/historical-data/{symbol}` - Get historical data
- `GET /api/company-info/{symbol}` - Get company information using AI
- `GET /api/available-symbols` - Get list of supported symbols

## Supported Stocks

**Any valid Indian stock symbol can be used!** The system uses AI to intelligently identify the correct symbol variations.

Examples:
- RELIANCE, TCS, HDFC, INFY, ICICIBANK, HINDUNILVR
- ITC, SBIN, BHARTIARTL, KOTAKBANK, AXISBANK
- ASIANPAINT, MARUTI, HCLTECH, SUNPHARMA, WIPRO
- ULTRACEMCO, TITAN, BAJFINANCE, NESTLEIND
- BANK OF BARODA, HDFC BANK, ICICI BANK, AXIS BANK

## Features

- **AI-Powered Symbol Identification** - Uses Gemini AI to intelligently identify stock symbols
- **Real-time stock quotes** from multiple sources (Yahoo Finance, Screener.in, MoneyControl, NSE)
- **Fundamental analysis data** with comprehensive financial metrics
- **Historical price data** with technical indicators
- **Company information** using AI-generated descriptions
- **Market cap and P/E ratios** with real-time updates
- **Dividend yield information** and growth metrics
- **Multi-source fallback** - If one source fails, tries the next

## Error Handling

The API includes comprehensive error handling and logging. Check the console output for detailed error messages if issues occur. 