import express from 'express';
import {
  getCases,
  getCaseById,
  toggleBookmark,
  updateTags,
  rateContent,
  deleteCase,
} from '../controllers/casesController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getCases);
router.get('/:id', authenticateToken, getCaseById);
router.patch('/:id/bookmark', authenticateToken, toggleBookmark);
router.patch('/:id/tags', authenticateToken, updateTags);
router.patch('/:id/rate', authenticateToken, rateContent);
router.delete('/:id', authenticateToken, deleteCase);

export default router;
