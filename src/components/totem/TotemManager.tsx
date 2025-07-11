import React, { useState, useEffect } from 'react';
import { 
  Monitor, 
  Printer, 
  ShoppingCart, 
  Clock, 
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
  Touch,
  QrCode,
  CreditCard,
  Receipt
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface TotemOrder {
  id: string;
  orderNumber: string;
  customerName?: string;
  customerPhone?: string;
  items: TotemOrderItem[];
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  paymentMethod: 'cash' | 'card' | 'pix' | 'qr_code';
  paymentStatus: 'pending' | 'paid' | 'failed';
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  estimatedTime: number;
  actualTime?: number;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
  priority: 'normal' | 'urgent' | 'vip';
  tableNumber?: number;
  isTakeaway: boolean;
}

interface TotemOrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
  customizations?: string[];
}

interface TotemProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  available: boolean;
  preparationTime: number;
  allergens?: string[];
  nutritionalInfo?: any;
  customizations?: TotemCustomization[];
}

interface TotemCustomization {
  id: string;
  name: string;
  type: 'single' | 'multiple';
  required: boolean;
  options: {
    id: string;
    name: string;
    price: number;
  }[];
}

interface TotemMetrics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  averagePreparationTime: number;
  customerSatisfaction: number;
  topProducts: Array<{name: string, orders: number, revenue: number}>;
  ordersByStatus: Array<{status: string, count: number, percentage: number}>;
}

const TotemManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'metrics' | 'settings'>('orders');
  const [orders, setOrders] = useState<TotemOrder[]>([]);
  const [products, setProducts] = useState<TotemProduct[]>([]);
  const [metrics, setMetrics] = useState<TotemMetrics | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<TotemOrder | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<TotemProduct | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showProductModal, setShowProductModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    // Mock data for totem orders
    const mockOrders: TotemOrder[] = [
      {
        id: '1',
        orderNumber: 'TOT-001',
        customerName: 'João Silva',
        customerPhone: '(11) 99999-9999',
        items: [
          {
            id: 'item-1',
            productName: 'Pizza Margherita',
            quantity: 2,
            unitPrice: 35.90,
            totalPrice: 71.80,
            customizations: ['Borda Recheada', 'Queijo Extra']
          },
          {
            id: 'item-2',
            productName: 'Refrigerante Coca-Cola',
            quantity: 2,
            unitPrice: 6.90,
            totalPrice: 13.80
          }
        ],
        status: 'preparing',
        paymentMethod: 'card',
        paymentStatus: 'paid',
        subtotal: 85.60,
        tax: 8.56,
        discount: 0,
        total: 94.16,
        estimatedTime: 20,
        actualTime: 18,
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
        updatedAt: new Date(),
        priority: 'normal',
        tableNumber: 5,
        isTakeaway: false
      },
      {
        id: '2',
        orderNumber: 'TOT-002',
        customerName: 'Maria Santos',
        customerPhone: '(11) 88888-8888',
        items: [
          {
            id: 'item-3',
            productName: 'Pizza Quatro Queijos',
            quantity: 1,
            unitPrice: 42.90,
            totalPrice: 42.90,
            customizations: ['Borda Recheada']
          }
        ],
        status: 'ready',
        paymentMethod: 'pix',
        paymentStatus: 'paid',
        subtotal: 42.90,
        tax: 4.29,
        discount: 5.00,
        total: 42.19,
        estimatedTime: 25,
        actualTime: 22,
        createdAt: new Date(Date.now() - 45 * 60 * 1000),
        updatedAt: new Date(),
        priority: 'urgent',
        isTakeaway: true
      },
      {
        id: '3',
        orderNumber: 'TOT-003',
        items: [
          {
            id: 'item-4',
            productName: 'Hambúrguer Clássico',
            quantity: 1,
            unitPrice: 25.90,
            totalPrice: 25.90,
            customizations: ['Bacon', 'Queijo Extra']
          },
          {
            id: 'item-5',
            productName: 'Batata Frita',
            quantity: 1,
            unitPrice: 12.90,
            totalPrice: 12.90
          }
        ],
        status: 'pending',
        paymentMethod: 'cash',
        paymentStatus: 'pending',
        subtotal: 38.80,
        tax: 3.88,
        discount: 0,
        total: 42.68,
        estimatedTime: 15,
        createdAt: new Date(Date.now() - 5 * 60 * 1000),
        updatedAt: new Date(),
        priority: 'normal',
        tableNumber: 3,
        isTakeaway: false
      }
    ];

    // Mock data for totem products
    const mockProducts: TotemProduct[] = [
      {
        id: '1',
        name: 'Pizza Margherita',
        description: 'Molho de tomate, mussarela, manjericão fresco',
        price: 35.90,
        category: 'Pizzas',
        available: true,
        preparationTime: 20,
        allergens: ['Glúten', 'Lactose'],
        image: 'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg?auto=compress&cs=tinysrgb&w=300',
        customizations: [
          {
            id: 'custom-1',
            name: 'Tamanho',
            type: 'single',
            required: true,
            options: [
              { id: 'small', name: 'Pequena', price: 0 },
              { id: 'medium', name: 'Média', price: 5.00 },
              { id: 'large', name: 'Grande', price: 10.00 }
            ]
          },
          {
            id: 'custom-2',
            name: 'Borda',
            type: 'single',
            required: false,
            options: [
              { id: 'normal', name: 'Normal', price: 0 },
              { id: 'recheada', name: 'Recheada', price: 5.00 }
            ]
          }
        ]
      },
      {
        id: '2',
        name: 'Hambúrguer Clássico',
        description: 'Hambúrguer, queijo, alface, tomate, maionese',
        price: 25.90,
        category: 'Lanches',
        available: true,
        preparationTime: 15,
        allergens: ['Glúten', 'Lactose'],
        image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=300',
        customizations: [
          {
            id: 'custom-3',
            name: 'Ponto',
            type: 'single',
            required: true,
            options: [
              { id: 'rare', name: 'Mal passado', price: 0 },
              { id: 'medium', name: 'Ao ponto', price: 0 },
              { id: 'well', name: 'Bem passado', price: 0 }
            ]
          },
          {
            id: 'custom-4',
            name: 'Adicionais',
            type: 'multiple',
            required: false,
            options: [
              { id: 'bacon', name: 'Bacon', price: 4.00 },
              { id: 'cheese', name: 'Queijo Extra', price: 2.00 },
              { id: 'onion', name: 'Cebola', price: 1.50 }
            ]
          }
        ]
      },
      {
        id: '3',
        name: 'Refrigerante Coca-Cola',
        description: 'Refrigerante Coca-Cola 350ml',
        price: 6.90,
        category: 'Bebidas',
        available: true,
        preparationTime: 1,
        image: 'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=300'
      }
    ];

    const mockMetrics: TotemMetrics = {
      totalOrders: 234,
      totalRevenue: 12345.67,
      averageOrderValue: 52.76,
      averagePreparationTime: 18.5,
      customerSatisfaction: 4.8,
      topProducts: [
        { name: 'Pizza Margherita', orders: 89, revenue: 3195.10 },
        { name: 'Hambúrguer Clássico', orders: 67, revenue: 1735.30 },
        { name: 'Refrigerante Coca-Cola', orders: 156, revenue: 1076.40 }
      ],
      ordersByStatus: [
        { status: 'Preparando', count: 45, percentage: 19.2 },
        { status: 'Pronto', count: 23, percentage: 9.8 },
        { status: 'Entregue', count: 156, percentage: 66.7 },
        { status: 'Cancelado', count: 10, percentage: 4.3 }
      ]
    };

    setOrders(mockOrders);
    setProducts(mockProducts);
    setMetrics(mockMetrics);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'preparing':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge className="bg-green-500 text-white">Pronto</Badge>;
      case 'preparing':
        return <Badge className="bg-yellow-500 text-white">Preparando</Badge>;
      case 'pending':
        return <Badge className="bg-orange-500 text-white">Pendente</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500 text-white">Cancelado</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">Desconhecido</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500 text-white">Pago</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 text-white">Pendente</Badge>;
      case 'failed':
        return <Badge className="bg-red-500 text-white">Falhou</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">Desconhecido</Badge>;
    }
  };

  const handleOrderStatusChange = (orderId: string, newStatus: TotemOrder['status']) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { 
              ...order, 
              status: newStatus,
              updatedAt: new Date(),
              actualTime: newStatus === 'ready' ? order.estimatedTime : order.actualTime
            }
          : order
      )
    );
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const preparingOrders = orders.filter(o => o.status === 'preparing').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white">
                <Monitor className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Autoatendimento (Totem)</h1>
                <p className="text-gray-600">Gerencie pedidos, produtos e interface touchscreen</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => window.location.reload()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar
              </Button>
              <Button>
                <ExternalLink className="w-4 h-4 mr-2" />
                Abrir Totem
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
                  <p className="text-sm font-medium text-gray-600">Total Pedidos</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.totalOrders}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Receita Total</p>
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
                  <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.averagePreparationTime} min</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock3 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Satisfação</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.customerSatisfaction}/5</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Smile className="w-6 h-6 text-yellow-600" />
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
            { id: 'orders', name: 'Pedidos', icon: <ShoppingCart className="w-4 h-4" /> },
            { id: 'products', name: 'Produtos', icon: <Package className="w-4 h-4" /> },
            { id: 'metrics', name: 'Métricas', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'settings', name: 'Configurações', icon: <Settings className="w-4 h-4" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === tab.id 
                  ? 'border-orange-500 text-orange-600' 
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
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pendentes</p>
                    <p className="text-xl font-bold text-orange-600">{pendingOrders}</p>
                  </div>
                  <AlertCircle className="w-6 h-6 text-orange-500" />
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Preparando</p>
                    <p className="text-xl font-bold text-yellow-600">{preparingOrders}</p>
                  </div>
                  <Clock className="w-6 h-6 text-yellow-500" />
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Prontos</p>
                    <p className="text-xl font-bold text-green-600">{orders.filter(o => o.status === 'ready').length}</p>
                  </div>
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar por cliente ou pedido..."
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
                <option value="pending">Pendente</option>
                <option value="preparing">Preparando</option>
                <option value="ready">Pronto</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {filteredOrders.map(order => (
                <Card key={order.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{order.orderNumber}</h3>
                        <p className="text-sm text-gray-600">{order.customerName || 'Cliente não identificado'}</p>
                      </div>
                      {getStatusIcon(order.status)}
                      {getStatusBadge(order.status)}
                      {getPaymentStatusBadge(order.paymentStatus)}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">R$ {order.total.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">{order.estimatedTime} min</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <ShoppingCart className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{order.items.length} itens</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{order.paymentMethod}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {order.isTakeaway ? (
                        <Package className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Users className="w-4 h-4 text-gray-400" />
                      )}
                      <span className="text-sm text-gray-600">
                        {order.isTakeaway ? 'Para viagem' : `Mesa ${order.tableNumber}`}
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        {order.status === 'pending' && (
                          <Button size="sm" onClick={() => handleOrderStatusChange(order.id, 'preparing')}>
                            <Clock className="w-4 h-4 mr-1" />
                            Iniciar Preparo
                          </Button>
                        )}
                        {order.status === 'preparing' && (
                          <Button size="sm" onClick={() => handleOrderStatusChange(order.id, 'ready')}>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Pronto
                          </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                          <Eye className="w-4 h-4 mr-1" />
                          Ver Detalhes
                        </Button>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Printer className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Bell className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Produtos do Totem</h2>
              <Button onClick={() => setShowProductModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Produto
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <Card key={product.id} className="p-6">
                  {product.image && (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-32 object-cover rounded-lg mb-4"
                    />
                  )}
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    <Badge className={product.available ? 'bg-green-500' : 'bg-red-500'}>
                      {product.available ? 'Disponível' : 'Indisponível'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold text-gray-900">R$ {product.price.toFixed(2)}</span>
                    <span className="text-sm text-gray-600">{product.preparationTime} min</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      Ver
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
                <h3 className="text-lg font-semibold mb-4">Produtos Mais Vendidos</h3>
                <div className="space-y-3">
                  {metrics.topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{product.name}</span>
                      <div className="text-right">
                        <span className="font-semibold text-gray-900">{product.orders}</span>
                        <span className="text-xs text-gray-500 ml-2">R$ {product.revenue.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Pedidos por Status</h3>
                <div className="space-y-3">
                  {metrics.ordersByStatus.map((status, index) => (
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

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Configurações do Totem</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número do Totem
                  </label>
                  <input
                    type="text"
                    value="TOTEM-001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Localização
                  </label>
                  <input
                    type="text"
                    value="Entrada Principal"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Impressora de Senha
                  </label>
                  <input
                    type="text"
                    value="EPSON TM-T88VI"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    readOnly
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="autoPrint" defaultChecked />
                  <label htmlFor="autoPrint" className="text-sm text-gray-700">
                    Impressão automática de senha
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="soundNotifications" defaultChecked />
                  <label htmlFor="soundNotifications" className="text-sm text-gray-700">
                    Notificações sonoras
                  </label>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Detalhes do Pedido</h3>
              <Button variant="ghost" onClick={() => setSelectedOrder(null)}>
                <XCircle className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Número do Pedido</p>
                  <p className="text-gray-900">{selectedOrder.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Cliente</p>
                  <p className="text-gray-900">{selectedOrder.customerName || 'Não identificado'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Método de Pagamento</p>
                  <p className="text-gray-900">{selectedOrder.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                {selectedOrder.tableNumber && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Mesa</p>
                    <p className="text-gray-900">{selectedOrder.tableNumber}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-600">Tipo</p>
                  <p className="text-gray-900">{selectedOrder.isTakeaway ? 'Para viagem' : 'No local'}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Itens do Pedido</p>
                <div className="space-y-2">
                  {selectedOrder.items.map(item => (
                    <div key={item.id} className="flex justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <span className="text-sm font-medium">{item.productName} x{item.quantity}</span>
                        {item.customizations && item.customizations.length > 0 && (
                          <p className="text-xs text-gray-600">{item.customizations.join(', ')}</p>
                        )}
                      </div>
                      <span className="text-sm font-medium">R$ {item.totalPrice.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>R$ {selectedOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxa</span>
                  <span>R$ {selectedOrder.tax.toFixed(2)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between">
                    <span>Desconto</span>
                    <span>-R$ {selectedOrder.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold border-t pt-2">
                  <span>Total</span>
                  <span>R$ {selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {selectedOrder.notes && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Observações</p>
                  <p className="text-gray-900">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TotemManager; 