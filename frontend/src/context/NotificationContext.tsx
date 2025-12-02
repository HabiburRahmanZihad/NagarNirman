'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import toast from 'react-hot-toast';
import { notificationAPI } from '@/utils/api';
import { useAuth } from './AuthContext';

interface Notification {
  _id: string;
  id?: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  timestamp: Date;
  createdAt?: Date;
  read: boolean;
  actionUrl?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, '_id' | 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
  clearAllNotifications: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  fetchNotifications: () => Promise<void>;
  isLoading: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const unreadCount = notifications.filter(n => !n.read).length;

  // Fetch notifications from backend
  const fetchNotifications = useCallback(async () => {
    // Skip fetching notifications if not authenticated
    if (!isAuthenticated) {
      setNotifications([]);
      return;
    }

    try {
      setIsLoading(true);

      // Try to fetch notifications with a timeout
      let response;
      try {
        response = await Promise.race([
          notificationAPI.getAll({ limit: 50 }),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Notification fetch timeout')), 5000)
          )
        ]);
      } catch (fetchError) {
        // If fetch fails, just set empty notifications and return
        setNotifications([]);
        setIsLoading(false);
        return;
      }

      // Validate response is an object
      if (!response || typeof response !== 'object') {
        setNotifications([]);
        setIsLoading(false);
        return;
      }

      // Handle different response formats safely
      let dataArray: any[] = [];

      if (Array.isArray(response)) {
        dataArray = response;
      } else if (response && typeof response === 'object' && 'data' in response) {
        if (Array.isArray(response.data)) {
          dataArray = response.data;
        }
      }

      // Transform and set notifications if we have data
      if (Array.isArray(dataArray) && dataArray.length > 0) {
        const transformedNotifications = dataArray
          .filter((notif: any) => notif && typeof notif === 'object')
          .map((notif: any) => {
            try {
              const id = notif._id || notif.id || `notif-${Date.now()}-${Math.random()}`;
              return {
                ...notif,
                _id: id,
                id: id,
                title: notif.title || 'Notification',
                message: notif.message || '',
                type: (notif.type || 'info') as 'success' | 'error' | 'info' | 'warning',
                timestamp: notif.createdAt ? new Date(notif.createdAt) : new Date(),
                read: notif.read ?? false,
              };
            } catch (transformError) {
              console.error('Error transforming notification:', transformError);
              return null;
            }
          })
          .filter((notif: any) => notif !== null);

        setNotifications(transformedNotifications);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      // Silently handle any unexpected errors
      console.debug('Notification fetch error:', error instanceof Error ? error.message : 'Unknown error');
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch notifications on mount and set up polling
  useEffect(() => {
    if (isAuthenticated) {
      // Wrap fetch in try-catch to handle backend not having notifications endpoint
      Promise.resolve()
        .then(() => fetchNotifications())
        .catch(() => {
          // Silently fail if notifications aren't available
          setIsLoading(false);
        });

      // Poll for new notifications every 30 seconds
      const interval = setInterval(() => {
        Promise.resolve()
          .then(() => fetchNotifications())
          .catch(() => {
            // Silently ignore polling errors
          });
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, fetchNotifications]);

  const addNotification = useCallback((notification: Omit<Notification, '_id' | 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      _id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Show toast notification
    const toastMessage = `${notification.title}: ${notification.message}`;
    switch (notification.type) {
      case 'success':
        toast.success(toastMessage, { duration: 4000 });
        break;
      case 'error':
        toast.error(toastMessage, { duration: 5000 });
        break;
      case 'warning':
        toast(toastMessage, {
          icon: '⚠️',
          duration: 4000,
        });
        break;
      default:
        toast(toastMessage, { duration: 4000 });
    }

    // Browser notification (if permission granted)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/logo/logo.png',
        badge: '/logo/logo.png',
        tag: newNotification.id,
      });
    }
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    if (!id) return;

    // Update local state immediately for better UX
    setNotifications(prev =>
      prev.map(n => (n.id === id || n._id === id ? { ...n, read: true } : n))
    );

    try {
      // Update backend in background
      await notificationAPI.markAsRead(id);
    } catch (error) {
      // Silently fail - local state is already updated
      console.error('Failed to mark notification as read:', error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    // Update local state immediately
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

    try {
      // Update backend in background
      await notificationAPI.markAllAsRead();
    } catch (error) {
      // Silently fail - local state is already updated
      console.error('Failed to mark all notifications as read:', error);
    }
  }, []);

  const clearNotification = useCallback(async (id: string) => {
    if (!id) return;

    // Update local state immediately
    setNotifications(prev => prev.filter(n => n.id !== id && n._id !== id));

    try {
      // Delete from backend in background
      await notificationAPI.delete(id);
    } catch (error) {
      // Silently fail - local state is already updated
      console.error('Failed to delete notification:', error);
    }
  }, []);

  const clearAllNotifications = useCallback(async () => {
    try {
      // Delete all from backend
      await notificationAPI.deleteAll();
      // Update local state
      setNotifications([]);
    } catch (error) {
      console.error('Failed to delete all notifications:', error);
    }
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      case 'warning':
        toast(message, { icon: '⚠️' });
        break;
      default:
        toast(message);
    }
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotification,
        clearAllNotifications,
        showToast,
        fetchNotifications,
        isLoading,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
