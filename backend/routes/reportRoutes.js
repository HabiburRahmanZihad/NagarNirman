// Report Routes
import express from 'express';
import {
  getReports,
  getReport,
  createNewReport,
  updateExistingReport,
  changeReportStatus,
  removeReport,
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
router.post('/', protect, createNewReport);
router.put('/:id', protect, updateExistingReport);
router.delete('/:id', protect, removeReport);
router.post('/:id/comment', protect, addComment);
router.post('/:id/upvote', protect, upvoteReport);
router.get('/user/:userId', protect, getUserReports);




// Authority and SuperAdmin routes
router.patch('/:id/status', protect, authorize('authority', 'superAdmin'), changeReportStatus);



export default router;
