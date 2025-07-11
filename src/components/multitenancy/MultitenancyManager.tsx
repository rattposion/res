import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Building, 
  Palette, 
  Globe2, 
  Shield, 
  Users, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  BarChart3,
  Calendar,
  DollarSign,
  Package,
  Tag,
  Percent,
  Award,
  Crown,
  User,
  Play,
  Printer,
  Send,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Database,
  Cloud,
  Zap,
  Search,
  Filter,
  Download,
  Upload,
  TrendingUp
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';

interface Tenant {
  id: string;
  name: string;
  domain: string;
  subdomain: string;
  cnpj: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  plan: 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'suspended' | 'pending';
  createdAt: Date;
  lastLogin: Date;
  customDomain?: string;
  theme: TenantTheme;
  modules: string[];
  users: number;
  storage: number;
  maxStorage: number;
}

interface TenantTheme {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  logo?: string;
  favicon?: string;
  customCSS?: string;
}

interface Domain {
  id: string;
  tenantId: string;
  domain: string;
  status: 'active' | 'pending' | 'error';
  sslCertificate: boolean;
  createdAt: Date;
  verifiedAt?: Date;
}

interface TenantMetrics {
  totalTenants: number;
  activeTenants: number;
  suspendedTenants: number;
  totalRevenue: number;
  averageTenantsPerMonth: number;
  topPlans: Array<{plan: string, count: number, revenue: number}>;
  tenantsByStatus: Array<{status: string, count: number, percentage: number}>;
}

const MultitenancyManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tenants' | 'themes' | 'domains' | 'metrics'>('tenants');
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [themes, setThemes] = useState<TenantTheme[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [metrics, setMetrics] = useState<TenantMetrics | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPlan, setFilterPlan] = useState<string>('all');
  const [showTenantModal, setShowTenantModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<TenantTheme | null>(null);

  useEffect(() => {
    // Mock data
    const mockTenants: Tenant[] = [
      {
        id: '1',
        name: 'Pizzaria Silva',
        domain: 'pizzariasilva',
        subdomain: 'pizzariasilva.restauranteapp.com',
        cnpj: '12.345.678/0001-90',
        email: 'contato@pizzariasilva.com',
        phone: '(11) 99999-9999',
        address: 'Rua das Flores, 123',
        city: 'São Paulo',
        state: 'SP',
        plan: 'premium',
        status: 'active',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        lastLogin: new Date(),
        customDomain: 'pizzariasilva.com.br',
        theme: {
          id: 'theme-1',
          name: 'Pizzaria Silva Theme',
          primaryColor: '#FF6B35',
          secondaryColor: '#F7931E',
          backgroundColor: '#FFFFFF',
          textColor: '#333333'
        },
        modules: ['pdv', 'delivery', 'estoque', 'financeiro'],
        users: 8,
        storage: 2.5,
        maxStorage: 10
      },
      {
        id: '2',
        name: 'Hamburgueria Costa',
        domain: 'hamburgueriacosta',
        subdomain: 'hamburgueriacosta.restauranteapp.com',
        cnpj: '98.765.432/0001-10',
        email: 'contato@hamburgueriacosta.com',
        phone: '(11) 88888-8888',
        address: 'Av. Paulista, 1000',
        city: 'São Paulo',
        state: 'SP',
        plan: 'basic',
        status: 'active',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        theme: {
          id: 'theme-2',
          name: 'Hamburgueria Costa Theme',
          primaryColor: '#2C3E50',
          secondaryColor: '#E74C3C',
          backgroundColor: '#FFFFFF',
          textColor: '#333333'
        },
        modules: ['pdv', 'delivery'],
        users: 5,
        storage: 1.2,
        maxStorage: 5
      },
      {
        id: '3',
        name: 'Doceria Santos',
        domain: 'doceriasantos',
        subdomain: 'doceriasantos.restauranteapp.com',
        cnpj: '11.222.333/0001-44',
        email: 'contato@doceriasantos.com',
        phone: '(11) 77777-7777',
        address: 'Rua Augusta, 500',
        city: 'São Paulo',
        state: 'SP',
        plan: 'enterprise',
        status: 'active',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        lastLogin: new Date(),
        customDomain: 'doceriasantos.com.br',
        theme: {
          id: 'theme-3',
          name: 'Doceria Santos Theme',
          primaryColor: '#9B59B6',
          secondaryColor: '#F39C12',
          backgroundColor: '#FFFFFF',
          textColor: '#333333'
        },
        modules: ['pdv', 'delivery', 'estoque', 'financeiro', 'marketing', 'fiscal'],
        users: 12,
        storage: 5.8,
        maxStorage: 50
      }
    ];

    const mockThemes: TenantTheme[] = [
      {
        id: 'theme-1',
        name: 'Pizzaria Silva Theme',
        primaryColor: '#FF6B35',
        secondaryColor: '#F7931E',
        backgroundColor: '#FFFFFF',
        textColor: '#333333'
      },
      {
        id: 'theme-2',
        name: 'Hamburgueria Costa Theme',
        primaryColor: '#2C3E50',
        secondaryColor: '#E74C3C',
        backgroundColor: '#FFFFFF',
        textColor: '#333333'
      },
      {
        id: 'theme-3',
        name: 'Doceria Santos Theme',
        primaryColor: '#9B59B6',
        secondaryColor: '#F39C12',
        backgroundColor: '#FFFFFF',
        textColor: '#333333'
      }
    ];

    const mockDomains: Domain[] = [
      {
        id: '1',
        tenantId: '1',
        domain: 'pizzariasilva.com.br',
        status: 'active',
        sslCertificate: true,
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        verifiedAt: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        tenantId: '3',
        domain: 'doceriasantos.com.br',
        status: 'active',
        sslCertificate: true,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        verifiedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
      }
    ];

    const mockMetrics: TenantMetrics = {
      totalTenants: 3,
      activeTenants: 3,
      suspendedTenants: 0,
      totalRevenue: 2500.00,
      averageTenantsPerMonth: 2.5,
      topPlans: [
        { plan: 'Premium', count: 1, revenue: 150.00 },
        { plan: 'Basic', count: 1, revenue: 50.00 },
        { plan: 'Enterprise', count: 1, revenue: 300.00 }
      ],
      tenantsByStatus: [
        { status: 'Ativo', count: 3, percentage: 100 },
        { status: 'Suspenso', count: 0, percentage: 0 },
        { status: 'Pendente', count: 0, percentage: 0 }
      ]
    };

    setTenants(mockTenants);
    setThemes(mockThemes);
    setDomains(mockDomains);
    setMetrics(mockMetrics);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'suspended':
        return 'bg-red-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'suspended':
        return 'Suspenso';
      case 'pending':
        return 'Pendente';
      default:
        return 'Desconhecido';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'basic':
        return 'bg-blue-500';
      case 'premium':
        return 'bg-purple-500';
      case 'enterprise':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPlanLabel = (plan: string) => {
    switch (plan) {
      case 'basic':
        return 'Básico';
      case 'premium':
        return 'Premium';
      case 'enterprise':
        return 'Empresarial';
      default:
        return 'Desconhecido';
    }
  };

  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tenant.domain.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || tenant.status === filterStatus;
    const matchesPlan = filterPlan === 'all' || tenant.plan === filterPlan;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center text-white">
                <Globe className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Multitenancy</h1>
                <p className="text-gray-600">Gerencie empresas, temas, domínios e isolamento de dados</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
              <Button onClick={() => setShowTenantModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Nova Empresa
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      {metrics && (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Empresas</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.totalTenants}</p>
                </div>
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                  <Building className="w-6 h-6 text-cyan-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Empresas Ativas</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.activeTenants}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Receita Mensal</p>
                  <p className="text-2xl font-bold text-gray-900">R$ {metrics.totalRevenue.toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Média/Mês</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.averageTenantsPerMonth}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-8 border-b">
          {[
            { id: 'tenants', name: 'Empresas', icon: <Building className="w-4 h-4" /> },
            { id: 'themes', name: 'Temas', icon: <Palette className="w-4 h-4" /> },
            { id: 'domains', name: 'Domínios', icon: <Globe2 className="w-4 h-4" /> },
            { id: 'metrics', name: 'Métricas', icon: <BarChart3 className="w-4 h-4" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === tab.id 
                  ? 'border-cyan-500 text-cyan-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'tenants' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar empresas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">Todos os status</option>
                <option value="active">Ativo</option>
                <option value="suspended">Suspenso</option>
                <option value="pending">Pendente</option>
              </select>
              <select
                value={filterPlan}
                onChange={(e) => setFilterPlan(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">Todos os planos</option>
                <option value="basic">Básico</option>
                <option value="premium">Premium</option>
                <option value="enterprise">Empresarial</option>
              </select>
            </div>

            {/* Tenants List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredTenants.map(tenant => (
                <Card key={tenant.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: tenant.theme.primaryColor }}
                      >
                        {tenant.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{tenant.name}</h3>
                        <p className="text-sm text-gray-600">{tenant.subdomain}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Badge className={getStatusColor(tenant.status)}>
                        {getStatusLabel(tenant.status)}
                      </Badge>
                      <Badge className={getPlanColor(tenant.plan)}>
                        {getPlanLabel(tenant.plan)}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">CNPJ</p>
                      <p className="text-sm font-medium">{tenant.cnpj}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm font-medium">{tenant.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Usuários</p>
                      <p className="text-sm font-medium">{tenant.users}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Armazenamento</p>
                      <p className="text-sm font-medium">{tenant.storage}GB / {tenant.maxStorage}GB</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => setSelectedTenant(tenant)}>
                          <Eye className="w-4 h-4 mr-1" />
                          Ver
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-1" />
                          Editar
                        </Button>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Globe2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'themes' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Temas Customizados</h2>
              <Button onClick={() => setShowThemeModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Tema
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {themes.map(theme => (
                <Card key={theme.id} className="p-6">
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{theme.name}</h3>
                    <div className="flex space-x-2">
                      <div 
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: theme.primaryColor }}
                      />
                      <div 
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: theme.secondaryColor }}
                      />
                      <div 
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: theme.backgroundColor }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Cor Primária:</span>
                      <span className="ml-2 font-mono">{theme.primaryColor}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Cor Secundária:</span>
                      <span className="ml-2 font-mono">{theme.secondaryColor}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'domains' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Domínios Customizados</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Domínio
              </Button>
            </div>

            <div className="space-y-4">
              {domains.map(domain => (
                <Card key={domain.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Globe2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{domain.domain}</h3>
                        <p className="text-sm text-gray-600">
                          {tenants.find(t => t.id === domain.tenantId)?.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge className={getStatusColor(domain.status)}>
                        {getStatusLabel(domain.status)}
                      </Badge>
                      {domain.sslCertificate && (
                        <Badge className="bg-green-500 text-white">
                          SSL
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'metrics' && metrics && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Planos Mais Populares</h3>
                <div className="space-y-3">
                  {metrics.topPlans.map((plan, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{plan.plan}</span>
                      <div className="text-right">
                        <span className="font-semibold text-gray-900">{plan.count}</span>
                        <span className="text-xs text-gray-500 ml-2">R$ {plan.revenue.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Empresas por Status</h3>
                <div className="space-y-3">
                  {metrics.tenantsByStatus.map((status, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{status.status}</span>
                      <div className="text-right">
                        <span className="font-semibold text-gray-900">{status.count}</span>
                        <span className="text-xs text-gray-500 ml-2">{status.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Tenant Details Modal */}
      {selectedTenant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Detalhes da Empresa</h3>
              <Button variant="ghost" onClick={() => setSelectedTenant(null)}>
                <XCircle className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Nome</p>
                  <p className="text-gray-900">{selectedTenant.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">CNPJ</p>
                  <p className="text-gray-900">{selectedTenant.cnpj}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Email</p>
                  <p className="text-gray-900">{selectedTenant.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Telefone</p>
                  <p className="text-gray-900">{selectedTenant.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Endereço</p>
                  <p className="text-gray-900">{selectedTenant.address}, {selectedTenant.city} - {selectedTenant.state}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Plano</p>
                  <Badge className={getPlanColor(selectedTenant.plan)}>
                    {getPlanLabel(selectedTenant.plan)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Subdomínio</p>
                  <p className="text-gray-900">{selectedTenant.subdomain}</p>
                </div>
                {selectedTenant.customDomain && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Domínio Customizado</p>
                    <p className="text-gray-900">{selectedTenant.customDomain}</p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Módulos Ativos</p>
                <div className="flex flex-wrap gap-2">
                  {selectedTenant.modules.map(module => (
                    <Badge key={module} className="bg-blue-100 text-blue-800">
                      {module}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Usuários</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedTenant.users}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Armazenamento</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedTenant.storage}GB</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Criado em</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedTenant.createdAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultitenancyManager; 