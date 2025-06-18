import React from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Header />
        <Dashboard />
      </div>
    </div>
  );
}

export default App; 