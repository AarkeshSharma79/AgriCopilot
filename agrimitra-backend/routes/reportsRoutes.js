import express from 'express';
import { getReportsSummary } from '../controllers/reportsController.js';

const router = express.Router();

router.get('/', getReportsSummary);

export default router;
