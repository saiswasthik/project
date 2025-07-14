import React from 'react';
import { AlertTriangle, Shield } from 'lucide-react';

const RiskAssessment = ({ data }) => {
  // Default fallback data if no props provided
  const defaultRisks = [
    'High valuation multiples',
    'Dependence on iPhone sales',
    'Regulatory scrutiny'
  ];

  const defaultStrengths = [
    'Strong brand loyalty',
    'Diversified revenue streams',
    'Excellent cash generation'
  ];

  // Use dynamic data if provided, otherwise use defaults
  // API returns: { key_risks: [...], key_strengths: [...] }
  const risks = data?.key_risks || defaultRisks;
  const strengths = data?.key_strengths || defaultStrengths;

  return (
    <div className="space-y-6">
      {/* Risks Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-yellow-600">
          <AlertTriangle size={20} />
          <h3 className="text-lg font-medium">Risk Assessment</h3>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Key Risks</h4>
          <ul className="list-disc list-inside space-y-2">
            {risks.map((risk, index) => (
              <li key={index} className="text-gray-600">{risk}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Strengths Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-green-600">
          <Shield size={20} />
          <h3 className="text-lg font-medium">Company Strengths</h3>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Key Strengths</h4>
          <ul className="list-disc list-inside space-y-2">
            {strengths.map((strength, index) => (
              <li key={index} className="text-gray-600">{strength}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RiskAssessment; 