import React from 'react';

const NewsArticle = ({ article }) => (
  <div className="bg-white rounded-lg shadow-sm p-4">
    <div className="font-bold text-lg mb-1">{article.title}</div>
    <div className="text-gray-500 text-xs mb-2">{article.source} • {article.time}</div>
    <div className="text-gray-700">{article.summary}</div>
  </div>
);

export default NewsArticle; 