import React, { useState } from 'react';
import { Search, Info } from 'lucide-react';

const SearchPanel = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Available Indian stock symbols
  const availableSymbols = [
    "RELIANCE", "TCS", "HDFC", "INFY", "ICICIBANK", "HINDUNILVR",
    "ITC", "SBIN", "BHARTIARTL", "KOTAKBANK", "AXISBANK",
    "ASIANPAINT", "MARUTI", "HCLTECH", "SUNPHARMA", "WIPRO",
    "ULTRACEMCO", "TITAN", "BAJFINANCE", "NESTLEIND"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim().toUpperCase());
    }
  };

  return (
    <div className="p-4 md:p-6">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="stockSearch" className="block text-sm font-medium text-gray-700 mb-1">
            Stock Symbol
          </label>
          <input
            type="text"
            id="stockSearch"
            placeholder="e.g., RELIANCE, TCS, INFY"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            list="availableSymbols"
          />
          <datalist id="availableSymbols">
            {availableSymbols.map(symbol => (
              <option key={symbol} value={symbol} />
            ))}
          </datalist>
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
            <p className="text-sm font-medium text-blue-800 mb-1">Available Indian Stocks:</p>
            <p className="text-xs text-blue-700">
              {availableSymbols.slice(0, 10).join(", ")}... and more
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPanel; 