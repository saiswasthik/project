import React, { useState } from 'react';
import ScreenerFilters from './ScreenerFilters';
import ScreenerResults from './ScreenerResults';
import api from '../../config/api';

const initialFilters = {
  pe: [0, 50],
  pb: [0, 10],
  growth: [0, 100],
  yield: [0, 10],
  debt: [0, 200],
  sectors: [],
  countries: [],
};

const sectorOptions = [
  'Technology', 'Healthcare', 'Finance', 'Consumer', 'Energy', 'Industrials'
];
const countryOptions = [
  'USA', 'Canada', 'UK', 'Germany', 'Japan', 'Australia'
];

const ratingColors = {
  'Strong Buy': 'bg-green-100 text-green-800',
  'Buy': 'bg-blue-100 text-blue-800',
  'Hold': 'bg-gray-100 text-gray-800',
};

const Screener = () => {
  const [filters, setFilters] = useState(initialFilters);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRange = (key, min, max) => {
    setFilters(f => ({ ...f, [key]: [min, max] }));
  };
  const handleCheckbox = (key, value) => {
    setFilters(f => {
      const arr = f[key].includes(value)
        ? f[key].filter(v => v !== value)
        : [...f[key], value];
      return { ...f, [key]: arr };
    });
  };
  const applyFilters = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/screener', {
        pe_min: filters.pe[0],
        pe_max: filters.pe[1],
        pb_min: filters.pb[0],
        pb_max: filters.pb[1],
        growth_min: filters.growth[0],
        growth_max: filters.growth[1],
        div_yield_min: filters.yield[0],
        div_yield_max: filters.yield[1],
        de_min: filters.debt[0],
        de_max: filters.debt[1],
        sectors: filters.sectors,
        countries: filters.countries.length > 0 ? filters.countries : ['India'],
      });
      setFiltered(
        (response.data.results || []).map(s => ({
          symbol: s.symbol,
          company: s.company,
          price: s.price,
          change: parseFloat((s.change || '0').replace('%', '').replace('+', '')),
          pe: s.pe,
          pb: s.pb,
          growth: parseFloat((s.growth || '0').replace('%', '')),
          yield: parseFloat((s.div_yield || '0').replace('%', '')),
          marketCap: s.market_cap,
          rating: s.rating,
          forum: s.forum_link || '#',
        }))
      );
    } catch (err) {
      setError('Failed to fetch screener results');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-8">
      <ScreenerFilters
        filters={filters}
        handleRange={handleRange}
        handleCheckbox={handleCheckbox}
        applyFilters={applyFilters}
      />
      <div className="flex-1">
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-500">{error}</div>}
        <ScreenerResults filtered={filtered} />
      </div>
    </div>
  );
};

export default Screener; 