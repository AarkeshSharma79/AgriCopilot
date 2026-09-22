import express from 'express';
import { getFullWeather, getFullWeatherByLocation } from '../controllers/weatherController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public / location-based weather endpoints
router.get('/location', getFullWeatherByLocation);

// Farm-specific protected endpoints
router.get('/dashboard/:farmId', protect, getFullWeather);

export default router;
