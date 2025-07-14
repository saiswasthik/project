import React from 'react';

const NewsCard = ({ article }) => {
  const getSentimentColor = (sentiment) => {
    switch (sentiment.toLowerCase()) {
      case 'bullish':
        return 'text-green-600';
      case 'bearish':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getSentimentEmoji = (sentiment) => {
    switch (sentiment.toLowerCase()) {
      case 'bullish':
        return '🚀';
      case 'bearish':
        return '📉';
      default:
        return '➡️';
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-lg font-medium text-gray-900">{article.title}</h4>
        <span className={`flex items-center ${getSentimentColor(article.sentiment)}`}>
          <span className="mr-1">{getSentimentEmoji(article.sentiment)}</span>
          <span className="text-sm font-medium">{article.sentiment}</span>
        </span>
      </div>
      <p className="text-gray-600 text-sm mb-3">{article.summary}</p>
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>{article.source}</span>
        <span>{article.date}</span>
      </div>
    </div>
  );
};

const RecentNews = ({ data }) => {
  if (!data || !data.length) return null;

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <span className="mr-2">📰</span> Recent News
      </h3>
      <div className="space-y-4">
        {data.map((article, index) => (
          <NewsCard key={index} article={article} />
        ))}
      </div>
    </div>
  );
};

export default RecentNews; 