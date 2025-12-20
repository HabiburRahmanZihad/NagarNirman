// User Routes
import express from 'express';
import {
  getUsers,
  getUser,
  applyProblemSolver,
  approveUser,
  getUserStats,
  getLeaderboard,
  updateProfile,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  getMyApplication,
  deleteMyApplication,
  getAllApplications,
  getApplicationDetails,
  reviewApplication,
  getSolvers,
  getWeeklyReportLimit,
} from '../controllers/userController.js';


import { protect, authorize } from '../middleware/auth.js';


const router = express.Router();


// Public routes
router.get('/leaderboard', getLeaderboard);



// Protected routes
router.post('/apply-problem-solver', protect, applyProblemSolver);
router.get('/my-application', protect, getMyApplication);
router.delete('/my-application', protect, deleteMyApplication);
router.put('/profile', protect, updateProfile);
router.get('/weekly-report-limit', protect, getWeeklyReportLimit);



// Authority and SuperAdmin routes (must be before /:id routes)
router.get('/', protect, authorize('authority', 'superAdmin'), getUsers);
router.get('/solvers', protect, authorize('authority', 'superAdmin'), getSolvers);
router.get('/:id/stats', protect, getUserStats);
router.get('/:id', protect, getUser);
router.patch('/:id/approve', protect, authorize('authority', 'superAdmin'), approveUser);
router.patch('/:id/role', protect, authorize('authority', 'superAdmin'), updateUserRole);
router.patch('/:id/status', protect, authorize('authority', 'superAdmin'), updateUserStatus);
router.delete('/:id', protect, authorize('authority', 'superAdmin'), deleteUser);




// Problem Solver Application routes (Authority and SuperAdmin)
router.get('/applications/all', protect, authorize('authority', 'superAdmin'), getAllApplications);
router.get('/applications/:id', protect, authorize('authority', 'superAdmin'), getApplicationDetails);
router.patch('/applications/:id/review', protect, authorize('authority', 'superAdmin'), reviewApplication);



export default router;
