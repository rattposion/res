import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'admin' | 'gerente' | 'garcom' | 'caixa';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  lastLogin: Date;
  isActive: boolean;
  permissions: string[];
}

export interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  updateUser: (userData: Partial<User>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Permissões por módulo
const PERMISSIONS = {
  // Dashboard
  'dashboard.view': ['admin', 'gerente', 'caixa', 'garcom'],

  // PDV & Pedidos
  'pdv.view': ['admin', 'gerente', 'caixa'],
  'pdv.create': ['admin', 'gerente', 'caixa'],
  'pdv.edit': ['admin', 'gerente'],
  'pdv.delete': ['admin'],
  'pdv.reports': ['admin', 'gerente'],

  // Delivery
  'delivery.view': ['admin', 'gerente', 'caixa'],
  'delivery.manage': ['admin', 'gerente'],
  'delivery.reports': ['admin', 'gerente'],

  // Estoque
  'inventory.view': ['admin', 'gerente'],
  'inventory.manage': ['admin', 'gerente'],
  'inventory.reports': ['admin'],

  // Financeiro
  'financial.view': ['admin', 'gerente'],
  'financial.manage': ['admin'],
  'financial.reports': ['admin'],

  // Marketing
  'marketing.view': ['admin', 'gerente'],
  'marketing.manage': ['admin'],
  'marketing.reports': ['admin'],

  // Fiscal
  'fiscal.view': ['admin', 'gerente'],
  'fiscal.manage': ['admin'],
  'fiscal.reports': ['admin'],

  // Suporte
  'support.view': ['admin', 'gerente'],

  // IA
  'ai.view': ['admin'],

  // White Label
  'white-label.view': ['admin'],

  // Segurança
  'security.view': ['admin'],

  // Multitenancy
  'multitenancy.view': ['admin'],

  // Licenciamento
  'licensing.view': ['admin'],

  // Configurações
  'settings.view': ['admin'],
  'settings.manage': ['admin'],

  // Usuários
  'users.view': ['admin'],
  'users.manage': ['admin'],

  // Relatórios
  'reports.view': ['admin', 'gerente'],
  'reports.export': ['admin', 'gerente'],

  // Garçom
  'waiter.view': ['admin', 'gerente', 'garcom'],
  'waiter.manage': ['admin', 'gerente'],

  // Autoatendimento
  'totem.view': ['admin', 'gerente'],
  'totem.manage': ['admin'],

  // Integrações
  'integrations.view': ['admin'],
  'integrations.manage': ['admin'],
} as const;

// Usuários mockados
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Administrador',
    email: 'admin@restaurante.com',
    role: 'admin',
    lastLogin: new Date(),
    isActive: true,
    permissions: [
      'dashboard.view',
      'pdv.view', 'pdv.create', 'pdv.edit', 'pdv.delete', 'pdv.reports',
      'delivery.view', 'delivery.manage', 'delivery.reports',
      'inventory.view', 'inventory.manage', 'inventory.reports',
      'financial.view', 'financial.manage', 'financial.reports',
      'marketing.view', 'marketing.manage', 'marketing.reports',
      'fiscal.view', 'fiscal.manage', 'fiscal.reports',
      'support.view',
      'ai.view',
      'white-label.view',
      'security.view',
      'multitenancy.view',
      'licensing.view',
      'settings.view', 'settings.manage',
      'users.view', 'users.manage',
      'reports.view', 'reports.export',
      'waiter.view', 'waiter.manage',
      'totem.view', 'totem.manage',
      'integrations.view', 'integrations.manage'
    ]
  },
  {
    id: '2',
    name: 'João Gerente',
    email: 'gerente@restaurante.com',
    role: 'gerente',
    lastLogin: new Date(),
    isActive: true,
    permissions: [
      'dashboard.view',
      'pdv.view', 'pdv.create', 'pdv.edit', 'pdv.reports',
      'delivery.view', 'delivery.manage', 'delivery.reports',
      'inventory.view', 'inventory.manage',
      'financial.view',
      'marketing.view',
      'fiscal.view',
      'support.view',
      'reports.view', 'reports.export',
      'waiter.view', 'waiter.manage',
      'totem.view'
    ]
  },
  {
    id: '3',
    name: 'Maria Caixa',
    email: 'caixa@restaurante.com',
    role: 'caixa',
    lastLogin: new Date(),
    isActive: true,
    permissions: [
      'dashboard.view',
      'pdv.view', 'pdv.create',
      'delivery.view'
    ]
  },
  {
    id: '4',
    name: 'Pedro Garçom',
    email: 'garcom@restaurante.com',
    role: 'garcom',
    lastLogin: new Date(),
    isActive: true,
    permissions: [
      'dashboard.view',
      'waiter.view'
    ]
  }
];

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar se há usuário salvo no localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      
      // Verificar se o usuário tem dashboard.view, se não, limpar localStorage
      if (!userData.permissions.includes('dashboard.view')) {
        localStorage.removeItem('user');
        return;
      }
      
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simular login
    const foundUser = MOCK_USERS.find(u => u.email === email);
    
    if (foundUser && password === '123456') {
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(foundUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission);
  };

  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(user.role);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value: UserContextType = {
    user,
    isAuthenticated,
    login,
    logout,
    hasPermission,
    hasRole,
    updateUser
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Hook para verificar permissões específicas
export const usePermission = (permission: string): boolean => {
  const { hasPermission } = useUser();
  return hasPermission(permission);
};

// Hook para verificar roles
export const useRole = (role: UserRole | UserRole[]): boolean => {
  const { hasRole } = useUser();
  return hasRole(role);
}; 