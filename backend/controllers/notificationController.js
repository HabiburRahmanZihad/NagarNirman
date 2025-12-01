// Notification Controller (Native MongoDB)
import {
  createNotification,
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllUserNotifications,
  getNotificationById,
} from '../models/Notification.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// @desc    Get user's notifications
// @route   GET /api/notifications
// @access  Private
export const getNotifications = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    unreadOnly = false,
    type = null,
  } = req.query;

  const result = await getUserNotifications(req.user._id.toString(), {
    page: parseInt(page),
    limit: parseInt(limit),
    unreadOnly: unreadOnly === 'true',
    type: type || null,
  });

  res.status(200).json({
    success: true,
    count: result.notifications.length,
    pagination: result.pagination,
    data: result.notifications,
  });
});

// @desc    Get unread notification count
// @route   GET /api/notifications/unread-count
// @access  Private
export const getUnreadNotificationCount = asyncHandler(async (req, res) => {
  const count = await getUnreadCount(req.user._id.toString());

  res.status(200).json({
    success: true,
    data: { count },
  });
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markNotificationAsRead = asyncHandler(async (req, res) => {
  const notification = await getNotificationById(req.params.id);

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: 'Notification not found',
    });
  }

  // Check if notification belongs to user
  if (notification.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this notification',
    });
  }

  const updatedNotification = await markAsRead(req.params.id);

  res.status(200).json({
    success: true,
    data: updatedNotification,
  });
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/mark-all-read
// @access  Private
export const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
  const count = await markAllAsRead(req.user._id.toString());

  res.status(200).json({
    success: true,
    message: `${count} notifications marked as read`,
    data: { count },
  });
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotificationById = asyncHandler(async (req, res) => {
  const notification = await getNotificationById(req.params.id);

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: 'Notification not found',
    });
  }

  // Check if notification belongs to user
  if (notification.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this notification',
    });
  }

  await deleteNotification(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Notification deleted successfully',
  });
});

// @desc    Delete all user notifications
// @route   DELETE /api/notifications/all
// @access  Private
export const deleteAllNotifications = asyncHandler(async (req, res) => {
  const count = await deleteAllUserNotifications(req.user._id.toString());

  res.status(200).json({
    success: true,
    message: `${count} notifications deleted`,
    data: { count },
  });
});
