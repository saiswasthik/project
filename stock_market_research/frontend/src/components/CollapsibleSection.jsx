import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const CollapsibleSection = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left"
      >
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <ChevronDown
          size={20}
          className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
};

export default CollapsibleSection; 