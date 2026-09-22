import express from 'express';
import {
  createFarm,
  getFarms,
  getFarmById,
  updateFarm,
  deleteFarm,
  getWaterUsage,
} from '../controllers/farmController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/').post(createFarm).get(getFarms);

router.route('/:id').get(getFarmById).put(updateFarm).delete(deleteFarm);
router.route('/:farmId/water-usage').get(getWaterUsage);

export default router;
