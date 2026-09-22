import { sendSuccess, asyncHandler } from '../utils/helpers.js';

// @route   GET /api/precision
// @access  Public / Private
export const getPrecisionOverview = asyncHandler(async (req, res) => {
  const tiles = [
    { label: 'Irrigation', value: 'Recommended', sub: 'Tomorrow 5:00 PM', color: 'text-sky-500 bg-sky-500/10' },
    { label: 'Fertilizer', value: 'Urea', sub: 'Within 3 days', color: 'text-leaf-600 bg-leaf-50' },
    { label: 'Seed', value: 'High yield', sub: 'Recommended', color: 'text-amber-500 bg-amber-500/10' },
    { label: 'Pest Control', value: 'No major risk', sub: 'Good', color: 'text-leaf-600 bg-leaf-50' },
  ];

  const zones = [
    { id: 1, health: 'High', quality: 'Good', level: 'high' },
    { id: 2, health: 'Moderate', quality: 'Moderate', level: 'medium' },
    { id: 3, health: 'Low', quality: 'Low', level: 'low' },
  ];

  sendSuccess(res, 200, { tiles, zones }, 'Precision farming overview fetched.');
});
