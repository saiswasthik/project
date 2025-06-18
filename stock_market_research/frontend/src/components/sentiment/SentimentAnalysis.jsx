import React, { useEffect, useState, useRef } from 'react';
import SentimentDistribution from './SentimentDistribution';
import SentimentTrend from './SentimentTrend';
import SentimentMetrics from './SentimentMetrics';
import NewsAnalysis from './NewsAnalysis';
import SentimentGuide from './SentimentGuide';

const SentimentAnalysis = ({ stockSymbol }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);

  useEffect(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    if (!stockSymbol) {
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

        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/sentiment-analysis/${stockSymbol}`, { signal });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        if (!signal.aborted) {
          if (result.error) {
            setError(result.error);
            setData(null);
          } else {
            setData(result);
          }
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(err.message);
        setData(null);
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      controller.abort();
    };
  }, [stockSymbol]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 text-center">
        Error loading data: {error}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Sentiment Analysis - {stockSymbol}</h2>
        <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">Last 24 Hours</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <SentimentDistribution data={data?.sentiment_distribution} />
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <SentimentTrend data={data?.sentiment_trend} />
        </div>
      </div>

      <SentimentMetrics data={data?.overall_metrics} />
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <NewsAnalysis data={data?.recent_news} />
      </div>
      
      <div className="bg-blue-50 rounded-lg shadow-sm p-6">
        <SentimentGuide data={data?.sentiment_guide} />
      </div>
    </div>
  );
};

export default SentimentAnalysis; 