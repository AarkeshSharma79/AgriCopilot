import express from 'express';
import { getFullRecommendation, askAssistant } from '../controllers/recommendationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public assistant query route
router.post('/ask', askAssistant);

// Protected recommendation route
router.get('/recommendation/:farmId', protect, getFullRecommendation);

export default router;

