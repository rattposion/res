import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../components/ui';
import { UserInfo } from '../components/Dashboard/UserInfo';
import { NotificationDemo } from '../components/dashboard/NotificationDemo';
import { useUser } from '../contexts/UserContext';
import { useNotificationHelpers } from '../contexts/NotificationContext';
import { 
  Users, 
  ShoppingCart, 
  Truck, 
  Monitor, 
  Package, 
  DollarSign, 
  MessageSquare, 
  Settings,
  TrendingUp,
  Bell,
  Calendar,
  MapPin,
  CreditCard,
  FileText,
  Smartphone,
  Utensils,
  Store,
  BarChart3,
  Shield,
  Zap,
  Globe,
  Award,
  Headphones,
  Bot,
  Palette,
  QrCode,
  Mic,
  Trophy,
  MessageCircle,
  Check,
  Activity,
  Clock,
  Target,
  TrendingDown,
  Plus,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Star,
  Heart,
  Share2,
  MoreHorizontal
} from 'lucide-react';

interface ModuleCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  status: 'active' | 'beta' | 'coming-soon';
  route: string;
  features: string[];
  stats?: {
    value: string;
    change: number;
    trend: 'up' | 'down';
  };
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  route: string;
  badge?: string;
}

interface RecentActivity {
  id: string;
  type: 'order' | 'payment' | 'delivery' | 'inventory' | 'user';
  title: string;
  description: string;
  time: string;
  status: 'success' | 'pending' | 'error';
  amount?: number;
}

