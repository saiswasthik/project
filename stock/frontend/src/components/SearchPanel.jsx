import React, { useState, useEffect } from 'react';
import { Search, Info, ChevronDown } from 'lucide-react';
import { fetchSymbolSuggestions } from '../config/api';

const SearchPanel = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  // Available Indian stock symbols
  const availableSymbols = [
    "RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "INFY.NS", "ICICIBANK.NS", "HINDUNILVR.NS",
    "ITC.NS", "SBIN.NS", "BHARTIARTL.NS", "KOTAKBANK.NS", "AXISBANK.NS",
    "ASIANPAINT.NS", "MARUTI.NS", "HCLTECH.NS", "SUNPHARMA.NS", "WIPRO.NS",
    "ULTRACEMCO.NS", "TITAN.NS", "BAJFINANCE.NS", "NESTLEIND.NS",
    "ONGC.NS", "IOC.NS", "BPCL.NS", "HPCL.NS", "GAIL.NS"
  ];

  // Fetch symbol suggestions when search term changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.trim().length >= 2) {
        setLoading(true);
        try {
          console.log('🔍 Fetching suggestions for:', searchTerm.trim());
          const data = await fetchSymbolSuggestions(searchTerm.trim());
          console.log('✅ Suggestions received:', data);
          setSuggestions(data.suggestions || []);
          setShowSuggestions(true);
        } catch (error) {
          console.error('❌ Error fetching suggestions:', error);
          // Show fallback suggestions for common terms
          const fallbackSuggestions = getFallbackSuggestions(searchTerm.trim());
          setSuggestions(fallbackSuggestions);
          setShowSuggestions(true);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Fallback suggestions for common terms
  const getFallbackSuggestions = (term) => {
    const termUpper = term.toUpperCase();
    const fallbackMap = {
      'OIL': [
        { symbol: 'ONGC.NS', name: 'Oil and Natural Gas Corporation', description: 'Largest oil and gas company' },
        { symbol: 'IOC.NS', name: 'Indian Oil Corporation', description: 'Largest oil marketing company' },
        { symbol: 'BPCL.NS', name: 'Bharat Petroleum', description: 'Major oil marketing company' },
        { symbol: 'HPCL.NS', name: 'Hindustan Petroleum', description: 'Oil marketing company' }
      ],
      'BANK': [
        { symbol: 'HDFCBANK.NS', name: 'HDFC Bank', description: 'Private sector bank' },
        { symbol: 'ICICIBANK.NS', name: 'ICICI Bank', description: 'Private sector bank' },
        { symbol: 'SBIN.NS', name: 'State Bank of India', description: 'Public sector bank' },
        { symbol: 'KOTAKBANK.NS', name: 'Kotak Mahindra Bank', description: 'Private sector bank' }
      ],
      'TECH': [
        { symbol: 'TCS.NS', name: 'Tata Consultancy Services', description: 'IT services company' },
        { symbol: 'INFY.NS', name: 'Infosys', description: 'IT services company' },
        { symbol: 'WIPRO.NS', name: 'Wipro', description: 'IT services company' },
        { symbol: 'HCLTECH.NS', name: 'HCL Technologies', description: 'IT services company' }
      ]
    };
    
    return fallbackMap[termUpper] || [];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim().toUpperCase());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (symbol) => {
    console.log('🎯 User clicked suggestion:', symbol);
    onSearch(symbol);
    setSearchTerm(symbol);
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      {/* Guidance Message */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-start space-x-3">
          <div className="text-blue-600 text-lg">💡</div>
          <div className="flex-1">
            <div className="text-blue-800 font-semibold mb-1">How to Search Stocks:</div>
            <div className="text-blue-700 text-sm space-y-1">
              <p>• Type <strong>company names</strong> (e.g., "RELIANCE", "TCS")</p>
              <p>• Try <strong>categories</strong> (e.g., "OIL", "BANK", "TECH") for suggestions</p>
              <p>• Use <strong>symbols</strong> with .NS suffix (e.g., "RELIANCE.NS")</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => searchTerm.trim().length >= 2 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Search stocks (e.g., RELIANCE, OIL, BANK)..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>
        
        {/* Suggestions Dropdown */}
        {showSuggestions && (suggestions.length > 0 || loading) && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <span>Finding suggestions...</span>
              </div>
            ) : (
              <div className="p-2">
                <div className="text-sm text-gray-600 mb-2 px-2 font-medium">
                  💡 Suggestions for "{searchTerm}"
                </div>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion.symbol)}
                    className="w-full text-left p-3 hover:bg-blue-50 rounded-lg transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-lg">{suggestion.symbol}</div>
                        <div className="text-sm text-gray-600 font-medium">{suggestion.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{suggestion.description}</div>
                      </div>
                      <div className="text-blue-600 text-sm font-medium">
                        Click to search →
                      </div>
                    </div>
                  </button>
                ))}
                
                {/* Quick Categories */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="text-sm text-gray-600 mb-2 px-2 font-medium">🎯 Quick Categories:</div>
                  <div className="flex flex-wrap gap-2 px-2">
                    {['OIL', 'BANK', 'TECH', 'PHARMA'].map((category) => (
                      <button
                        key={category}
                        onClick={() => setSearchTerm(category)}
                        className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs rounded-full transition-colors duration-200"
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </form>
      
      {/* Available Symbols Info */}
      <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200">
        <div className="flex items-start gap-2">
          <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-800 mb-1">💡 Search Tips:</p>
            <p className="text-xs text-blue-700 mb-2">
              Try searching for categories like "OIL", "BANK", "TECH", "PHARMA" or specific symbols like "RELIANCE.NS"
            </p>
            <p className="text-xs text-blue-700">
              Popular symbols: {availableSymbols.slice(0, 8).join(", ")}...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPanel; 