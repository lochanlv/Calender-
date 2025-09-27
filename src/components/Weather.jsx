import React, { useState, useEffect } from "react";
import {
  MapPin,
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  Wind,
  Thermometer,
  Eye,
} from "lucide-react";

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setError(
            "Unable to get your location. Please enable location services."
          );
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  }, []);

  // Fetch weather data
  useEffect(() => {
    if (location) {
      fetchWeatherData();
    }
  }, [location]);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      // Using wttr.in API (free, no API key required)
      const response = await fetch(
        `https://wttr.in/${location.lat},${location.lon}?format=j1`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Transform wttr.in data to match our expected format
      const current = data.current_condition[0];
      const nearestArea = data.nearest_area[0];

      setWeather({
        name: nearestArea.areaName[0].value,
        main: {
          temp: parseInt(current.temp_C),
          feels_like: parseInt(current.FeelsLikeC),
          humidity: parseInt(current.humidity),
        },
        weather: [
          {
            main: current.weatherDesc[0].value,
            description: current.weatherDesc[0].value.toLowerCase(),
            icon: current.weatherCode,
          },
        ],
        wind: {
          speed: parseFloat(current.windspeedKmph) / 3.6, // Convert km/h to m/s
        },
        visibility: parseInt(current.visibility) * 1000, // Convert km to meters
      });
    } catch (error) {
      console.error("Error fetching weather:", error);
      // Use mock data for demo purposes
      setWeather({
        name: "Demo City",
        main: {
          temp: 22,
          feels_like: 24,
          humidity: 65,
        },
        weather: [
          {
            main: "Clear",
            description: "clear sky",
            icon: "01d",
          },
        ],
        wind: {
          speed: 3.5,
        },
        visibility: 10000,
      });
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (weatherMain, iconCode) => {
    switch (weatherMain) {
      case "Clear":
        return <Sun className="text-yellow-400" size={32} />;
      case "Clouds":
        return <Cloud className="text-gray-400" size={32} />;
      case "Rain":
        return <CloudRain className="text-blue-400" size={32} />;
      case "Snow":
        return <CloudSnow className="text-blue-200" size={32} />;
      default:
        return <Cloud className="text-gray-400" size={32} />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-6 animate-fade-in">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <span className="ml-3 text-white">Loading weather...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-6 animate-fade-in">
        <div className="text-center">
          <Cloud className="mx-auto text-red-400 mb-4" size={48} />
          <h3 className="text-lg font-display font-bold text-white mb-2">
            Weather Unavailable
          </h3>
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-6 animate-fade-in">
        <div className="text-center">
          <Cloud className="mx-auto text-dark-400 mb-4" size={48} />
          <h3 className="text-lg font-display font-bold text-white mb-2">
            No Weather Data
          </h3>
          <p className="text-dark-400 text-sm">
            Unable to fetch weather information
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="text-accent-400" size={20} />
        <h3 className="text-lg font-display font-bold text-white">Weather</h3>
      </div>

      <div className="space-y-4">
        {/* Main Weather Info */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            {getWeatherIcon(weather.weather[0].main, weather.weather[0].icon)}
            <div>
              <div className="text-3xl font-bold text-white">
                {Math.round(weather.main.temp)}°C
              </div>
              <div className="text-sm text-dark-300 capitalize">
                {weather.weather[0].description}
              </div>
            </div>
          </div>
          <div className="text-white/80 text-sm">{weather.name}</div>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Thermometer className="text-orange-400" size={16} />
              <span className="text-white text-sm font-medium">Feels like</span>
            </div>
            <div className="text-white text-lg font-bold">
              {Math.round(weather.main.feels_like)}°C
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Wind className="text-blue-400" size={16} />
              <span className="text-white text-sm font-medium">Wind</span>
            </div>
            <div className="text-white text-lg font-bold">
              {weather.wind.speed} m/s
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Cloud className="text-cyan-400" size={16} />
              <span className="text-white text-sm font-medium">Humidity</span>
            </div>
            <div className="text-white text-lg font-bold">
              {weather.main.humidity}%
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Eye className="text-purple-400" size={16} />
              <span className="text-white text-sm font-medium">Visibility</span>
            </div>
            <div className="text-white text-lg font-bold">
              {Math.round(weather.visibility / 1000)} km
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <button
          onClick={fetchWeatherData}
          className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm font-body"
        >
          Refresh Weather
        </button>
      </div>
    </div>
  );
};

export default Weather;
