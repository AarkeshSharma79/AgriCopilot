import express from 'express';
import { analyzeSoil, getSoilHistory, getSoilHealth } from '../controllers/soilController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/health/:farmId', getSoilHealth);
router.get('/health', getSoilHealth);

router.use(protect);

router.post('/analyze/:farmId', upload.single('image'), analyzeSoil);
router.get('/history/:farmId', getSoilHistory);

export default router;

