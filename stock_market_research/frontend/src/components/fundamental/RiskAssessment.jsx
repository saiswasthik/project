import React from 'react';
import { AlertTriangle, Shield } from 'lucide-react';

const RiskAssessment = () => {
  const risks = [
    {
      category: 'Moderate Risks',
      items: [
        'High valuation multiples',
        'Dependence on iPhone sales',
        'Regulatory scrutiny'
      ]
    }
  ];

  const strengths = [
    {
      category: 'Strengths',
      items: [
        'Strong brand loyalty',
        'Diversified revenue streams',
        'Excellent cash generation'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Risks Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-yellow-600">
          <AlertTriangle size={20} />
          <h3 className="text-lg font-medium">Risk Assessment</h3>
        </div>
        {risks.map((section, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">{section.category}</h4>
            <ul className="list-disc list-inside space-y-2">
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex} className="text-gray-600">{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Strengths Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-green-600">
          <Shield size={20} />
          <h3 className="text-lg font-medium">Company Strengths</h3>
        </div>
        {strengths.map((section, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">{section.category}</h4>
            <ul className="list-disc list-inside space-y-2">
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex} className="text-gray-600">{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiskAssessment; 