import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import axios from 'axios';

const router = express.Router();

router.post('/', protect, async (req, res) => {
    try {
        const response = await axios.post('http://localhost:8000/api/farmer-chat', req.body);
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error in farmer chat proxy:', error.message);
        res.status(500).json({ success: false, message: 'Failed to communicate with RAG service' });
    }
});

export default router;
