// Notification Routes
import express from 'express';
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotificationById,
  deleteAllNotifications,
} from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Get user's notifications
router.get('/', getNotifications);

// Get unread count
router.get('/unread-count', getUnreadNotificationCount);

// Mark all as read
router.put('/mark-all-read', markAllNotificationsAsRead);

// Delete all notifications
router.delete('/all', deleteAllNotifications);

// Mark single notification as read
router.put('/:id/read', markNotificationAsRead);

// Delete single notification
router.delete('/:id', deleteNotificationById);

export default router;
