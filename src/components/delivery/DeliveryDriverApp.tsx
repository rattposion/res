import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Package, 
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  Phone,
  MessageSquare,
  Camera,
  FileText,
  Settings,
  LogOut,
  Bell,
  Home,
  Route,
  DollarSign,
  Star,
  Calendar,
  Filter,
  Search,
  RefreshCw,
  Play,
  Pause,
  Stop,
  ArrowRight,
  ArrowLeft,
  Target,
  Timer,
  Eye
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';

interface DeliveryOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: DeliveryItem[];
  status: 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'cash_on_delivery';
  paymentMethod: 'cash' | 'card' | 'pix' | 'online';
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  estimatedDeliveryTime: Date;
  actualDeliveryTime?: Date;
  assignedAt: Date;
  pickedUpAt?: Date;
  deliveredAt?: Date;
  notes?: string;
  priority: 'normal' | 'urgent' | 'vip';
  distance: number;
  estimatedDuration: number;
}

interface DeliveryItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  licensePlate: string;
  status: 'available' | 'busy' | 'offline';
  currentLocation: {
    lat: number;
    lng: number;
  };
  currentOrder?: string;
  totalDeliveries: number;
  totalEarnings: number;
  rating: number;
  isOnline: boolean;
  lastActive: Date;
}

interface Route {
  id: string;
  orders: DeliveryOrder[];
  totalDistance: number;
  estimatedDuration: number;
  startTime: Date;
  endTime?: Date;
  status: 'active' | 'completed' | 'cancelled';
}

const DeliveryDriverApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'route' | 'history' | 'profile'>('orders');
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [currentDriver, setCurrentDriver] = useState<Driver | null>(null);
  const [currentRoute, setCurrentRoute] = useState<Route | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const [currentLocation, setCurrentLocation] = useState({ lat: -23.5505, lng: -46.6333 });

  useEffect(() => {
    // Load mock data
    const mockDriver: Driver = {
      id: 'driver-1',
      name: 'Carlos Santos',
      phone: '(11) 88888-8888',
      vehicle: 'Moto Honda CG 150',
      licensePlate: 'ABC-1234',
      status: 'busy',
      currentLocation: { lat: -23.5505, lng: -46.6333 },
      currentOrder: '1',
      totalDeliveries: 156,
      totalEarnings: 2840.50,
      rating: 4.8,
      isOnline: true,
      lastActive: new Date()
    };

    const mockOrders: DeliveryOrder[] = [
      {
        id: '1',
        customerName: 'João Silva',
        customerPhone: '(11) 99999-9999',
        customerAddress: 'Rua das Flores, 123 - Vila Madalena, São Paulo - SP',
        items: [
          {
            id: 'item-1',
            productName: 'Pizza Margherita',
            quantity: 2,
            unitPrice: 35.90,
            totalPrice: 71.80
          },
          {
            id: 'item-2',
            productName: 'Refrigerante Coca-Cola',
            quantity: 2,
            unitPrice: 6.90,
            totalPrice: 13.80
          }
        ],
        status: 'in_transit',
        paymentStatus: 'paid',
        paymentMethod: 'pix',
        subtotal: 85.60,
        deliveryFee: 5.00,
        discount: 0,
        total: 90.60,
        estimatedDeliveryTime: new Date(Date.now() + 15 * 60 * 1000),
        assignedAt: new Date(Date.now() - 30 * 60 * 1000),
        pickedUpAt: new Date(Date.now() - 10 * 60 * 1000),
        priority: 'normal',
        distance: 2.5,
        estimatedDuration: 15
      },
      {
        id: '2',
        customerName: 'Maria Santos',
        customerPhone: '(11) 77777-7777',
        customerAddress: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP',
        items: [
          {
            id: 'item-3',
            productName: 'Pizza Quatro Queijos',
            quantity: 1,
            unitPrice: 42.90,
            totalPrice: 42.90
          }
        ],
        status: 'assigned',
        paymentStatus: 'paid',
        paymentMethod: 'card',
        subtotal: 42.90,
        deliveryFee: 8.00,
        discount: 5.00,
        total: 45.90,
        estimatedDeliveryTime: new Date(Date.now() + 45 * 60 * 1000),
        assignedAt: new Date(Date.now() - 5 * 60 * 1000),
        priority: 'urgent',
        distance: 4.2,
        estimatedDuration: 25
      },
      {
        id: '3',
        customerName: 'Pedro Costa',
        customerPhone: '(11) 66666-6666',
        customerAddress: 'Rua Augusta, 500 - Consolação, São Paulo - SP',
        items: [
          {
            id: 'item-4',
            productName: 'Pizza Margherita',
            quantity: 1,
            unitPrice: 35.90,
            totalPrice: 35.90
          },
          {
            id: 'item-5',
            productName: 'Suco Natural Laranja',
            quantity: 1,
            unitPrice: 8.90,
            totalPrice: 8.90
          }
        ],
        status: 'assigned',
        paymentStatus: 'cash_on_delivery',
        paymentMethod: 'cash',
        subtotal: 44.80,
        deliveryFee: 6.00,
        discount: 0,
        total: 50.80,
        estimatedDeliveryTime: new Date(Date.now() + 60 * 60 * 1000),
        assignedAt: new Date(Date.now() - 2 * 60 * 1000),
        priority: 'normal',
        distance: 3.8,
        estimatedDuration: 20
      }
    ];

    const mockRoute: Route = {
      id: 'route-1',
      orders: mockOrders,
      totalDistance: 10.5,
      estimatedDuration: 60,
      startTime: new Date(),
      status: 'active'
    };

    setCurrentDriver(mockDriver);
    setOrders(mockOrders);
    setCurrentRoute(mockRoute);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'warning';
      case 'picked_up': return 'primary';
      case 'in_transit': return 'primary';
      case 'delivered': return 'success';
      case 'cancelled': return 'error';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'assigned': return 'Atribuído';
      case 'picked_up': return 'Retirado';
      case 'in_transit': return 'Em Trânsito';
      case 'delivered': return 'Entregue';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'normal': return 'secondary';
      case 'urgent': return 'error';
      case 'vip': return 'warning';
      default: return 'secondary';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'normal': return 'Normal';
      case 'urgent': return 'Urgente';
      case 'vip': return 'VIP';
      default: return priority;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'cash_on_delivery': return 'primary';
      default: return 'secondary';
    }
  };

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Pago';
      case 'pending': return 'Pendente';
      case 'cash_on_delivery': return 'Dinheiro';
      default: return status;
    }
  };

  const updateOrderStatus = (orderId: string, status: DeliveryOrder['status']) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const updatedOrder = { ...order, status };
        if (status === 'picked_up') {
          updatedOrder.pickedUpAt = new Date();
        } else if (status === 'delivered') {
          updatedOrder.deliveredAt = new Date();
          updatedOrder.actualDeliveryTime = new Date();
        }
        return updatedOrder;
      }
      return order;
    }));
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customerPhone.includes(searchQuery);
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const activeOrders = orders.filter(order => 
    order.status === 'assigned' || order.status === 'picked_up' || order.status === 'in_transit'
  );

  const completedOrders = orders.filter(order => order.status === 'delivered');

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">App do Entregador</h1>
          <p className="text-gray-600">Bem-vindo, {currentDriver?.name}</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant={isOnline ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setIsOnline(!isOnline)}
          >
            {isOnline ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Online
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 mr-2" />
                Offline
              </>
            )}
          </Button>
          <Button variant="secondary" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Notificações
          </Button>
          <Button variant="secondary" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </Button>
          <Button variant="secondary" size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Entregas Hoje</p>
              <p className="text-2xl font-bold text-gray-900">{activeOrders.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ganhos Hoje</p>
              <p className="text-2xl font-bold text-green-600">R$ 45.60</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avaliação</p>
              <p className="text-2xl font-bold text-yellow-600">{currentDriver?.rating}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Status</p>
              <p className="text-2xl font-bold text-green-600">Ativo</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Navigation className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'orders'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Package className="h-4 w-4 inline mr-2" />
          Entregas
        </button>
        <button
          onClick={() => setActiveTab('route')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'route'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Route className="h-4 w-4 inline mr-2" />
          Rota
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'history'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Calendar className="h-4 w-4 inline mr-2" />
          Histórico
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'profile'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <User className="h-4 w-4 inline mr-2" />
          Perfil
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
              placeholder="Buscar entregas..."
              className="pl-10 w-64"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos os status</option>
            <option value="assigned">Atribuído</option>
            <option value="picked_up">Retirado</option>
            <option value="in_transit">Em Trânsito</option>
            <option value="delivered">Entregue</option>
            <option value="cancelled">Cancelado</option>
          </select>

          <Button variant="secondary">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>

        <Button>
          <Navigation className="h-4 w-4 mr-2" />
          Navegação
        </Button>
      </div>

      {/* Content */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <Card key={order.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{order.customerName}</h3>
                  <p className="text-sm text-gray-600">{order.customerPhone}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getStatusColor(order.status)}>
                    {getStatusLabel(order.status)}
                  </Badge>
                  <Badge variant={getPriorityColor(order.priority)}>
                    {getPriorityLabel(order.priority)}
                  </Badge>
                  <Badge variant={getPaymentStatusColor(order.paymentStatus)}>
                    {getPaymentStatusLabel(order.paymentStatus)}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="truncate">{order.customerAddress}</span>
                </div>

                <div className="space-y-1">
                  {order.items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.productName}</span>
                      <span>R$ {item.totalPrice.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>R$ {order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Taxa de entrega:</span>
                    <span>R$ {order.deliveryFee.toFixed(2)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Desconto:</span>
                      <span>-R$ {order.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>R$ {order.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Distância</p>
                    <p className="font-semibold">{order.distance} km</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Tempo Estimado</p>
                    <p className="font-semibold">{order.estimatedDuration} min</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Entrega</p>
                    <p className="font-semibold">
                      {order.estimatedDeliveryTime.toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button size="sm" onClick={() => {
                  setSelectedOrder(order);
                  setShowOrderDetails(true);
                }}>
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Detalhes
                </Button>
                <Button size="sm" variant="secondary">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
                <Button size="sm" variant="secondary">
                  <Navigation className="h-4 w-4 mr-2" />
                  Rota
                </Button>
                {order.status === 'assigned' && (
                  <Button size="sm" onClick={() => updateOrderStatus(order.id, 'picked_up')}>
                    <Package className="h-4 w-4 mr-2" />
                    Retirar
                  </Button>
                )}
                {order.status === 'picked_up' && (
                  <Button size="sm" onClick={() => updateOrderStatus(order.id, 'in_transit')}>
                    <Play className="h-4 w-4 mr-2" />
                    Iniciar Entrega
                  </Button>
                )}
                {order.status === 'in_transit' && (
                  <Button size="sm" onClick={() => {
                    setSelectedOrder(order);
                    setShowDeliveryModal(true);
                  }}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirmar Entrega
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'route' && currentRoute && (
        <div className="space-y-6">
          {/* Route Summary */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Rota Atual</h3>
              <Badge variant="primary">Ativa</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total de Entregas</p>
                <p className="text-2xl font-bold">{currentRoute.orders.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Distância Total</p>
                <p className="text-2xl font-bold">{currentRoute.totalDistance} km</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tempo Estimado</p>
                <p className="text-2xl font-bold">{currentRoute.estimatedDuration} min</p>
              </div>
            </div>
          </Card>

          {/* Route Orders */}
          <div className="space-y-4">
            {currentRoute.orders.map((order, index) => (
              <Card key={order.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold">{order.customerName}</h3>
                      <p className="text-sm text-gray-600">{order.customerAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatusColor(order.status)}>
                      {getStatusLabel(order.status)}
                    </Badge>
                    <Badge variant={getPriorityColor(order.priority)}>
                      {getPriorityLabel(order.priority)}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Distância</p>
                    <p className="font-semibold">{order.distance} km</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tempo</p>
                    <p className="font-semibold">{order.estimatedDuration} min</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="font-semibold">R$ {order.total.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pagamento</p>
                    <Badge variant={getPaymentStatusColor(order.paymentStatus)} size="sm">
                      {getPaymentStatusLabel(order.paymentStatus)}
                    </Badge>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm">
                    <Navigation className="h-4 w-4 mr-2" />
                    Navegar
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Phone className="h-4 w-4 mr-2" />
                    Ligar
                  </Button>
                  <Button size="sm" variant="secondary">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                  {order.status === 'assigned' && (
                    <Button size="sm" onClick={() => updateOrderStatus(order.id, 'picked_up')}>
                      <Package className="h-4 w-4 mr-2" />
                      Retirar
                    </Button>
                  )}
                  {order.status === 'picked_up' && (
                    <Button size="sm" onClick={() => updateOrderStatus(order.id, 'in_transit')}>
                      <Play className="h-4 w-4 mr-2" />
                      Iniciar
                    </Button>
                  )}
                  {order.status === 'in_transit' && (
                    <Button size="sm" onClick={() => {
                      setSelectedOrder(order);
                      setShowDeliveryModal(true);
                    }}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Entregar
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-4">
          {completedOrders.map(order => (
            <Card key={order.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{order.customerName}</h3>
                  <p className="text-sm text-gray-600">{order.customerAddress}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">R$ {order.total.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">
                    {order.deliveredAt?.toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Distância</p>
                  <p className="font-semibold">{order.distance} km</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tempo Real</p>
                  <p className="font-semibold">
                    {order.actualDeliveryTime && order.pickedUpAt 
                      ? Math.floor((order.actualDeliveryTime.getTime() - order.pickedUpAt.getTime()) / (1000 * 60))
                      : '-'
                    } min
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pagamento</p>
                  <Badge variant={getPaymentStatusColor(order.paymentStatus)} size="sm">
                    {getPaymentStatusLabel(order.paymentStatus)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avaliação</p>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="ml-1 font-semibold">5.0</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'profile' && currentDriver && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Informações Pessoais</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Nome</p>
                <p className="font-medium">{currentDriver.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Telefone</p>
                <p className="font-medium">{currentDriver.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Veículo</p>
                <p className="font-medium">{currentDriver.vehicle}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Placa</p>
                <p className="font-medium">{currentDriver.licensePlate}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Estatísticas</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Total de Entregas</p>
                <p className="text-2xl font-bold">{currentDriver.totalDeliveries}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Ganhos Totais</p>
                <p className="text-2xl font-bold">R$ {currentDriver.totalEarnings.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Avaliação</p>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <span className="ml-2 text-xl font-bold">{currentDriver.rating}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold">Entrega #{selectedOrder.id}</h2>
                <p className="text-sm text-gray-600">{selectedOrder.customerName}</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowOrderDetails(false)}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="font-medium mb-3">Informações do Cliente</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Nome:</span>
                    <span className="text-sm font-medium">{selectedOrder.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Telefone:</span>
                    <span className="text-sm font-medium">{selectedOrder.customerPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Endereço:</span>
                    <span className="text-sm font-medium">{selectedOrder.customerAddress}</span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-medium mb-3">Itens do Pedido</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map(item => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-gray-600">Quantidade: {item.quantity}</p>
                        {item.notes && (
                          <p className="text-sm text-gray-600">Obs: {item.notes}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">R$ {item.totalPrice.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">R$ {item.unitPrice.toFixed(2)} cada</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Info */}
              <div>
                <h3 className="font-medium mb-3">Informações de Pagamento</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Método:</span>
                    <span className="text-sm font-medium">
                      {selectedOrder.paymentMethod === 'cash' && 'Dinheiro'}
                      {selectedOrder.paymentMethod === 'card' && 'Cartão'}
                      {selectedOrder.paymentMethod === 'pix' && 'PIX'}
                      {selectedOrder.paymentMethod === 'online' && 'Online'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <Badge variant={getPaymentStatusColor(selectedOrder.paymentStatus)}>
                      {getPaymentStatusLabel(selectedOrder.paymentStatus)}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-4 border-t">
                <Button variant="secondary">
                  <Navigation className="h-4 w-4 mr-2" />
                  Navegar
                </Button>
                <Button variant="secondary">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
                <Button variant="secondary">
                  <Phone className="h-4 w-4 mr-2" />
                  Ligar
                </Button>
                {selectedOrder.status === 'in_transit' && (
                  <Button onClick={() => {
                    setShowOrderDetails(false);
                    setShowDeliveryModal(true);
                  }}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirmar Entrega
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Delivery Confirmation Modal */}
      {showDeliveryModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Confirmar Entrega</h2>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowDeliveryModal(false)}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Pedido #{selectedOrder.id} - {selectedOrder.customerName}
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Observações sobre a entrega..."
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setShowDeliveryModal(false)}
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    updateOrderStatus(selectedOrder.id, 'delivered');
                    setShowDeliveryModal(false);
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirmar
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DeliveryDriverApp; 