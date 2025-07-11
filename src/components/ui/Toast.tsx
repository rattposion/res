import React from 'react';
import { CheckCircle, AlertCircle, Info, XCircle, X } from 'lucide-react';
import { NotificationType } from '../../contexts/NotificationContext';

interface ToastProps {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose: () => void;
}

const getToastStyles = (type: NotificationType) => {
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

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  action,
  onClose
}) => {
  const styles = getToastStyles(type);
  const IconComponent = styles.iconComponent;

  return (
    <div
      className={`${styles.bg} border rounded-lg p-4 shadow-lg max-w-sm w-full animate-in slide-in-from-right-full duration-300`}
      role="alert"
    >
      <div className="flex items-start space-x-3">
        <IconComponent className={`w-5 h-5 ${styles.icon} flex-shrink-0 mt-0.5`} />
        
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-medium ${styles.title}`}>
            {title}
          </h4>
          {message && (
            <p className={`text-sm ${styles.message} mt-1`}>
              {message}
            </p>
          )}
          {action && (
            <button
              onClick={action.onClick}
              className={`text-sm font-medium ${styles.icon} hover:opacity-80 mt-2`}
            >
              {action.label}
            </button>
          )}
        </div>
        
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}; 