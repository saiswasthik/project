import React from 'react';
import { ArrowLeft, Settings, LogOut } from 'lucide-react';

const Header = ({ onBackToHome, onSettingsClick, onLogout }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Stock Market Research Dashboard</h1>
      <p className="text-gray-600 mt-2">Comprehensive analysis and insights for informed investment decisions</p>
        </div>
        <div className="flex items-center gap-3">
          {onSettingsClick && (
            <button
              onClick={onSettingsClick}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Settings size={18} />
              <span>Settings</span>
            </button>
          )}
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft size={18} />
              <span>Back to Home</span>
            </button>
          )}
          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header; 