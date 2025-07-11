import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { 
  Home, 
  ShoppingCart, 
  Users, 
  Truck, 
  Package, 
  DollarSign, 
  Receipt, 
  Gift, 
  FileText, 
  MessageSquare, 
  Brain, 
  Palette,
  Settings,
  BarChart3,
  MapPin,
  Scale,
  Award,
  Shield,
  Zap,
  Globe,
  CreditCard,
  Bot,
  Monitor,
  Smartphone,
  Store,
  Activity,
  TrendingUp,
  Target,
  Star,
  Bell,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Download,
  RefreshCw,
  Edit,
  Trash2,
  MoreHorizontal
} from 'lucide-react';

const Navigation: React.FC = () => {
  const { hasPermission } = useUser();

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: Home,
      description: 'Visão geral do sistema',
      permission: 'dashboard.view'
    },
    {
      title: 'PDV',
      path: '/pos',
      icon: ShoppingCart,
      description: 'Sistema de vendas',
      permission: 'pdv.view'
    },
    {
      title: 'Mesas',
      path: '/tables',
      icon: MapPin,
      description: 'Gestão de mesas',
      permission: 'pdv.view'
    },
    {
      title: 'Delivery',
      path: '/delivery',
      icon: Truck,
      description: 'Gestão de entregas',
      permission: 'delivery.view'
    },
    {
      title: 'Entregadores',
      path: '/delivery-driver',
      icon: Users,
      description: 'App dos entregadores',
      permission: 'delivery.view'
    },
    {
      title: 'Estoque',
      path: '/inventory',
      icon: Package,
      description: 'Controle de estoque',
      permission: 'inventory.view'
    },
    {
      title: 'Financeiro',
      path: '/financial',
      icon: DollarSign,
      description: 'Gestão financeira',
      permission: 'financial.view'
    },
    {
      title: 'Garçom',
      path: '/waiter',
      icon: Smartphone,
      description: 'App do garçom',
      permission: 'waiter.view'
    },
    {
      title: 'Marketing',
      path: '/marketing',
      icon: Gift,
      description: 'Marketing e fidelidade',
      permission: 'marketing.view'
    },
    {
      title: 'Fiscal',
      path: '/fiscal',
      icon: FileText,
      description: 'Gestão fiscal',
      permission: 'fiscal.view'
    },
    {
      title: 'Suporte',
      path: '/support',
      icon: MessageSquare,
      description: 'Central de suporte',
      permission: 'support.view'
    },
    {
      title: 'IA Analytics',
      path: '/ai',
      icon: Brain,
      description: 'Análise com IA',
      permission: 'ai.view',
      badge: 'Beta'
    },
    {
      title: 'White Label',
      path: '/white-label',
      icon: Palette,
      description: 'Personalização de marca',
      permission: 'white-label.view'
    },
    {
      title: 'Segurança',
      path: '/security',
      icon: Shield,
      description: 'Configurações de segurança',
      permission: 'security.view'
    },
    {
      title: 'Multitenancy',
      path: '/multitenancy',
      icon: Globe,
      description: 'Gestão multi-tenant',
      permission: 'multitenancy.view'
    },
    {
      title: 'Licenciamento',
      path: '/licensing',
      icon: CreditCard,
      description: 'Controle de licenças',
      permission: 'licensing.view'
    },
    {
      title: 'Integrações',
      path: '/integrations',
      icon: Zap,
      description: 'Integrações externas',
      permission: 'integrations.view'
    },
    {
      title: 'iFood',
      path: '/ifood',
      icon: Truck,
      description: 'Integração iFood',
      permission: 'integrations.view'
    },
    {
      title: 'TEF POS',
      path: '/tef-pos',
      icon: CreditCard,
      description: 'Terminal de pagamento',
      permission: 'integrations.view'
    },
    {
      title: 'Google Maps',
      path: '/google-maps',
      icon: MapPin,
      description: 'Integração Google Maps',
      permission: 'integrations.view'
    },
    {
      title: 'WhatsApp',
      path: '/whatsapp',
      icon: MessageSquare,
      description: 'Integração WhatsApp',
      permission: 'integrations.view'
    },
    {
      title: 'Autoatendimento',
      path: '/totem',
      icon: Monitor,
      description: 'Totem self-service',
      permission: 'totem.view'
    }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    !item.permission || hasPermission(item.permission)
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredMenuItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => `
            group relative p-6 bg-white rounded-xl shadow-sm border-2 transition-all duration-200 hover:shadow-md hover:scale-105
            ${isActive 
              ? 'border-blue-500 bg-blue-50 shadow-md' 
              : 'border-gray-200 hover:border-blue-300'
            }
          `}
        >
          <div className="flex items-start space-x-4">
            <div className={`
              p-3 rounded-lg transition-colors
              ${item.path === '/ai' 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                : 'bg-gray-100 group-hover:bg-blue-100'
              }
            `}>
              <item.icon className="w-6 h-6" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full font-medium">
                    {item.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">{item.description}</p>
            </div>
          </div>
          
          {/* Active indicator */}
          <div className={`
            absolute top-2 right-2 w-2 h-2 rounded-full transition-colors
            ${item.path === '/ai' ? 'bg-purple-500' : 'bg-blue-500'}
            opacity-0 group-hover:opacity-100
          `} />
        </NavLink>
      ))}
    </div>
  );
};

export default Navigation;