import React from 'react';

const MetricCard = ({ title, value, change, trend, description }) => {
  const isPositive = change >= 0;
  const trendColor = isPositive ? 'text-green-600' : 'text-red-600';
  const trendIcon = isPositive ? '↑' : '↓';

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        <span className={`ml-2 text-sm font-medium ${trendColor}`}>
          {trendIcon} {Math.abs(change)}%
        </span>
      </div>
      {description && (
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      )}
    </div>
  );
};

export default MetricCard; 