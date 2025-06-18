import React from 'react';
import { TrendingUp } from 'lucide-react';

const GrowthFactors = () => {
  const factors = [
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
              <span className="text-green-600 font-medium">{factor.value}</span>
            </div>
            <p className="mt-2 text-sm text-gray-600">{factor.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GrowthFactors; 