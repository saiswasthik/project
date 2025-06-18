import React from 'react';
import { BarChart2, TrendingUp, LineChart, Newspaper, Filter } from 'lucide-react';

const TabNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'fundamental', label: 'Fundamental', icon: <BarChart2 size={18} /> },
    { id: 'technical', label: 'Technical', icon: <TrendingUp size={18} /> },
    { id: 'sentiment', label: 'Sentiment', icon: <LineChart size={18} /> },
    { id: 'news', label: 'News', icon: <Newspaper size={18} /> },
    { id: 'screener', label: 'Screener', icon: <Filter size={18} /> },
  ];

  return (
    <div className="border-b border-gray-200">
      <nav className="flex overflow-x-auto no-scrollbar justify-between" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
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
  );
};

export default TabNavigation; 