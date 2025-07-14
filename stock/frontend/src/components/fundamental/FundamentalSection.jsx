import React, { useState } from 'react';
import { BarChart2, TrendingUp, LineChart, Newspaper } from 'lucide-react';
import FundamentalAnalysis from './FundamentalAnalysis';
import TechnicalAnalysis from '../technical/TechnicalAnalysis';
import SentimentAnalysis from '../sentiment/SentimentAnalysis';
import NewsView from '../news/NewsView';

const FundamentalSection = ({ stockSymbol, onSymbolResolved }) => {
  const [activeSubTab, setActiveSubTab] = useState('fundamental');

  const subTabs = [
    { id: 'fundamental', label: 'Fundamental', icon: <BarChart2 size={16} /> },
    { id: 'technical', label: 'Technical', icon: <TrendingUp size={16} /> },
    { id: 'sentiment', label: 'Sentiment', icon: <LineChart size={16} /> },
    { id: 'news', label: 'News', icon: <Newspaper size={16} /> },
  ];

  const renderSubTabContent = () => {
    switch (activeSubTab) {
      case 'fundamental':
        return <FundamentalAnalysis symbol={stockSymbol} />;
      case 'technical':
        return <TechnicalAnalysis symbol={stockSymbol} />;
      case 'sentiment':
        return <SentimentAnalysis symbol={stockSymbol} />;
      case 'news':
        return <NewsView symbol={stockSymbol} />;
      default:
        return <FundamentalAnalysis symbol={stockSymbol} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto no-scrollbar" aria-label="Sub Tabs">
            {subTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeSubTab === tab.id
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Sub-tab Content */}
      <div className="space-y-6">
        {renderSubTabContent()}
      </div>
    </div>
  );
};

export default FundamentalSection; 