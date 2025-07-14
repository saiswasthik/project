import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = {
  bullish: '#22c55e', // green
  neutral: '#64748b', // gray
  bearish: '#ef4444', // red
};

const SentimentTrend = ({ data }) => {
  // Sanitize and map data for stacked bar chart
  const sanitizedData = (data || []).map(item => ({
    week: item.week || '',
    bullish: typeof item.bullish === 'number' ? item.bullish : parseFloat(item.bullish) || 0,
    neutral: typeof item.neutral === 'number' ? item.neutral : parseFloat(item.neutral) || 0,
    bearish: typeof item.bearish === 'number' ? item.bearish : parseFloat(item.bearish) || 0,
  }));

  // If the backend returns trend as [{week, score}], try to reconstruct bullish/neutral/bearish from sentiment_distribution if possible
  // Otherwise, expect the backend to return [{week, bullish, neutral, bearish}]

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
          <p className="font-medium mb-1">{label}</p>
          {payload.map((entry, idx) => (
            <p key={idx} className="text-sm" style={{ color: entry.color }}>
              {entry.name} : {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <span className="mr-2">📊</span> Sentiment Trend (4 Weeks)
      </h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sanitizedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} tickFormatter={v => v} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="bullish" stackId="a" fill={COLORS.bullish} name="bullish" />
            <Bar dataKey="neutral" stackId="a" fill={COLORS.neutral} name="neutral" />
            <Bar dataKey="bearish" stackId="a" fill={COLORS.bearish} name="bearish" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SentimentTrend; 