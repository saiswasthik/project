const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.PROD 
    ? 'https://stock-market-live-data.onrender.com/api'
    : 'http://127.0.0.1:8000/api'
  );

export const fetchFundamentalData = async (symbol) => {
  const response = await fetch(`${API_BASE_URL}/fundamental/${encodeURIComponent(symbol)}`);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

export const fetchNewsData = async (symbol) => {
  const response = await fetch(`${API_BASE_URL}/news/${encodeURIComponent(symbol)}`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

export const fetchSentimentData = async (symbol) => {
  const response = await fetch(`${API_BASE_URL}/sentiment/${encodeURIComponent(symbol)}`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

export const fetchTechnicalData = async (symbol) => {
  const response = await fetch(`${API_BASE_URL}/technical/${encodeURIComponent(symbol)}`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

export const fetchScreenerData = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters);
  const response = await fetch(`${API_BASE_URL}/screener/filter?${queryParams}`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

export const fetchTopStocksData = async () => {
  const response = await fetch(`${API_BASE_URL}/top-stocks`);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

export const fetchSymbolSuggestions = async (query) => {
  const response = await fetch(`${API_BASE_URL}/fundamental/suggest-symbol/${encodeURIComponent(query)}`);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}; 