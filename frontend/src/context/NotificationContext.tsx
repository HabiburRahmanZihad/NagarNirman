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
  type: 'success' | 'error' | 'info' | 'warning' | 'task_assigned' | 'task_approved' | 'report_submitted';
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
      const response = await notificationAPI.getAll({ limit: 50 });

      if (!response || typeof response !== 'object') {
        setNotifications([]);
        return;
      }

      // Handle API response format
      let dataArray: any[] = [];

      if (Array.isArray(response)) {
        dataArray = response;
      } else if (response.data && Array.isArray(response.data)) {
        dataArray = response.data;
      }

      // Transform notifications
      if (Array.isArray(dataArray) && dataArray.length > 0) {
        const transformed = dataArray
          .filter((n: any) => n && typeof n === 'object')
          .map((n: any) => ({
            _id: n._id || n.id,
            id: n._id || n.id,
            title: n.title || 'Notification',
            message: n.message || '',
            type: n.type || 'info',
            timestamp: new Date(n.createdAt || new Date()),
            createdAt: n.createdAt,
            read: n.read ?? false,
            actionUrl: n.actionUrl,
          }));

        setNotifications(transformed);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch notifications on mount and set up polling
  useEffect(() => {
    if (isAuthenticated) {
      // Fetch immediately
      fetchNotifications();

      // Poll for new notifications every 30 seconds
      const interval = setInterval(() => {
        fetchNotifications();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, fetchNotifications]);

  const addNotification = useCallback((notification: Omit<Notification, '_id' | 'id' | 'timestamp' | 'read'>) => {
    const id = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: Notification = {
      ...notification,
      _id: id,
      id: id,
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
        toast(toastMessage, { icon: '⚠️', duration: 4000 });
        break;
      default:
        toast(toastMessage, { duration: 4000 });
    }

    // Browser notification (if permission granted)
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/logo/logo.png',
        badge: '/logo/logo.png',
        tag: id,
      });
    }
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    if (!id) return;

    // Update local state immediately
    setNotifications(prev =>
      prev.map(n => (n.id === id || n._id === id ? { ...n, read: true } : n))
    );

    try {
      // Update backend in background
      await notificationAPI.markAsRead(id);
    } catch (error) {
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
