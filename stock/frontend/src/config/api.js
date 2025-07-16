const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.PROD 
    ? 'https://stock.nicefield-a95bbc97.southcentralus.azurecontainerapps.io/api'
    : 'http://127.0.0.1:8000/api'
  );

console.log('🌐 API_BASE_URL:', API_BASE_URL);
console.log('🌐 Environment:', import.meta.env.MODE);
console.log('🌐 VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);

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
  const url = `${API_BASE_URL}/fundamental/suggest-symbol/${encodeURIComponent(query)}`;
  console.log('🔍 Fetching symbol suggestions from:', url);
  
  const response = await fetch(url);
  
  console.log('📡 Response status:', response.status);
  console.log('📡 Response ok:', response.ok);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('❌ Suggestions API error:', errorData);
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  console.log('✅ Suggestions API success:', data);
  return data;
}; 