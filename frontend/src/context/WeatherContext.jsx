import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCurrentWeather } from '../services/api';

const WeatherContext = createContext();

export function WeatherProvider({ children }) {
  const [currentCity, setCurrentCity] = useState(() => {
    return localStorage.getItem('weathergpt_city') || 'New Delhi';
  });
  const [coordinates, setCoordinates] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tempUnit, setTempUnit] = useState(() => {
    return localStorage.getItem('weathergpt_temp_unit') || 'C';
  });

  const loadWeather = useCallback(async (city = currentCity, coords = coordinates) => {
    setLoading(true);
    setError(null);
    try {
      const lat = coords?.lat || null;
      const lon = coords?.lon || null;
      const data = await getCurrentWeather(city, lat, lon);
      setWeatherData(data);
      if (data?.location?.name) {
        setCurrentCity(data.location.name);
        localStorage.setItem('weathergpt_city', data.location.name);
      }
    } catch (err) {
      console.error('Failed to load weather data:', err);
      setError('Unable to fetch weather data. Please check your connection or search for another location.');
    } finally {
      setLoading(false);
    }
  }, [currentCity, coordinates]);

  useEffect(() => {
    loadWeather(currentCity, coordinates);
  }, []);

  const changeLocation = (cityName) => {
    setCoordinates(null);
    setCurrentCity(cityName);
    loadWeather(cityName, null);
  };

  const useCurrentGeolocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude
        };
        setCoordinates(coords);
        await loadWeather('Your Location', coords);
      },
      (geoErr) => {
        console.warn('Geolocation permission denied or timed out:', geoErr);
        setError('Location permission was denied. Falling back to default city.');
        setLoading(false);
      },
      { timeout: 10000 }
    );
  };

  const toggleTempUnit = () => {
    const next = tempUnit === 'C' ? 'F' : 'C';
    setTempUnit(next);
    localStorage.setItem('weathergpt_temp_unit', next);
  };

  const formatTemp = (celsius) => {
    if (celsius === undefined || celsius === null || isNaN(celsius)) return '--';
    if (tempUnit === 'F') {
      const fahr = Math.round((celsius * 9) / 5 + 32);
      return `${fahr}°F`;
    }
    return `${celsius}°C`;
  };

  return (
    <WeatherContext.Provider
      value={{
        currentCity,
        coordinates,
        weatherData,
        loading,
        error,
        tempUnit,
        formatTemp,
        toggleTempUnit,
        changeLocation,
        useCurrentGeolocation,
        refreshWeather: () => loadWeather(currentCity, coordinates)
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}
