import React from 'react';
import { useUser } from '../../contexts/UserContext';
import { UserRole } from '../../contexts/UserContext';

interface PermissionGuardProps {
  children: React.ReactNode;
  permission?: string;
  roles?: UserRole[];
  fallback?: React.ReactNode;
  showFallback?: boolean;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  permission,
  roles,
  fallback = null,
  showFallback = false
}) => {
  const { user, hasPermission, hasRole } = useUser();

  if (!user) {
    return showFallback ? fallback : null;
  }

  // Verificar permissão específica
  if (permission && !hasPermission(permission)) {
    return showFallback ? fallback : null;
  }

  // Verificar roles específicas
  if (roles && !hasRole(roles)) {
    return showFallback ? fallback : null;
  }

  return <>{children}</>;
};

// Hook para verificar permissões em componentes funcionais
export const usePermissionGuard = () => {
  const { user, hasPermission, hasRole } = useUser();

  const canAccess = (permission?: string, roles?: UserRole[]) => {
    if (!user) return false;
    
    if (permission && !hasPermission(permission)) {
      return false;
    }
    
    if (roles && !hasRole(roles)) {
      return false;
    }
    
    return true;
  };

  return { canAccess, user };
}; 