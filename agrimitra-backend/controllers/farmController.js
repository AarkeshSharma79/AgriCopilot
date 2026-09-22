import Farm from '../models/Farm.js';
import User from '../models/User.js';
import { sendSuccess, asyncHandler } from '../utils/helpers.js';

// @route  POST /api/farms
// @access Private
export const createFarm = asyncHandler(async (req, res) => {
  const { name, location, sizeAcres, soilType, irrigationSource } = req.body;

  if (!name || !location?.lat || !location?.lng || !sizeAcres) {
    return res.status(400).json({
      success: false,
      message: 'name, location.lat, location.lng, and sizeAcres are required.',
    });
  }

  const farm = await Farm.create({
    owner: req.user._id,
    name,
    location,
    sizeAcres,
    soilType,
    irrigationSource,
  });

  await User.findByIdAndUpdate(req.user._id, { $push: { farms: farm._id } });

  sendSuccess(res, 201, farm, 'Farm created successfully.');
});

// @route  GET /api/farms
// @access Private
export const getFarms = asyncHandler(async (req, res) => {
  const farms = await Farm.find({ owner: req.user._id, isActive: true })
    .populate('currentCrop', 'name season')
    .populate('latestSoilAnalysis');

  sendSuccess(res, 200, farms, 'Farms fetched.');
});

// @route  GET /api/farms/:id
// @access Private
export const getFarmById = asyncHandler(async (req, res) => {
  const farm = await Farm.findOne({ _id: req.params.id, owner: req.user._id })
    .populate('currentCrop')
    .populate('latestSoilAnalysis')
    .populate('cropHistory.crop', 'name season');

  if (!farm) {
    return res.status(404).json({ success: false, message: 'Farm not found.' });
  }

  sendSuccess(res, 200, farm, 'Farm fetched.');
});

// @route  PUT /api/farms/:id
// @access Private
export const updateFarm = asyncHandler(async (req, res) => {
  const allowedFields = ['name', 'location', 'sizeAcres', 'soilType', 'irrigationSource', 'currentCrop'];
  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const farm = await Farm.findOneAndUpdate({ _id: req.params.id, owner: req.user._id }, updates, {
    new: true,
    runValidators: true,
  });

  if (!farm) {
    return res.status(404).json({ success: false, message: 'Farm not found.' });
  }

  sendSuccess(res, 200, farm, 'Farm updated.');
});

// @route  DELETE /api/farms/:id
// @access Private
export const deleteFarm = asyncHandler(async (req, res) => {
  const farm = await Farm.findOneAndUpdate(
    { _id: req.params.id, owner: req.user._id },
    { isActive: false },
    { new: true }
  );

  if (!farm) {
    return res.status(404).json({ success: false, message: 'Farm not found.' });
  }

  await User.findByIdAndUpdate(req.user._id, { $pull: { farms: farm._id } });

  sendSuccess(res, 200, null, 'Farm removed.');
});

// @route  GET /api/farms/:farmId/water-usage
// @access Private
export const getWaterUsage = asyncHandler(async (req, res) => {
  const farm = await Farm.findOne({ _id: req.params.farmId, owner: req.user._id });
  if (!farm) {
    return res.status(404).json({ success: false, message: 'Farm not found.' });
  }

  // Generate dynamic-looking water usage dummy data for now
  const data = {
    totalUsed: 12400, // liters
    efficiency: 85, // percentage
    breakdown: [
      { crop: 'Wheat', usage: 6000 },
      { crop: 'Corn', usage: 6400 }
    ]
  };

  sendSuccess(res, 200, data, 'Water usage fetched.');
});
