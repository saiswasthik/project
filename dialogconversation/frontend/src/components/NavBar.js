import React from 'react';

const NavBar = ({ user, onLogout }) => (
  <div className="w-full shadow-lg bg-gradient-to-r from-purple-400 to-blue-500 mb-6 hover:shadow-2xl transition-shadow duration-300">
    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl hover:bg-purple-600 hover:shadow-lg transition-all duration-200 cursor-pointer">🗨️</div>
        <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-purple-600">ConversationAI</span>
      </div>
      <div className="flex items-center space-x-6">
        {/* <button className="border border-gray-300 px-6 py-3 rounded-lg flex items-center space-x-2 bg-white hover:bg-gray-50 hover:border-gray-400 hover:shadow-lg transition-all duration-200 shadow-sm">
          <span>⏲️</span> 
          <span>History</span>
        </button> */}
        <span className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 hover:shadow-md transition-all duration-200 cursor-pointer px-3 py-2 rounded-lg bg-white/20">
          <span>👤</span>
          <span>{user?.email || 'User'}</span>
        </span>
        <button 
          className="border border-gray-300 px-6 py-3 rounded-lg flex items-center space-x-2 bg-white hover:bg-gray-50 hover:border-gray-400 hover:shadow-lg transition-all duration-200 shadow-sm"
          onClick={onLogout}
        >
          <span>⏎</span> 
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  </div>
);

export default NavBar; 