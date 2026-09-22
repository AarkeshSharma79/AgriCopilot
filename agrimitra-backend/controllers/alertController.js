import Alert from '../models/Alert.js';
import { sendSuccess, asyncHandler } from '../utils/helpers.js';

// Default mock alerts for initial user experience or empty database fallback
const defaultAlerts = [
  { id: '1', type: 'weather', title: 'Heavy rainfall expected tomorrow', meta: 'Indore, MP', time: '10:30 AM', severity: 'high' },
  { id: '2', type: 'disease', title: 'Early blight detected in Tomato', meta: 'Farm-3', time: '09:15 AM', severity: 'medium' },
  { id: '3', type: 'irrigation', title: 'Irrigation scheduled tomorrow', meta: 'Farm-2', time: 'Yesterday', severity: 'info' },
  { id: '4', type: 'weather', title: 'Wind advisory issued for the region', meta: 'Indore, MP', time: '2 days ago', severity: 'medium' },
  { id: '5', type: 'irrigation', title: 'Water tank level below 30%', meta: 'Farm-1', time: '3 days ago', severity: 'high' },
];

// @route   GET /api/alerts
// @access  Public / Private
export const getAlerts = asyncHandler(async (req, res) => {
  let alerts = [];
  if (req.user) {
    alerts = await Alert.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(20);
  }

  if (!alerts || alerts.length === 0) {
    return sendSuccess(res, 200, defaultAlerts, 'Alerts fetched.');
  }

  const formatted = alerts.map((a) => ({
    id: a._id,
    type: a.type === 'pest' ? 'disease' : a.type,
    title: a.title,
    meta: a.message || 'System Notification',
    time: a.createdAt ? new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
    severity: a.severity,
  }));

  sendSuccess(res, 200, formatted, 'Alerts fetched.');
});

// @route   POST /api/alerts
// @access  Private
export const createAlert = asyncHandler(async (req, res) => {
  const { title, message, type, severity } = req.body;
  const alert = await Alert.create({
    user: req.user._id,
    title: title || 'New Notification',
    message: message || title || 'Alert message',
    type: type || 'general',
    severity: severity || 'info',
  });
  sendSuccess(res, 201, alert, 'Alert created.');
});
