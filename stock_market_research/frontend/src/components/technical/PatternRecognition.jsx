import React from 'react';
import { Clock } from 'lucide-react';

const getStatusBadge = (status) => {
  if (status === 'confirmed') return 'bg-blue-900 text-white';
  if (status === 'completed') return 'bg-green-900 text-white';
  return 'bg-yellow-100 text-yellow-800';
};

const PatternRecognition = ({ data }) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <h3 className="text-lg font-semibold mb-4">Pattern Recognition</h3>
    <div className="space-y-4">
      {(data || [
        { name: 'Cup and Handle', timeframe: '-', probability: '-', status: '-' },
        { name: 'Ascending Triangle', timeframe: '-', probability: '-', status: '-' },
        { name: 'Bull Flag', timeframe: '-', probability: '-', status: '-' }
      ]).map((pattern, idx) => (
        <div key={pattern.name || idx} className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <div className="font-medium text-gray-900">{pattern.pattern || pattern.name}</div>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Clock className="w-4 h-4 mr-1" />
              Timeframe: {pattern.timeframe}
            </div>
          </div>
          <div className="flex items-center">
            <div className="mr-4">
              <div className="text-sm text-gray-500">Probability</div>
              <div className="font-medium text-gray-900">{pattern.probability}%</div>
            </div>
            <span className={`px-3 py-1 text-sm rounded-full font-semibold ${getStatusBadge(pattern.status)}`}>
              {pattern.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default PatternRecognition; 