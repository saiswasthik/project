import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const NewsCatalysts = () => {
  const catalysts = {
    bull: [
      {
        title: 'New Product Launch',
        impact: 'High',
        description: 'Upcoming product launch expected to drive significant revenue growth',
      },
      {
        title: 'Market Expansion',
        impact: 'Medium',
        description: 'Expansion into new geographic markets showing strong potential',
      },
    ],
    bear: [
      {
        title: 'Competition',
        impact: 'Medium',
        description: 'Increasing competition in core markets',
      },
      {
        title: 'Regulatory Risk',
        impact: 'Low',
        description: 'Potential regulatory changes in key markets',
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2 text-green-600 mb-4">
            <TrendingUp size={20} />
            <h3 className="text-lg font-medium">Bull Case</h3>
          </div>
          <div className="space-y-4">
            {catalysts.bull.map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-gray-900">{item.title}</h4>
                  <span className="px-2 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                    {item.impact}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 text-red-600 mb-4">
            <TrendingDown size={20} />
            <h3 className="text-lg font-medium">Bear Case</h3>
          </div>
          <div className="space-y-4">
            {catalysts.bear.map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-gray-900">{item.title}</h4>
                  <span className="px-2 py-1 text-sm bg-red-100 text-red-800 rounded-full">
                    {item.impact}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCatalysts; 