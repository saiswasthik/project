import React, { useState, useEffect } from 'react';
import { fetchFundamentalData } from '../../config/api';
import FinancialHealth from './FinancialHealth';
import GrowthFactors from './GrowthFactors';
import NewsCatalysts from './NewsCatalysts';
import RiskAssessment from './RiskAssessment';
import ValuationRatios from './ValuationRatios';
import MetricCard from '../MetricCard';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Target, Shield, Zap, ChevronDown, ChevronUp } from 'lucide-react';

const FundamentalAnalysis = ({ symbol }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAllMetrics, setShowAllMetrics] = useState(false);

  useEffect(() => {
    if (symbol) {
      fetchData();
    }
  }, [symbol]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
    try {
      const response = await fetchFundamentalData(symbol);
      console.log('Fundamental API Response:', response);
      console.log('Risk Assessment Data:', response?.risk_assessment);
      console.log('Growth Performance Data:', response?.growth_performance);
      setData(response);
      } catch (err) {
      console.error('Error fetching fundamental data:', err);
      setError(err.message || 'Failed to fetch data');
      } finally {
          setLoading(false);
        }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600 text-lg font-medium">Analyzing fundamentals...</div>
          <div className="text-gray-400 text-sm mt-2">Fetching real-time market data</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-8 text-center shadow-lg">
        <div className="text-red-600 text-xl font-bold mb-3">⚠️ Data Unavailable</div>
        <div className="text-red-500 mb-6 text-lg">{error}</div>
        <button 
          onClick={fetchData}
          className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          🔄 Try Again
        </button>
       </div>
     );
   }

  if (!data) {
     return (
      <div className="text-center p-12">
        <div className="text-gray-400 text-6xl mb-4">📊</div>
        <div className="text-gray-500 text-xl font-medium mb-2">Ready to Analyze</div>
        <div className="text-gray-400">Enter a stock symbol to view fundamental analysis</div>
       </div>
     );
   }

  return (
    <div className="space-y-8">
      {/* Real-time Data */}
      {data.real_time_data && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-xl p-8 border border-blue-200">
          <div className="flex items-center mb-6">
            <BarChart3 className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Real-time Market Data</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white rounded-xl shadow-md">
              <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900 mb-2">{data.real_time_data.current_price}</div>
              <div className="text-sm text-gray-600 font-medium">Current Price</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-md">
              {data.real_time_data.change.startsWith('+') ? (
                <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-3" />
              ) : (
                <TrendingDown className="w-8 h-8 text-red-600 mx-auto mb-3" />
              )}
              <div className={`text-2xl font-bold mb-2 ${data.real_time_data.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {data.real_time_data.change}
              </div>
              <div className="text-sm text-gray-600 font-medium">Change</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-md">
              {data.real_time_data.change_percent.startsWith('+') ? (
                <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-3" />
              ) : (
                <TrendingDown className="w-8 h-8 text-red-600 mx-auto mb-3" />
              )}
              <div className={`text-2xl font-bold mb-2 ${data.real_time_data.change_percent.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {data.real_time_data.change_percent}
              </div>
              <div className="text-sm text-gray-600 font-medium">Change %</div>
            </div>
       </div>
          <div className="mt-6 text-sm text-gray-500 text-center bg-white/50 rounded-lg p-3">
            📡 Source: {data.source} • ⏰ Last updated: {new Date(data.timestamp).toLocaleString()}
          </div>
        </div>
      )}

      {/* Major Metrics */}
      {data.major_metrics && (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-xl p-8 border border-gray-200">
          <div className="flex items-center mb-6">
            <Target className="w-8 h-8 text-gray-700 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Key Financial Metrics</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {Object.entries(data.major_metrics)
              .slice(0, showAllMetrics ? undefined : 8)
              .map(([key, metric]) => (
                <div key={key} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 mb-2">{metric.value}</div>
                    <div className="text-sm text-gray-600 font-medium">{metric.label}</div>
                  </div>
                </div>
              ))}
          </div>
          
          {/* Show More/Less Button */}
          {Object.keys(data.major_metrics).length > 8 && (
            <div className="text-center mt-6">
              <button
                onClick={() => setShowAllMetrics(!showAllMetrics)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {showAllMetrics ? (
                  <>
                    <ChevronUp className="mr-2" size={20} />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="mr-2" size={20} />
                    Show More Metrics
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Valuation Summary */}
      {data.valuation_summary && (
        <ValuationRatios data={data.valuation_summary} />
      )}

      {/* Growth & Performance */}
      {data.growth_performance && (
        <GrowthFactors data={data.growth_performance} />
      )}

      {/* Risk Assessment */}
      {data.risk_assessment && (
        <RiskAssessment data={data.risk_assessment} />
      )}

      {/* Investment Summary */}
      {data.investment_summary && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl shadow-xl p-8 border border-purple-200">
          <div className="flex items-center mb-6">
            <Shield className="w-8 h-8 text-purple-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Investment Summary</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-sm text-gray-600 mb-2 font-medium">Valuation Grade</div>
              <div className="text-xl font-bold text-blue-600">{data.investment_summary.valuation_grade}</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
              <div className="text-2xl mb-2">💚</div>
              <div className="text-sm text-gray-600 mb-2 font-medium">Financial Health</div>
              <div className="text-xl font-bold text-green-600">{data.investment_summary.financial_health}</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
              <div className="text-2xl mb-2">📈</div>
              <div className="text-sm text-gray-600 mb-2 font-medium">Growth Grade</div>
              <div className="text-xl font-bold text-purple-600">{data.investment_summary.growth_grade}</div>
           </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
              <div className="text-2xl mb-2">⭐</div>
              <div className="text-sm text-gray-600 mb-2 font-medium">Overall Rating</div>
              <div className="text-xl font-bold text-orange-600">{data.investment_summary.overall_rating}</div>
            </div>
          </div>
        </div>
       )}
    </div>
  );
};

export default FundamentalAnalysis;
 