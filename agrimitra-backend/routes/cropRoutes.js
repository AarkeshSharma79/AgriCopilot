import express from 'express';
import {
  getCropCatalog,
  getCropRecommendation,
  analyzeCropImageController,
  getCropHealthOverviewController,
} from '../controllers/cropController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getCropCatalog);
router.post('/analyze', upload.single('image'), analyzeCropImageController);
router.get('/health/:farmId', getCropHealthOverviewController);
router.get('/recommend/:farmId', protect, getCropRecommendation);

export default router;

