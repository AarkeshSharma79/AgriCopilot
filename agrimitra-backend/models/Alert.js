import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    farm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
    },
    type: {
      type: String,
      enum: ['weather', 'pest', 'price', 'irrigation', 'fertilizer', 'general'],
      required: true,
    },
    severity: {
      type: String,
      enum: ['info', 'low', 'medium', 'high', 'critical'],
      default: 'info',
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      default: 'hi',
    },
    channel: {
      type: String,
      enum: ['push', 'sms', 'both'],
      default: 'push',
    },
    deliveryStatus: {
      type: String,
      enum: ['pending', 'sent', 'failed', 'read'],
      default: 'pending',
    },
    read: {
      type: Boolean,
      default: false,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed, // e.g. { crop, mandiPrice, pestName }
    },
  },
  { timestamps: true }
);

alertSchema.index({ user: 1, read: 1, createdAt: -1 });

export default mongoose.model('Alert', alertSchema);
