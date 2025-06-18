import React, { useEffect, useState, useRef } from 'react';
import PriceChart from './PriceChart';
import VolumeAnalysis from './VolumeAnalysis';
import TechnicalIndicators from './TechnicalIndicators';
import PatternRecognition from './PatternRecognition';
import TechnicalSummary from './TechnicalSummary';

const TechnicalAnalysis = ({ stockSymbol }) => {
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
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/technical-analysis/${stockSymbol}`, { signal });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (!signal.aborted) {
          setData(result);
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
  }, [stockSymbol]);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>;
  }
  if (error) {
    return <div className="text-red-500 p-4 text-center">Error loading data: {error}</div>;
  }
  // Always render structure, pass data or null to subcomponents
  return (
    <div className="p-6 space-y-8">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <PriceChart data={data?.price_chart || null} />
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <VolumeAnalysis data={data?.volume_analysis || null} />
      </div>
      <div className="mb-6">
        <TechnicalIndicators data={data?.technical_indicators || null} />
      </div>
      <div className="mb-6">
        <PatternRecognition data={data?.pattern_recognition || null} />
      </div>
      <div>
        <TechnicalSummary data={data?.technical_summary || null} />
      </div>
    </div>
  );
};

export default TechnicalAnalysis; 