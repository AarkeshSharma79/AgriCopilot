import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian phone number'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    preferredLanguage: {
      type: String,
      enum: ['en', 'hi', 'mr', 'ta', 'te', 'kn', 'bn', 'gu', 'pa'],
      default: 'hi',
    },
    location: {
      lat: { type: Number },
      lng: { type: Number },
      district: { type: String },
      state: { type: String },
    },
    role: {
      type: String,
      enum: ['farmer', 'admin'],
      default: 'farmer',
    },
    notificationPreferences: {
      weatherAlerts: { type: Boolean, default: true },
      pestAlerts: { type: Boolean, default: true },
      priceAlerts: { type: Boolean, default: true },
      channel: {
        type: String,
        enum: ['push', 'sms', 'both'],
        default: 'both',
      },
    },
    farms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farm',
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toSafeObject = function toSafeObject() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model('User', userSchema);
