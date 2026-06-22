import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { notificationApi } from '@/lib/notification-api';
import { NotificationFilters, Notification } from '@/types/notification';
import toast from 'react-hot-toast';

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<NotificationFilters>({});

  const fetchNotifications = useCallback(async (customFilters?: NotificationFilters) => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await notificationApi.getUserNotifications(
        user.id,
        { ...filters, ...customFilters, page }
      );
      setNotifications(response.notifications);
      setTotal(response.total);
      setTotalPages(response.totalPages);
      setUnreadCount(response.unreadCount);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch notifications';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user?.id, filters, page]);

  const fetchUnreadCount = useCallback(async () => {
    if (!user?.id) return;
    try {
      const response = await notificationApi.getUnreadCount(user.id);
      setUnreadCount(response.unreadCount);
    } catch {}
  }, [user?.id]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await notificationApi.updateNotification(notificationId, true);
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch {
      toast.error('Failed to mark notification as read');
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    if (!user?.id) return;
    try {
      await notificationApi.markAllAsRead(user.id);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch {
      toast.error('Failed to mark all as read');
    }
  }, [user?.id]);

  const deleteNotification = useCallback(async (notificationId: string) => {
    if (!user?.id) return;
    try {
      await notificationApi.deleteNotification(notificationId, user.id);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      setTotal(prev => Math.max(0, prev - 1));
      toast.success('Notification deleted');
    } catch {
      toast.error('Failed to delete notification');
    }
  }, [user?.id]);

  const bulkDeleteNotifications = useCallback(async (notificationIds: string[]) => {
    if (!user?.id) return;
    try {
      await notificationApi.bulkDeleteNotifications({ userId: user.id, notificationIds });
      setNotifications(prev => prev.filter(n => !notificationIds.includes(n.id)));
      setTotal(prev => Math.max(0, prev - notificationIds.length));
      toast.success(`${notificationIds.length} notifications deleted`);
    } catch {
      toast.error('Failed to delete notifications');
    }
  }, [user?.id]);

  const updateFilters = useCallback((newFilters: NotificationFilters) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchUnreadCount();
      const interval = setInterval(() => fetchUnreadCount(), 30000);
      return () => clearInterval(interval);
    }
  }, [user, fetchNotifications, fetchUnreadCount]);

  return {
    notifications, unreadCount, total, page, totalPages,
    loading, error, filters,
    fetchNotifications, fetchUnreadCount,
    markAsRead, markAllAsRead,
    deleteNotification, bulkDeleteNotifications,
    updateFilters, setPage,
  };
};

export default useNotifications;
