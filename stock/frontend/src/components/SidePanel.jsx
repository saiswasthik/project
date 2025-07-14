import React from 'react';
import { BarChart2, TrendingUp, Filter, Settings, GitCompare } from 'lucide-react';

const SidePanel = ({ activeSection, onSectionChange }) => {
  const sections = [
    { id: 'fundamental', label: 'Fundamental', icon: <BarChart2 size={20} /> },
    // { id: 'screener', label: 'Screener', icon: <Filter size={20} /> },
  ];

  return (
    <div className="w-64 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Analysis Tools</h2>
      
      <nav className="space-y-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors ${
              activeSection === section.id
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <span className="mr-3">{section.icon}</span>
            {section.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default SidePanel; 