import React from 'react';

const MetricCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-lg p-4 shadow-sm">
    <div className="flex items-center justify-between mb-2">
      <h4 className="text-sm font-medium text-gray-600">{title}</h4>
      <span className="text-xl">{icon}</span>
    </div>
    <p className={`text-2xl font-semibold ${color}`}>{value}</p>
  </div>
);

const OverallMetrics = ({ data }) => {
  if (!data) return null;

  // Defensive: handle array or number for sentiment_score
  const score = Array.isArray(data.sentiment_score)
    ? data.sentiment_score[0]
    : (typeof data.sentiment_score === 'number' ? data.sentiment_score : 0);

  // Defensive: handle percent or decimal for accuracy
  const accuracy = typeof data.sentiment_accuracy === 'number'
    ? (data.sentiment_accuracy > 1 ? data.sentiment_accuracy / 100 : data.sentiment_accuracy)
    : 0;

  const getSentimentColor = (score) => {
    if (score >= 0.6) return 'text-green-600';
    if (score >= 0.3) return 'text-blue-600';
    if (score >= 0) return 'text-gray-600';
    return 'text-red-600';
  };

  const getSentimentEmoji = (score) => {
    if (score >= 0.6) return '🚀';
    if (score >= 0.3) return '📈';
    if (score >= 0) return '➡️';
    return '📉';
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <span className="mr-2">📊</span> Overall Metrics
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Overall Sentiment Score"
          value={`${(score * 100).toFixed(1)}%`}
          icon={getSentimentEmoji(score)}
          color={getSentimentColor(score)}
        />
        <MetricCard
          title="Articles Analyzed"
          value={data.articles_analyzed}
          icon="📰"
          color="text-blue-600"
        />
        <MetricCard
          title="Sentiment Accuracy"
          value={`${(accuracy * 100).toFixed(1)}%`}
          icon="🎯"
          color="text-purple-600"
        />
      </div>
    </div>
  );
};

export default OverallMetrics; 