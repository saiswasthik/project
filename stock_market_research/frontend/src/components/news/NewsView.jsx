import React, { useState, useEffect } from 'react';
import NewsList from './NewsList';
import DailyDigest from './DailyDigest';
import api from '../../config/api';

const TABS = [
  { id: 'all', label: 'All News' },
  { id: 'earnings', label: 'Earnings' },
  { id: 'products', label: 'Products' },
  { id: 'analyst', label: 'Analyst' },
  { id: 'regulatory', label: 'Regulatory' }
];

const NewsView = ({ stockSymbol = 'AAPL' }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [activeView, setActiveView] = useState('articles');
  const [liveUpdates, setLiveUpdates] = useState([]);
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      if (!stockSymbol) return;
      
      try {
        setLoading(true);
        const response = await api.get(`/news/${stockSymbol}`);
        console.log('News API Response:', response.data);
        
        // Set both live updates and news data
        setLiveUpdates(response.data.live_updates || []);
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
    // Refresh news every 5 minutes
    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [stockSymbol]);

  // Filter news based on active tab
  const filteredNews = activeTab === 'all' 
    ? newsData 
    : newsData.filter(item => item.category.toLowerCase() === activeTab.toLowerCase());

  if (!stockSymbol) {
    return (
      <div className="text-center p-8 text-gray-500">
        Please select a stock symbol to view news
      </div>
    );
  }

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

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-2">Stock News - {stockSymbol}</h2>
      
      {/* Top tab bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex w-full max-w-xl mx-auto bg-white rounded-lg overflow-hidden border border-gray-300">
          <button
            className={`flex-1 px-4 py-2 text-center font-medium transition-colors duration-150 ${activeView === 'articles' ? 'border-b-2 border-black bg-gray-100' : 'bg-white text-gray-500'}`}
            onClick={() => setActiveView('articles')}
          >
            News Articles
          </button>
          <button
            className={`flex-1 px-4 py-2 text-center font-medium transition-colors duration-150 ${activeView === 'digest' ? 'border-b-2 border-black bg-gray-100' : 'bg-white text-gray-500'}`}
            onClick={() => setActiveView('digest')}
          >
            Daily Digest
          </button>
        </div>
        <div className="ml-4 text-sm text-gray-500 flex items-center">
          <span className="mr-2">⏲️</span> Live Updates
          {liveUpdates.length > 0 && (
            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
              {liveUpdates.length} new
            </span>
          )}
        </div>
      </div>

      {/* Live Updates Section */}
      {liveUpdates.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <h3 className="font-semibold mb-2">Live Updates</h3>
          <div className="space-y-2">
            {liveUpdates.map((update, idx) => (
              <div key={idx} className="flex items-start space-x-2">
                <span className="text-gray-500 text-sm">{update.time}</span>
                <span className="flex-1">{update.update}</span>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  update.impact === 'high' ? 'bg-red-100 text-red-800' :
                  update.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {update.impact} impact
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* News filter buttons */}
      {activeView === 'articles' && (
        <div className="flex space-x-2 mb-4">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`px-3 py-1 rounded ${activeTab === tab.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Main content */}
      {activeView === 'digest' ? (
        <DailyDigest symbol={stockSymbol} />
      ) : (
        <div className="space-y-6">
          {filteredNews.length === 0 ? (
            <div className="text-center p-8 text-gray-500">
              No news available for {activeTab === 'all' ? 'this stock' : `the ${activeTab} category`}
            </div>
          ) : (
            filteredNews.map((item, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    item.category === 'earnings' ? 'bg-blue-100 text-blue-800' :
                    item.category === 'products' ? 'bg-purple-100 text-purple-800' :
                    item.category === 'analyst' ? 'bg-green-100 text-green-800' :
                    item.category === 'regulatory' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.category}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    item.priority === 'high' ? 'bg-red-100 text-red-800' :
                    item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
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
                  <span className={`text-sm ${
                    item.sentiment === 'bullish' ? 'text-green-600' :
                    item.sentiment === 'bearish' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {item.sentiment}
                  </span>
                  <span className="text-sm text-gray-500">
                    Impact: {item.impact_score > 0 ? '+' : ''}{item.impact_score}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NewsView; 