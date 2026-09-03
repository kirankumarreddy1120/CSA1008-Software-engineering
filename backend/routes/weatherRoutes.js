const express = require('express');
const router = express.Router();
const {
  getCurrentWeather,
  getForecast,
  getAlerts,
  getHistoricalClimateData,
  getAgriculturalAdvisoryData,
  searchLocations
} = require('../controllers/weatherController');

router.get('/current', getCurrentWeather);
router.get('/forecast', getForecast);
router.get('/alerts', getAlerts);
router.get('/history', getHistoricalClimateData);
router.get('/agriculture', getAgriculturalAdvisoryData);
router.get('/locations', searchLocations);

module.exports = router;
