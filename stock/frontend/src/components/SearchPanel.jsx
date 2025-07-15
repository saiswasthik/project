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
          const data = await fetchSymbolSuggestions(searchTerm.trim());
          setSuggestions(data.suggestions || []);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim().toUpperCase());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (symbol) => {
    setSearchTerm(symbol);
    onSearch(symbol);
    setShowSuggestions(false);
  };

  return (
    <div className="p-4 md:p-6">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <label htmlFor="stockSearch" className="block text-sm font-medium text-gray-700 mb-1">
            Stock Symbol
          </label>
          <input
            type="text"
            id="stockSearch"
            placeholder="e.g., OIL, BANK, TECH, RELIANCE.NS"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => searchTerm.trim().length >= 2 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            list="availableSymbols"
          />
          <datalist id="availableSymbols">
            {availableSymbols.map(symbol => (
              <option key={symbol} value={symbol} />
            ))}
          </datalist>
          
          {/* Suggestions Dropdown */}
          {showSuggestions && (suggestions.length > 0 || loading) && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {loading ? (
                <div className="p-3 text-center text-gray-500">Loading suggestions...</div>
              ) : (
                suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => handleSuggestionClick(suggestion.symbol)}
                  >
                    <div className="font-medium text-gray-900">{suggestion.symbol}</div>
                    <div className="text-sm text-gray-600">{suggestion.name}</div>
                    <div className="text-xs text-gray-500">{suggestion.description}</div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        
        <div className="md:self-end">
          <button
            type="submit"
            className="w-full md:w-auto px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 flex items-center justify-center gap-2 transition-colors"
          >
            <Search size={18} />
            <span>Search</span>
          </button>
        </div>
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