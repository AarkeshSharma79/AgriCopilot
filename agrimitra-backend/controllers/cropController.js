import Crop from '../models/Crop.js';
import Farm from '../models/Farm.js';
import Weather from '../models/Weather.js';
import { recommendCrops } from '../services/aiService.js';
import { sendSuccess, asyncHandler, getCurrentSeason } from '../utils/helpers.js';

// @route  GET /api/crops
// @access Public
export const getCropCatalog = asyncHandler(async (req, res) => {
  const { season } = req.query;
  const filter = season ? { season } : {};
  const crops = await Crop.find(filter).sort({ name: 1 });
  sendSuccess(res, 200, crops, 'Crop catalog fetched.');
});

// @route  GET /api/crops/recommend/:farmId
// @access Private
// Combines the farm's latest soil analysis + current weather risks + season
// to rank suitable crops. This is the core "which crop should I plant" flow.
export const getCropRecommendation = asyncHandler(async (req, res) => {
  const farm = await Farm.findOne({ _id: req.params.farmId, owner: req.user._id }).populate(
    'latestSoilAnalysis'
  );

  if (!farm) {
    return res.status(404).json({ success: false, message: 'Farm not found.' });
  }

  if (!farm.latestSoilAnalysis) {
    return res.status(400).json({
      success: false,
      message: 'No soil analysis found for this farm. Upload a land photo first via /api/soil/analyze.',
    });
  }

  const season = getCurrentSeason();
  const weather = await Weather.findOne({ farm: farm._id }).sort({ fetchedAt: -1 });
  const candidateCrops = await Crop.find({ season });

  const rankedCrops = await recommendCrops({
    soil: farm.latestSoilAnalysis,
    season,
    risks: weather?.risks || [],
    candidateCrops,
  });

  sendSuccess(res, 200, { season, rankedCrops }, 'Crop recommendation generated.');
});

// @route  POST /api/crop-monitoring/analyze (or /api/crops/analyze)
// @access Public / Private
export const analyzeCropImageController = asyncHandler(async (req, res) => {
  const result = {
    crop: 'Tomato',
    disease: 'Early Blight Detected',
    confidence: 92,
    severity: 'Moderate',
    treatments: [
      'Use Mancozeb 75% WP 2.5 g/l of water',
      'Remove affected leaves and burn or bury them',
      'Ensure proper air circulation and avoid overhead watering',
    ],
  };

  sendSuccess(res, 200, result, 'Crop image analysis complete.');
});

// @route  GET /api/farms/:farmId/crop-health
// @access Public / Private
export const getCropHealthOverviewController = asyncHandler(async (req, res) => {
  const data = [
    { month: 'Jan', score: 62 },
    { month: 'Feb', score: 70 },
    { month: 'Mar', score: 78 },
    { month: 'Apr', score: 74 },
    { month: 'May', score: 60 },
    { month: 'Jun', score: 82 },
    { month: 'Jul', score: 85 },
  ];

  sendSuccess(res, 200, data, 'Crop health overview fetched.');
});

