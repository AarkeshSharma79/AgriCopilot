import dotenv from 'dotenv';
dotenv.config();

const required = ['MONGO_URI', 'JWT_SECRET'];
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.warn(
    `[env] Warning: missing environment variables: ${missing.join(', ')}. Using defaults where possible.`
  );
}

export const PORT = process.env.PORT || 5000;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/agrimitra';
export const JWT_SECRET = process.env.JWT_SECRET || 'dev_change_this_secret';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d';

export const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || '';
export const OPENWEATHER_BASE_URL =
  process.env.OPENWEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5';

export const BHUVAN_API_KEY = process.env.BHUVAN_API_KEY || '';

export const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:6000';
export const AI_SERVICE_TIMEOUT_MS = Number(process.env.AI_SERVICE_TIMEOUT_MS) || 15000;

export const ENAM_API_URL = process.env.ENAM_API_URL || '';
export const ENAM_API_KEY = process.env.ENAM_API_KEY || '';

export const SMS_PROVIDER_API_KEY = process.env.SMS_PROVIDER_API_KEY || '';
export const SMS_PROVIDER_SENDER_ID = process.env.SMS_PROVIDER_SENDER_ID || 'AGRMTR';
export const FCM_SERVER_KEY = process.env.FCM_SERVER_KEY || '';

export const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads/crop-images';
export const MAX_UPLOAD_SIZE_MB = Number(process.env.MAX_UPLOAD_SIZE_MB) || 5;

export default {
  PORT,
  NODE_ENV,
  MONGO_URI,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  OPENWEATHER_API_KEY,
  OPENWEATHER_BASE_URL,
  BHUVAN_API_KEY,
  AI_SERVICE_URL,
  AI_SERVICE_TIMEOUT_MS,
  ENAM_API_URL,
  ENAM_API_KEY,
  SMS_PROVIDER_API_KEY,
  SMS_PROVIDER_SENDER_ID,
  FCM_SERVER_KEY,
  UPLOAD_DIR,
  MAX_UPLOAD_SIZE_MB,
};

