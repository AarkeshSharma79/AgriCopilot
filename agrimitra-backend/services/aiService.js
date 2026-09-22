import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';
import { AI_SERVICE_URL, AI_SERVICE_TIMEOUT_MS } from '../config/env.js';

/**
 * Sends a land/soil photo to the Python/TensorFlow inference service and
 * returns the parsed soil analysis (moisture, fertility, pH, nutrients, soil type).
 *
 * Expected ML service response shape:
 * {
 *   moisturePercent, fertilityScore, ph,
 *   nutrients: { nitrogen, phosphorus, potassium },
 *   soilTypeDetected, confidenceScore
 * }
 */
export const analyzeSoilImage = async (imagePath, { lat, lng } = {}) => {
  try {
    const form = new FormData();
    form.append('image', fs.createReadStream(imagePath));
    if (lat !== undefined) form.append('lat', lat);
    if (lng !== undefined) form.append('lng', lng);

    const { data } = await axios.post(`${AI_SERVICE_URL}/analyze-soil`, form, {
      headers: form.getHeaders(),
      timeout: AI_SERVICE_TIMEOUT_MS,
    });

    return data;
  } catch (error) {
    console.error(`[aiService] ML inference failed: ${error.message}. Falling back to heuristic estimate.`);
    return getFallbackAnalysis();
  }
};

/**
 * Ranks candidate crops for a farm based on soil analysis + season + weather risk.
 * The heavy scoring model lives in the ML service; this function calls it and,
 * if unavailable, falls back to a simple rule-based ranking so the app degrades
 * gracefully instead of failing the farmer's request outright.
 */
export const recommendCrops = async ({ soil, season, risks, candidateCrops }) => {
  try {
    const { data } = await axios.post(
      `${AI_SERVICE_URL}/recommend-crops`,
      { soil, season, risks, candidateCrops },
      { timeout: AI_SERVICE_TIMEOUT_MS }
    );
    return data.rankedCrops;
  } catch (error) {
    console.error(`[aiService] Crop recommendation service failed: ${error.message}. Using rule-based fallback.`);
    return ruleBasedCropRanking({ soil, season, risks, candidateCrops });
  }
};

const ruleBasedCropRanking = ({ soil, season, risks, candidateCrops }) => {
  const hasDroughtRisk = risks?.some((r) => r.type === 'drought');
  const hasFrostRisk = risks?.some((r) => r.type === 'frost');

  return candidateCrops
    .filter((crop) => crop.season === season)
    .map((crop) => {
      let score = 50;

      if (soil?.ph >= crop.idealSoilPH?.min && soil?.ph <= crop.idealSoilPH?.max) score += 20;
      if (crop.idealSoilType?.includes(soil?.soilTypeDetected)) score += 15;
      if (hasDroughtRisk && crop.droughtTolerant) score += 10;
      if (hasFrostRisk && crop.frostSensitive) score -= 20;

      return { crop, score: Math.max(0, Math.min(100, score)) };
    })
    .sort((a, b) => b.score - a.score);
};

const getFallbackAnalysis = () => ({
  moisturePercent: 35,
  fertilityScore: 55,
  ph: 6.5,
  nutrients: { nitrogen: 'medium', phosphorus: 'medium', potassium: 'medium' },
  soilTypeDetected: 'unknown',
  confidenceScore: 0.3,
  note: 'Fallback heuristic estimate — ML service unavailable, treat as low-confidence.',
});
