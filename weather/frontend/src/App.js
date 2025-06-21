import React, { useState, useEffect } from 'react';
import CurrentWeather from './components/CurrentWeather';
import WeatherDetails from './components/WeatherDetails';
import Forecast from './components/Forecast';
import { Search } from 'lucide-react';

function App() {
  const [city, setCity] = useState('hyderabad');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true); // Start loading initially
  const [error, setError] = useState(null);

  const handleSearch = async (searchCity) => {
    if (!searchCity.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://127.0.0.1:8000/weather/${encodeURIComponent(searchCity.trim())}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'An unknown API error occurred.' }));
        throw new Error(errorData.error || 'City not found or API error');
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setWeatherData(data);
    } catch (err) {
      setError(err.message);
      setWeatherData(null); // Clear old data on error
    } finally {
      setLoading(false);
    }
  };

  // Auto-search on component mount
  useEffect(() => {
    handleSearch(city);
  }, []);

  const onSearchClick = () => {
    handleSearch(city);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-indigo-600 p-4 sm:p-6 md:p-8 text-white font-sans">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 sm:mb-8">Weather Forecast</h1>
        
        {/* Search Bar */}
        <div className="mb-8 max-w-xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name (e.g., Hyderabad, New York, London)"
              className="w-full bg-white/10 backdrop-blur-sm rounded-lg py-3 px-5 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
              onKeyPress={(e) => e.key === 'Enter' && onSearchClick()}
            />
            <button 
              onClick={onSearchClick}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-md px-4 py-2 text-sm flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
              disabled={loading}
            >
              <Search size={16} />
              <span>Search Weather</span>
            </button>
          </div>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
            <p className="mt-4 text-lg">Fetching Weather Data...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center bg-red-800/50 rounded-lg p-4 max-w-md mx-auto">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}
        
        {weatherData && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Current Weather (takes 2 columns) */}
                <div className="lg:col-span-2 bg-white/20 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
                    <CurrentWeather data={weatherData} />
                </div>
                {/* Weather Details (takes 1 column) */}
                <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
                    <WeatherDetails data={weatherData} />
                </div>
            </div>

            {/* 5-Day Forecast */}
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
                <Forecast data={weatherData} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
