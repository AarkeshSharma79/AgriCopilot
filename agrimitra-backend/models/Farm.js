import mongoose from 'mongoose';

const farmSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Farm name is required'],
      trim: true,
    },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      village: { type: String },
      district: { type: String },
      state: { type: String },
    },
    sizeAcres: {
      type: Number,
      required: [true, 'Farm size in acres is required'],
      min: 0.1,
    },
    soilType: {
      type: String,
      enum: ['alluvial', 'black', 'red', 'laterite', 'arid', 'mountain', 'unknown'],
      default: 'unknown',
    },
    irrigationSource: {
      type: String,
      enum: ['canal', 'borewell', 'rainfed', 'tank', 'other'],
      default: 'rainfed',
    },
    currentCrop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Crop',
    },
    cropHistory: [
      {
        crop: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop' },
        season: String,
        year: Number,
        yieldQuintalsPerAcre: Number,
      },
    ],
    latestSoilAnalysis: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Soil',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

farmSchema.index({ 'location.lat': 1, 'location.lng': 1 });

export default mongoose.model('Farm', farmSchema);
