import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

const PriceChart = ({ data }) => {
  // Format the data for display
  const formattedData = data?.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    price: Number(item.price).toFixed(2)
  })) || [];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <span className="mr-2">📈</span> Price Chart (Last 10 Days)
      </h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData}>
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
              domain={['auto', 'auto']}
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip 
              formatter={(value) => [`₹${value}`, 'Price']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#2563eb" 
              dot={{ fill: '#2563eb', r: 4 }}
              activeDot={{ r: 6 }}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceChart; 