import React from 'react';

const GuideItem = ({ title, description, icon }) => (
  <div className="flex items-start space-x-3">
    <span className="text-xl mt-1">{icon}</span>
    <div>
      <h4 className="font-medium text-gray-900">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  </div>
);

const SentimentGuide = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <span className="mr-2">📖</span> Sentiment Guide
      </h3>
      <div className="space-y-4">
        <GuideItem
          title="Bullish Sentiment"
          description={data.bullish}
          icon="🚀"
        />
        <GuideItem
          title="Neutral Sentiment"
          description={data.neutral}
          icon="➡️"
        />
        <GuideItem
          title="Bearish Sentiment"
          description={data.bearish}
          icon="📉"
        />
      </div>
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">{data.note}</p>
      </div>
    </div>
  );
};

export default SentimentGuide; 