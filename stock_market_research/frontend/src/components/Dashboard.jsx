import React, { useState } from 'react';
import SearchPanel from './SearchPanel';
import TabNavigation from './TabNavigation';
import FundamentalAnalysis from './fundamental/FundamentalAnalysis';
import TechnicalAnalysis from './technical/TechnicalAnalysis';
import SentimentAnalysis from './sentiment/SentimentAnalysis';
import NewsView from './news/NewsView';
import Screener from './screener/Screener';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('fundamental');
  const [stockSymbol, setStockSymbol] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(true);

  const handleSearch = (symbol) => {
    setStockSymbol(symbol);
    setShowAnalysis(true);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <SearchPanel onSearch={handleSearch} />
        
        {showAnalysis && (
          <div className="bg-blue-50 p-4 border-t border-blue-100">
            <h3 className="text-lg font-medium text-blue-800">Analyzing: {stockSymbol || 'Select a stock'}</h3>
            {stockSymbol && <p className="text-blue-600 text-sm">Showing comprehensive analysis for {stockSymbol}</p>}
          </div>
        )}
      </div>

      <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

      {activeTab === 'fundamental' && showAnalysis && (
        <div className="space-y-6">
          <FundamentalAnalysis stockSymbol={stockSymbol} />
        </div>
      )}

      {activeTab === 'technical' && showAnalysis && (
        <TechnicalAnalysis stockSymbol={stockSymbol} />
      )}

      {activeTab === 'sentiment' && showAnalysis && (
        <SentimentAnalysis stockSymbol={stockSymbol} />
      )}

      {activeTab === 'news' && showAnalysis && (
        <NewsView stockSymbol={stockSymbol} />
      )}

      {activeTab === 'screener' && showAnalysis && (
        <Screener />
      )}
    </div>
  );
};

export default Dashboard; 