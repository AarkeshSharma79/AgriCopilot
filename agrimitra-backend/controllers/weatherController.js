import Farm from '../models/Farm.js';
import Weather from '../models/Weather.js';
import { fetchFullWeather } from '../services/weatherService.js';
import { sendSuccess, asyncHandler } from '../utils/helpers.js';

// @route  GET /api/weather/dashboard/:farmId
// @access Private
export const getFullWeather = asyncHandler(async (req, res) => {
  const farm = await Farm.findOne({ _id: req.params.farmId, owner: req.user._id });
  if (!farm) {
    return res.status(404).json({ success: false, message: 'Farm not found.' });
  }

  let weather = await Weather.findOne({ farm: farm._id }).sort({ fetchedAt: -1 });

  // Cache valid for 30 mins
  if (!weather || (new Date() - weather.fetchedAt) > 30 * 60 * 1000) {
    const fullWeatherData = await fetchFullWeather(farm.location.lat, farm.location.lng);
    weather = await Weather.create({
      farm: farm._id,
      location: farm.location,
      forecast: fullWeatherData.forecast.daily,
      fullData: fullWeatherData // Store the entire payload in a flexible schema or just return it
    });
    return sendSuccess(res, 200, fullWeatherData, 'Fresh weather fetched.');
  }

  // If cached, return the fullData if it exists
  if (weather.fullData) {
    return sendSuccess(res, 200, weather.fullData, 'Cached weather fetched.');
  }
  
  // Fallback if old cache format
  const fullWeatherData = await fetchFullWeather(farm.location.lat, farm.location.lng);
  sendSuccess(res, 200, fullWeatherData, 'Fresh weather fetched.');
});

// @route  GET /api/weather/location
// @access Public / Private
export const getFullWeatherByLocation = asyncHandler(async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ success: false, message: 'lat and lon are required.' });
  }

  const fullWeatherData = await fetchFullWeather(lat, lon);
  sendSuccess(res, 200, fullWeatherData, 'Location weather fetched.');
});
