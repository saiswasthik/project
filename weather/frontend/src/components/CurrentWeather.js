import React from 'react';
import { Sun, Cloud, CloudRain, CloudSun, CloudSnow, CloudLightning } from 'lucide-react';

const WeatherIcon = ({ condition, size = 128 }) => {
  const lowerCondition = condition.toLowerCase();
  
  let IconComponent = CloudSun; // Default icon
  const iconProps = { size, className: "text-yellow-300 drop-shadow-lg" };

  if (lowerCondition.includes('rain')) IconComponent = CloudRain;
  else if (lowerCondition.includes('sunny') || lowerCondition.includes('clear')) IconComponent = Sun;
  else if (lowerCondition.includes('cloud')) IconComponent = Cloud;
  else if (lowerCondition.includes('snow')) IconComponent = CloudSnow;
  else if (lowerCondition.includes('thunder')) IconComponent = CloudLightning;
  
  return <IconComponent {...iconProps} />;
};


const CurrentWeather = ({ data }) => {
  if (!data || !data.current_weather) {
    return <div className="p-8 text-center">Loading current weather...</div>;
  }

  const { city, current_weather } = data;
  
  return (
    <div className="flex justify-between items-center h-full">
        {/* Left Side: Weather Info */}
        <div className="flex flex-col justify-between h-full">
            <div>
                <p className="text-2xl">Today</p>
                <p className="text-lg text-white/80">{city}</p>
            </div>
            <div>
                <p className="text-7xl font-bold">{Math.round(current_weather.temperature)}°C</p>
                <p className="text-xl capitalize">{current_weather.condition}</p>
            </div>
        </div>
        {/* Right Side: Weather Icon */}
        <div className="flex items-center">
            <WeatherIcon condition={current_weather.condition} />
        </div>
    </div>
  );
};

export default CurrentWeather; 