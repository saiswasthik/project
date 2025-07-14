import React from 'react';
import { Calculator, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const ValuationRatios = ({ data }) => {
  // Use provided data or fallback to sample data
  const ratios = data || [
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

  const getComparisonIcon = (value, industry) => {
    const val = parseFloat(value.replace('%', ''));
    const ind = parseFloat(industry.replace('%', ''));
    
    if (val > ind) return <TrendingUp className="w-4 h-4 text-orange-500" />;
    if (val < ind) return <TrendingDown className="w-4 h-4 text-green-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getComparisonText = (value, industry) => {
    const val = parseFloat(value.replace('%', ''));
    const ind = parseFloat(industry.replace('%', ''));
    
    if (val > ind) return 'Above Industry';
    if (val < ind) return 'Below Industry';
    return 'Industry Average';
  };

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-100 rounded-2xl shadow-xl p-8 border border-emerald-200">
      <div className="flex items-center mb-6">
        <Calculator className="w-8 h-8 text-emerald-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-800">Valuation Ratios</h2>
      </div>
      <div className="grid gap-6">
        {ratios.map((ratio, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h4 className="font-bold text-gray-900 text-lg">{ratio.name}</h4>
                  {getComparisonIcon(ratio.value, ratio.industry)}
                </div>
                <p className="text-sm text-gray-600 mb-3">{ratio.description}</p>
                <div className="text-xs text-gray-500 font-medium">
                  {getComparisonText(ratio.value, ratio.industry)}
                </div>
              </div>
              <div className="text-right ml-6">
                <div className="text-2xl font-bold text-gray-900 mb-1">{ratio.value}</div>
                <div className="text-sm text-gray-500">
                  Industry: <span className="font-medium">{ratio.industry}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ValuationRatios; 