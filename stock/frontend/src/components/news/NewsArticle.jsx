import React from 'react';

const NewsArticle = ({ article }) => {
  const handleClick = () => {
    if (article.url && article.url !== '#') {
      window.open(article.url, '_blank', 'noopener,noreferrer');
    }
  };

  const isClickable = article.url && article.url !== '#';

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow">
      <div 
        className={`font-bold text-lg mb-1 ${isClickable ? 'text-blue-600 hover:text-blue-800 cursor-pointer' : 'text-gray-900'}`}
        onClick={handleClick}
      >
        {article.title}
        {isClickable && (
          <span className="ml-2 text-sm text-gray-400">↗</span>
        )}
      </div>
      <div className="text-gray-500 text-xs mb-2">
        {article.source} • {new Date(article.published_at).toLocaleDateString()}
      </div>
      <div className="text-gray-700 text-sm leading-relaxed">{article.summary}</div>
      {isClickable && (
        <div className="mt-2 text-xs text-blue-600">
          Click to read full article
        </div>
      )}
    </div>
  );
};

export default NewsArticle; 