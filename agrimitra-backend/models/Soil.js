import mongoose from 'mongoose';

const soilSchema = new mongoose.Schema(
  {
    farm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    moisturePercent: {
      type: Number,
      min: 0,
      max: 100,
    },
    fertilityScore: {
      type: Number, // 0-100 composite score from ML model
      min: 0,
      max: 100,
    },
    ph: {
      type: Number,
      min: 0,
      max: 14,
    },
    nutrients: {
      nitrogen: { type: String, enum: ['low', 'medium', 'high'] },
      phosphorus: { type: String, enum: ['low', 'medium', 'high'] },
      potassium: { type: String, enum: ['low', 'medium', 'high'] },
    },
    soilTypeDetected: {
      type: String,
      enum: ['alluvial', 'black', 'red', 'laterite', 'arid', 'mountain', 'unknown'],
      default: 'unknown',
    },
    analysisSource: {
      type: String,
      enum: ['ai_model', 'manual', 'lab_report'],
      default: 'ai_model',
    },
    confidenceScore: {
      type: Number, // ML model confidence 0-1
      min: 0,
      max: 1,
    },
    rawModelOutput: {
      type: mongoose.Schema.Types.Mixed, // store full inference payload for audit/debug
    },
  },
  { timestamps: true }
);

soilSchema.index({ farm: 1, createdAt: -1 });

export default mongoose.model('Soil', soilSchema);
