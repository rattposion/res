import React from 'react';
import { NavLink } from 'react-router-dom';
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
  Zap
} from 'lucide-react';

const Navigation: React.FC = () => {
  const menuItems = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: Home,
      description: 'Visão geral do sistema'
    },
    {
      title: 'PDV',
      path: '/pos',
      icon: ShoppingCart,
      description: 'Sistema de vendas'
    },
    {
      title: 'Mesas',
      path: '/tables',
      icon: MapPin,
      description: 'Gestão de mesas'
    },
    {
      title: 'Delivery',
      path: '/delivery',
      icon: Truck,
      description: 'Gestão de entregas'
    },
    {
      title: 'Entregadores',
      path: '/delivery-driver',
      icon: Users,
      description: 'App dos entregadores'
    },
    {
      title: 'Estoque',
      path: '/inventory',
      icon: Package,
      description: 'Controle de estoque'
    },
    {
      title: 'Financeiro',
      path: '/financial',
      icon: DollarSign,
      description: 'Gestão financeira'
    },
    {
      title: 'Garçom',
      path: '/waiter',
      icon: Receipt,
      description: 'App do garçom'
    },
    {
      title: 'Marketing',
      path: '/marketing',
      icon: Gift,
      description: 'Marketing e fidelidade'
    },
    {
      title: 'Fiscal',
      path: '/fiscal',
      icon: FileText,
      description: 'Gestão fiscal'
    },
    {
      title: 'Suporte',
      path: '/support',
      icon: MessageSquare,
      description: 'Central de suporte'
    },
    {
      title: 'IA Analytics',
      path: '/ai',
      icon: Brain,
      description: 'Análise com IA'
    },
    {
      title: 'White Label',
      path: '/white-label',
      icon: Palette,
      description: 'Personalização de marca'
    }
  ];

  return (
    <nav className="space-y-2">
      {menuItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`
            }
            title={item.description}
          >
            <Icon className="h-5 w-5" />
            <span>{item.title}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default Navigation;