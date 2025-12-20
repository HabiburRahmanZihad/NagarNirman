// Notification Model Helper Functions (Native MongoDB)
import { ObjectId } from 'mongodb';
import { getDB } from '../config/db.js';



// Get notifications collection
export const getNotificationsCollection = () => getDB().collection('notifications');




// Create indexes for better query performance
export const createNotificationIndexes = async () => {
  const collection = getNotificationsCollection();
  try {
    await collection.createIndex({ userId: 1, read: 1 });
    await collection.createIndex({ userId: 1, createdAt: -1 });
    await collection.createIndex({ type: 1 });
    await collection.createIndex({ read: 1 });
    // console.log('Notification indexes created successfully');
  } catch (error) {
    console.error('Error creating notification indexes:', error);
  }
};




// Validate notification type
export const isValidNotificationType = (type) => {
  const validTypes = [
    'task_assigned',
    'task_accepted',
    'task_rejected_by_solver',
    'task_started',
    'task_submitted',
    'task_approved',
    'task_rejected',
    'report_submitted',
    'report_status_updated',
    'report_assigned',
    'application_approved',
    'application_rejected',
    'points_awarded',
    'system',
  ];
  return validTypes.includes(type);
};




// Create notification
export const createNotification = async (notificationData) => {
  const {
    userId,
    title,
    message,
    type = 'system',
    actionUrl,
    metadata = {},
  } = notificationData;

  // Validate required fields
  if (!userId || !title || !message) {
    throw new Error('Please provide userId, title, and message');
  }

  if (!ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }

  if (!isValidNotificationType(type)) {
    throw new Error('Invalid notification type');
  }

  // Create notification document
  const notification = {
    userId: new ObjectId(userId),
    title: title.trim(),
    message: message.trim(),
    type,
    actionUrl: actionUrl || null,
    metadata,
    read: false,
    createdAt: new Date(),
    readAt: null,
  };

  const result = await getNotificationsCollection().insertOne(notification);
  notification._id = result.insertedId;

  return notification;
};



// Get notification by ID
export const getNotificationById = async (notificationId) => {
  if (!ObjectId.isValid(notificationId)) {
    throw new Error('Invalid notification ID');
  }

  return await getNotificationsCollection().findOne({
    _id: new ObjectId(notificationId),
  });
};




// Get user's notifications with pagination
export const getUserNotifications = async (userId, options = {}) => {
  if (!ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }

  const {
    page = 1,
    limit = 20,
    unreadOnly = false,
    type = null,
  } = options;

  const skip = (page - 1) * limit;

  // Build filter
  const filter = { userId: new ObjectId(userId) };
  if (unreadOnly) {
    filter.read = false;
  }
  if (type) {
    filter.type = type;
  }

  // Get notifications
  const notifications = await getNotificationsCollection()
    .find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();

  // Get total count
  const total = await getNotificationsCollection().countDocuments(filter);

  return {
    notifications,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};




// Get unread count for user
export const getUnreadCount = async (userId) => {
  if (!ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }

  return await getNotificationsCollection().countDocuments({
    userId: new ObjectId(userId),
    read: false,
  });
};



// Mark notification as read
export const markAsRead = async (notificationId) => {
  if (!ObjectId.isValid(notificationId)) {
    throw new Error('Invalid notification ID');
  }

  const result = await getNotificationsCollection().findOneAndUpdate(
    { _id: new ObjectId(notificationId) },
    {
      $set: {
        read: true,
        readAt: new Date(),
      },
    },
    { returnDocument: 'after' }
  );

  return result;
};




// Mark all user notifications as read
export const markAllAsRead = async (userId) => {
  if (!ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }

  const result = await getNotificationsCollection().updateMany(
    { userId: new ObjectId(userId), read: false },
    {
      $set: {
        read: true,
        readAt: new Date(),
      },
    }
  );

  return result.modifiedCount;
};




// Delete notification
export const deleteNotification = async (notificationId) => {
  if (!ObjectId.isValid(notificationId)) {
    throw new Error('Invalid notification ID');
  }

  const result = await getNotificationsCollection().deleteOne({
    _id: new ObjectId(notificationId),
  });

  return result.deletedCount > 0;
};




// Delete all user notifications
export const deleteAllUserNotifications = async (userId) => {
  if (!ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }

  const result = await getNotificationsCollection().deleteMany({
    userId: new ObjectId(userId),
  });

  return result.deletedCount;
};




// Bulk create notifications (for multiple users)
export const createBulkNotifications = async (notificationsData) => {
  if (!Array.isArray(notificationsData) || notificationsData.length === 0) {
    throw new Error('Please provide an array of notification data');
  }

  // Validate and prepare notifications
  const notifications = notificationsData.map((data) => {
    const { userId, title, message, type = 'system', actionUrl, metadata = {} } = data;

    if (!userId || !title || !message) {
      throw new Error('Each notification must have userId, title, and message');
    }

    if (!ObjectId.isValid(userId)) {
      throw new Error(`Invalid user ID: ${userId}`);
    }

    if (!isValidNotificationType(type)) {
      throw new Error(`Invalid notification type: ${type}`);
    }

    return {
      userId: new ObjectId(userId),
      title: title.trim(),
      message: message.trim(),
      type,
      actionUrl: actionUrl || null,
      metadata,
      read: false,
      createdAt: new Date(),
      readAt: null,
    };
  });

  const result = await getNotificationsCollection().insertMany(notifications);
  return result.insertedCount;
};




// Clean up old read notifications (older than 30 days)
export const cleanupOldNotifications = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const result = await getNotificationsCollection().deleteMany({
    read: true,
    readAt: { $lt: thirtyDaysAgo },
  });

  return result.deletedCount;
};
