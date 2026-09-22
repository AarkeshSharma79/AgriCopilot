import User from '../models/User.js';
import { sendSuccess, generateToken, asyncHandler } from '../utils/helpers.js';

// @route  POST /api/auth/register
// @access Public
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, preferredLanguage, location } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
  }

  const user = await User.create({ name, email, password, phone, preferredLanguage, location });

  sendSuccess(
    res,
    201,
    { user: user.toSafeObject(), token: generateToken(user._id) },
    'Account created successfully.'
  );
});

// @route  POST /api/auth/login
// @access Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid email address or password.' });
  }

  if (!user.isActive) {
    return res.status(403).json({ success: false, message: 'This account has been deactivated.' });
  }

  sendSuccess(
    res,
    200,
    { user: user.toSafeObject(), token: generateToken(user._id) },
    'Login successful.'
  );
});

// @route  GET /api/auth/profile
// @access Private
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('farms', 'name sizeAcres location');
  sendSuccess(res, 200, user, 'Profile fetched.');
});

// @route  PUT /api/auth/profile
// @access Private
export const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = ['name', 'email', 'preferredLanguage', 'location', 'notificationPreferences'];
  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  sendSuccess(res, 200, user, 'Profile updated.');
});
