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
} from '../controllers/taskController.js';
import { protect, authorize, checkApproved } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.get('/my-tasks', protect, checkApproved, getMyTasks);
router.get('/:id', protect, getTask);
router.patch('/:id/status', protect, changeTaskStatus);

// Problem solver routes
router.post('/:id/complete', protect, authorize('problemSolver', 'ngo'), checkApproved, completeTask);

// Authority and SuperAdmin routes
router.get('/', protect, authorize('authority', 'superAdmin'), getTasks);
router.post('/assign', protect, authorize('authority', 'superAdmin'), assignTask);
router.post('/:id/reward', protect, authorize('authority', 'superAdmin'), grantReward);

export default router;
