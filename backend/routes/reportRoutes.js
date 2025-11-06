// Report Routes
import express from 'express';
import {
  getReports,
  getReport,
  createReport,
  updateReport,
  updateReportStatus,
  deleteReport,
  addComment,
  upvoteReport,
  getUserReports,
} from '../controllers/reportController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getReports);
router.get('/:id', getReport);

// Protected routes
router.post('/', protect, createReport);
router.put('/:id', protect, updateReport);
router.delete('/:id', protect, deleteReport);
router.post('/:id/comment', protect, addComment);
router.post('/:id/upvote', protect, upvoteReport);
router.get('/user/:userId', protect, getUserReports);

// Authority only routes
router.patch('/:id/status', protect, authorize('authority'), updateReportStatus);

export default router;
