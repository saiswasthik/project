import React from 'react';
import { Thermometer, Wind, Droplets } from 'lucide-react';

const WeatherDetails = ({ data }) => {
  if (!data || !data.current_weather) {
    return <div className="p-4 text-center">Loading details...</div>;
  }

  const { current_weather } = data;

  const details = [
    {
      icon: <Thermometer size={20} className="text-white/80" />,
      label: "Feels like",
      value: `${Math.round(current_weather.feels_like)}°C`
    },
    {
      icon: <Wind size={20} className="text-white/80" />,
      label: "Wind Speed",
      value: `${current_weather.wind_speed} km/h`
    },
    {
      icon: <Droplets size={20} className="text-white/80" />,
      label: "Humidity",
      value: `${current_weather.humidity}%`
    }
  ];

  return (
    <div className="flex flex-col justify-between h-full">
      <h2 className="text-xl font-bold mb-4">Weather Details</h2>
      <div className="space-y-4">
        {details.map(detail => (
          <div key={detail.label} className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              {detail.icon}
              <span className="text-white/90">{detail.label}</span>
            </div>
            <span className="font-semibold">{detail.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherDetails; 