import express from 'express';
import { body } from 'express-validator';
import { generate, getTrending, getDaily } from '../controllers/generateController.js';
import { authenticateToken } from '../middlewares/auth.js';
import { generateLimiter } from '../config/rateLimiter.js';

const router = express.Router();

router.post('/', authenticateToken, generateLimiter, [
  body('topic').trim().isLength({ min: 2, max: 200 }),
  body('gsPaper').optional().isIn(['GS1', 'GS2', 'GS3', 'GS4', 'Essay', 'all']),
  body('language').optional().isIn(['english', 'hindi']),
], generate);

router.get('/trending', authenticateToken, getTrending);
router.get('/daily', authenticateToken, getDaily);

export default router;
