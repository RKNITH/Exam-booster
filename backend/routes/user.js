import express from 'express';
import { getStats, updatePreferences } from '../controllers/userController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

router.get('/stats', authenticateToken, getStats);
router.patch('/preferences', authenticateToken, updatePreferences);

export default router;
