import React from 'react';

const ratingColors = {
  'Strong Buy': 'bg-green-100 text-green-800',
  'Buy': 'bg-blue-100 text-blue-800',
  'Hold': 'bg-gray-100 text-gray-800',
};

const getForumLink = (symbol) =>
  `https://www.screener.in/company/${encodeURIComponent(symbol)}/consolidated/`;

const ScreenerResults = ({ filtered }) => (
  <div>
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-bold">Screened Results</h2>
      <span className="bg-white border border-gray-200 rounded-full px-4 py-1 text-sm font-medium">{filtered.length} stocks found</span>
    </div>
    <div className="bg-white rounded-xl p-4 border border-gray-200 overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-gray-500 text-left">
            <th className="py-2 px-2">Symbol</th>
            <th className="py-2 px-2">Company</th>
            <th className="py-2 px-2">Price</th>
            <th className="py-2 px-2">Change</th>
            <th className="py-2 px-2">P/E</th>
            <th className="py-2 px-2">P/B</th>
            <th className="py-2 px-2">Growth</th>
            <th className="py-2 px-2">Div Yield</th>
            <th className="py-2 px-2">Market Cap</th>
            <th className="py-2 px-2">Rating</th>
            <th className="py-2 px-2">Forum</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((s) => (
            <tr key={s.symbol} className="border-t border-gray-100 hover:bg-gray-50">
              <td className="py-2 px-2 font-semibold">{s.symbol}</td>
              <td className="py-2 px-2">{s.company}</td>
              <td className="py-2 px-2">
                {typeof s.price === 'number'
                  ? `₹${s.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : s.price}
              </td>
              <td className={`py-2 px-2 font-medium ${s.change > 0 ? 'text-green-600' : s.change < 0 ? 'text-red-600' : 'text-gray-700'}`}>{s.change > 0 ? '↗' : s.change < 0 ? '↘' : ''} {s.change > 0 ? '+' : ''}{s.change}%</td>
              <td className="py-2 px-2">{s.pe}</td>
              <td className="py-2 px-2">{s.pb}</td>
              <td className="py-2 px-2">{s.growth}%</td>
              <td className="py-2 px-2">{s.yield}%</td>
              <td className="py-2 px-2">{s.marketCap}</td>
              <td className="py-2 px-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${ratingColors[s.rating] || 'bg-gray-100 text-gray-800'}`}>{s.rating}</span>
              </td>
              <td className="py-2 px-2">
                <a
                  href={`https://www.screener.in/company/${encodeURIComponent(s.symbol)}/consolidated/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'blue',}}
                >
                  🔗
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default ScreenerResults; 