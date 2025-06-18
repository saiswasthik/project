import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SearchPanel = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [exchange, setExchange] = useState('.NS'); // Default to NSE suffix

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Append the selected exchange suffix
      onSearch(`${searchTerm.trim().toUpperCase()}${exchange}`);
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
            placeholder="e.g., RELIANCE, TCS"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="md:w-64">
          <label htmlFor="exchange" className="block text-sm font-medium text-gray-700 mb-1">
            Exchange
          </label>
          <select
            id="exchange"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={exchange}
            onChange={(e) => setExchange(e.target.value)}
          >
            <option value=".NS">NSE</option>
            <option value=".BO">BSE</option>
          </select>
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
    </div>
  );
};

export default SearchPanel; 