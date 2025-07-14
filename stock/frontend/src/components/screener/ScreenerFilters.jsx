import React from 'react';

const sectorOptions = [
  'Technology', 'Healthcare', 'Finance', 'Consumer', 'Energy', 'Industrials'
];
const countryOptions = [
  'USA', 'Canada', 'UK', 'Germany', 'Japan', 'Australia'
];

const ScreenerFilters = ({ filters, handleRange, handleCheckbox, applyFilters }) => (
  <div className="w-80 bg-white rounded-xl p-6 border border-gray-200 flex-shrink-0">
    <h2 className="text-xl font-bold mb-4">Filters</h2>
    {/* Sliders */}
    <div className="mb-4">
      <label className="block font-medium mb-1">P/E Ratio: {filters.pe[0]} - {filters.pe[1]}</label>
      <input type="range" min={0} max={50} value={filters.pe[1]} onChange={e => handleRange('pe', 0, +e.target.value)} className="w-full accent-blue-900" />
    </div>
    <div className="mb-4">
      <label className="block font-medium mb-1">P/B Ratio: {filters.pb[0]} - {filters.pb[1]}</label>
      <input type="range" min={0} max={10} value={filters.pb[1]} onChange={e => handleRange('pb', 0, +e.target.value)} className="w-full accent-blue-900" />
    </div>
    <div className="mb-4">
      <label className="block font-medium mb-1">Revenue Growth: {filters.growth[0]}% - {filters.growth[1]}%</label>
      <input type="range" min={0} max={100} value={filters.growth[1]} onChange={e => handleRange('growth', 0, +e.target.value)} className="w-full accent-blue-900" />
    </div>
    <div className="mb-4">
      <label className="block font-medium mb-1">Dividend Yield: {filters.yield[0]}% - {filters.yield[1]}%</label>
      <input type="range" min={0} max={10} value={filters.yield[1]} onChange={e => handleRange('yield', 0, +e.target.value)} className="w-full accent-blue-900" />
    </div>
    <div className="mb-4">
      <label className="block font-medium mb-1">Debt/Equity: {filters.debt[0]}% - {filters.debt[1]}%</label>
      <input type="range" min={0} max={200} value={filters.debt[1]} onChange={e => handleRange('debt', 0, +e.target.value)} className="w-full accent-blue-900" />
    </div>
    {/* Sectors */}
    <div className="mb-4">
      <div className="font-medium mb-1">Sectors</div>
      {sectorOptions.map(opt => (
        <div key={opt} className="flex items-center mb-1">
          <input type="checkbox" id={opt} checked={filters.sectors.includes(opt)} onChange={() => handleCheckbox('sectors', opt)} className="mr-2" />
          <label htmlFor={opt}>{opt}</label>
        </div>
      ))}
    </div>
    {/* Countries */}
    <div className="mb-6">
      {/* <div className="font-medium mb-1">Countries</div>
      {countryOptions.map(opt => (
        <div key={opt} className="flex items-center mb-1">
          <input type="checkbox" id={opt} checked={filters.countries.includes(opt)} onChange={() => handleCheckbox('countries', opt)} className="mr-2" />
          <label htmlFor={opt}>{opt}</label>
        </div>
      ))} */}
    </div>
    <button onClick={applyFilters} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition">
      <span className="material-icons">search</span> Apply Filters
    </button>
  </div>
);

export default ScreenerFilters; 