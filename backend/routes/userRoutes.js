// User Routes
import express from 'express';
import {
  getUsers,
  getUser,
  applyProblemSolver,
  approveUser,
  getUserStats,
  getLeaderboard,
  updateUserStatus,
  getMyApplication,
  getAllApplications,
  getApplicationDetails,
  reviewApplication,
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/leaderboard', getLeaderboard);

// Protected routes
router.post('/apply-problem-solver', protect, applyProblemSolver);
router.get('/my-application', protect, getMyApplication);
router.get('/:id/stats', protect, getUserStats);
router.get('/:id', protect, getUser);

// Authority only routes
router.get('/', protect, authorize('authority'), getUsers);
router.patch('/:id/approve', protect, authorize('authority'), approveUser);
router.patch('/:id/status', protect, authorize('authority'), updateUserStatus);

// Problem Solver Application routes (Authority only)
router.get('/applications/all', protect, authorize('authority'), getAllApplications);
router.get('/applications/:id', protect, authorize('authority'), getApplicationDetails);
router.patch('/applications/:id/review', protect, authorize('authority'), reviewApplication);

export default router;
