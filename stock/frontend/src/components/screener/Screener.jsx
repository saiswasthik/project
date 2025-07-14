import React, { useState } from 'react';
import { fetchScreenerData } from '../../config/api';
import ScreenerFilters from './ScreenerFilters';
import ScreenerResults from './ScreenerResults';

const Screener = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (filters) => {
    try {
    setLoading(true);
    setError(null);
      const response = await fetchScreenerData(filters);
      setResults(response);
    } catch (err) {
      setError(err.message);
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Stock Screener</h2>
        <ScreenerFilters onSearch={handleSearch} />
      </div>

      {loading && (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Searching stocks...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 text-lg font-semibold mb-2">Search Failed</div>
          <div className="text-red-500 mb-4">{error}</div>
        </div>
      )}

      {results && (
        <ScreenerResults results={results} />
      )}
    </div>
  );
};

export default Screener; 