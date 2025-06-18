import React, { useState, useEffect } from 'react';
import api from '../../config/api';

const DailyDigest = ({ symbol = 'AAPL' }) => {
  const [digestData, setDigestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDigest = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/news/${symbol}`);
        console.log('Digest API Response:', response.data);
        setDigestData(response.data.daily_digest);
        setError(null);
      } catch (err) {
        console.error('Error fetching digest:', err);
        setError(err.response?.data?.detail || 'Failed to fetch daily digest');
      } finally {
        setLoading(false);
      }
    };

    fetchDigest();
  }, [symbol]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  if (!digestData) {
    return (
      <div className="text-gray-500 text-center p-4">
        No digest available
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-xl font-bold mb-4">Daily Market Digest</h3>
      
      <div className="mb-6">
        <h4 className="font-semibold mb-2">Summary</h4>
        <p className="text-gray-700">{digestData.summary}</p>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold mb-2">Key Developments</h4>
        <ul className="list-disc list-inside space-y-2">
          {digestData.key_developments.map((dev, idx) => (
            <li key={idx} className="text-gray-700">{dev}</li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-semibold mb-2">Market Reaction</h4>
        <p className="text-gray-700">{digestData.market_reaction}</p>
      </div>
    </div>
  );
};

export default DailyDigest; 