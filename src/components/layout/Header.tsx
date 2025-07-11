import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { useUser } from '../../contexts/UserContext';
import { User, LogOut, Bell, Settings } from 'lucide-react';
import { UserSwitcher } from '../auth/UserSwitcher';
import { NotificationBadge } from '../ui/NotificationBadge';
import { NotificationPanel } from '../ui/NotificationPanel';

interface HeaderProps {
  title?: string;
  onMenuToggle?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  title = "Restaurant Management System", 
  onMenuToggle
}) => {
  const { user, logout, hasPermission } = useUser();
  const [showNotifications, setShowNotifications] = useState(false);

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'gerente': return 'Gerente';
      case 'caixa': return 'Caixa';
      case 'garcom': return 'Garçom';
      default: return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500';
      case 'gerente': return 'bg-blue-500';
      case 'caixa': return 'bg-green-500';
      case 'garcom': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {onMenuToggle && (
            <button
              onClick={onMenuToggle}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          {hasPermission('notifications.view') && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowNotifications(true)}
            >
              <NotificationBadge className="h-4 w-4 mr-2" />
              Notificações
            </Button>
          )}
          
          {hasPermission('settings.view') && (
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
          )}

          {user && (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 ${getRoleColor(user.role)} rounded-full flex items-center justify-center`}>
                  <span className="text-white text-sm font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  <div className="text-xs text-gray-500">{getRoleLabel(user.role)}</div>
                </div>
              </div>
              
              <UserSwitcher />
              
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Notification Panel */}
      <NotificationPanel 
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </header>
  );
};