import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';

const CompactScreener = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [peRange, setPeRange] = useState([0, 50]);

  const sectors = [
    'Technology', 'Healthcare', 'Finance', 'Consumer', 'Energy', 'Industrials'
  ];

  const handleSearch = () => {
    // This would trigger the main screener search
    console.log('Searching with:', { searchTerm, selectedSector, peRange });
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Search Stocks
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter symbol or company"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search size={16} className="absolute right-3 top-2.5 text-gray-400" />
        </div>
      </div>

      {/* Sector Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Sector
        </label>
        <select
          value={selectedSector}
          onChange={(e) => setSelectedSector(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Sectors</option>
          {sectors.map(sector => (
            <option key={sector} value={sector}>{sector}</option>
          ))}
        </select>
      </div>

      {/* P/E Ratio Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          P/E Ratio: {peRange[0]} - {peRange[1]}
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={peRange[0]}
            onChange={(e) => setPeRange([parseInt(e.target.value) || 0, peRange[1]])}
            className="w-1/2 px-2 py-1 border border-gray-300 rounded text-sm"
            placeholder="Min"
          />
          <input
            type="number"
            value={peRange[1]}
            onChange={(e) => setPeRange([peRange[0], parseInt(e.target.value) || 50])}
            className="w-1/2 px-2 py-1 border border-gray-300 rounded text-sm"
            placeholder="Max"
          />
        </div>
      </div>

      {/* Quick Filters */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quick Filters
        </label>
        <div className="space-y-2">
          <button className="w-full text-left px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors">
            High Growth (&gt;20%)
          </button>
          <button className="w-full text-left px-3 py-2 text-sm bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors">
            High Dividend (&gt;3%)
          </button>
          <button className="w-full text-left px-3 py-2 text-sm bg-yellow-50 text-yellow-700 rounded-md hover:bg-yellow-100 transition-colors">
            Low P/E (&lt;15)
          </button>
        </div>
      </div>

      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
      >
        <Filter size={16} className="mr-2" />
        Apply Filters
      </button>
    </div>
  );
};

export default CompactScreener; 