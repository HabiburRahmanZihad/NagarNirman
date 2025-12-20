import {
  getUserEarthquakeNotifications,
  getEarthquakeNotificationsByAlertLevel,
  markEarthquakeNotificationsAsRead,
  getEarthquakeNotificationStats,
  deleteOldEarthquakeNotifications,
} from '../services/earthquakeNotificationService.js';

/**
 * Get user's earthquake notifications
 * GET /api/earthquakes/:userId/notifications
 */
export const getUserNotificationsController = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20, skip = 0, read } = req.query;

    const options = {
      limit: parseInt(limit),
      skip: parseInt(skip),
      read: read === undefined ? undefined : read === 'true',
    };

    const notifications = await getUserEarthquakeNotifications(userId, options);

    res.status(200).json({
      success: true,
      data: notifications,
      count: notifications.length,
      message: 'User earthquake notifications retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error: error.message,
    });
  }
};

/**
 * Get notifications by alert level
 * GET /api/earthquakes/:userId/notifications/alert-level/:alertLevel
 */
export const getNotificationsByAlertLevelController = async (req, res) => {
  try {
    const { userId, alertLevel } = req.params;

    const validAlertLevels = ['Red', 'Orange', 'Yellow', 'Green'];
    if (!validAlertLevels.includes(alertLevel)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid alert level. Must be: Red, Orange, Yellow, or Green',
      });
    }

    const notifications = await getEarthquakeNotificationsByAlertLevel(userId, alertLevel);

    res.status(200).json({
      success: true,
      data: notifications,
      count: notifications.length,
      alertLevel,
    });
  } catch (error) {
    console.error('Error fetching notifications by alert level:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error: error.message,
    });
  }
};

/**
 * Mark notifications as read
 * POST /api/earthquakes/:userId/notifications/read
 * Body: { notificationIds: ['id1', 'id2'] } or empty to mark all as read
 */
export const markNotificationsAsReadController = async (req, res) => {
  try {
    const { userId } = req.params;
    const { notificationIds } = req.body;

    const result = await markEarthquakeNotificationsAsRead(userId, notificationIds);

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} notification(s) marked as read`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking notifications as read',
      error: error.message,
    });
  }
};

/**
 * Get notification statistics
 * GET /api/earthquakes/:userId/notifications/stats
 */
export const getNotificationStatsController = async (req, res) => {
  try {
    const { userId } = req.params;

    const stats = await getEarthquakeNotificationStats(userId);

    res.status(200).json({
      success: true,
      data: stats,
      message: 'Notification statistics retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching notification stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message,
    });
  }
};

/**
 * Admin: Cleanup old notifications
 * POST /api/earthquakes/admin/cleanup-notifications
 * Body: { daysOld: 30 }
 */
export const cleanupOldNotificationsController = async (req, res) => {
  try {
    const { daysOld = 30 } = req.body;

    const result = await deleteOldEarthquakeNotifications(daysOld);

    res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} notifications older than ${daysOld} days`,
      deletedCount: result.deletedCount,
      daysOld,
    });
  } catch (error) {
    console.error('Error cleaning up notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Error cleaning up notifications',
      error: error.message,
    });
  }
};

export {
  getUserNotificationsController as getUserNotifications,
  getNotificationsByAlertLevelController as getNotificationsByAlertLevel,
  markNotificationsAsReadController as markNotificationsAsRead,
  getNotificationStatsController as getNotificationStats,
  cleanupOldNotificationsController as cleanupOldNotifications,
};
