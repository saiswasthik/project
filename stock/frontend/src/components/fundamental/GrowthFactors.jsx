import React from 'react';
import { TrendingUp } from 'lucide-react';

const GrowthFactors = ({ data }) => {
  // Default fallback data if no props provided
  const defaultFactors = [
    {
      factor: 'Revenue Growth',
      value: '+15%',
      trend: 'positive',
      description: 'Year-over-year revenue growth',
    },
    {
      factor: 'Market Share',
      value: '25%',
      trend: 'positive',
      description: 'Current market share in primary segment',
    },
    {
      factor: 'R&D Investment',
      value: '12%',
      trend: 'positive',
      description: 'Percentage of revenue invested in R&D',
    },
  ];

  // Use dynamic data if provided, otherwise use defaults
  // API returns: { earnings_yield: { label: "...", value: "..." }, ... }
  let factors = defaultFactors;
  
  if (data && typeof data === 'object') {
    // Convert API data structure to component format
    factors = Object.entries(data).map(([key, metric]) => ({
      factor: metric.label || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: metric.value || 'N/A',
      trend: 'positive', // Default to positive, could be enhanced with trend detection
      description: metric.label || `Growth metric: ${key.replace(/_/g, ' ')}`,
    }));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-blue-600">
        <TrendingUp size={20} />
        <h3 className="text-lg font-medium">Growth Factors</h3>
      </div>
      <div className="grid gap-4">
        {factors.map((factor, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-start">
              <h4 className="font-medium text-gray-900">{factor.factor}</h4>
              <span className={`font-medium ${factor.trend === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                {factor.value}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-600">{factor.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GrowthFactors; 