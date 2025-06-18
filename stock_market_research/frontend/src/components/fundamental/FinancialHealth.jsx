import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const FinancialHealth = () => {
  const metrics = [
    {
      name: 'Revenue Growth',
      value: '15.2%',
      change: '+2.3%',
      trend: 'up'
    },
    {
      name: 'Profit Margin',
      value: '24.5%',
      change: '+1.1%',
      trend: 'up'
    },
    {
      name: 'Debt-to-Equity',
      value: '0.45',
      change: '-0.05',
      trend: 'down'
    },
    {
      name: 'Current Ratio',
      value: '2.1',
      change: '+0.2',
      trend: 'up'
    },
    {
      name: 'ROE',
      value: '18.3%',
      change: '-0.5%',
      trend: 'down'
    },
    {
      name: 'Operating Cash Flow',
      value: '$2.4B',
      change: '+$0.3B',
      trend: 'up'
    }
  ];

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Financial Health</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <div key={metric.name} className="p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-gray-600">{metric.name}</span>
              </div>
              <div className="flex items-center gap-1">
                {getTrendIcon(metric.trend)}
                <span className={`text-sm ${
                  metric.trend === 'up' ? 'text-green-600' :
                  metric.trend === 'down' ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  {metric.change}
                </span>
              </div>
            </div>
            <div className="mt-2 text-2xl font-bold">{metric.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinancialHealth; 