// Task Routes
import express from 'express';
import {
  getTasks,
  getTask,
  assignTask,
  changeTaskStatus,
  completeTask,
  grantReward,
  getMyTasks,
  getSolverStatistics,
  acceptTaskAssignment,
  startWorkingOnTask,
  submitTaskProofHandler,
  getPendingReviewTasks,
  approveTaskSubmission,
  rejectTaskSubmission,
  syncCompletedTasksWithReports,
  getTaskStatistics,
} from '../controllers/taskController.js';


import { protect, authorize, checkApproved } from '../middleware/auth.js';


const router = express.Router();


// Protected routes
router.get('/my-tasks', protect, checkApproved, getMyTasks);
router.get('/:id', protect, getTask);
router.patch('/:id/status', protect, changeTaskStatus);




// Problem solver routes - Task workflow
router.post('/:id/accept', protect, authorize('problemSolver'), checkApproved, acceptTaskAssignment);
router.post('/:id/start', protect, authorize('problemSolver'), checkApproved, startWorkingOnTask);
router.post('/:id/submit-proof', protect, authorize('problemSolver'), checkApproved, submitTaskProofHandler);
router.post('/:id/complete', protect, authorize('problemSolver'), checkApproved, completeTask);




// Authority and SuperAdmin routes
router.get('/', protect, authorize('authority', 'superAdmin'), getTasks);
router.get('/review/pending', protect, authorize('authority', 'superAdmin'), getPendingReviewTasks);
router.post('/assign', protect, authorize('authority', 'superAdmin'), assignTask);
router.post('/:id/approve', protect, authorize('authority', 'superAdmin'), approveTaskSubmission);
router.post('/:id/reject', protect, authorize('authority', 'superAdmin'), rejectTaskSubmission);
router.post('/:id/reward', protect, authorize('authority', 'superAdmin'), grantReward);




// SuperAdmin only routes
router.get('/statistics/counts', protect, authorize('superAdmin', 'authority'), getTaskStatistics);
router.get('/statistics/solvers', protect, authorize('superAdmin'), getSolverStatistics);
router.post('/sync-reports', protect, authorize('superAdmin'), syncCompletedTasksWithReports);



export default router;
