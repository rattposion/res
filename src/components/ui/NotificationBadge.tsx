import React from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import { Bell } from 'lucide-react';

interface NotificationBadgeProps {
  className?: string;
  showCount?: boolean;
  maxCount?: number;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  className = '',
  showCount = true,
  maxCount = 99
}) => {
  const { unreadCount } = useNotifications();

  if (unreadCount === 0) {
    return (
      <div className={`relative ${className}`}>
        <Bell className="w-5 h-5 text-gray-400" />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Bell className="w-5 h-5 text-gray-600" />
      {showCount && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
          {unreadCount > maxCount ? `${maxCount}+` : unreadCount}
        </span>
      )}
    </div>
  );
}; 