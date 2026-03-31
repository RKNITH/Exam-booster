import express from 'express';
import { getAllUsers, getPlatformStats } from '../controllers/adminController.js';
import { authenticateToken, isAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticateToken, isAdmin);

router.get('/users', getAllUsers);
router.get('/stats', getPlatformStats);

export default router;
