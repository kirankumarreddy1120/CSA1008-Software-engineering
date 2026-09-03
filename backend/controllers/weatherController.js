const { resolveLocation, getWeatherData, getHistoricalClimate, PRESET_CITIES } = require('../services/weatherService');
const { query } = require('../config/db');

exports.getCurrentWeather = async (req, res, next) => {
  try {
    const { city, lat, lon, sessionId = 'guest_user' } = req.query;
    let targetCoords;

    if (lat && lon) {
      targetCoords = {
        name: city || 'Current Location',
        lat: parseFloat(lat),
        lon: parseFloat(lon)
      };
    } else {
      targetCoords = await resolveLocation(city || 'New Delhi');
    }

    const weatherData = await getWeatherData(targetCoords.lat, targetCoords.lon, targetCoords.name);

    // Asynchronously log inquiry
    try {
      await query(
        'INSERT INTO weather_queries (session_id, location_name, query_type, raw_query, detected_intent, language, response_summary) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [sessionId, weatherData.location.name, 'current', city || 'default', 'CURRENT_WEATHER', 'en', `${weatherData.current.temperature}°C, ${weatherData.current.condition.label}`]
      );
    } catch (e) {
      // Non-blocking log
    }

    return res.status(200).json({
      success: true,
      data: weatherData
    });
  } catch (error) {
    next(error);
  }
};

exports.getForecast = async (req, res, next) => {
  try {
    const { city, lat, lon, days = 7 } = req.query;
    let targetCoords;

    if (lat && lon) {
      targetCoords = {
        name: city || 'Location',
        lat: parseFloat(lat),
        lon: parseFloat(lon)
      };
    } else {
      targetCoords = await resolveLocation(city || 'New Delhi');
    }

    const weatherData = await getWeatherData(targetCoords.lat, targetCoords.lon, targetCoords.name);

    return res.status(200).json({
      success: true,
      location: weatherData.location,
      current: weatherData.current,
      hourly: weatherData.hourly,
      daily: weatherData.daily.slice(0, parseInt(days, 10))
    });
  } catch (error) {
    next(error);
  }
};

exports.getAlerts = async (req, res, next) => {
  try {
    const { city, lat, lon } = req.query;
    let targetCoords;

    if (lat && lon) {
      targetCoords = {
        name: city || 'Location',
        lat: parseFloat(lat),
        lon: parseFloat(lon)
      };
    } else {
      targetCoords = await resolveLocation(city || 'New Delhi');
    }

    const weatherData = await getWeatherData(targetCoords.lat, targetCoords.lon, targetCoords.name);

    return res.status(200).json({
      success: true,
      location: weatherData.location,
      alerts: weatherData.alerts
    });
  } catch (error) {
    next(error);
  }
};

exports.getHistoricalClimateData = async (req, res, next) => {
  try {
    const { city, lat, lon } = req.query;
    const targetCoords = (lat && lon)
      ? { name: city || 'Location', lat: parseFloat(lat), lon: parseFloat(lon) }
      : await resolveLocation(city || 'New Delhi');

    const climateData = await getHistoricalClimate(targetCoords.name, targetCoords.lat, targetCoords.lon);

    return res.status(200).json({
      success: true,
      data: climateData
    });
  } catch (error) {
    next(error);
  }
};

exports.getAgriculturalAdvisoryData = async (req, res, next) => {
  try {
    const { city, lat, lon } = req.query;
    const targetCoords = (lat && lon)
      ? { name: city || 'Location', lat: parseFloat(lat), lon: parseFloat(lon) }
      : await resolveLocation(city || 'New Delhi');

    const weatherData = await getWeatherData(targetCoords.lat, targetCoords.lon, targetCoords.name);

    return res.status(200).json({
      success: true,
      data: weatherData.agriculture
    });
  } catch (error) {
    next(error);
  }
};

exports.searchLocations = async (req, res, next) => {
  try {
    const { search = '' } = req.query;
    const term = search.trim().toLowerCase();

    if (!term) {
      const topDefaults = Object.values(PRESET_CITIES).slice(0, 10);
      return res.status(200).json({ success: true, locations: topDefaults });
    }

    // Search local database / presets first
    const matches = [];
    for (const [key, loc] of Object.entries(PRESET_CITIES)) {
      if (key.includes(term) || loc.name.toLowerCase().includes(term) || loc.state.toLowerCase().includes(term)) {
        matches.push(loc);
      }
    }

    // If few matches, query Open-Meteo Geocoding
    if (matches.length < 5) {
      try {
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(term)}&count=6&language=en&format=json`;
        const response = await fetch(geoUrl, { signal: AbortSignal.timeout(4000) });
        if (response.ok) {
          const data = await response.json();
          if (data.results) {
            data.results.forEach(r => {
              if (!matches.some(m => Math.abs(m.lat - r.latitude) < 0.1 && Math.abs(m.lon - r.longitude) < 0.1)) {
                matches.push({
                  name: r.name,
                  state: r.admin1 || r.country || '',
                  country: r.country || 'India',
                  lat: r.latitude,
                  lon: r.longitude,
                  elevation: r.elevation || 100
                });
              }
            });
          }
        }
      } catch (e) {
        // Continue with available matches
      }
    }

    return res.status(200).json({
      success: true,
      locations: matches.slice(0, 10)
    });
  } catch (error) {
    next(error);
  }
};
