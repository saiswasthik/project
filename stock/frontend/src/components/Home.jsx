import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, BarChart3, Globe, Zap, ArrowRight, Sparkles } from 'lucide-react';
import { fetchTopStocksData } from '../config/api';

const Home = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [topStocks, setTopStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topPerformers, setTopPerformers] = useState([]);
  const [highestMarketCap, setHighestMarketCap] = useState([]);

  useEffect(() => {
    loadTopStocks();
  }, []);

  const loadTopStocks = async () => {
    try {
      setLoading(true);
      const data = await fetchTopStocksData();
      // Handle the actual API response structure
      if (data && data.highest_market_cap && data.highest_price) {
        // Separate the two types of stocks
        setHighestMarketCap(data.highest_market_cap.slice(0, 3));
        setTopPerformers(data.highest_price.slice(0, 3));
        // Combine both arrays for the preview section
        const combinedStocks = [
          ...data.highest_market_cap.slice(0, 2),
          ...data.highest_price.slice(0, 2)
        ];
        setTopStocks(combinedStocks);
      } else {
        // If data structure is different, use as is
        setTopStocks(Array.isArray(data) ? data : []);
        setHighestMarketCap([]);
        setTopPerformers([]);
      }
      setError(null);
    } catch (err) {
      console.error('Error loading top stocks:', err);
      setError('Failed to load market data');
      // Fallback data
      const fallbackStocks = [
        { symbol: 'RELIANCE', name: 'Reliance Industries', price: '₹2,450.00', change: '+2.5%', marketCap: '₹15.2T' },
        { symbol: 'TCS', name: 'Tata Consultancy', price: '₹3,850.00', change: '+1.8%', marketCap: '₹14.1T' },
        { symbol: 'HDFC', name: 'HDFC Bank', price: '₹1,650.00', change: '+0.9%', marketCap: '₹9.8T' },
        { symbol: 'INFY', name: 'Infosys', price: '₹1,450.00', change: '+1.2%', marketCap: '₹6.1T' },
        { symbol: 'ICICIBANK', name: 'ICICI Bank', price: '₹950.00', change: '+0.7%', marketCap: '₹6.7T' },
        { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', price: '₹2,750.00', change: '+0.5%', marketCap: '₹6.2T' }
      ];
      setTopStocks(fallbackStocks);
      setHighestMarketCap(fallbackStocks.slice(0, 3));
      setTopPerformers(fallbackStocks.slice(3, 6));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim().toUpperCase());
    }
  };

  const handleStockClick = (symbol) => {
    onSearch(symbol);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl">
                <TrendingUp className="text-white" size={40} />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                <Sparkles className="text-yellow-900" size={16} />
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI-Powered
            </span>
            <br />
            Stock Analysis
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Discover the future of investment research with our advanced AI-driven platform. 
            Get real-time insights, technical analysis, and sentiment predictions for informed decisions.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <form onSubmit={handleSearch} className="relative group">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for stocks (e.g., RELIANCE, TCS, HDFC)"
                  className="w-full px-6 py-4 pl-16 pr-20 text-lg bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-2xl shadow-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 placeholder-gray-400 text-white group-hover:bg-white/15"
                />
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-purple-400 transition-colors" size={24} />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-xl hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Analyze
                </button>
              </div>
            </form>
          </div>

          {/* Live Market Data Preview */}
          <div className="max-w-6xl mx-auto mb-12">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                    <TrendingUp className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Live Market Data</h3>
                    <p className="text-gray-300">Real-time stock prices and market movements</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm font-medium">Live</span>
                </div>
              </div>
              
              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-4 animate-pulse">
                      <div className="h-4 bg-white/20 rounded mb-2"></div>
                      <div className="h-6 bg-white/20 rounded mb-1"></div>
                      <div className="h-3 bg-white/20 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-6">
                  <p className="text-red-300">{error}</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {topStocks.slice(0, 4).map((stock, index) => (
                    <div
                      key={stock.symbol}
                      onClick={() => handleStockClick(stock.symbol)}
                      className="bg-white/5 backdrop-blur-sm rounded-xl p-4 cursor-pointer hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-white text-sm">{stock.symbol}</span>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          stock.change.startsWith('+') 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {stock.change}
                        </span>
                      </div>
                      <div className="text-lg font-bold text-white mb-1">{stock.price}</div>
                      <div className="text-xs text-gray-400 truncate">{stock.name}</div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-6 text-center">
                <button
                  onClick={() => document.getElementById('market-data-section').scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-xl hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  View All Market Data
                  <ArrowRight className="ml-2" size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Market Data Section */}
      <div id="market-data-section" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Live Market Data
          </h2>
          <p className="text-lg text-gray-300">
            Comprehensive view of the Indian stock market
          </p>
        </div>

        {loading ? (
          <div className="space-y-12">
            {/* Top Performers Loading */}
            <div>
              <div className="text-center mb-8">
                <div className="h-8 bg-white/20 rounded w-64 mx-auto mb-4"></div>
                <div className="h-4 bg-white/20 rounded w-96 mx-auto"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 animate-pulse">
                    <div className="h-4 bg-white/20 rounded mb-4"></div>
                    <div className="h-6 bg-white/20 rounded mb-2"></div>
                    <div className="h-4 bg-white/20 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Highest Market Cap Loading */}
            <div>
              <div className="text-center mb-8">
                <div className="h-8 bg-white/20 rounded w-64 mx-auto mb-4"></div>
                <div className="h-4 bg-white/20 rounded w-96 mx-auto"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 animate-pulse">
                    <div className="h-4 bg-white/20 rounded mb-4"></div>
                    <div className="h-6 bg-white/20 rounded mb-2"></div>
                    <div className="h-4 bg-white/20 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="bg-red-500/20 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6 max-w-md mx-auto">
              <p className="text-red-300">{error}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Today's Top Performers */}
            <div>
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-3">
                    <TrendingUp className="text-white" size={20} />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Today's Top Performers</h3>
                </div>
                <p className="text-gray-300 max-w-2xl mx-auto">
                  Stocks with the highest price gains today - showing strong momentum and investor interest
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {topPerformers.map((stock, index) => (
                  <div
                    key={stock.symbol}
                    onClick={() => handleStockClick(stock.symbol)}
                    className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-300 cursor-pointer hover-lift group border border-white/20 relative overflow-hidden"
                  >
                    {/* Top performer badge */}
                    <div className="absolute top-4 right-4">
                      <div className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded-full">
                        #{index + 1}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
                          {stock.symbol.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <h3 className="font-bold text-white group-hover:text-green-400 transition-colors">
                            {stock.symbol}
                          </h3>
                          <p className="text-sm text-gray-300">{stock.name}</p>
                        </div>
                      </div>
                      <ArrowRight className="text-gray-400 group-hover:text-green-400 transition-colors" size={20} />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">Current Price</span>
                        <span className="font-semibold text-white">{stock.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">Today's Gain</span>
                        <span className="font-semibold text-green-400 bg-green-500/10 px-2 py-1 rounded">
                          {stock.change}
                        </span>
                      </div>
                      {stock.marketCap && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300 text-sm">Market Cap</span>
                          <span className="font-semibold text-white">{stock.marketCap}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Highest Market Cap Stocks */}
            <div>
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-3">
                    <BarChart3 className="text-white" size={20} />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Highest Market Cap Stocks</h3>
                </div>
                <p className="text-gray-300 max-w-2xl mx-auto">
                  India's largest companies by market value - representing the biggest players in the market
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {highestMarketCap.map((stock, index) => (
                  <div
                    key={stock.symbol}
                    onClick={() => handleStockClick(stock.symbol)}
                    className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-300 cursor-pointer hover-lift group border border-white/20 relative overflow-hidden"
                  >
                    {/* Market cap badge */}
                    <div className="absolute top-4 right-4">
                      <div className="bg-blue-500/20 text-blue-400 text-xs font-bold px-2 py-1 rounded-full">
                        #{index + 1}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
                          {stock.symbol.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors">
                            {stock.symbol}
                          </h3>
                          <p className="text-sm text-gray-300">{stock.name}</p>
                        </div>
                      </div>
                      <ArrowRight className="text-gray-400 group-hover:text-blue-400 transition-colors" size={20} />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">Current Price</span>
                        <span className="font-semibold text-white">{stock.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">Market Cap</span>
                        <span className="font-semibold text-blue-400 bg-blue-500/10 px-2 py-1 rounded">
                          {stock.marketCap}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">Today's Change</span>
                        <span className={`font-semibold ${stock.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                          {stock.change}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home; 