'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { notificationApi } from '@/lib/notification-api';
import { NotificationFilters, Notification, NotificationResponse } from '@/types/notification';
import toast from 'react-hot-toast';

/**
 * Custom hook for managing notifications in the catering marketplace
 */
export const useNotifications = () => {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<NotificationFilters>({});

  // Get current user ID from session
  const getCurrentUserId = useCallback(async () => {
    if (!session?.user?.email) return null;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/email/${session.user.email}`);
      const userData = await response.json();
      return userData?.id || null;
    } catch (error) {
      console.error('Error fetching user ID:', error);
      return null;
    }
  }, [session?.user?.email]);

  // Fetch notifications
  const fetchNotifications = useCallback(async (customFilters?: NotificationFilters) => {
    const userId = session?.user?.id || (await getCurrentUserId());
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await notificationApi.getUserNotifications(
        userId,
        { ...filters, ...customFilters, page }
      );
      
      setNotifications(response.notifications);
      setTotal(response.total);
      setTotalPages(response.totalPages);
      setUnreadCount(response.unreadCount);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch notifications';
      setError(errorMessage);
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id, getCurrentUserId, filters, page]);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    const userId = session?.user?.id || (await getCurrentUserId());
    if (!userId) return;

    try {
      const response = await notificationApi.getUnreadCount(userId);
      setUnreadCount(response.unreadCount);
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  }, [session?.user?.id, getCurrentUserId]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await notificationApi.updateNotification(notificationId, true);
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      toast.error('Failed to mark notification as read');
      console.error('Error marking notification as read:', err);
    }
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    const userId = session?.user?.id || (await getCurrentUserId());
    if (!userId) return;

    try {
      await notificationApi.markAllAsRead(userId);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (err) {
      toast.error('Failed to mark all as read');
      console.error('Error marking all as read:', err);
    }
  }, [session?.user?.id, getCurrentUserId]);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId: string) => {
    const userId = session?.user?.id || (await getCurrentUserId());
    if (!userId) return;

    try {
      await notificationApi.deleteNotification(notificationId, userId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      setTotal(prev => Math.max(0, prev - 1));
      toast.success('Notification deleted');
    } catch (err) {
      toast.error('Failed to delete notification');
      console.error('Error deleting notification:', err);
    }
  }, [session?.user?.id, getCurrentUserId]);

  // Bulk delete notifications
  const bulkDeleteNotifications = useCallback(async (notificationIds: string[]) => {
    const userId = session?.user?.id || (await getCurrentUserId());
    if (!userId) return;

    try {
      await notificationApi.bulkDeleteNotifications({
        userId,
        notificationIds
      });
      setNotifications(prev => prev.filter(n => !notificationIds.includes(n.id)));
      setTotal(prev => Math.max(0, prev - notificationIds.length));
      toast.success(`${notificationIds.length} notifications deleted`);
    } catch (err) {
      toast.error('Failed to delete notifications');
      console.error('Error deleting notifications:', err);
    }
  }, [session?.user?.id, getCurrentUserId]);

  // Update filters
  const updateFilters = useCallback((newFilters: NotificationFilters) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  // Initial fetch
  useEffect(() => {
    if (session?.user) {
      fetchNotifications();
      fetchUnreadCount();

      // Poll for new notifications every 30 seconds
      const interval = setInterval(() => {
        fetchUnreadCount();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [session?.user, fetchNotifications, fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    total,
    page,
    totalPages,
    loading,
    error,
    filters,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    bulkDeleteNotifications,
    updateFilters,
    setPage,
  };
};

export default useNotifications;
