import axios from 'axios';
import Alert from '../models/Alert.js';
import { SMS_PROVIDER_API_KEY, SMS_PROVIDER_SENDER_ID, FCM_SERVER_KEY } from '../config/env.js';

/**
 * Creates an Alert record and attempts delivery over the user's preferred channel.
 * This is the single entry point used by weather-risk detection, pest reports,
 * price-drop checks, and irrigation reminders — every daily-use notification
 * in the app flows through here.
 */
export const sendAlert = async ({ user, farm, type, severity = 'info', title, message, language, channel, metadata }) => {
  const alert = await Alert.create({
    user: user._id,
    farm: farm?._id,
    type,
    severity,
    title,
    message,
    language: language || user.preferredLanguage,
    channel: channel || user.notificationPreferences?.channel || 'push',
    metadata,
  });

  try {
    if (alert.channel === 'push' || alert.channel === 'both') {
      await sendPushNotification(user, title, message);
    }
    if (alert.channel === 'sms' || alert.channel === 'both') {
      await sendSMS(user.phone, message);
    }
    alert.deliveryStatus = 'sent';
  } catch (error) {
    console.error(`[notificationService] Delivery failed for alert ${alert._id}: ${error.message}`);
    alert.deliveryStatus = 'failed';
  }

  await alert.save();
  return alert;
};

/**
 * Sends a push notification via FCM. No-ops with a console log if no key is
 * configured, so local/dev environments don't crash on missing credentials.
 */
const sendPushNotification = async (user, title, body) => {
  if (!FCM_SERVER_KEY || !user.fcmToken) {
    console.log(`[notificationService] (mock push) -> ${user.phone}: ${title} - ${body}`);
    return;
  }

  await axios.post(
    'https://fcm.googleapis.com/fcm/send',
    {
      to: user.fcmToken,
      notification: { title, body },
    },
    {
      headers: {
        Authorization: `key=${FCM_SERVER_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 8000,
    }
  );
};

/**
 * Sends an SMS via the configured SMS gateway. Falls back to a console mock
 * when no provider key is set — keeps rural/offline-reachability features
 * testable without a live account.
 */
const sendSMS = async (phone, message) => {
  if (!SMS_PROVIDER_API_KEY) {
    console.log(`[notificationService] (mock SMS) -> ${phone}: ${message}`);
    return;
  }

  await axios.post(
    'https://api.smsgateway.example.com/v1/send', // replace with actual provider endpoint
    {
      to: phone,
      sender: SMS_PROVIDER_SENDER_ID,
      message,
    },
    {
      headers: { Authorization: `Bearer ${SMS_PROVIDER_API_KEY}` },
      timeout: 8000,
    }
  );
};
