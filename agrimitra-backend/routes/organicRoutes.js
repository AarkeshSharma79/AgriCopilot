import express from 'express';
import { getOrganicInfo } from '../controllers/organicController.js';

const router = express.Router();

router.get('/', getOrganicInfo);

export default router;
