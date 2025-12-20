// Earthquake Notification Service
// Creates notifications for users based on earthquake location and their location preferences

import { ObjectId } from 'mongodb';
import { getDB } from '../config/db.js';
import { calculateDistance } from './usgsService.js';
import { createNotification } from '../models/Notification.js';



const NOTIFICATION_RADIUS_KM = 150; // Notify users within 150km of earthquake



/**
 * Create earthquake notifications for affected users
 * @param {Object} earthquake - Earthquake data with latitude, longitude, magnitude, etc.
 */
export const createEarthquakeNotifications = async (earthquake) => {
  try {
    const { latitude, longitude, magnitude, location, alertLevel } = earthquake;

    if (!latitude || !longitude) {
      console.error('Invalid earthquake coordinates for notifications');
      return { notified: 0, failed: 0 };
    }

    // Get all users with location saved
    const usersCollection = getDB().collection('users');
    const users = await usersCollection
      .find({
        'location.latitude': { $exists: true },
        'location.longitude': { $exists: true },
      })
      .toArray();

    let notified = 0;
    let failed = 0;

    // Send notifications to nearby users
    for (const user of users) {
      try {
        const distance = calculateDistance(
          user.location.latitude,
          user.location.longitude,
          latitude,
          longitude
        );

        // Check if user is within notification radius or if earthquake is high alert
        const shouldNotify =
          distance <= NOTIFICATION_RADIUS_KM || alertLevel === 'Red' || alertLevel === 'Orange';

        if (shouldNotify) {
          const notificationData = {
            userId: user._id.toString(),
            title: `Earthquake Alert: ${location}`,
            message: `A magnitude ${magnitude} earthquake occurred ${distance.toFixed(1)}km from your location. Please take necessary precautions.`,
            type: 'earthquake_alert',
            actionUrl: `/earthquakes/${earthquake._id || earthquake.eventId}`,
            metadata: {
              earthquakeId: earthquake._id ? earthquake._id.toString() : earthquake.eventId,
              magnitude,
              location,
              distance,
              alertLevel,
              userLatitude: user.location.latitude,
              userLongitude: user.location.longitude,
            },
          };

          await createNotification(notificationData);
          notified++;

          // Log notification
          // console.log(
          //   `📢 Notification sent to user ${user._id}: ${distance.toFixed(1)}km away`
          // );
        }
      } catch (error) {
        console.error(`Failed to notify user ${user._id}:`, error.message);
        failed++;
      }
    }

    return { notified, failed, totalUsers: users.length };
  } catch (error) {
    console.error('Error creating earthquake notifications:', error);
    return { notified: 0, failed: 0, error: error.message };
  }
};




/**
 * Get earthquake notifications for a specific user
 * @param {string} userId - User ID
 * @param {Object} options - Query options (limit, skip, read status)
 * @returns {Promise<Array>} Array of notifications
 */
export const getUserEarthquakeNotifications = async (userId, options = {}) => {
  try {
    const { limit = 10, skip = 0, read = null } = options;

    if (!ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID');
    }

    const notificationsCollection = getDB().collection('notifications');
    const filter = {
      userId: new ObjectId(userId),
      type: 'earthquake_alert',
    };

    if (read !== null) {
      filter.read = read;
    }

    const notifications = await notificationsCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return notifications;
  } catch (error) {
    console.error('Error fetching earthquake notifications:', error);
    return [];
  }
};




/**
 * Get earthquake notifications by alert level and location
 * @param {string} userId - User ID
 * @param {string} alertLevel - 'Red', 'Orange', 'Yellow', or 'Green'
 * @returns {Promise<Array>} Filtered notifications
 */
export const getEarthquakeNotificationsByAlertLevel = async (userId, alertLevel) => {
  try {
    if (!ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID');
    }

    const notificationsCollection = getDB().collection('notifications');
    const notifications = await notificationsCollection
      .find({
        userId: new ObjectId(userId),
        type: 'earthquake_alert',
        'metadata.alertLevel': alertLevel,
      })
      .sort({ createdAt: -1 })
      .toArray();

    return notifications;
  } catch (error) {
    console.error('Error fetching notifications by alert level:', error);
    return [];
  }
};




/**
 * Mark earthquake notifications as read for a user
 * @param {string} userId - User ID
 * @param {Array<string>} notificationIds - Array of notification IDs (optional, if not provided marks all)
 */
export const markEarthquakeNotificationsAsRead = async (userId, notificationIds = []) => {
  try {
    if (!ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID');
    }

    const notificationsCollection = getDB().collection('notifications');
    const filter = {
      userId: new ObjectId(userId),
      type: 'earthquake_alert',
    };

    if (notificationIds.length > 0) {
      filter._id = {
        $in: notificationIds.map((id) => new ObjectId(id)),
      };
    }

    const result = await notificationsCollection.updateMany(filter, {
      $set: { read: true, readAt: new Date() },
    });

    return result.modifiedCount;
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    return 0;
  }
};




/**
 * Get earthquake statistics for notifications
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Statistics object
 */
export const getEarthquakeNotificationStats = async (userId) => {
  try {
    if (!ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID');
    }

    const notificationsCollection = getDB().collection('notifications');
    const userIdObj = new ObjectId(userId);

    const [total, unread, byAlertLevel] = await Promise.all([
      notificationsCollection.countDocuments({
        userId: userIdObj,
        type: 'earthquake_alert',
      }),
      notificationsCollection.countDocuments({
        userId: userIdObj,
        type: 'earthquake_alert',
        read: false,
      }),
      notificationsCollection
        .aggregate([
          { $match: { userId: userIdObj, type: 'earthquake_alert' } },
          { $group: { _id: '$metadata.alertLevel', count: { $sum: 1 } } },
        ])
        .toArray(),
    ]);

    return {
      total,
      unread,
      byAlertLevel: Object.fromEntries(
        byAlertLevel.map((item) => [item._id, item.count])
      ),
    };
  } catch (error) {
    console.error('Error fetching notification statistics:', error);
    return { total: 0, unread: 0, byAlertLevel: {} };
  }
};




/**
 * Delete old earthquake notifications
 * @param {number} daysOld - Delete notifications older than this many days
 */
export const deleteOldEarthquakeNotifications = async (daysOld = 30) => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const notificationsCollection = getDB().collection('notifications');
    const result = await notificationsCollection.deleteMany({
      type: 'earthquake_alert',
      createdAt: { $lt: cutoffDate },
    });

    // console.log(`Deleted ${result.deletedCount} old earthquake notifications`);
    return result.deletedCount;
  } catch (error) {
    console.error('Error deleting old notifications:', error);
    return 0;
  }
};



export default {
  createEarthquakeNotifications,
  getUserEarthquakeNotifications,
  getEarthquakeNotificationsByAlertLevel,
  markEarthquakeNotificationsAsRead,
  getEarthquakeNotificationStats,
  deleteOldEarthquakeNotifications,
  NOTIFICATION_RADIUS_KM,
};
