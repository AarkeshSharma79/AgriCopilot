import path from 'path';
import Farm from '../models/Farm.js';
import Soil from '../models/Soil.js';
import { analyzeSoilImage } from '../services/aiService.js';
import { sendSuccess, asyncHandler } from '../utils/helpers.js';

// @route  POST /api/soil/analyze/:farmId
// @access Private
// Expects multipart/form-data with a single "image" file (see uploadMiddleware).
export const analyzeSoil = asyncHandler(async (req, res) => {
  const farm = await Farm.findOne({ _id: req.params.farmId, owner: req.user._id });
  if (!farm) {
    return res.status(404).json({ success: false, message: 'Farm not found.' });
  }

  if (!req.file) {
    return res.status(400).json({ success: false, message: 'A land/soil photo is required.' });
  }

  const analysis = await analyzeSoilImage(req.file.path, {
    lat: farm.location.lat,
    lng: farm.location.lng,
  });

  const imageUrl = `/uploads/crop-images/${path.basename(req.file.path)}`;

  const soilRecord = await Soil.create({
    farm: farm._id,
    imageUrl,
    moisturePercent: analysis.moisturePercent,
    fertilityScore: analysis.fertilityScore,
    ph: analysis.ph,
    nutrients: analysis.nutrients,
    soilTypeDetected: analysis.soilTypeDetected,
    confidenceScore: analysis.confidenceScore,
    rawModelOutput: analysis,
  });

  farm.latestSoilAnalysis = soilRecord._id;
  if (analysis.soilTypeDetected && analysis.soilTypeDetected !== 'unknown') {
    farm.soilType = analysis.soilTypeDetected;
  }
  await farm.save();

  sendSuccess(res, 201, soilRecord, 'Soil analysis complete.');
});

// @route  GET /api/soil/history/:farmId
// @access Private
export const getSoilHistory = asyncHandler(async (req, res) => {
  const farm = await Farm.findOne({ _id: req.params.farmId, owner: req.user._id });
  if (!farm) {
    return res.status(404).json({ success: false, message: 'Farm not found.' });
  }

  const history = await Soil.find({ farm: farm._id }).sort({ createdAt: -1 }).limit(20);

  sendSuccess(res, 200, history, 'Soil analysis history fetched.');
});

// @route  GET /api/soil/health/:farmId (or /api/farms/:farmId/soil-health)
// @access Public / Private
export const getSoilHealth = asyncHandler(async (req, res) => {
  // 1. Log out that we are moving away from the former static logic
  console.log('[getSoilHealth] Fetching dynamic soil data, ignoring former static data');
  
  // 2. Dynamic logic to fetch the latest soil record for the given farm
  const latestSoil = await Soil.findOne({ farm: req.params.farmId }).sort({ createdAt: -1 });

  let data;
  if (latestSoil) {
    data = {
      score: latestSoil.fertilityScore || 0,
      metrics: [
        { label: 'NPK', value: latestSoil.nutrients?.nitrogen ? `${latestSoil.nutrients.nitrogen} N` : 'Unknown' },
        { label: 'pH', value: latestSoil.ph ? latestSoil.ph.toString() : 'Unknown' },
        { label: 'Organic Matter', value: 'Good' }, // Not in schema, keeping fallback
        { label: 'Moisture', value: latestSoil.moisturePercent ? `${latestSoil.moisturePercent}%` : 'Unknown' },
      ],
    };
  } else {
    console.log('[getSoilHealth] No soil records found, using former fallback data');
    data = {
      score: 72,
      metrics: [
        { label: 'NPK', value: 'Good' },
        { label: 'pH', value: 'Neutral' },
        { label: 'Organic Matter', value: 'Good' },
        { label: 'Moisture', value: 'Optimal' },
      ],
    };
  }

  sendSuccess(res, 200, data, 'Soil health fetched.');
});

