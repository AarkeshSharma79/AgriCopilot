import express from 'express';
import { getPrecisionOverview } from '../controllers/precisionController.js';

const router = express.Router();

router.get('/', getPrecisionOverview);

export default router;
