import express from 'express';
import { body } from 'express-validator';
import { register, login, getMe } from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', [
  body('username').trim().isLength({ min: 3, max: 30 }).matches(/^[a-zA-Z0-9_]+$/),
  body('password').isLength({ min: 6 }),
], register);

router.post('/login', [
  body('username').trim().notEmpty(),
  body('password').notEmpty(),
], login);

router.get('/me', authenticateToken, getMe);

export default router;
