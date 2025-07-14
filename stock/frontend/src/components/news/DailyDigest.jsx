import React, { useEffect, useState, useRef } from 'react';
import { fetchNewsData } from '../../config/api';

const DailyDigest = ({ symbol }) => {
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
        <span className="ml-2 text-gray-600">Loading daily digest...</span>
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
        Enter a stock symbol to view daily digest
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Daily Digest for {symbol}</h2>
      
      {data.stock_info && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Stock Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Price:</span>
              <div className="font-semibold">{data.stock_info.current_price}</div>
            </div>
            <div>
              <span className="text-gray-600">Change:</span>
              <div className={`font-semibold ${data.stock_info.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {data.stock_info.change} ({data.stock_info.change_percent})
              </div>
            </div>
            <div>
              <span className="text-gray-600">Market Cap:</span>
              <div className="font-semibold">{data.stock_info.market_cap}</div>
            </div>
            <div>
              <span className="text-gray-600">P/E Ratio:</span>
              <div className="font-semibold">{data.stock_info.pe_ratio}</div>
            </div>
          </div>
      </div>
      )}

      {data.articles && data.articles.length > 0 ? (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Latest Updates</h3>
          <div className="space-y-3">
            {data.articles.map((article, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="font-medium text-gray-900">{article.title}</div>
                <div className="text-sm text-gray-600 mt-1">{article.summary}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {article.source} • {new Date(article.published_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <div className="text-lg font-medium mb-2">No Recent Updates</div>
          <div className="text-sm">Check back later for the latest news and updates</div>
        </div>
      )}

      {data.message && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="text-yellow-800 text-sm">{data.message}</div>
      </div>
      )}

      <div className="mt-6 text-xs text-gray-500 text-center">
        Source: {data.source} • Last updated: {new Date(data.timestamp).toLocaleString()}
      </div>
    </div>
  );
};

export default DailyDigest; 