import mongoose from 'mongoose';

const weatherSchema = new mongoose.Schema(
  {
    farm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
      required: true,
    },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    source: {
      type: String,
      enum: ['openweathermap', 'imd'],
      default: 'openweathermap',
    },
    forecast: mongoose.Schema.Types.Mixed,
    fullData: mongoose.Schema.Types.Mixed,
    risks: mongoose.Schema.Types.Mixed,
    fetchedAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      // forecasts go stale quickly; default TTL of 6 hours
      default: () => new Date(Date.now() + 6 * 60 * 60 * 1000),
    },
  },
  { timestamps: true }
);

weatherSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
weatherSchema.index({ farm: 1, fetchedAt: -1 });

export default mongoose.model('Weather', weatherSchema);
