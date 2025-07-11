import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import {
  LayoutDashboard, 
  ShoppingCart, 
  Truck, 
  Smartphone, 
  Monitor, 
  Package, 
  DollarSign, 
  TrendingUp, 
  FileText, 
  Shield, 
  Globe, 
  CreditCard, 
  Headphones, 
  Bot, 
  Palette, 
  Store, 
  Users, 
  BarChart3, 
  Zap, 
  Award, 
  QrCode, 
  Mic, 
  Trophy,
  Settings,
  MapPin,
  MessageSquare,
  Calendar,
  Activity,
  Target,
  Star,
  Gift,
  Receipt,
  Clipboard,
  Database,
  Lock,
  Key,
  Building,
  Network,
  Wifi,
  Smartphone as Mobile,
  Tablet,
  Printer,
  Camera,
  Bell,
  AlertTriangle,
  CheckCircle,
  Clock,
  UserCheck,
  UserX,
  RefreshCw,
  Download,
  Upload,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  MoreHorizontal
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavGroup {
  title: string;
  items: NavItem[];
  icon?: React.ReactNode;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  permission?: string;
  roles?: ('admin' | 'gerente' | 'garcom' | 'caixa')[];
  badge?: string;
  description?: string;
}

const navGroups: NavGroup[] = [
  {
    title: 'Visão Geral',
    items: [
      {
        label: 'Dashboard',
        path: '/dashboard',
        icon: <LayoutDashboard className="w-5 h-5" />,
        permission: 'dashboard.view',
        description: 'Visão geral do sistema'
      },
    ]
  },
  {
    title: 'Operação',
    items: [
      {
        label: 'PDV & Vendas',
        path: '/pos',
        icon: <ShoppingCart className="w-5 h-5" />,
        permission: 'pdv.view',
        description: 'Sistema de vendas'
      },
      {
        label: 'Gestão de Mesas',
        path: '/tables',
        icon: <MapPin className="w-5 h-5" />,
        permission: 'pdv.view',
        description: 'Controle de mesas'
      },
      {
        label: 'Delivery',
        path: '/delivery',
        icon: <Truck className="w-5 h-5" />,
        permission: 'delivery.view',
        description: 'Gestão de entregas'
      },
      {
        label: 'App do Garçom',
        path: '/waiter',
        icon: <Smartphone className="w-5 h-5" />,
        permission: 'waiter.view',
        description: 'Aplicativo mobile'
      },
      {
        label: 'Autoatendimento',
        path: '/totem',
        icon: <Monitor className="w-5 h-5" />,
        permission: 'totem.view',
        description: 'Totem self-service'
      },
    ]
  },
  {
    title: 'Gestão',
    items: [
      {
        label: 'Estoque',
        path: '/inventory',
        icon: <Package className="w-5 h-5" />,
        permission: 'inventory.view',
        description: 'Controle de estoque'
      },
      {
        label: 'Financeiro',
        path: '/financial',
        icon: <DollarSign className="w-5 h-5" />,
        permission: 'financial.view',
        description: 'Gestão financeira'
      },
      {
        label: 'Marketing',
        path: '/marketing',
        icon: <TrendingUp className="w-5 h-5" />,
        permission: 'marketing.view',
        description: 'Marketing e fidelidade'
      },
      {
        label: 'Fiscal',
        path: '/fiscal',
        icon: <FileText className="w-5 h-5" />,
        permission: 'fiscal.view',
        description: 'Gestão fiscal'
      },
      {
        label: 'Suporte',
        path: '/support',
        icon: <Headphones className="w-5 h-5" />,
        permission: 'support.view',
        description: 'Central de suporte'
      },
    ]
  },
  {
    title: 'Administração',
    items: [
      {
        label: 'Segurança',
        path: '/security',
        icon: <Shield className="w-5 h-5" />,
        permission: 'security.view',
        roles: ['admin'],
        description: 'Configurações de segurança'
      },
      {
        label: 'Multitenancy',
        path: '/multitenancy',
        icon: <Globe className="w-5 h-5" />,
        permission: 'multitenancy.view',
        roles: ['admin'],
        description: 'Gestão multi-tenant'
      },
      {
        label: 'Licenciamento',
        path: '/licensing',
        icon: <CreditCard className="w-5 h-5" />,
        permission: 'licensing.view',
        roles: ['admin'],
        description: 'Controle de licenças'
      },
      {
        label: 'White Label',
        path: '/white-label',
        icon: <Palette className="w-5 h-5" />,
        permission: 'white-label.view',
        roles: ['admin'],
        description: 'Personalização de marca'
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
        roles: ['admin'],
        description: 'Integrações externas'
      },
      {
        label: 'iFood',
        path: '/ifood',
        icon: <Truck className="w-5 h-5" />,
        permission: 'integrations.view',
        roles: ['admin'],
        description: 'Integração iFood'
      },
      {
        label: 'TEF POS',
        path: '/tef-pos',
        icon: <CreditCard className="w-5 h-5" />,
        permission: 'integrations.view',
        roles: ['admin'],
        description: 'Terminal de pagamento'
      },
      {
        label: 'Google Maps',
        path: '/google-maps',
        icon: <MapPin className="w-5 h-5" />,
        permission: 'integrations.view',
        roles: ['admin'],
        description: 'Integração Google Maps'
      },
      {
        label: 'WhatsApp',
        path: '/whatsapp',
        icon: <MessageSquare className="w-5 h-5" />,
        permission: 'integrations.view',
        roles: ['admin'],
        description: 'Integração WhatsApp'
      },
    ]
  },
  {
    title: 'Inovação',
    items: [
      {
        label: 'IA Analytics',
        path: '/ai',
        icon: <Bot className="w-5 h-5" />,
        permission: 'ai.view',
        roles: ['admin'],
        description: 'Análise com IA',
        badge: 'Beta'
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500';
      case 'gerente': return 'bg-blue-500';
      case 'caixa': return 'bg-green-500';
      case 'garcom': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'gerente': return 'Gerente';
      case 'caixa': return 'Caixa';
      case 'garcom': return 'Garçom';
      default: return role;
    }
  };

  return (
    <aside className={`bg-gradient-to-b from-gray-900 to-gray-800 text-white w-64 min-h-screen transition-transform duration-300 ease-in-out shadow-xl ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">RestaurantSaaS</h2>
              <p className="text-xs text-gray-400">Sistema de Gestão</p>
            </div>
          </div>
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
        
        {/* User Info */}
        {user && (
          <div className="mb-6 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 ${getRoleColor(user.role)} rounded-full flex items-center justify-center`}>
                <span className="text-white text-sm font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white">{user.name}</div>
                <div className="text-xs text-gray-400">{getRoleLabel(user.role)}</div>
              </div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}
        
        {/* Navigation */}
        <nav className="space-y-6">
          {getFilteredNavGroups().map((group) => (
            <div key={group.title}>
              <div className="text-xs uppercase text-gray-400 font-semibold mb-3 px-3 tracking-wider flex items-center">
                {group.icon && <span className="mr-2">{group.icon}</span>}
                {group.title}
              </div>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`group flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm relative ${
                      location.pathname === item.path
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                        : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                    }`}
                    title={item.description}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`transition-colors ${
                        location.pathname === item.path 
                          ? 'text-white' 
                          : 'text-gray-400 group-hover:text-white'
                      }`}>
                        {item.icon}
                      </div>
                      <span>{item.label}</span>
                    </div>
                    
                    {/* Badge */}
                    {item.badge && (
                      <span className="px-2 py-0.5 text-xs bg-yellow-500 text-yellow-900 rounded-full font-medium">
                        {item.badge}
                      </span>
                    )}
                    
                    {/* Active indicator */}
                    {location.pathname === item.path && (
                      <div className="absolute right-2 w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
        
        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <div className="text-xs text-gray-500 text-center">
            <p>RestaurantSaaS v2.0</p>
            <p className="mt-1">© 2024 Todos os direitos reservados</p>
          </div>
        </div>
      </div>
    </aside>
  );
};