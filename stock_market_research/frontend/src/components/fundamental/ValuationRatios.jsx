import React from 'react';
import { Calculator } from 'lucide-react';

const ValuationRatios = () => {
  const ratios = [
    {
      name: 'P/E Ratio',
      value: '25.4',
      industry: '22.1',
      description: 'Price to Earnings Ratio',
    },
    {
      name: 'P/B Ratio',
      value: '3.2',
      industry: '2.8',
      description: 'Price to Book Ratio',
    },
    {
      name: 'EV/EBITDA',
      value: '15.6',
      industry: '14.2',
      description: 'Enterprise Value to EBITDA',
    },
    {
      name: 'Dividend Yield',
      value: '2.1%',
      industry: '1.8%',
      description: 'Annual Dividend Yield',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-purple-600">
        <Calculator size={20} />
        <h3 className="text-lg font-medium">Valuation Ratios</h3>
      </div>
      <div className="grid gap-4">
        {ratios.map((ratio, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-gray-900">{ratio.name}</h4>
                <p className="text-sm text-gray-500">{ratio.description}</p>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-900">{ratio.value}</div>
                <div className="text-sm text-gray-500">Industry: {ratio.industry}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ValuationRatios; 