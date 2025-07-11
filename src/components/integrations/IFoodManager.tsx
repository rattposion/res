import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Settings,
  RefreshCw,
  ExternalLink,
  MapPin,
  Phone,
  User,
  DollarSign,
  Package,
  Star,
  TrendingUp,
  BarChart3,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Printer,
  MessageCircle,
  Bell,
  Calendar,
  Clock3,
  ShoppingBag,
  Users,
  Award
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface IFoodOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  total: number;
  deliveryFee: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled';
  paymentMethod: 'credit_card' | 'debit_card' | 'cash' | 'pix';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: Date;
  estimatedDelivery: Date;
  actualDelivery?: Date;
  notes?: string;
  rating?: number;
  review?: string;
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  image?: string;
  preparationTime: number;
  allergens?: string[];
  nutritionalInfo?: any;
}

interface IFoodMetrics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  deliveryTime: number;
  customerRating: number;
  repeatCustomers: number;
  topItems: Array<{name: string, orders: number}>;
}

const IFoodManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'metrics' | 'settings'>('orders');
  const [orders, setOrders] = useState<IFoodOrder[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [metrics, setMetrics] = useState<IFoodMetrics | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<IFoodOrder | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    // Mock data for iFood orders
    const mockOrders: IFoodOrder[] = [
      {
        id: '1',
        orderNumber: 'IF-001',
        customerName: 'João Silva',
        customerPhone: '(11) 99999-9999',
        customerAddress: 'Rua das Flores, 123 - São Paulo, SP',
        items: [
          { id: '1', name: 'Pizza Margherita', quantity: 1, unitPrice: 35.90, totalPrice: 35.90 },
          { id: '2', name: 'Coca-Cola 350ml', quantity: 2, unitPrice: 6.90, totalPrice: 13.80 }
        ],
        total: 49.70,
        deliveryFee: 5.00,
        status: 'preparing',
        paymentMethod: 'credit_card',
        paymentStatus: 'paid',
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
        estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000),
        notes: 'Sem cebola na pizza'
      },
      {
        id: '2',
        orderNumber: 'IF-002',
        customerName: 'Maria Santos',
        customerPhone: '(11) 88888-8888',
        customerAddress: 'Av. Paulista, 1000 - São Paulo, SP',
        items: [
          { id: '3', name: 'X-Burger', quantity: 1, unitPrice: 25.90, totalPrice: 25.90 },
          { id: '4', name: 'Batata Frita', quantity: 1, unitPrice: 12.90, totalPrice: 12.90 }
        ],
        total: 38.80,
        deliveryFee: 5.00,
        status: 'delivering',
        paymentMethod: 'pix',
        paymentStatus: 'paid',
        createdAt: new Date(Date.now() - 45 * 60 * 1000),
        estimatedDelivery: new Date(Date.now() + 15 * 60 * 1000),
        actualDelivery: new Date(Date.now() + 10 * 60 * 1000),
        rating: 5,
        review: 'Muito rápido e gostoso!'
      },
      {
        id: '3',
        orderNumber: 'IF-003',
        customerName: 'Pedro Costa',
        customerPhone: '(11) 77777-7777',
        customerAddress: 'Rua Augusta, 500 - São Paulo, SP',
        items: [
          { id: '5', name: 'Pizza Pepperoni', quantity: 1, unitPrice: 42.90, totalPrice: 42.90 },
          { id: '6', name: 'Suco Natural', quantity: 1, unitPrice: 8.90, totalPrice: 8.90 }
        ],
        total: 51.80,
        deliveryFee: 5.00,
        status: 'pending',
        paymentMethod: 'debit_card',
        paymentStatus: 'pending',
        createdAt: new Date(Date.now() - 5 * 60 * 1000),
        estimatedDelivery: new Date(Date.now() + 50 * 60 * 1000)
      }
    ];

    const mockMenuItems: MenuItem[] = [
      {
        id: '1',
        name: 'Pizza Margherita',
        description: 'Molho de tomate, mussarela, manjericão fresco',
        price: 35.90,
        category: 'Pizzas',
        available: true,
        preparationTime: 20,
        allergens: ['Glúten', 'Lactose'],
        image: 'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg?auto=compress&cs=tinysrgb&w=300'
      },
      {
        id: '2',
        name: 'X-Burger',
        description: 'Hambúrguer, queijo, alface, tomate, maionese',
        price: 25.90,
        category: 'Lanches',
        available: true,
        preparationTime: 15,
        allergens: ['Glúten', 'Lactose'],
        image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=300'
      },
      {
        id: '3',
        name: 'Batata Frita',
        description: 'Porção de batatas fritas crocantes',
        price: 12.90,
        category: 'Acompanhamentos',
        available: true,
        preparationTime: 10,
        allergens: ['Glúten']
      }
    ];

    const mockMetrics: IFoodMetrics = {
      totalOrders: 156,
      totalRevenue: 7840.50,
      averageOrderValue: 50.26,
      deliveryTime: 35,
      customerRating: 4.8,
      repeatCustomers: 45,
      topItems: [
        { name: 'Pizza Margherita', orders: 67 },
        { name: 'X-Burger', orders: 45 },
        { name: 'Batata Frita', orders: 34 }
      ]
    };

    setOrders(mockOrders);
    setMenuItems(mockMenuItems);
    setMetrics(mockMetrics);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500 text-white">Pendente</Badge>;
      case 'confirmed':
        return <Badge className="bg-blue-500 text-white">Confirmado</Badge>;
      case 'preparing':
        return <Badge className="bg-orange-500 text-white">Preparando</Badge>;
      case 'ready':
        return <Badge className="bg-green-500 text-white">Pronto</Badge>;
      case 'delivering':
        return <Badge className="bg-purple-500 text-white">Entregando</Badge>;
      case 'delivered':
        return <Badge className="bg-green-600 text-white">Entregue</Badge>;
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
      case 'refunded':
        return <Badge className="bg-red-500 text-white">Reembolsado</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">Desconhecido</Badge>;
    }
  };

  const handleStatusChange = (orderId: string, newStatus: IFoodOrder['status']) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus }
          : order
      )
    );
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white">
                <Truck className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">iFood Manager</h1>
                <p className="text-gray-600">Gerencie pedidos, cardápio e métricas do iFood</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => window.location.reload()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Sincronizar
              </Button>
              <Button>
                <ExternalLink className="w-4 h-4 mr-2" />
                Abrir iFood
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
                  <p className="text-sm font-medium text-gray-600">Total de Pedidos</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.totalOrders}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-orange-600" />
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
                  <p className="text-2xl font-bold text-gray-900">{metrics.deliveryTime} min</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock3 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avaliação</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.customerRating}/5</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-600" />
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
            { id: 'orders', name: 'Pedidos', icon: <ShoppingBag className="w-4 h-4" /> },
            { id: 'menu', name: 'Cardápio', icon: <Package className="w-4 h-4" /> },
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
                <option value="confirmed">Confirmado</option>
                <option value="preparing">Preparando</option>
                <option value="ready">Pronto</option>
                <option value="delivering">Entregando</option>
                <option value="delivered">Entregue</option>
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
                        <p className="text-sm text-gray-600">{order.customerName}</p>
                      </div>
                      {getStatusBadge(order.status)}
                      {getPaymentStatusBadge(order.paymentStatus)}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">R$ {order.total.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">{order.createdAt.toLocaleTimeString()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{order.customerPhone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{order.customerAddress}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Entrega: {order.estimatedDelivery.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        {order.status === 'pending' && (
                          <Button size="sm" onClick={() => handleStatusChange(order.id, 'confirmed')}>
                            Confirmar
                          </Button>
                        )}
                        {order.status === 'confirmed' && (
                          <Button size="sm" onClick={() => handleStatusChange(order.id, 'preparing')}>
                            Iniciar Preparo
                          </Button>
                        )}
                        {order.status === 'preparing' && (
                          <Button size="sm" onClick={() => handleStatusChange(order.id, 'ready')}>
                            Pronto
                          </Button>
                        )}
                        {order.status === 'ready' && (
                          <Button size="sm" onClick={() => handleStatusChange(order.id, 'delivering')}>
                            Entregar
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
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Cardápio iFood</h2>
              <Button onClick={() => setShowMenuModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Item
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map(item => (
                <Card key={item.id} className="p-6">
                  {item.image && (
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-32 object-cover rounded-lg mb-4"
                    />
                  )}
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <Badge className={item.available ? 'bg-green-500' : 'bg-red-500'}>
                      {item.available ? 'Disponível' : 'Indisponível'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold text-gray-900">R$ {item.price.toFixed(2)}</span>
                    <span className="text-sm text-gray-600">{item.preparationTime} min</span>
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
                <h3 className="text-lg font-semibold mb-4">Itens Mais Vendidos</h3>
                <div className="space-y-3">
                  {metrics.topItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{item.name}</span>
                      <span className="font-semibold text-gray-900">{item.orders} pedidos</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Resumo</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Ticket Médio</span>
                    <span className="font-semibold text-gray-900">R$ {metrics.averageOrderValue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Clientes Recorrentes</span>
                    <span className="font-semibold text-gray-900">{metrics.repeatCustomers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Avaliação Média</span>
                    <span className="font-semibold text-gray-900">{metrics.customerRating}/5</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Configurações do iFood</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    API Key
                  </label>
                  <input
                    type="text"
                    value="if_123456789"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Store ID
                  </label>
                  <input
                    type="text"
                    value="restaurant_123"
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
                    value="https://api.restaurant.com/webhook/ifood"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    readOnly
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="autoSync" defaultChecked />
                  <label htmlFor="autoSync" className="text-sm text-gray-700">
                    Sincronização automática
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
              <h3 className="text-lg font-semibold">Detalhes do Pedido {selectedOrder.orderNumber}</h3>
              <Button variant="ghost" onClick={() => setSelectedOrder(null)}>
                <XCircle className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Cliente</p>
                  <p className="text-gray-900">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Telefone</p>
                  <p className="text-gray-900">{selectedOrder.customerPhone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-600">Endereço</p>
                  <p className="text-gray-900">{selectedOrder.customerAddress}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Itens do Pedido</p>
                <div className="space-y-2">
                  {selectedOrder.items.map(item => (
                    <div key={item.id} className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>{item.name} x{item.quantity}</span>
                      <span>R$ {item.totalPrice.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>R$ {(selectedOrder.total - selectedOrder.deliveryFee).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxa de entrega</span>
                  <span>R$ {selectedOrder.deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold">
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

              {selectedOrder.rating && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Avaliação</p>
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star 
                          key={star} 
                          className={`w-4 h-4 ${star <= selectedOrder.rating! ? 'text-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({selectedOrder.rating}/5)</span>
                  </div>
                  {selectedOrder.review && (
                    <p className="text-sm text-gray-600 mt-1">"{selectedOrder.review}"</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IFoodManager; 