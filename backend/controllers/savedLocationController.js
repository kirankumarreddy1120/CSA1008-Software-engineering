const { query } = require('../config/db');
const { resolveLocation } = require('../services/weatherService');

exports.getSavedLocations = async (req, res, next) => {
  try {
    const { sessionId = 'default_user' } = req.query;

    const rows = await query(
      'SELECT id, session_id, city_name, state_name, country, latitude, longitude, is_default, notes, created_at FROM saved_locations WHERE session_id = ? ORDER BY is_default DESC, created_at DESC',
      [sessionId]
    );

    return res.status(200).json({
      success: true,
      locations: rows || []
    });
  } catch (error) {
    next(error);
  }
};

exports.addSavedLocation = async (req, res, next) => {
  try {
    const { cityName, sessionId = 'default_user', notes = '', isDefault = false } = req.body;

    if (!cityName) {
      return res.status(400).json({ success: false, message: 'City name is required.' });
    }

    const resolved = await resolveLocation(cityName);

    const result = await query(
      'INSERT INTO saved_locations (session_id, city_name, state_name, country, latitude, longitude, is_default, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [sessionId, resolved.name, resolved.state || '', resolved.country || 'IN', resolved.lat, resolved.lon, isDefault ? 1 : 0, notes]
    );

    return res.status(201).json({
      success: true,
      message: `${resolved.name} added to saved locations.`,
      location: {
        id: result.insertId || Date.now(),
        cityName: resolved.name,
        stateName: resolved.state,
        country: resolved.country,
        latitude: resolved.lat,
        longitude: resolved.lon,
        isDefault,
        notes
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteSavedLocation = async (req, res, next) => {
  try {
    const { id } = req.params;

    await query('DELETE FROM saved_locations WHERE id = ?', [id]);

    return res.status(200).json({
      success: true,
      message: 'Location removed from bookmarks.'
    });
  } catch (error) {
    next(error);
  }
};
