import React, { useEffect, useState, useRef } from 'react';
import { fetchTechnicalData } from '../../config/api';

const TechnicalAnalysis = ({ symbol }) => {
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
        const response = await fetchTechnicalData(symbol);
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
        <span className="ml-2 text-gray-600">Loading technical data...</span>
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
        Enter a stock symbol to view technical analysis
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Price Data */}
      {data.price_data && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Price Data</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">{data.price_data.volume || 'N/A'}</div>
              <div className="text-sm text-gray-600">Volume</div>
            </div>
          </div>
        </div>
      )}

      {/* Technical Indicators */}
      {data.technical_indicators && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Technical Indicators</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">P/E Ratio</div>
              <div className="text-lg font-semibold text-blue-600">{data.technical_indicators.pe_ratio}</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">P/B Ratio</div>
              <div className="text-lg font-semibold text-green-600">{data.technical_indicators.pb_ratio}</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Market Cap</div>
              <div className="text-lg font-semibold text-purple-600">{data.technical_indicators.market_cap}</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Dividend Yield</div>
              <div className="text-lg font-semibold text-yellow-600">{data.technical_indicators.dividend_yield}</div>
            </div>
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">ROE</div>
              <div className="text-lg font-semibold text-indigo-600">{data.technical_indicators.roe}</div>
            </div>
            <div className="text-center p-4 bg-pink-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Debt/Equity</div>
              <div className="text-lg font-semibold text-pink-600">{data.technical_indicators.debt_to_equity}</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Current Ratio</div>
              <div className="text-lg font-semibold text-orange-600">{data.technical_indicators.current_ratio}</div>
            </div>
            <div className="text-center p-4 bg-teal-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Quick Ratio</div>
              <div className="text-lg font-semibold text-teal-600">{data.technical_indicators.quick_ratio}</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Price to Sales</div>
              <div className="text-lg font-semibold text-red-600">{data.technical_indicators.price_to_sales}</div>
            </div>
            <div className="text-center p-4 bg-cyan-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">EV/EBITDA</div>
              <div className="text-lg font-semibold text-cyan-600">{data.technical_indicators.ev_to_ebitda}</div>
            </div>
            <div className="text-center p-4 bg-lime-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">ROA</div>
              <div className="text-lg font-semibold text-lime-600">{data.technical_indicators.roa}</div>
            </div>
          </div>
        </div>
      )}

      {/* Growth Performance */}
      {data.growth_performance && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Growth & Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Revenue Growth</div>
              <div className="text-lg font-semibold text-emerald-600">{data.growth_performance.revenue_growth}</div>
            </div>
            <div className="text-center p-4 bg-violet-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Earnings Growth</div>
              <div className="text-lg font-semibold text-violet-600">{data.growth_performance.earnings_growth}</div>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Return on Equity</div>
              <div className="text-lg font-semibold text-amber-600">{data.growth_performance.return_on_equity}</div>
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      {data.summary && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Investment Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Valuation Grade</div>
              <div className="text-lg font-semibold text-orange-600">{data.summary.valuation_grade}</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Overall Rating</div>
              <div className="text-lg font-semibold text-red-600">{data.summary.overall_rating}</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Risk Assessment</div>
              <div className="text-lg font-semibold text-blue-600">{data.summary.risk_assessment}</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Recommendation</div>
              <div className="text-lg font-semibold text-green-600">{data.summary.investment_recommendation}</div>
            </div>
      </div>
      </div>
      )}

      <div className="text-sm text-gray-500 text-center">
        Source: {data.source} • Last updated: {new Date(data.timestamp).toLocaleString()}
      </div>
    </div>
  );
};

export default TechnicalAnalysis; 