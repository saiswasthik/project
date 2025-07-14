import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const SentimentDistribution = ({ data }) => {
  // Use only the percent value if data is an array
  const getValue = (val) =>
    Array.isArray(val) ? val[1] : (typeof val === 'number' ? val : 0);

  const chartData = data ? [
    { name: 'Bullish', value: getValue(data.bullish), color: '#22c55e' },
    { name: 'Neutral', value: getValue(data.neutral), color: '#64748b' },
    { name: 'Bearish', value: getValue(data.bearish), color: '#ef4444' }
  ] : [
    { name: 'Bullish', value: 0, color: '#22c55e' },
    { name: 'Neutral', value: 0, color: '#64748b' },
    { name: 'Bearish', value: 0, color: '#ef4444' }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm">{payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <span className="mr-2">🗨️</span> Current Sentiment Distribution
      </h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, value }) => `${name}: ${value}%`}
              labelLine={false}
            >
              {chartData.map((entry, idx) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SentimentDistribution; 