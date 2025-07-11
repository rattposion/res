import React, { useState } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import { Card, Button, Badge } from './';
import { 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  XCircle, 
  X, 
  Check,
  Trash2,
  Clock
} from 'lucide-react';
import { NotificationType } from '../../contexts/NotificationContext';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const getNotificationStyles = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return {
        bg: 'bg-green-50 border-green-200',
        icon: 'text-green-500',
        title: 'text-green-800',
        message: 'text-green-700',
        iconComponent: CheckCircle
      };
    case 'error':
      return {
        bg: 'bg-red-50 border-red-200',
        icon: 'text-red-500',
        title: 'text-red-800',
        message: 'text-red-700',
        iconComponent: XCircle
      };
    case 'warning':
      return {
        bg: 'bg-yellow-50 border-yellow-200',
        icon: 'text-yellow-500',
        title: 'text-yellow-800',
        message: 'text-yellow-700',
        iconComponent: AlertCircle
      };
    case 'info':
      return {
        bg: 'bg-blue-50 border-blue-200',
        icon: 'text-blue-500',
        title: 'text-blue-800',
        message: 'text-blue-700',
        iconComponent: Info
      };
  }
};

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Agora';
  if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h atrás`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d atrás`;
  
  return date.toLocaleDateString('pt-BR');
};

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  onClose
}) => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    removeNotification, 
    clearAllNotifications 
  } = useNotifications();

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => !n.read);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="w-96 h-full bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Notificações
              </h2>
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filters */}
          <div className="flex space-x-2 mt-4">
            <Button
              variant={filter === 'all' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Todas ({notifications.length})
            </Button>
            <Button
              variant={filter === 'unread' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilter('unread')}
            >
              Não lidas ({unreadCount})
            </Button>
          </div>

          {/* Actions */}
          <div className="flex space-x-2 mt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              <Check className="w-4 h-4 mr-1" />
              Marcar todas como lidas
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllNotifications}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Limpar todas
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Bell className="w-12 h-12 mb-4" />
              <p className="text-lg font-medium">Nenhuma notificação</p>
              <p className="text-sm">
                {filter === 'all' ? 'Você está em dia!' : 'Todas as notificações foram lidas'}
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {filteredNotifications.map((notification) => {
                const styles = getNotificationStyles(notification.type);
                const IconComponent = styles.iconComponent;

                return (
                  <Card
                    key={notification.id}
                    className={`p-4 border-l-4 border-l-${notification.type === 'success' ? 'green' : notification.type === 'error' ? 'red' : notification.type === 'warning' ? 'yellow' : 'blue'}-500 ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <IconComponent className={`w-5 h-5 ${styles.icon} flex-shrink-0 mt-0.5`} />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-sm font-medium ${styles.title}`}>
                            {notification.title}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">
                              {formatTimeAgo(notification.timestamp)}
                            </span>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                        
                        {notification.message && (
                          <p className={`text-sm ${styles.message} mt-1`}>
                            {notification.message}
                          </p>
                        )}
                        
                        {notification.action && (
                          <button
                            onClick={notification.action.onClick}
                            className={`text-sm font-medium ${styles.icon} hover:opacity-80 mt-2`}
                          >
                            {notification.action.label}
                          </button>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            title="Marcar como lida"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => removeNotification(notification.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                          title="Remover"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 