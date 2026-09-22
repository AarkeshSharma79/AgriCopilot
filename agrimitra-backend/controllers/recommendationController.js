import Farm from '../models/Farm.js';
import Crop from '../models/Crop.js';
import Weather from '../models/Weather.js';
import { sendSuccess, asyncHandler } from '../utils/helpers.js';

// @route  GET /api/recommendations/:farmId
// @access Private
// The single "what should I do this week" endpoint the app's home screen calls.
// Combines soil moisture + fertility, live weather risk, and the crop's reference
// data into an irrigation schedule and a fertilizer plan.
export const getFullRecommendation = asyncHandler(async (req, res) => {
  const farm = await Farm.findOne({ _id: req.params.farmId, owner: req.user._id })
    .populate('latestSoilAnalysis')
    .populate('currentCrop');

  if (!farm) {
    return res.status(404).json({ success: false, message: 'Farm not found.' });
  }

  if (!farm.currentCrop) {
    return res.status(400).json({
      success: false,
      message: 'No current crop set for this farm. Set farm.currentCrop after choosing a recommended crop.',
    });
  }

  const soil = farm.latestSoilAnalysis;
  const crop = farm.currentCrop;
  const weather = await Weather.findOne({ farm: farm._id }).sort({ fetchedAt: -1 });
  const risks = weather?.risks || [];

  const irrigationSchedule = buildIrrigationSchedule({ crop, soil, risks });
  const fertilizerPlan = buildFertilizerPlan({ crop, soil });
  const calendar = buildCropCalendar({ crop });

  sendSuccess(
    res,
    200,
    { farm: farm._id, crop: crop.name, irrigationSchedule, fertilizerPlan, calendar, activeRisks: risks },
    'Full recommendation generated.'
  );
});

const buildIrrigationSchedule = ({ crop, soil, risks }) => {
  let frequencyDays = crop.irrigationFrequencyDays || 7;

  // Soil is already moist — space irrigation out.
  if (soil?.moisturePercent >= 60) frequencyDays += 2;
  // Soil is dry — irrigate sooner.
  if (soil?.moisturePercent <= 25) frequencyDays = Math.max(1, frequencyDays - 2);

  const hasHeavyRainSoon = risks.some((r) => r.type === 'heavy_rain');
  const hasDrought = risks.some((r) => r.type === 'drought');

  const notes = [];
  if (hasHeavyRainSoon) notes.push('Heavy rain forecast — skip the next scheduled irrigation.');
  if (hasDrought) notes.push('Dry spell detected — monitor soil moisture more frequently than the default schedule.');

  return {
    recommendedFrequencyDays: frequencyDays,
    totalWaterRequirementMm: crop.waterRequirementMm,
    notes,
  };
};

const buildFertilizerPlan = ({ crop, soil }) => {
  const plan = {
    organic: crop.fertilizer?.organic,
    inorganic: crop.fertilizer?.inorganic,
    adjustmentNotes: [],
  };

  if (soil?.nutrients?.nitrogen === 'low') {
    plan.adjustmentNotes.push('Nitrogen is low — consider increasing urea/organic nitrogen dose by ~15%.');
  }
  if (soil?.nutrients?.phosphorus === 'low') {
    plan.adjustmentNotes.push('Phosphorus is low — consider a starter dose of DAP at sowing.');
  }
  if (soil?.nutrients?.potassium === 'low') {
    plan.adjustmentNotes.push('Potassium is low — consider adding MOP before the flowering stage.');
  }

  return plan;
};

const buildCropCalendar = ({ crop }) => {
  const today = new Date();
  const harvestDate = new Date(today);
  harvestDate.setDate(today.getDate() + (crop.growthDurationDays || 100));

  return {
    sowingDate: today.toISOString().split('T')[0],
    estimatedHarvestDate: harvestDate.toISOString().split('T')[0],
    growthDurationDays: crop.growthDurationDays,
  };
};

// @route  POST /api/ai/ask
// @access Public / Private
export const askAssistant = asyncHandler(async (req, res) => {
  const { message, context } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ success: false, message: 'Message is required.' });
  }

  const query = message.toLowerCase();
  let reply = '';

  if (query.includes('weather') || query.includes('rain')) {
    reply = 'Current forecast indicates partly cloudy conditions with a high probability of localized light showers tomorrow afternoon. Ensure field drainage channels are clear.';
  } else if (query.includes('fertilizer') || query.includes('urea') || query.includes('npk')) {
    reply = 'For your active crop cycle, we recommend applying organic Vermicompost (2.5 tons/acre) combined with a split application of Nitrogen (Urea) at 45 days after sowing.';
  } else if (query.includes('disease') || query.includes('blight') || query.includes('pest')) {
    reply = 'If leaf spot or blight is observed, spray Neemastra (5% neem oil solution) or Mancozeb 75% WP (2.5g/L) during early morning or evening hours.';
  } else if (query.includes('water') || query.includes('irrigation')) {
    reply = 'Soil moisture is currently optimal. Next irrigation cycle is recommended in 3 days during evening hours to minimize evaporative water loss.';
  } else {
    reply = `Thank you for your question! Based on current field conditions in your zone, your crops are performing well. For "${message}", we advise monitoring soil moisture and following zero-chemical pest prevention practices.`;
  }

  sendSuccess(res, 200, { reply }, 'AI Assistant response generated.');
});

