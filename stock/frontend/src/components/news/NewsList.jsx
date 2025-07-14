import React, { useEffect, useState, useRef } from 'react';
import { fetchNewsData } from '../../config/api';
import NewsArticle from './NewsArticle';

const NewsList = ({ symbol }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);

  useEffect(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    if (!symbol) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }
    const controller = new AbortController();
    controllerRef.current = controller;
    const signal = controller.signal;
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setData(null);
        const response = await fetchNewsData(symbol);
        if (!signal.aborted) {
          setData(response);
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(err.message);
        setData(null);
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    };
    fetchData();
    return () => { controller.abort(); };
  }, [symbol]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading news data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 text-lg font-semibold mb-2">No Data Available</div>
        <div className="text-red-500 mb-4">{error}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center p-8 text-gray-500">
        Enter a stock symbol to view news
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stock Info */}
      {data.stock_info && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Stock Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{data.stock_info.current_price}</div>
              <div className="text-sm text-gray-600">Current Price</div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-semibold ${data.stock_info.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {data.stock_info.change}
              </div>
              <div className="text-sm text-gray-600">Change</div>
          </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">{data.stock_info.market_cap}</div>
              <div className="text-sm text-gray-600">Market Cap</div>
          </div>
          </div>
        </div>
      )}

      {/* News Articles */}
      {data.articles && data.articles.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Latest News</h2>
          {data.articles.map((article, index) => (
            <NewsArticle key={index} article={article} />
          ))}
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <div className="text-yellow-800">No recent news articles available</div>
        </div>
      )}

      {data.message && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-blue-800">{data.message}</div>
        </div>
      )}

      <div className="text-sm text-gray-500 text-center">
        Source: {data.source} • Last updated: {new Date(data.timestamp).toLocaleString()}
      </div>
    </div>
  );
};

export default NewsList; 