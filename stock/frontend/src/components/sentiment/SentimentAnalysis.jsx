import React, { useEffect, useState, useRef } from 'react';
import { fetchSentimentData } from '../../config/api';
import OverallMetrics from './OverallMetrics';
import SentimentDistribution from './SentimentDistribution';
import SentimentTrend from './SentimentTrend';
import RecentNews from './RecentNews';
import NewsAnalysis from './NewsAnalysis';
import SentimentGuide from './SentimentGuide';

const SentimentAnalysis = ({ symbol }) => {
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
        const response = await fetchSentimentData(symbol);
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
        <span className="ml-2 text-gray-600">Loading sentiment data...</span>
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
        Enter a stock symbol to view sentiment analysis
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Price Data */}
      {data.price_data && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Price Data</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{data.price_data.current_price}</div>
              <div className="text-sm text-gray-600">Current Price</div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-semibold ${data.price_data.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {data.price_data.change}
              </div>
              <div className="text-sm text-gray-600">Change</div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-semibold ${data.price_data.change_percent.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {data.price_data.change_percent}
              </div>
              <div className="text-sm text-gray-600">Change %</div>
            </div>
          </div>
      </div>
      )}

      {/* Sentiment Metrics */}
      {data.sentiment_metrics && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Sentiment Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Overall Sentiment</div>
              <div className="text-lg font-semibold text-blue-600 capitalize">{data.sentiment_metrics.overall_sentiment}</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Confidence Score</div>
              <div className="text-lg font-semibold text-green-600">{(data.sentiment_metrics.confidence_score * 100).toFixed(1)}%</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Key Factors</div>
              <div className="text-sm text-purple-600">{data.sentiment_metrics.key_factors.length} factors</div>
            </div>
          </div>
        </div>
      )}

      {/* Analysis */}
      {data.analysis && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Financial Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Valuation Grade</div>
              <div className="text-lg font-semibold text-orange-600">{data.analysis.valuation_grade}</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Financial Health</div>
              <div className="text-lg font-semibold text-green-600">{data.analysis.financial_health}</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Overall Rating</div>
              <div className="text-lg font-semibold text-red-600">{data.analysis.overall_rating}</div>
            </div>
          </div>
        </div>
      )}
      
      {data.message && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <div className="text-yellow-800">{data.message}</div>
      </div>
      )}
      
      <div className="text-sm text-gray-500 text-center">
        Source: {data.source} • Last updated: {new Date(data.timestamp).toLocaleString()}
      </div>
    </div>
  );
};

export default SentimentAnalysis; 