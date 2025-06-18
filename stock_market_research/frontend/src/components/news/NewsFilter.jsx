import React from 'react';

const NewsFilter = () => (
  <div className="flex space-x-2 mb-4">
    {/* Filter buttons go here */}
    <button className="px-3 py-1 rounded bg-blue-600 text-white">All News</button>
    <button className="px-3 py-1 rounded bg-gray-100 text-gray-800">Earnings</button>
    <button className="px-3 py-1 rounded bg-gray-100 text-gray-800">Products</button>
    <button className="px-3 py-1 rounded bg-gray-100 text-gray-800">Analyst</button>
    <button className="px-3 py-1 rounded bg-gray-100 text-gray-800">Regulatory</button>
  </div>
);

export default NewsFilter; 