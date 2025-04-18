import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudLightning, CloudSnow } from 'lucide-react';

const Weather = () => {
    const [weather, setWeather] = useState({
        temp: 22,
        condition: 'sunny',
        humidity: 65,
        wind: 12
    });

    const getWeatherIcon = (condition) => {
        switch (condition) {
            case 'sunny':
                return <Sun className="h-8 w-8 text-yellow-500" />;
            case 'cloudy':
                return <Cloud className="h-8 w-8 text-gray-500" />;
            case 'rainy':
                return <CloudRain className="h-8 w-8 text-blue-500" />;
            case 'stormy':
                return <CloudLightning className="h-8 w-8 text-purple-500" />;
            case 'snowy':
                return <CloudSnow className="h-8 w-8 text-blue-300" />;
            default:
                return <Sun className="h-8 w-8 text-yellow-500" />;
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Weather</h2>
                <div className="text-sm text-gray-500">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
            </div>

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                    {getWeatherIcon(weather.condition)}
                    <div>
                        <div className="text-3xl font-bold text-gray-900">{weather.temp}°C</div>
                        <div className="text-sm text-gray-500 capitalize">{weather.condition}</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm text-gray-500">Humidity</div>
                    <div className="text-lg font-semibold text-gray-900">{weather.humidity}%</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm text-gray-500">Wind</div>
                    <div className="text-lg font-semibold text-gray-900">{weather.wind} km/h</div>
                </div>
            </div>
        </div>
    );
};

export default Weather; 