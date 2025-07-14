import React from 'react';
import { Activity } from 'lucide-react';

const getBadge = (signal) => {
  if (signal === 'bullish') return 'bg-green-900 text-white';
  if (signal === 'bearish' || signal === 'overbought') return 'bg-red-500 text-white';
  return 'bg-gray-100 text-gray-800';
};

const TechnicalIndicators = ({ data }) => (
  <div>
    <h3 className="text-lg font-semibold mb-4">Technical Indicators</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {(data || [
        { name: 'RSI (14)', value: '-', signal: '-' },
        { name: 'MACD', value: '-', signal: '-' },
        { name: 'SMA 20', value: '-', signal: '-' },
        { name: 'SMA 50', value: '-', signal: '-' },
        { name: 'Bollinger Bands', value: '-', signal: '-' },
        { name: 'Stochastic', value: '-', signal: '-' }
      ]).map((indicator) => (
        <div key={indicator.name} className="p-4 border rounded-lg bg-white flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Activity className="w-4 h-4 mr-2 text-gray-500" />
              <span className="text-gray-600">{indicator.name}</span>
            </div>
            <span className={`px-2 py-1 text-xs rounded-full font-semibold ${getBadge(indicator.signal)}`}>
              {indicator.signal}
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold">{indicator.value}</div>
        </div>
      ))}
    </div>
  </div>
);

export default TechnicalIndicators; 