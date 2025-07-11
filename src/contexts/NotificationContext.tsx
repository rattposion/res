import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Bell, CheckCircle, AlertCircle, Info, XCircle, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  autoClose?: boolean;
  duration?: number;
}

export interface Toast {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  toasts: Toast[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  removeToast: (id: string) => void;
  clearAllNotifications: () => void;
  clearAllToasts: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [notificationIdCounter, setNotificationIdCounter] = useState(0);
  const [toastIdCounter, setToastIdCounter] = useState(0);

  // Carregar notificações do localStorage
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        setNotifications(parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        })));
      } catch (error) {
        console.error('Erro ao carregar notificações:', error);
      }
    }
  }, []);

  // Salvar notificações no localStorage
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newId = `notification_${Date.now()}_${notificationIdCounter}`;
    setNotificationIdCounter(prev => prev + 1);
    
    const newNotification: Notification = {
      ...notification,
      id: newId,
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Auto-close se configurado
    if (notification.autoClose !== false) {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, notification.duration || 5000);
    }
  };

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const newId = `toast_${Date.now()}_${toastIdCounter}`;
    setToastIdCounter(prev => prev + 1);
    
    const newToast: Toast = {
      ...toast,
      id: newId
    };

    setToasts(prev => [...prev, newToast]);

    // Auto-remove toast
    setTimeout(() => {
      removeToast(newToast.id);
    }, toast.duration || 4000);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const clearAllToasts = () => {
    setToasts([]);
  };

  const value: NotificationContextType = {
    notifications,
    toasts,
    unreadCount,
    addNotification,
    addToast,
    markAsRead,
    markAllAsRead,
    removeNotification,
    removeToast,
    clearAllNotifications,
    clearAllToasts
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Helpers para criar notificações rapidamente
export const useNotificationHelpers = () => {
  const { addNotification, addToast } = useNotifications();

  const success = (title: string, message?: string) => {
    addNotification({ type: 'success', title, message: message || '' });
    addToast({ type: 'success', title, message });
  };

  const error = (title: string, message?: string) => {
    addNotification({ type: 'error', title, message: message || '' });
    addToast({ type: 'error', title, message });
  };

  const warning = (title: string, message?: string) => {
    addNotification({ type: 'warning', title, message: message || '' });
    addToast({ type: 'warning', title, message });
  };

  const info = (title: string, message?: string) => {
    addNotification({ type: 'info', title, message: message || '' });
    addToast({ type: 'info', title, message });
  };

  return { success, error, warning, info };
}; 