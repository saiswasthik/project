import React from 'react';

const SentimentMetrics = ({ data }) => {
  if (!data) return null;

  // Defensive: handle array or number for sentiment_score
  const score = Array.isArray(data.sentiment_score)
    ? data.sentiment_score[0]
    : (typeof data.sentiment_score === 'number' ? data.sentiment_score : 0);

  // Defensive: handle percent or decimal for accuracy
  const accuracy = typeof data.sentiment_accuracy === 'number'
    ? (data.sentiment_accuracy > 1 ? data.sentiment_accuracy : data.sentiment_accuracy * 100)
    : 0;

  // Determine sentiment label
  const sentimentLabel =
    score >= 0.6 ? 'Positive' :
    score >= 0.3 ? 'Mildly Positive' :
    score >= 0 ? 'Neutral' :
    'Negative';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
      <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center">
        <span className="text-3xl font-bold text-green-600">{score > 0 ? '+' : ''}{score.toFixed(2)}</span>
        <span className="text-gray-700 mt-2">Overall Sentiment Score</span>
        <span className="mt-2 px-3 py-1 rounded-full bg-black text-white text-xs font-semibold">{sentimentLabel}</span>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center">
        <span className="text-3xl font-bold text-blue-600">{data.articles_analyzed?.toLocaleString()}</span>
        <span className="text-gray-700 mt-2">Articles Analyzed</span>
        <span className="mt-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">Last 7 Days</span>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center">
        <span className="text-3xl font-bold text-purple-600">{accuracy.toFixed(1)}%</span>
        <span className="text-gray-700 mt-2">Sentiment Accuracy</span>
        <span className="mt-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-semibold">{data.confidence_level || 'Confidence'}</span>
      </div>
    </div>
  );
};

export default SentimentMetrics; 