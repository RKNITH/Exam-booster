import express from 'express';
import { getHistory, clearHistory } from '../controllers/historyController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getHistory);
router.delete('/clear', authenticateToken, clearHistory);

export default router;
