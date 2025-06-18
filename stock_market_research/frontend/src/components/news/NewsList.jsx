import React, { useState, useEffect } from 'react';
import api from '../../config/api';

const tagColors = {
  earnings: "bg-blue-100 text-blue-800",
  products: "bg-purple-100 text-purple-800",
  analyst: "bg-green-100 text-green-800",
  regulatory: "bg-yellow-100 text-yellow-800",
  "high priority": "bg-red-100 text-red-800",
  "medium priority": "bg-orange-100 text-orange-800",
  "low priority": "bg-gray-100 text-gray-800"
};

const NewsList = ({ filter, symbol = 'AAPL' }) => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/news/${symbol}`);
        console.log('News API Response:', response.data);
        setNewsData(response.data.articles || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError(err.response?.data?.detail || 'Failed to fetch news data');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
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

  const filtered = filter === 'all'
    ? newsData
    : newsData.filter(item => item.category === filter);

  return (
    <div className="space-y-6">
      {filtered.map((item, idx) => (
        <div key={idx} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-2 mb-2">
            <span className={`px-2 py-1 rounded text-xs font-semibold ${tagColors[item.category] || 'bg-gray-100 text-gray-800'}`}>
              {item.category}
            </span>
            <span className={`px-2 py-1 rounded text-xs font-semibold ${tagColors[item.priority] || 'bg-gray-100 text-gray-800'}`}>
              {item.priority} priority
            </span>
            <span className="text-gray-500 text-xs">{item.source} • {item.time}</span>
          </div>
          <div className="font-bold text-lg mb-2">{item.title}</div>
          <div>
            <span className="font-semibold">Key Points:</span>
            <ul className="list-disc list-inside text-gray-700 mt-1">
              {item.key_points.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
          <div className="mt-2 flex items-center space-x-2">
            <span className={`text-sm ${item.sentiment === 'bullish' ? 'text-green-600' : item.sentiment === 'bearish' ? 'text-red-600' : 'text-gray-600'}`}>
              {item.sentiment}
            </span>
            <span className="text-sm text-gray-500">
              Impact: {item.impact_score > 0 ? '+' : ''}{item.impact_score}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsList; 