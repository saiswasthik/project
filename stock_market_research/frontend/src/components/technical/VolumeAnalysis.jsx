import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

const VolumeAnalysis = ({ data }) => {
  // Format the data for display
  const formattedData = data?.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    volume: Number(item.volume)
  })) || [];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <span className="mr-2">📊</span> Volume Analysis (Last 10 Days)
      </h3>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              tickFormatter={(value) => {
                if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
                return value;
              }}
            />
            <Tooltip 
              formatter={(value) => [value.toLocaleString(), 'Volume']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Bar 
              dataKey="volume" 
              fill="#818cf8"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default VolumeAnalysis; 