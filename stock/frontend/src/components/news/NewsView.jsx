import React, { useState } from 'react';
import { fetchNewsData } from '../../config/api';
import NewsHeader from './NewsHeader';
import NewsSearch from './NewsSearch';
import NewsFilter from './NewsFilter';
import NewsList from './NewsList';
import DailyDigest from './DailyDigest';

const NewsView = ({ symbol }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div className="space-y-6">
      <NewsHeader symbol={symbol} />
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <NewsSearch onSearch={handleSearch} />
          <NewsFilter activeTab={activeTab} onTabChange={handleTabChange} />
      </div>

        {activeTab === 'digest' ? (
          <DailyDigest symbol={symbol} />
      ) : (
          <NewsList symbol={symbol} />
          )}
        </div>
    </div>
  );
};

export default NewsView; 