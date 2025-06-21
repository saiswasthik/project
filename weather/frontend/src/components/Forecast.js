import React from 'react';
import { Sun, Cloud, CloudRain, CloudSun, Droplet, CloudSnow, CloudLightning } from 'lucide-react';

const ForecastIcon = ({ condition, size = 32 }) => {
    const lowerCondition = condition.toLowerCase();
    
    let IconComponent = CloudSun; // Default icon
    const iconProps = { size, className: "mx-auto text-white/90 drop-shadow-lg" };
  
    if (lowerCondition.includes('rain')) IconComponent = CloudRain;
    else if (lowerCondition.includes('sunny') || lowerCondition.includes('clear')) IconComponent = Sun;
    else if (lowerCondition.includes('cloud')) IconComponent = Cloud;
    else if (lowerCondition.includes('snow')) IconComponent = CloudSnow;
    else if (lowerCondition.includes('thunder')) IconComponent = CloudLightning;
    
    return <IconComponent {...iconProps} />;
};

const Forecast = ({ data }) => {
  if (!data || !data.forecast || data.forecast.length === 0) {
    return (
      <div className="py-8 text-center">
        <p>No forecast data available.</p>
      </div>
    );
  }

  const { forecast } = data;

  const getDayName = (dateString, index) => {
    if (index === 0) return "Tomorrow";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">5-Day Forecast</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {forecast.map((day, index) => (
          <div key={index} className="text-center bg-white/10 rounded-lg p-4 transition-all duration-300 hover:bg-white/20 hover:scale-105">
            <p className="font-semibold text-lg">
                {getDayName(day.date, index)}
            </p>
            <p className="text-sm text-white/70 mb-2">
                {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
            <div className="my-2">
              <ForecastIcon condition={day.condition} />
            </div>
            <p className="text-sm capitalize text-white/80 mb-2">{day.condition}</p>
            <div className="flex justify-center items-baseline gap-2">
                <p className="text-xl font-bold">{day.temp_max}°</p>
                <p className="text-white/60">{day.temp_min}°</p>
            </div>
            <div className="flex items-center justify-center gap-1 mt-2 text-sm text-sky-300">
                <Droplet size={14} />
                <span>{day.pop}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast; 