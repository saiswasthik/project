import React from 'react';

const TechnicalSummary = ({ data }) => (
  <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
    <h3 className="text-lg font-semibold mb-4 text-green-700">Technical Summary</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h4 className="font-medium text-gray-900 mb-2">Short-term Outlook</h4>
        <p className="text-gray-600">
          {data ? data.short_term_outlook : '—'}
        </p>
      </div>
      <div>
        <h4 className="font-medium text-gray-900 mb-2">Key Levels</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Support:</span>
            <span className="font-medium">{data && data.key_levels ? data.key_levels.support : '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Resistance:</span>
            <span className="font-medium">{data && data.key_levels ? data.key_levels.resistance : '—'}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default TechnicalSummary; 