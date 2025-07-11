import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Send, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Settings,
  RefreshCw,
  ExternalLink,
  DollarSign,
  TrendingUp,
  BarChart3,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Wifi,
  WifiOff,
  Smartphone,
  Users,
  Package,
  Globe,
  Route,
  Target,
  Compass,
  Calendar,
  Clock3,
  Bell,
  Phone,
  Mail,
  FileText,
  Image,
  Video,
  Mic,
  Smile,
  Zap,
  Shield,
  Key,
  Reply
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface WhatsAppMessage {
  id: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'document' | 'template';
  from: string;
  to: string;
  content: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: Date;
  templateName?: string;
  variables?: Record<string, string>;
  mediaUrl?: string;
  customerName?: string;
  orderNumber?: string;
}

interface WhatsAppTemplate {
  id: string;
  name: string;
  category: 'marketing' | 'utility' | 'authentication';
  language: string;
  status: 'approved' | 'pending' | 'rejected';
  content: string;
  variables: string[];
  usageCount: number;
  lastUsed?: Date;
}

interface WhatsAppAutomation {
  id: string;
  name: string;
  trigger: 'order_confirmation' | 'delivery_update' | 'payment_reminder' | 'feedback_request' | 'promotion';
  template: string;
  conditions: Record<string, any>;
  active: boolean;
  lastTriggered?: Date;
  triggerCount: number;
}

interface WhatsAppMetrics {
  totalMessages: number;
  deliveredMessages: number;
  readRate: number;
  responseRate: number;
  averageResponseTime: number;
  topTemplates: Array<{name: string, usage: number, success: number}>;
  messagesByType: Array<{type: string, count: number, percentage: number}>;
}

const WhatsAppManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'messages' | 'templates' | 'automations' | 'metrics' | 'settings'>('messages');
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [automations, setAutomations] = useState<WhatsAppAutomation[]>([]);
  const [metrics, setMetrics] = useState<WhatsAppMetrics | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<WhatsAppMessage | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<WhatsAppTemplate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showAutomationModal, setShowAutomationModal] = useState(false);

  useEffect(() => {
    // Mock data for WhatsApp messages
    const mockMessages: WhatsAppMessage[] = [
      {
        id: '1',
        type: 'template',
        from: '+5511999999999',
        to: '+5511888888888',
        content: 'Olá {{1}}, seu pedido {{2}} foi confirmado e está sendo preparado! 🍕',
        status: 'read',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        templateName: 'order_confirmation',
        variables: { '1': 'João', '2': 'IF-001' },
        customerName: 'João Silva',
        orderNumber: 'IF-001'
      },
      {
        id: '2',
        type: 'text',
        from: '+5511888888888',
        to: '+5511999999999',
        content: 'Obrigado! Quando ficará pronto?',
        status: 'delivered',
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        customerName: 'João Silva'
      },
      {
        id: '3',
        type: 'template',
        from: '+5511999999999',
        to: '+5511888888888',
        content: 'Seu pedido {{1}} está a caminho! 🚚 Tempo estimado: {{2}} minutos.',
        status: 'sent',
        timestamp: new Date(Date.now() - 20 * 60 * 1000),
        templateName: 'delivery_update',
        variables: { '1': 'IF-001', '2': '15' },
        customerName: 'João Silva',
        orderNumber: 'IF-001'
      },
      {
        id: '4',
        type: 'template',
        from: '+5511999999999',
        to: '+5511777777777',
        content: 'Olá {{1}}! Que tal experimentar nossa nova pizza? 🍕 Use o cupom PIZZA10 e ganhe 10% de desconto!',
        status: 'delivered',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        templateName: 'promotion',
        variables: { '1': 'Maria' },
        customerName: 'Maria Santos'
      }
    ];

    // Mock data for WhatsApp templates
    const mockTemplates: WhatsAppTemplate[] = [
      {
        id: '1',
        name: 'order_confirmation',
        category: 'utility',
        language: 'pt-BR',
        status: 'approved',
        content: 'Olá {{1}}, seu pedido {{2}} foi confirmado e está sendo preparado! 🍕',
        variables: ['customer_name', 'order_number'],
        usageCount: 156,
        lastUsed: new Date(Date.now() - 30 * 60 * 1000)
      },
      {
        id: '2',
        name: 'delivery_update',
        category: 'utility',
        language: 'pt-BR',
        status: 'approved',
        content: 'Seu pedido {{1}} está a caminho! 🚚 Tempo estimado: {{2}} minutos.',
        variables: ['order_number', 'estimated_time'],
        usageCount: 89,
        lastUsed: new Date(Date.now() - 20 * 60 * 1000)
      },
      {
        id: '3',
        name: 'payment_reminder',
        category: 'utility',
        language: 'pt-BR',
        status: 'approved',
        content: 'Olá {{1}}, lembre-se de pagar seu pedido {{2}}. Valor: R$ {{3}}',
        variables: ['customer_name', 'order_number', 'amount'],
        usageCount: 45,
        lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: '4',
        name: 'feedback_request',
        category: 'utility',
        language: 'pt-BR',
        status: 'pending',
        content: 'Como foi sua experiência? Avalie nosso serviço: {{1}} ⭐',
        variables: ['rating_link'],
        usageCount: 23,
        lastUsed: new Date(Date.now() - 4 * 60 * 60 * 1000)
      },
      {
        id: '5',
        name: 'promotion',
        category: 'marketing',
        language: 'pt-BR',
        status: 'approved',
        content: 'Olá {{1}}! Que tal experimentar nossa nova pizza? 🍕 Use o cupom {{2}} e ganhe {{3}} de desconto!',
        variables: ['customer_name', 'coupon_code', 'discount'],
        usageCount: 67,
        lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000)
      }
    ];

    // Mock data for WhatsApp automations
    const mockAutomations: WhatsAppAutomation[] = [
      {
        id: '1',
        name: 'Confirmação de Pedido',
        trigger: 'order_confirmation',
        template: 'order_confirmation',
        conditions: { orderValue: '>50' },
        active: true,
        lastTriggered: new Date(Date.now() - 30 * 60 * 1000),
        triggerCount: 156
      },
      {
        id: '2',
        name: 'Atualização de Entrega',
        trigger: 'delivery_update',
        template: 'delivery_update',
        conditions: { deliveryType: 'delivery' },
        active: true,
        lastTriggered: new Date(Date.now() - 20 * 60 * 1000),
        triggerCount: 89
      },
      {
        id: '3',
        name: 'Lembrete de Pagamento',
        trigger: 'payment_reminder',
        template: 'payment_reminder',
        conditions: { paymentStatus: 'pending', hoursAfterOrder: '>24' },
        active: true,
        lastTriggered: new Date(Date.now() - 2 * 60 * 60 * 1000),
        triggerCount: 45
      },
      {
        id: '4',
        name: 'Solicitação de Feedback',
        trigger: 'feedback_request',
        template: 'feedback_request',
        conditions: { orderStatus: 'delivered', hoursAfterDelivery: '>2' },
        active: false,
        lastTriggered: new Date(Date.now() - 4 * 60 * 60 * 1000),
        triggerCount: 23
      }
    ];

    const mockMetrics: WhatsAppMetrics = {
      totalMessages: 1234,
      deliveredMessages: 1189,
      readRate: 85.2,
      responseRate: 23.4,
      averageResponseTime: 2.5,
      topTemplates: [
        { name: 'order_confirmation', usage: 156, success: 98.7 },
        { name: 'delivery_update', usage: 89, success: 95.5 },
        { name: 'promotion', usage: 67, success: 82.1 }
      ],
      messagesByType: [
        { type: 'Template', count: 456, percentage: 37.0 },
        { type: 'Texto', count: 345, percentage: 28.0 },
        { type: 'Imagem', count: 234, percentage: 19.0 },
        { type: 'Documento', count: 123, percentage: 10.0 },
        { type: 'Áudio', count: 76, percentage: 6.0 }
      ]
    };

    setMessages(mockMessages);
    setTemplates(mockTemplates);
    setAutomations(mockAutomations);
    setMetrics(mockMetrics);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'read':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'sent':
        return <Send className="w-5 h-5 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Send className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'read':
        return <Badge className="bg-green-500 text-white">Lida</Badge>;
      case 'delivered':
        return <Badge className="bg-blue-500 text-white">Entregue</Badge>;
      case 'sent':
        return <Badge className="bg-yellow-500 text-white">Enviada</Badge>;
      case 'failed':
        return <Badge className="bg-red-500 text-white">Falhou</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">Desconhecido</Badge>;
    }
  };

  const getTemplateStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500 text-white">Aprovado</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 text-white">Pendente</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 text-white">Rejeitado</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">Desconhecido</Badge>;
    }
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <MessageCircle className="w-4 h-4" />;
      case 'image':
        return <Image className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'audio':
        return <Mic className="w-4 h-4" />;
      case 'document':
        return <FileText className="w-4 h-4" />;
      case 'template':
        return <Zap className="w-4 h-4" />;
      default:
        return <MessageCircle className="w-4 h-4" />;
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeAutomations = automations.filter(a => a.active).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white">
                <MessageCircle className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">WhatsApp Business Manager</h1>
                <p className="text-gray-600">Gerencie mensagens, templates e automações</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => window.location.reload()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Sincronizar
              </Button>
              <Button>
                <ExternalLink className="w-4 h-4 mr-2" />
                Abrir WhatsApp
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
                  <p className="text-sm font-medium text-gray-600">Total Mensagens</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.totalMessages}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taxa de Leitura</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.readRate}%</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taxa de Resposta</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.responseRate}%</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Reply className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Automações Ativas</p>
                  <p className="text-2xl font-bold text-gray-900">{activeAutomations}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Zap className="w-6 h-6 text-purple-600" />
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
            { id: 'messages', name: 'Mensagens', icon: <MessageCircle className="w-4 h-4" /> },
            { id: 'templates', name: 'Templates', icon: <FileText className="w-4 h-4" /> },
            { id: 'automations', name: 'Automações', icon: <Zap className="w-4 h-4" /> },
            { id: 'metrics', name: 'Métricas', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'settings', name: 'Configurações', icon: <Settings className="w-4 h-4" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === tab.id 
                  ? 'border-green-500 text-green-600' 
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
        {activeTab === 'messages' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar por cliente ou conteúdo..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">Todos os status</option>
                <option value="sent">Enviada</option>
                <option value="delivered">Entregue</option>
                <option value="read">Lida</option>
                <option value="failed">Falhou</option>
              </select>
            </div>

            {/* Messages List */}
            <div className="space-y-4">
              {filteredMessages.map(message => (
                <Card key={message.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{message.customerName || 'Cliente'}</h3>
                        <p className="text-sm text-gray-600">{message.from}</p>
                      </div>
                      {getStatusIcon(message.status)}
                      {getStatusBadge(message.status)}
                      {getMessageTypeIcon(message.type)}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{message.timestamp.toLocaleTimeString()}</p>
                      {message.orderNumber && (
                        <p className="text-xs text-gray-500">Pedido: {message.orderNumber}</p>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-900">{message.content}</p>
                    {message.templateName && (
                      <p className="text-sm text-gray-600 mt-1">Template: {message.templateName}</p>
                    )}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => setSelectedMessage(message)}>
                          <Eye className="w-4 h-4 mr-1" />
                          Ver Detalhes
                        </Button>
                        <Button variant="outline" size="sm">
                          <Reply className="w-4 h-4 mr-1" />
                          Responder
                        </Button>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Mail className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Templates de Mensagem</h2>
              <Button onClick={() => setShowTemplateModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Template
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map(template => (
                <Card key={template.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      <p className="text-sm text-gray-600">{template.category}</p>
                    </div>
                    {getTemplateStatusBadge(template.status)}
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-900 line-clamp-3">{template.content}</p>
                  </div>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Uso:</span>
                      <span className="text-gray-900">{template.usageCount} vezes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Idioma:</span>
                      <span className="text-gray-900">{template.language}</span>
                    </div>
                    {template.lastUsed && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Último uso:</span>
                        <span className="text-gray-900">{template.lastUsed.toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Send className="w-4 h-4 mr-1" />
                      Testar
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'automations' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Automações</h2>
              <Button onClick={() => setShowAutomationModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Automação
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {automations.map(automation => (
                <Card key={automation.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{automation.name}</h3>
                      <p className="text-sm text-gray-600">Trigger: {automation.trigger}</p>
                    </div>
                    <Badge className={automation.active ? 'bg-green-500' : 'bg-red-500'}>
                      {automation.active ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Template:</span>
                      <span className="text-gray-900">{automation.template}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Execuções:</span>
                      <span className="text-gray-900">{automation.triggerCount}</span>
                    </div>
                    {automation.lastTriggered && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Última execução:</span>
                        <span className="text-gray-900">{automation.lastTriggered.toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Zap className="w-4 h-4 mr-1" />
                      Testar
                    </Button>
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
                <h3 className="text-lg font-semibold mb-4">Templates Mais Usados</h3>
                <div className="space-y-3">
                  {metrics.topTemplates.map((template, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{template.name}</span>
                      <div className="text-right">
                        <span className="font-semibold text-gray-900">{template.usage}</span>
                        <span className="text-xs text-gray-500 ml-2">{template.success}% sucesso</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Mensagens por Tipo</h3>
                <div className="space-y-3">
                  {metrics.messagesByType.map((type, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{type.type}</span>
                      <div className="text-right">
                        <span className="font-semibold text-gray-900">{type.count}</span>
                        <span className="text-xs text-gray-500 ml-2">{type.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Configurações do WhatsApp Business</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número do WhatsApp
                  </label>
                  <input
                    type="text"
                    value="+5511999999999"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    API Key
                  </label>
                  <input
                    type="text"
                    value="wa_789123456"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Webhook URL
                  </label>
                  <input
                    type="text"
                    value="https://api.restaurant.com/webhook/whatsapp"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    readOnly
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="autoReply" defaultChecked />
                  <label htmlFor="autoReply" className="text-sm text-gray-700">
                    Resposta automática
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="messageNotifications" defaultChecked />
                  <label htmlFor="messageNotifications" className="text-sm text-gray-700">
                    Notificações de mensagens
                  </label>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Message Details Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Detalhes da Mensagem</h3>
              <Button variant="ghost" onClick={() => setSelectedMessage(null)}>
                <XCircle className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">De</p>
                  <p className="text-gray-900">{selectedMessage.from}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Para</p>
                  <p className="text-gray-900">{selectedMessage.to}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Tipo</p>
                  <p className="text-gray-900">{selectedMessage.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  {getStatusBadge(selectedMessage.status)}
                </div>
                {selectedMessage.customerName && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Cliente</p>
                    <p className="text-gray-900">{selectedMessage.customerName}</p>
                  </div>
                )}
                {selectedMessage.orderNumber && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pedido</p>
                    <p className="text-gray-900">{selectedMessage.orderNumber}</p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600">Conteúdo</p>
                <p className="text-gray-900">{selectedMessage.content}</p>
              </div>

              {selectedMessage.variables && Object.keys(selectedMessage.variables).length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Variáveis</p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(selectedMessage.variables).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-sm text-gray-600">{key}:</span>
                        <span className="text-sm text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-gray-600">Data/Hora</p>
                <p className="text-gray-900">{selectedMessage.timestamp.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppManager; 