const Dashboard: React.FC = () => {
  const { user, hasPermission } = useUser();
  const { success, info } = useNotificationHelpers();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Dados mockados para demonstração
  const [recentActivities] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'order',
      title: 'Novo Pedido #1234',
      description: 'Hambúrguer + Batata + Refrigerante',
      time: '2 min atrás',
      status: 'success',
      amount: 25.90
    },
    {
      id: '2',
      type: 'payment',
      title: 'Pagamento Processado',
      description: 'Cartão de crédito - R$ 45,80',
      time: '5 min atrás',
      status: 'success',
      amount: 45.80
    },
    {
      id: '3',
      type: 'delivery',
      title: 'Delivery Entregue',
      description: 'Pedido #1230 entregue com sucesso',
      time: '12 min atrás',
      status: 'success'
    },
    {
      id: '4',
      type: 'inventory',
      title: 'Estoque Baixo',
      description: 'Hambúrguer - 5 unidades restantes',
      time: '15 min atrás',
      status: 'pending'
    },
    {
      id: '5',
      type: 'user',
      title: 'Novo Usuário',
      description: 'João Silva cadastrado no sistema',
      time: '1 hora atrás',
      status: 'success'
    }
  ]);

  const modules: ModuleCard[] = [
    // Módulos Principais
    {
      id: 'pos',
      title: 'PDV & Pedidos',
      description: 'Sistema completo de vendas, mesas e comandas',
      icon: <ShoppingCart className="w-8 h-8" />,
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      status: 'active',
      route: '/pos',
      features: ['Vendas rápidas', 'Gestão de mesas', 'Comandas digitais', 'Teclado numérico'],
      stats: { value: 'R$ 2.450', change: 12.5, trend: 'up' }
    },
    {
      id: 'delivery',
      title: 'Delivery',
      description: 'Site/app para clientes e painel de entregas',
      icon: <Truck className="w-8 h-8" />,
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      status: 'active',
      route: '/delivery',
      features: ['Site do cliente', 'App de entregadores', 'Rastreamento', 'Chat integrado'],
      stats: { value: '15 pedidos', change: 8.2, trend: 'up' }
    },
    {
      id: 'waiter',
      title: 'App do Garçom',
      description: 'Aplicativo mobile para garçons',
      icon: <Smartphone className="w-8 h-8" />,
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      status: 'active',
      route: '/waiter',
      features: ['Login por código', 'Mapa de mesas', 'Pedidos por voz', 'QR Code scanner'],
      stats: { value: '8 ativos', change: 0, trend: 'up' }
    },
    {
      id: 'totem',
      title: 'Autoatendimento',
      description: 'Totem para pedidos self-service',
      icon: <Monitor className="w-8 h-8" />,
      color: 'bg-gradient-to-br from-orange-500 to-orange-600',
      status: 'active',
      route: '/totem',
      features: ['Tela touchscreen', 'Impressora de senha', 'Checkout integrado', 'Backend cozinha']
    },

    // Módulos de Gestão
    {
      id: 'inventory',
      title: 'Estoque & Ficha Técnica',
      description: 'Controle completo de estoque e receitas',
      icon: <Package className="w-8 h-8" />,
      color: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
      status: 'active',
      route: '/inventory',
      features: ['Cadastro de insumos', 'Fichas técnicas', 'Baixa automática', 'Controle de saldo'],
      stats: { value: '156 itens', change: -2.1, trend: 'down' }
    },
    {
      id: 'financial',
      title: 'Financeiro',
      description: 'Gestão financeira e relatórios',
      icon: <DollarSign className="w-8 h-8" />,
      color: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
      status: 'active',
      route: '/financial',
      features: ['Fluxo de caixa', 'Contas a pagar/receber', 'Relatórios', 'Lançamentos automáticos'],
      stats: { value: 'R$ 8.920', change: 15.3, trend: 'up' }
    },
    {
      id: 'marketing',
      title: 'Marketing & Fidelidade',
      description: 'Cupons, cashback e programas de fidelidade',
      icon: <TrendingUp className="w-8 h-8" />,
      color: 'bg-gradient-to-br from-pink-500 to-pink-600',
      status: 'active',
      route: '/marketing',
      features: ['Cupons de desconto', 'Cashback', 'Programa de pontos', 'Motor de regras'],
      stats: { value: '234 clientes', change: 5.7, trend: 'up' }
    },
    {
      id: 'fiscal',
      title: 'Fiscal',
      description: 'Emissão de NFC-e, NFe e cupom MEI',
      icon: <FileText className="w-8 h-8" />,
      color: 'bg-gradient-to-br from-red-500 to-red-600',
      status: 'active',
      route: '/fiscal',
      features: ['NFC-e', 'NFe', 'Cupom MEI', 'Integração SEFAZ']
    },

    // Módulos Avançados
    {
      id: 'security',
      title: 'Segurança',
      description: 'Sistema robusto de segurança e auditoria',
      icon: <Shield className="w-8 h-8" />,
      color: 'bg-gradient-to-br from-gray-700 to-gray-800',
      status: 'active',
      route: '/security',
      features: ['Criptografia', 'JWT', 'Auditoria', 'Rate limiting']
    },
    {
      id: 'multitenancy',
      title: 'Multitenancy',
      description: 'Sistema multi-empresa com isolamento',
      icon: <Globe className="w-8 h-8" />,
      color: 'bg-gradient-to-br from-cyan-500 to-cyan-600',
      status: 'active',
      route: '/multitenancy',
      features: ['Isolamento de dados', 'Temas customizados', 'White-label', 'Domínios próprios']
    },
    {
      id: 'licensing',
      title: 'Licenciamento',
      description: 'Sistema de planos e pagamentos',
      icon: <CreditCard className="w-8 h-8" />,
      color: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
      status: 'active',
      route: '/licensing',
      features: ['Planos flexíveis', 'Gateways de pagamento', 'Trials', 'Faturamento automático']
    },
    {
      id: 'support',
      title: 'Suporte',
      description: 'Sistema de tickets e atendimento',
      icon: <Headphones className="w-8 h-8" />,
      color: 'bg-gradient-to-br from-teal-500 to-teal-600',
      status: 'active',
      route: '/support',
      features: ['Tickets', 'Chatbot', 'FAQ', 'Tutoriais']
    },

    // Módulos de IA e Inovação
    {
      id: 'ai',
      title: 'Inteligência Artificial',
      description: 'IA para insights e recomendações',
      icon: <Bot className="w-8 h-8" />,
      color: 'bg-gradient-to-br from-violet-500 to-violet-600',
      status: 'beta',
      route: '/ai',
      features: ['Insights de vendas', 'Recomendações', 'Chat IA', 'Análise preditiva']
    },
    {
      id: 'white-label',
      title: 'White Label',
      description: 'Customização completa da marca',
      icon: <Palette className="w-8 h-8" />,
      color: 'bg-gradient-to-br from-rose-500 to-rose-600',
      status: 'active',
      route: '/white-label',
      features: ['Logos customizados', 'Cores da marca', 'Domínios próprios', 'App personalizado']
    },

    // Integrações
    {
      id: 'integrations',
      title: 'Integrações',
      description: 'Conecte com todo o ecossistema',
      icon: <Zap className="w-8 h-8" />,
      color: 'bg-gradient-to-br from-lime-500 to-lime-600',
      status: 'active',
      route: '/integrations',
      features: ['iFood', 'TEF', 'Google Maps', 'WhatsApp']
    }
  ];

  const quickActions: QuickAction[] = [
    {
      id: 'new-order',
      title: 'Novo Pedido',
      description: 'Criar pedido rapidamente',
      icon: <Plus className="w-5 h-5" />,
      color: 'bg-blue-500',
      route: '/pos'
    },
    {
      id: 'delivery-status',
      title: 'Status Delivery',
      description: 'Acompanhar entregas',
      icon: <Truck className="w-5 h-5" />,
      color: 'bg-green-500',
      route: '/delivery',
      badge: '3 ativos'
    },
    {
      id: 'waiter-app',
      title: 'App Garçom',
      description: 'Acessar app mobile',
      icon: <Smartphone className="w-5 h-5" />,
      color: 'bg-purple-500',
      route: '/waiter'
    },
    {
      id: 'reports',
      title: 'Relatórios',
      description: 'Visualizar relatórios',
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'bg-orange-500',
      route: '/financial'
    }
  ];

  const categories = [
    { id: 'all', name: 'Todos', icon: <Store className="w-4 h-4" /> },
    { id: 'core', name: 'Principais', icon: <Target className="w-4 h-4" /> },
    { id: 'management', name: 'Gestão', icon: <Settings className="w-4 h-4" /> },
    { id: 'advanced', name: 'Avançados', icon: <Award className="w-4 h-4" /> },
    { id: 'ai', name: 'IA & Inovação', icon: <Bot className="w-4 h-4" /> }
  ];

  const getModuleCategory = (module: ModuleCard) => {
    const coreModules = ['pos', 'delivery', 'waiter', 'totem'];
    const managementModules = ['inventory', 'financial', 'marketing', 'fiscal'];
    const advancedModules = ['security', 'multitenancy', 'licensing', 'support', 'white-label', 'integrations'];
    const aiModules = ['ai'];

    if (coreModules.includes(module.id)) return 'core';
    if (managementModules.includes(module.id)) return 'management';
    if (advancedModules.includes(module.id)) return 'advanced';
    if (aiModules.includes(module.id)) return 'ai';
    return 'other';
  };

  const filteredModules = modules.filter(module => {
    const categoryMatch = selectedCategory === 'all' || getModuleCategory(module) === selectedCategory;
    const searchMatch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       module.description.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 text-white">Ativo</Badge>;
      case 'beta':
        return <Badge className="bg-yellow-500 text-white">Beta</Badge>;
      case 'coming-soon':
        return <Badge className="bg-gray-500 text-white">Em Breve</Badge>;
      default:
        return null;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingCart className="w-4 h-4" />;
      case 'payment': return <CreditCard className="w-4 h-4" />;
      case 'delivery': return <Truck className="w-4 h-4" />;
      case 'inventory': return <Package className="w-4 h-4" />;
      case 'user': return <Users className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'order': return 'text-blue-500 bg-blue-50';
      case 'payment': return 'text-green-500 bg-green-50';
      case 'delivery': return 'text-purple-500 bg-purple-50';
      case 'inventory': return 'text-orange-500 bg-orange-50';
      case 'user': return 'text-indigo-500 bg-indigo-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'error': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  useEffect(() => {
    // Simular notificação de boas-vindas
    if (user) {
      setTimeout(() => {
        success('Bem-vindo!', `Olá ${user.name}, o sistema está funcionando perfeitamente.`);
      }, 1000);
    }
  }, [user, success]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Bem-vindo de volta, {user?.name}! Aqui está o resumo do seu negócio.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{new Date().toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Vendas Hoje</p>
                    <p className="text-2xl font-bold">R$ 2.450</p>
                    <p className="text-blue-200 text-sm">+12.5% vs ontem</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Pedidos</p>
                    <p className="text-2xl font-bold">45</p>
                    <p className="text-green-200 text-sm">+8.2% vs ontem</p>
                  </div>
                  <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Delivery</p>
                    <p className="text-2xl font-bold">15</p>
                    <p className="text-purple-200 text-sm">3 em andamento</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-400 rounded-full flex items-center justify-center">
                    <Truck className="w-6 h-6" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Clientes</p>
                    <p className="text-2xl font-bold">234</p>
                    <p className="text-orange-200 text-sm">+5.7% este mês</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                </div>
              </Card>
            </div>
          </div>
          <div>
            <UserInfo />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Ações Rápidas</h2>
            <Button variant="ghost" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Card key={action.id} className="p-4 hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center text-white`}>
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {action.title}
                      </h3>
                      {action.badge && (
                        <Badge className="bg-blue-100 text-blue-800 text-xs">
                          {action.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Atividade Recente</h2>
            <Button variant="ghost" size="sm">
              Ver todas
            </Button>
          </div>
          <Card className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`w-8 h-8 ${getActivityColor(activity.type)} rounded-full flex items-center justify-center`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{activity.title}</h4>
                      <div className="flex items-center space-x-2">
                        {activity.amount && (
                          <span className="text-sm font-medium text-gray-900">
                            R$ {activity.amount.toFixed(2)}
                          </span>
                        )}
                        <Badge className={getStatusColor(activity.status)}>
                          {activity.status === 'success' ? 'Concluído' : 
                           activity.status === 'pending' ? 'Pendente' : 'Erro'}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">{activity.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Modules Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Módulos do Sistema</h2>
              <p className="text-gray-600">Gerencie todos os aspectos do seu restaurante</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar módulos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              >
                {viewMode === 'grid' ? 'Lista' : 'Grid'}
              </Button>
            </div>
          </div>

          {/* Categories Filter */}
          <div className="flex space-x-2 overflow-x-auto pb-2 mb-6">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center space-x-2 whitespace-nowrap"
              >
                {category.icon}
                <span>{category.name}</span>
              </Button>
            ))}
          </div>

          {/* Modules Grid */}
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredModules.map(module => (
              <Card key={module.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${module.color} rounded-lg flex items-center justify-center text-white shadow-lg`}>
                      {module.icon}
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(module.status)}
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {module.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {module.description}
                  </p>

                  {module.stats && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">{module.stats.value}</span>
                        <div className={`flex items-center space-x-1 text-sm ${
                          module.stats.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {module.stats.trend === 'up' ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          <span>{module.stats.change}%</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 mb-4">
                    {module.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        <span className="text-xs text-gray-500">{feature}</span>
                      </div>
                    ))}
                    {module.features.length > 3 && (
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                        <span className="text-xs text-gray-400">+{module.features.length - 3} mais</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <Button 
                      className="flex-1 bg-blue-500 hover:bg-blue-600"
                      onClick={() => window.location.href = module.route}
                    >
                      Acessar
                    </Button>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Notification Demo */}
        <div className="mb-8">
          <NotificationDemo />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;