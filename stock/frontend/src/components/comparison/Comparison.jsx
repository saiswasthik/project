import React, { useState } from 'react';
import { BarChart3, TrendingUp, PieChart, Users, GitCompare } from 'lucide-react';

const Comparison = ({ stockSymbol }) => {
  const [activeComparison, setActiveComparison] = useState('peers');

  const comparisonOptions = [
    { id: 'peers', label: 'Peer Comparison', icon: <GitCompare size={16} /> },
    { id: 'sector', label: 'Sector Analysis', icon: <PieChart size={16} /> },
    { id: 'historical', label: 'Historical Performance', icon: <TrendingUp size={16} /> },
    { id: 'ratios', label: 'Ratio Analysis', icon: <BarChart3 size={16} /> },
  ];

  const renderComparisonContent = () => {
    switch (activeComparison) {
      case 'peers':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Peer Comparison</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'].map(symbol => (
                <div key={symbol} className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-900">{symbol}</h4>
                  <div className="mt-2 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">P/E:</span>
                      <span className="font-medium">{(Math.random() * 30 + 10).toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">P/B:</span>
                      <span className="font-medium">{(Math.random() * 5 + 1).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ROE:</span>
                      <span className="font-medium">{(Math.random() * 20 + 10).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'sector':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Sector Analysis</h3>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Technology Sector</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avg P/E:</span>
                      <span className="font-medium">25.4</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avg P/B:</span>
                      <span className="font-medium">3.2</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avg ROE:</span>
                      <span className="font-medium">18.5%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Your Stock</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">P/E:</span>
                      <span className="font-medium">22.1</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">P/B:</span>
                      <span className="font-medium">2.8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ROE:</span>
                      <span className="font-medium">16.2%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'historical':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Historical Performance</h3>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['1Y', '3Y', '5Y', '10Y'].map(period => (
                  <div key={period} className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {(Math.random() * 50 - 10).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">{period} Return</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'ratios':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Ratio Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Valuation Ratios</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">P/E Ratio:</span>
                    <span className="font-medium">22.1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">P/B Ratio:</span>
                    <span className="font-medium">2.8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">P/S Ratio:</span>
                    <span className="font-medium">4.2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">EV/EBITDA:</span>
                    <span className="font-medium">15.6</span>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Financial Ratios</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ROE:</span>
                    <span className="font-medium">16.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ROA:</span>
                    <span className="font-medium">8.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Debt/Equity:</span>
                    <span className="font-medium">0.45</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Ratio:</span>
                    <span className="font-medium">1.8</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Comparison Options */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto no-scrollbar" aria-label="Comparison Tabs">
            {comparisonOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setActiveComparison(option.id)}
                className={`flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeComparison === option.id
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{option.icon}</span>
                {option.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Comparison Content */}
      <div className="space-y-6">
        {renderComparisonContent()}
      </div>
    </div>
  );
};

export default Comparison; 