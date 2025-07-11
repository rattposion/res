import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Gift, 
  Star,
  Calendar,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
  FileText,
  Receipt,
  MessageSquare,
  Mail,
  Phone,
  Target,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Settings,
  Bell,
  Home,
  Package,
  Tag,
  Percent,
  Award,
  Crown,
  User,
  Play
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  joinDate: Date;
  lastOrder: Date;
  status: 'active' | 'inactive' | 'vip';
}

interface Coupon {
  id: string;
  code: string;
  name: string;
  type: 'percentage' | 'fixed' | 'free_delivery';
  value: number;
  minOrder: number;
  maxUses: number;
  usedCount: number;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'inactive' | 'expired';
  applicableTo: string[];
  excludedProducts: string[];
  customerGroups: string[];
  description: string;
  createdAt: Date;
}

interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'push' | 'social';
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'paused';
  targetAudience: string[];
  message: string;
  subject?: string;
  scheduledDate?: Date;
  sentCount: number;
  openCount: number;
  clickCount: number;
  conversionCount: number;
  createdAt: Date;
}

interface LoyaltyProgram {
  id: string;
  name: string;
  description: string;
  pointsPerReal: number;
  tiers: LoyaltyTier[];
  rewards: Reward[];
  status: 'active' | 'inactive';
  createdAt: Date;
}

interface LoyaltyTier {
  id: string;
  name: string;
  minPoints: number;
  discount: number;
  benefits: string[];
  color: string;
}

interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  discount: number;
  type: 'discount' | 'free_item' | 'free_delivery';
  status: 'active' | 'inactive';
  redemptionCount: number;
}

const MarketingDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'customers' | 'coupons' | 'campaigns' | 'loyalty' | 'reports'>('overview');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loyaltyProgram, setLoyaltyProgram] = useState<LoyaltyProgram | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [reportPeriod, setReportPeriod] = useState<string>('month');
  const [reportType, setReportType] = useState<string>('campaigns');
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    // Load mock data
    const mockCustomers: Customer[] = [
      {
        id: '1',
        name: 'João Silva',
        email: 'joao@email.com',
        phone: '(11) 99999-9999',
        totalOrders: 15,
        totalSpent: 1250.50,
        points: 1250,
        tier: 'gold',
        joinDate: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000),
        lastOrder: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        status: 'active'
      },
      {
        id: '2',
        name: 'Maria Santos',
        email: 'maria@email.com',
        phone: '(11) 88888-8888',
        totalOrders: 8,
        totalSpent: 680.30,
        points: 680,
        tier: 'silver',
        joinDate: new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000),
        lastOrder: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        status: 'active'
      },
      {
        id: '3',
        name: 'Pedro Costa',
        email: 'pedro@email.com',
        phone: '(11) 77777-7777',
        totalOrders: 25,
        totalSpent: 2840.90,
        points: 2840,
        tier: 'platinum',
        joinDate: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000),
        lastOrder: new Date(),
        status: 'vip'
      }
    ];

    const mockCoupons: Coupon[] = [
      {
        id: '1',
        code: 'WELCOME10',
        name: 'Bem-vindo - 10% OFF',
        type: 'percentage',
        value: 10,
        minOrder: 50,
        maxUses: 100,
        usedCount: 45,
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'active',
        applicableTo: ['all'],
        excludedProducts: [],
        customerGroups: ['new'],
        description: 'Cupom de boas-vindas para novos clientes',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        code: 'FREEDELIVERY',
        name: 'Entrega Grátis',
        type: 'free_delivery',
        value: 0,
        minOrder: 80,
        maxUses: 50,
        usedCount: 12,
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'active',
        applicableTo: ['delivery'],
        excludedProducts: [],
        customerGroups: ['all'],
        description: 'Entrega grátis para pedidos acima de R$ 80',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        id: '3',
        code: 'PIZZA20',
        name: 'Pizzas - 20% OFF',
        type: 'percentage',
        value: 20,
        minOrder: 60,
        maxUses: 200,
        usedCount: 89,
        startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        status: 'active',
        applicableTo: ['pizzas'],
        excludedProducts: [],
        customerGroups: ['all'],
        description: '20% de desconto em todas as pizzas',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
      }
    ];

    const mockCampaigns: Campaign[] = [
      {
        id: '1',
        name: 'Promoção de Aniversário',
        type: 'email',
        status: 'active',
        targetAudience: ['birthday_month'],
        message: 'Parabéns! Você ganhou 15% de desconto no seu pedido de aniversário!',
        subject: '🎉 Feliz Aniversário! Presente especial para você',
        sentCount: 45,
        openCount: 23,
        clickCount: 12,
        conversionCount: 8,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        name: 'Lembrete de Pedido',
        type: 'sms',
        status: 'scheduled',
        targetAudience: ['inactive_30_days'],
        message: 'Que tal uma pizza hoje? Use o cupom PIZZA20 e ganhe 20% OFF!',
        scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        sentCount: 0,
        openCount: 0,
        clickCount: 0,
        conversionCount: 0,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    ];

    const mockLoyaltyProgram: LoyaltyProgram = {
      id: '1',
      name: 'Clube de Fidelidade',
      description: 'Programa de pontos para clientes fiéis',
      pointsPerReal: 1,
      tiers: [
        {
          id: 'bronze',
          name: 'Bronze',
          minPoints: 0,
          discount: 0,
          benefits: ['Acesso ao programa de pontos'],
          color: '#cd7f32'
        },
        {
          id: 'silver',
          name: 'Prata',
          minPoints: 500,
          discount: 5,
          benefits: ['5% de desconto', 'Entrega grátis em pedidos acima de R$ 100'],
          color: '#c0c0c0'
        },
        {
          id: 'gold',
          name: 'Ouro',
          minPoints: 1000,
          discount: 10,
          benefits: ['10% de desconto', 'Entrega grátis', 'Pedidos prioritários'],
          color: '#ffd700'
        },
        {
          id: 'platinum',
          name: 'Platina',
          minPoints: 2000,
          discount: 15,
          benefits: ['15% de desconto', 'Entrega grátis', 'Pedidos prioritários', 'Cupons exclusivos'],
          color: '#e5e4e2'
        }
      ],
      rewards: [
        {
          id: '1',
          name: 'Desconto de R$ 10',
          description: 'Desconto de R$ 10 em qualquer pedido',
          pointsCost: 100,
          discount: 10,
          type: 'discount',
          status: 'active',
          redemptionCount: 45
        },
        {
          id: '2',
          name: 'Entrega Grátis',
          description: 'Entrega grátis no próximo pedido',
          pointsCost: 50,
          discount: 0,
          type: 'free_delivery',
          status: 'active',
          redemptionCount: 23
        }
      ],
      status: 'active',
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
    };

    setCustomers(mockCustomers);
    setCoupons(mockCoupons);
    setCampaigns(mockCampaigns);
    setLoyaltyProgram(mockLoyaltyProgram);
  }, []);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'secondary';
      case 'silver': return 'secondary';
      case 'gold': return 'warning';
      case 'platinum': return 'primary';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'secondary';
      case 'expired': return 'error';
      case 'draft': return 'secondary';
      case 'scheduled': return 'warning';
      case 'completed': return 'success';
      case 'paused': return 'error';
      case 'vip': return 'warning';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'expired': return 'Expirado';
      case 'draft': return 'Rascunho';
      case 'scheduled': return 'Agendado';
      case 'completed': return 'Concluído';
      case 'paused': return 'Pausado';
      case 'vip': return 'VIP';
      default: return status;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'percentage': return 'success';
      case 'fixed': return 'primary';
      case 'free_delivery': return 'warning';
      case 'email': return 'primary';
      case 'sms': return 'success';
      case 'push': return 'warning';
      case 'social': return 'secondary';
      default: return 'secondary';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'percentage': return 'Porcentagem';
      case 'fixed': return 'Valor Fixo';
      case 'free_delivery': return 'Entrega Grátis';
      case 'email': return 'Email';
      case 'sms': return 'SMS';
      case 'push': return 'Push';
      case 'social': return 'Redes Sociais';
      default: return type;
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || customer.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         coupon.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || coupon.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const averageOrderValue = totalRevenue / customers.reduce((sum, c) => sum + c.totalOrders, 0);

  const handleExportReport = (format: 'csv' | 'pdf') => {
    const data = `Relatório de Marketing - ${reportPeriod}\n\n`;
    const filename = `relatorio_marketing_${reportPeriod}_${new Date().toISOString().split('T')[0]}.${format}`;
    
    if (format === 'csv') {
      const csvContent = `Cliente,Email,Tier,Pedidos,Valor Total,Pontos\n` +
        customers.map(c => `${c.name},${c.email},${c.tier},${c.totalOrders},${c.totalSpent},${c.points}`).join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
    } else {
      alert(`Relatório PDF "${filename}" seria gerado aqui.`);
    }
    setShowExportModal(false);
  };

  const getMarketingMetrics = () => {
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => c.status === 'active').length;
    const vipCustomers = customers.filter(c => c.tier === 'platinum' || c.status === 'vip').length;
    const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
    const avgOrderValue = totalRevenue / customers.reduce((sum, c) => sum + c.totalOrders, 0);
    
    return {
      totalCustomers,
      activeCustomers,
      vipCustomers,
      totalRevenue,
      avgOrderValue
    };
  };

  const getCampaignMetrics = () => {
    const totalCampaigns = campaigns.length;
    const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
    const totalSent = campaigns.reduce((sum, c) => sum + c.sentCount, 0);
    const totalOpens = campaigns.reduce((sum, c) => sum + c.openCount, 0);
    const totalClicks = campaigns.reduce((sum, c) => sum + c.clickCount, 0);
    const totalConversions = campaigns.reduce((sum, c) => sum + c.conversionCount, 0);
    
    return {
      totalCampaigns,
      activeCampaigns,
      totalSent,
      totalOpens,
      totalClicks,
      totalConversions,
      openRate: totalSent > 0 ? (totalOpens / totalSent) * 100 : 0,
      clickRate: totalSent > 0 ? (totalClicks / totalSent) * 100 : 0,
      conversionRate: totalSent > 0 ? (totalConversions / totalSent) * 100 : 0
    };
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard de Marketing</h1>
        <p className="text-gray-600">Gestão de clientes, cupons, campanhas e fidelidade</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Clientes</p>
              <p className="text-2xl font-bold text-gray-900">{totalCustomers}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-green-600">+{activeCustomers}</span>
            <span className="text-gray-600 ml-1">ativos</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Receita Total</p>
              <p className="text-2xl font-bold text-green-600">R$ {totalRevenue.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-green-600">+12.5%</span>
            <span className="text-gray-600 ml-1">vs mês anterior</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
              <p className="text-2xl font-bold text-purple-600">R$ {averageOrderValue.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Receipt className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cupons Ativos</p>
              <p className="text-2xl font-bold text-yellow-600">{coupons.filter(c => c.status === 'active').length}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Gift className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'overview'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <BarChart3 className="h-4 w-4 inline mr-2" />
          Visão Geral
        </button>
        <button
          onClick={() => setActiveTab('customers')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'customers'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Users className="h-4 w-4 inline mr-2" />
          Clientes
        </button>
        <button
          onClick={() => setActiveTab('coupons')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'coupons'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Gift className="h-4 w-4 inline mr-2" />
          Cupons
        </button>
        <button
          onClick={() => setActiveTab('campaigns')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'campaigns'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <MessageSquare className="h-4 w-4 inline mr-2" />
          Campanhas
        </button>
        <button
          onClick={() => setActiveTab('loyalty')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'loyalty'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Award className="h-4 w-4 inline mr-2" />
          Fidelidade
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'reports'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <BarChart3 className="h-4 w-4 inline mr-2" />
          Relatórios
        </button>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar..."
              className="pl-10 w-64"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos os status</option>
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
            <option value="vip">VIP</option>
          </select>
        </div>

        <div className="flex space-x-2">
          <Button variant="secondary">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          {activeTab === 'coupons' && (
            <Button onClick={() => setShowCouponModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Cupom
            </Button>
          )}
          {activeTab === 'campaigns' && (
            <Button onClick={() => setShowCampaignModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Campanha
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Overview */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Visão Geral dos Clientes</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Clientes Ativos</span>
                <span className="font-semibold">{activeCustomers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Clientes VIP</span>
                <span className="font-semibold">{customers.filter(c => c.status === 'vip').length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Novos este mês</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Taxa de retenção</span>
                <span className="font-semibold text-green-600">78%</span>
              </div>
            </div>
          </Card>

          {/* Coupon Performance */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Performance dos Cupons</h3>
            <div className="space-y-4">
              {coupons.slice(0, 3).map(coupon => (
                <div key={coupon.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{coupon.name}</p>
                    <p className="text-sm text-gray-600">{coupon.code}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{coupon.usedCount}/{coupon.maxUses}</p>
                    <p className="text-sm text-gray-600">usos</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'customers' && (
        <div className="space-y-4">
          {filteredCustomers.map(customer => (
            <Card key={customer.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{customer.name}</h3>
                    <p className="text-sm text-gray-600">{customer.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getStatusColor(customer.status)}>
                    {getStatusLabel(customer.status)}
                  </Badge>
                  <Badge variant={getTierColor(customer.tier)}>
                    {customer.tier.toUpperCase()}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Total de Pedidos</p>
                  <p className="font-semibold">{customer.totalOrders}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Gasto</p>
                  <p className="font-semibold">R$ {customer.totalSpent.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pontos</p>
                  <p className="font-semibold">{customer.points}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Último Pedido</p>
                  <p className="font-semibold">{customer.lastOrder.toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Detalhes
                </Button>
                <Button size="sm" variant="secondary">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Enviar Mensagem
                </Button>
                <Button size="sm" variant="secondary">
                  <Gift className="h-4 w-4 mr-2" />
                  Enviar Cupom
                </Button>
                <Button size="sm" variant="secondary">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'coupons' && (
        <div className="space-y-4">
          {filteredCoupons.map(coupon => (
            <Card key={coupon.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{coupon.name}</h3>
                  <p className="text-sm text-gray-600">Código: {coupon.code}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getStatusColor(coupon.status)}>
                    {getStatusLabel(coupon.status)}
                  </Badge>
                  <Badge variant={getTypeColor(coupon.type)}>
                    {getTypeLabel(coupon.type)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Valor</p>
                  <p className="font-semibold">
                    {coupon.type === 'percentage' ? `${coupon.value}%` : 
                     coupon.type === 'fixed' ? `R$ ${coupon.value.toFixed(2)}` : 'Grátis'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pedido Mínimo</p>
                  <p className="font-semibold">R$ {coupon.minOrder.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Usos</p>
                  <p className="font-semibold">{coupon.usedCount}/{coupon.maxUses}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Validade</p>
                  <p className="font-semibold">{coupon.endDate.toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Detalhes
                </Button>
                <Button size="sm" variant="secondary">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button size="sm" variant="secondary">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
                <Button size="sm" variant="secondary">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'campaigns' && (
        <div className="space-y-4">
          {campaigns.map(campaign => (
            <Card key={campaign.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{campaign.name}</h3>
                  <p className="text-sm text-gray-600">{campaign.message}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getStatusColor(campaign.status)}>
                    {getStatusLabel(campaign.status)}
                  </Badge>
                  <Badge variant={getTypeColor(campaign.type)}>
                    {getTypeLabel(campaign.type)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Enviados</p>
                  <p className="font-semibold">{campaign.sentCount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Abertos</p>
                  <p className="font-semibold">{campaign.openCount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cliques</p>
                  <p className="font-semibold">{campaign.clickCount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Conversões</p>
                  <p className="font-semibold">{campaign.conversionCount}</p>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Detalhes
                </Button>
                <Button size="sm" variant="secondary">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button size="sm" variant="secondary">
                  <Play className="h-4 w-4 mr-2" />
                  Executar
                </Button>
                <Button size="sm" variant="secondary">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Relatório
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'loyalty' && loyaltyProgram && (
        <div className="space-y-6">
          {/* Program Overview */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">{loyaltyProgram.name}</h3>
                <p className="text-sm text-gray-600">{loyaltyProgram.description}</p>
              </div>
              <Badge variant="success">Ativo</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Pontos por Real</p>
                <p className="text-2xl font-bold">{loyaltyProgram.pointsPerReal}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total de Membros</p>
                <p className="text-2xl font-bold">{customers.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Recompensas Ativas</p>
                <p className="text-2xl font-bold">{loyaltyProgram.rewards.filter(r => r.status === 'active').length}</p>
              </div>
            </div>
          </Card>

          {/* Tiers */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Níveis de Fidelidade</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {loyaltyProgram.tiers.map(tier => (
                <div key={tier.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{tier.name}</h4>
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: tier.color }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {tier.minPoints} pontos mínimos
                  </p>
                  <p className="text-sm font-medium">
                    {tier.discount}% de desconto
                  </p>
                  <ul className="mt-2 space-y-1">
                    {tier.benefits.map((benefit, index) => (
                      <li key={index} className="text-xs text-gray-600">• {benefit}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>

          {/* Rewards */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Recompensas Disponíveis</h3>
            <div className="space-y-4">
              {loyaltyProgram.rewards.map(reward => (
                <div key={reward.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">{reward.name}</h4>
                    <p className="text-sm text-gray-600">{reward.description}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Custo</p>
                      <p className="font-semibold">{reward.pointsCost} pontos</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Resgates</p>
                      <p className="font-semibold">{reward.redemptionCount}</p>
                    </div>
                    <Badge variant={reward.status === 'active' ? 'success' : 'secondary'}>
                      {reward.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Relatórios de Marketing</h2>
            <div className="flex space-x-2">
              <select
                value={reportPeriod}
                onChange={(e) => setReportPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="week">Última Semana</option>
                <option value="month">Último Mês</option>
                <option value="quarter">Último Trimestre</option>
                <option value="year">Último Ano</option>
              </select>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="campaigns">Campanhas</option>
                <option value="customers">Clientes</option>
                <option value="coupons">Cupons</option>
                <option value="loyalty">Fidelidade</option>
              </select>
              <Button onClick={() => setShowExportModal(true)}>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Métricas de Clientes</h3>
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Clientes:</span>
                  <span className="font-semibold">{getMarketingMetrics().totalCustomers}</span>
                </div>
                <div className="flex justify-between">
                  <span>Clientes Ativos:</span>
                  <span className="font-semibold text-green-600">{getMarketingMetrics().activeCustomers}</span>
                </div>
                <div className="flex justify-between">
                  <span>Clientes VIP:</span>
                  <span className="font-semibold text-purple-600">{getMarketingMetrics().vipCustomers}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span>Receita Total:</span>
                  <span className="font-semibold text-green-600">R$ {getMarketingMetrics().totalRevenue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ticket Médio:</span>
                  <span className="font-semibold">R$ {getMarketingMetrics().avgOrderValue.toFixed(2)}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Performance de Campanhas</h3>
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Campanhas Ativas:</span>
                  <span className="font-semibold">{getCampaignMetrics().activeCampaigns}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxa de Abertura:</span>
                  <span className="font-semibold text-blue-600">{getCampaignMetrics().openRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxa de Clique:</span>
                  <span className="font-semibold text-green-600">{getCampaignMetrics().clickRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxa de Conversão:</span>
                  <span className="font-semibold text-purple-600">{getCampaignMetrics().conversionRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span>Total Conversões:</span>
                  <span className="font-semibold">{getCampaignMetrics().totalConversions}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Análise de Cupons</h3>
                <Gift className="h-6 w-6 text-orange-600" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Cupons Ativos:</span>
                  <span className="font-semibold">{coupons.filter(c => c.status === 'active').length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Usos:</span>
                  <span className="font-semibold text-green-600">{coupons.reduce((sum, c) => sum + c.usedCount, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxa de Uso:</span>
                  <span className="font-semibold text-blue-600">
                    {coupons.length > 0 ? (coupons.reduce((sum, c) => sum + c.usedCount, 0) / coupons.reduce((sum, c) => sum + c.maxUses, 0) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Valor Médio:</span>
                  <span className="font-semibold">
                    R$ {coupons.length > 0 ? (coupons.reduce((sum, c) => sum + c.value, 0) / coupons.length).toFixed(2) : 0}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Gráfico de Performance</h3>
            <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Gráfico de performance seria renderizado aqui</p>
                <p className="text-sm text-gray-500">Campanhas, conversões e ROI</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96 p-6">
            <h3 className="text-lg font-semibold mb-4">Exportar Relatório</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Formato</label>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => handleExportReport('csv')} className="flex-1">
                    <FileText className="h-4 w-4 mr-2" />
                    CSV
                  </Button>
                  <Button variant="outline" onClick={() => handleExportReport('pdf')} className="flex-1">
                    <FileText className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowExportModal(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MarketingDashboard; 