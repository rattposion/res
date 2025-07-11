import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Truck, 
  CreditCard, 
  MapPin, 
  MessageCircle, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Settings,
  RefreshCw,
  ExternalLink,
  Key,
  Globe,
  Smartphone,
  Wifi,
  WifiOff,
  Clock,
  DollarSign,
  Users,
  BarChart3
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  lastSync?: Date;
  apiKey?: string;
  config?: any;
  metrics?: {
    orders: number;
    revenue: number;
    customers: number;
  };
}

const IntegrationsManager: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configData, setConfigData] = useState({
    apiKey: '',
    webhookUrl: '',
    storeId: '',
    environment: 'production'
  });

  useEffect(() => {
    // Mock data for integrations
    const mockIntegrations: Integration[] = [
      {
        id: 'ifood',
        name: 'iFood',
        description: 'Integração com marketplace de delivery',
        icon: <Truck className="w-6 h-6" />,
        status: 'connected',
        lastSync: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        apiKey: 'if_123456789',
        config: {
          storeId: 'restaurant_123',
          webhookUrl: 'https://api.restaurant.com/webhook/ifood',
          autoSync: true
        },
        metrics: {
          orders: 45,
          revenue: 2840.50,
          customers: 23
        }
      },
      {
        id: 'tef',
        name: 'TEF/POS',
        description: 'Terminal de pagamento e impressora fiscal',
        icon: <CreditCard className="w-6 h-6" />,
        status: 'connected',
        lastSync: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        apiKey: 'tef_987654321',
        config: {
          terminalId: 'TEF001',
          printerModel: 'Bematech MP-4200',
          autoPrint: true
        },
        metrics: {
          orders: 156,
          revenue: 8920.30,
          customers: 89
        }
      },
      {
        id: 'google-maps',
        name: 'Google Maps',
        description: 'Geolocalização e roteirização de entregas',
        icon: <MapPin className="w-6 h-6" />,
        status: 'connected',
        lastSync: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
        apiKey: 'gmaps_456789123',
        config: {
          apiKey: 'AIzaSyB...',
          deliveryRadius: 5000,
          optimizeRoutes: true
        },
        metrics: {
          orders: 78,
          revenue: 4560.80,
          customers: 45
        }
      },
      {
        id: 'whatsapp',
        name: 'WhatsApp Business',
        description: 'Comunicação e notificações via WhatsApp',
        icon: <MessageCircle className="w-6 h-6" />,
        status: 'connected',
        lastSync: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
        apiKey: 'wa_789123456',
        config: {
          phoneNumber: '+5511999999999',
          autoNotifications: true,
          templates: ['order_confirmation', 'delivery_update', 'promotions']
        },
        metrics: {
          orders: 234,
          revenue: 12340.60,
          customers: 156
        }
      },
      {
        id: 'stripe',
        name: 'Stripe',
        description: 'Processamento de pagamentos online',
        icon: <CreditCard className="w-6 h-6" />,
        status: 'connected',
        lastSync: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        apiKey: 'sk_live_...',
        config: {
          webhookUrl: 'https://api.restaurant.com/webhook/stripe',
          autoCapture: true
        },
        metrics: {
          orders: 89,
          revenue: 5670.40,
          customers: 67
        }
      },
      {
        id: 'mercadopago',
        name: 'Mercado Pago',
        description: 'Pagamentos e transferências',
        icon: <DollarSign className="w-6 h-6" />,
        status: 'disconnected',
        lastSync: undefined,
        apiKey: undefined,
        config: undefined,
        metrics: undefined
      }
    ];

    setIntegrations(mockIntegrations);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'disconnected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <XCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-500 text-white">Conectado</Badge>;
      case 'disconnected':
        return <Badge className="bg-red-500 text-white">Desconectado</Badge>;
      case 'error':
        return <Badge className="bg-yellow-500 text-white">Erro</Badge>;
      case 'pending':
        return <Badge className="bg-blue-500 text-white">Pendente</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">Desconhecido</Badge>;
    }
  };

  const handleConnect = (integration: Integration) => {
    setSelectedIntegration(integration);
    setShowConfigModal(true);
  };

  const handleDisconnect = (integrationId: string) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === integrationId 
          ? { ...integration, status: 'disconnected' as const, lastSync: undefined }
          : integration
      )
    );
  };

  const handleSync = (integrationId: string) => {
    // Simulate sync
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === integrationId 
          ? { ...integration, lastSync: new Date() }
          : integration
      )
    );
  };

  const handleSaveConfig = () => {
    if (selectedIntegration) {
      setIntegrations(prev => 
        prev.map(integration => 
          integration.id === selectedIntegration.id 
            ? { 
                ...integration, 
                status: 'connected' as const, 
                lastSync: new Date(),
                apiKey: configData.apiKey,
                config: configData
              }
            : integration
        )
      );
      setShowConfigModal(false);
      setSelectedIntegration(null);
      setConfigData({ apiKey: '', webhookUrl: '', storeId: '', environment: 'production' });
    }
  };

  const totalOrders = integrations.reduce((sum, integration) => 
    sum + (integration.metrics?.orders || 0), 0
  );
  const totalRevenue = integrations.reduce((sum, integration) => 
    sum + (integration.metrics?.revenue || 0), 0
  );
  const connectedCount = integrations.filter(i => i.status === 'connected').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-lime-500 rounded-lg flex items-center justify-center text-white">
                <Zap className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Integrações</h1>
                <p className="text-gray-600">Gerencie todas as integrações do sistema</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => window.location.reload()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Integrações Ativas</p>
                <p className="text-2xl font-bold text-gray-900">{connectedCount}/{integrations.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Wifi className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pedidos via Integrações</p>
                <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receita via Integrações</p>
                <p className="text-2xl font-bold text-gray-900">R$ {totalRevenue.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Última Sincronização</p>
                <p className="text-2xl font-bold text-gray-900">2 min</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration) => (
            <Card key={integration.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    {integration.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                    <p className="text-sm text-gray-600">{integration.description}</p>
                  </div>
                </div>
                {getStatusIcon(integration.status)}
              </div>

              <div className="mb-4">
                {getStatusBadge(integration.status)}
              </div>

              {integration.metrics && (
                <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Pedidos</p>
                    <p className="font-semibold text-gray-900">{integration.metrics.orders}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Receita</p>
                    <p className="font-semibold text-gray-900">R$ {integration.metrics.revenue.toFixed(2)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Clientes</p>
                    <p className="font-semibold text-gray-900">{integration.metrics.customers}</p>
                  </div>
                </div>
              )}

              {integration.lastSync && (
                <div className="mb-4 text-sm text-gray-600">
                  Última sincronização: {integration.lastSync.toLocaleTimeString()}
                </div>
              )}

              <div className="flex space-x-2">
                {integration.status === 'connected' ? (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSync(integration.id)}
                    >
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Sincronizar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDisconnect(integration.id)}
                    >
                      <WifiOff className="w-4 h-4 mr-1" />
                      Desconectar
                    </Button>
                  </>
                ) : (
                  <Button 
                    size="sm"
                    onClick={() => handleConnect(integration)}
                  >
                    <Wifi className="w-4 h-4 mr-1" />
                    Conectar
                  </Button>
                )}
                
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Configuration Modal */}
      {showConfigModal && selectedIntegration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Configurar {selectedIntegration.name}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Key
                </label>
                <input
                  type="text"
                  value={configData.apiKey}
                  onChange={(e) => setConfigData({...configData, apiKey: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Digite sua API key..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Webhook URL
                </label>
                <input
                  type="text"
                  value={configData.webhookUrl}
                  onChange={(e) => setConfigData({...configData, webhookUrl: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="https://api.restaurant.com/webhook"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Store ID
                </label>
                <input
                  type="text"
                  value={configData.storeId}
                  onChange={(e) => setConfigData({...configData, storeId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="ID da loja..."
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <Button onClick={handleSaveConfig} className="flex-1">
                Salvar
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowConfigModal(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegrationsManager; 