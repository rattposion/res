import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import {
  LayoutDashboard, ShoppingCart, Truck, Smartphone, Monitor, Package, DollarSign, TrendingUp, FileText, Shield, Globe, CreditCard, Headphones, Bot, Palette, Store, Users, BarChart3, Zap, Award, QrCode, Mic, Trophy
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  permission?: string;
  roles?: ('admin' | 'gerente' | 'garcom' | 'caixa')[];
}

const navGroups: NavGroup[] = [
  {
    title: 'Operação',
    items: [
      {
        label: 'Dashboard',
        path: '/dashboard',
        icon: <LayoutDashboard className="w-5 h-5" />,
        permission: 'dashboard.view'
      },
      {
        label: 'PDV & Pedidos',
        path: '/pos',
        icon: <ShoppingCart className="w-5 h-5" />,
        permission: 'pdv.view'
      },
      {
        label: 'Delivery',
        path: '/delivery',
        icon: <Truck className="w-5 h-5" />,
        permission: 'delivery.view'
      },
      {
        label: 'App do Garçom',
        path: '/waiter',
        icon: <Smartphone className="w-5 h-5" />,
        permission: 'waiter.view'
      },
      {
        label: 'Autoatendimento',
        path: '/totem',
        icon: <Monitor className="w-5 h-5" />,
        permission: 'totem.view'
      },
    ]
  },
  {
    title: 'Gestão',
    items: [
      {
        label: 'Estoque & Ficha Técnica',
        path: '/inventory',
        icon: <Package className="w-5 h-5" />,
        permission: 'inventory.view'
      },
      {
        label: 'Financeiro',
        path: '/financial',
        icon: <DollarSign className="w-5 h-5" />,
        permission: 'financial.view'
      },
      {
        label: 'Marketing & Fidelidade',
        path: '/marketing',
        icon: <TrendingUp className="w-5 h-5" />,
        permission: 'marketing.view'
      },
      {
        label: 'Fiscal',
        path: '/fiscal',
        icon: <FileText className="w-5 h-5" />,
        permission: 'fiscal.view'
      },
      {
        label: 'Suporte',
        path: '/support',
        icon: <Headphones className="w-5 h-5" />,
        permission: 'support.view'
      },
    ]
  },
  {
    title: 'Avançado',
    items: [
      {
        label: 'Segurança',
        path: '/security',
        icon: <Shield className="w-5 h-5" />,
        permission: 'security.view',
        roles: ['admin']
      },
      {
        label: 'Multitenancy',
        path: '/multitenancy',
        icon: <Globe className="w-5 h-5" />,
        permission: 'multitenancy.view',
        roles: ['admin']
      },
      {
        label: 'Licenciamento',
        path: '/licensing',
        icon: <CreditCard className="w-5 h-5" />,
        permission: 'licensing.view',
        roles: ['admin']
      },
      {
        label: 'IA',
        path: '/ai',
        icon: <Bot className="w-5 h-5" />,
        permission: 'ai.view',
        roles: ['admin']
      },
      {
        label: 'White Label',
        path: '/white-label',
        icon: <Palette className="w-5 h-5" />,
        permission: 'white-label.view',
        roles: ['admin']
      },
    ]
  },
  {
    title: 'Integrações',
    items: [
      {
        label: 'Integrações',
        path: '/integrations',
        icon: <Zap className="w-5 h-5" />,
        permission: 'integrations.view',
        roles: ['admin']
      },
    ]
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const location = useLocation();
  const { user, hasPermission, hasRole } = useUser();

  const canAccessItem = (item: NavItem): boolean => {
    if (!user) return false;
    
    // Verificar permissão específica
    if (item.permission && !hasPermission(item.permission)) {
      return false;
    }
    
    // Verificar roles específicas
    if (item.roles && !hasRole(item.roles)) {
      return false;
    }
    
    return true;
  };

  const getFilteredNavGroups = () => {
    return navGroups.map(group => ({
      ...group,
      items: group.items.filter(canAccessItem)
    })).filter(group => group.items.length > 0);
  };

  return (
    <aside className={`bg-gray-900 text-white w-64 min-h-screen transition-transform duration-300 ease-in-out shadow-lg ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight">SaaS Restaurante</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        {user && (
          <div className="mb-6 p-3 bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="text-sm font-medium text-white">{user.name}</div>
                <div className="text-xs text-gray-400">{user.role}</div>
              </div>
            </div>
          </div>
        )}
        
        <nav className="space-y-6">
          {getFilteredNavGroups().map((group) => (
            <div key={group.title}>
              <div className="text-xs uppercase text-gray-400 font-semibold mb-2 px-3 tracking-wider">{group.title}</div>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors font-medium text-sm ${
                      location.pathname === item.path
                        ? 'bg-blue-600 text-white shadow'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
};