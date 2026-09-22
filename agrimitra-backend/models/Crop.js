import mongoose from 'mongoose';

const cropSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    localNames: {
      hi: String,
      mr: String,
      ta: String,
      te: String,
      kn: String,
      bn: String,
      gu: String,
      pa: String,
    },
    season: {
      type: String,
      enum: ['kharif', 'rabi', 'zaid', 'perennial'],
      required: true,
    },
    growthDurationDays: {
      type: Number,
      required: true,
    },
    idealSoilPH: {
      min: { type: Number, default: 5.5 },
      max: { type: Number, default: 7.5 },
    },
    idealSoilType: [
      {
        type: String,
        enum: ['alluvial', 'black', 'red', 'laterite', 'arid', 'mountain'],
      },
    ],
    waterRequirementMm: {
      type: Number, // total water requirement across the crop cycle
    },
    irrigationFrequencyDays: {
      type: Number, // default interval between irrigations
    },
    fertilizer: {
      organic: {
        type: { type: String, default: 'FYM/Compost' },
        quantityKgPerAcre: Number,
      },
      inorganic: {
        npkRatio: { type: String, default: '' }, // e.g. "120:60:40"
        quantityKgPerAcre: Number,
      },
    },
    frostSensitive: {
      type: Boolean,
      default: false,
    },
    droughtTolerant: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Crop', cropSchema);
