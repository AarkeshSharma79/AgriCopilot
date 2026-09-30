import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import { PORT, NODE_ENV } from './config/env.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import farmRoutes from './routes/farmRoutes.js';
import cropRoutes from './routes/cropRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';
import soilRoutes from './routes/soilRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import reportsRoutes from './routes/reportsRoutes.js';
import organicRoutes from './routes/organicRoutes.js';
import precisionRoutes from './routes/precisionRoutes.js';
import farmerChatRoutes from './routes/farmerChat.js';

import { analyzeCropImageController, getCropHealthOverviewController } from './controllers/cropController.js';
import { getSoilHealth } from './controllers/soilController.js';
import { getFullRecommendation } from './controllers/recommendationController.js';
import upload from './middleware/uploadMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB before accepting traffic
connectDB();

const app = express();

// --- Core middleware ---
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve uploaded crop/land photos statically (e.g. for previewing in the app)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Health check ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'AgriMitra API is running.', env: NODE_ENV });
});

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/soil', soilRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/organic', organicRoutes);
app.use('/api/precision', precisionRoutes);
app.use('/api/farmer-chat', farmerChatRoutes);

// --- Convenience / Legacy Frontend Compatibility Route Aliases ---
app.get('/api/farms/:farmId/crop-health', getCropHealthOverviewController);
app.post('/api/crop-monitoring/analyze', upload.single('image'), analyzeCropImageController);
app.get('/api/farms/:farmId/soil-health', getSoilHealth);
app.get('/api/farms/:farmId/recommendations', getFullRecommendation);

// --- Error handling (must be last) ---
app.use(notFound);
app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`[server] AgriMitra API running in ${NODE_ENV} mode on port ${PORT}`);
});

// Guard against silent crashes from unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[server] Unhandled Rejection: ${err.message}`);
});

export default app;
