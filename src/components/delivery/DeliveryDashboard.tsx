import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Clock, 
  Truck, 
  User, 
  Phone,
  MessageSquare,
  Navigation,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  Printer,
  Filter,
  Search,
  RefreshCw,
  DollarSign,
  Star,
  Route,
  Package,
  ShoppingCart
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
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod: 'cash' | 'card' | 'pix' | 'online';
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  estimatedDeliveryTime: Date;
  actualDeliveryTime?: Date;
  driver?: Driver;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
  priority: 'normal' | 'urgent' | 'vip';
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
  currentLocation?: {
    lat: number;
    lng: number;
  };
  currentOrder?: string;
}

interface DeliveryZone {
  id: string;
  name: string;
  deliveryFee: number;
  estimatedTime: number;
  isActive: boolean;
}

const DeliveryDashboard: React.FC = () => {
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [showIfoodModal, setShowIfoodModal] = useState(false);

  const handleImportIfoodOrder = () => {
    // Pedido mockado iFood
    const newOrder: DeliveryOrder = {
      id: (orders.length + 1).toString(),
      customerName: 'Cliente iFood',
      customerPhone: '(11) 91234-5678',
      customerAddress: 'Rua do iFood, 123 - Centro, São Paulo - SP',
      items: [
        { id: 'item-ifood-1', productName: 'Pizza Pepperoni', quantity: 1, unitPrice: 39.90, totalPrice: 39.90 },
        { id: 'item-ifood-2', productName: 'Coca-Cola 2L', quantity: 1, unitPrice: 12.00, totalPrice: 12.00 }
      ],
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'online',
      subtotal: 51.90,
      deliveryFee: 7.00,
      discount: 0,
      total: 58.90,
      estimatedDeliveryTime: new Date(Date.now() + 40 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: 'normal'
    };
    setOrders(prev => [newOrder, ...prev]);
    setShowIfoodModal(false);
  };

  useEffect(() => {
    // Load mock data
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
        status: 'out_for_delivery',
        paymentStatus: 'paid',
        paymentMethod: 'pix',
        subtotal: 85.60,
        deliveryFee: 5.00,
        discount: 0,
        total: 90.60,
        estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000),
        driver: {
          id: 'driver-1',
          name: 'Carlos Santos',
          phone: '(11) 88888-8888',
          vehicle: 'Moto Honda CG 150',
          licensePlate: 'ABC-1234',
          status: 'busy',
          currentOrder: '1'
        },
        createdAt: new Date(Date.now() - 45 * 60 * 1000),
        updatedAt: new Date(),
        priority: 'normal'
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
        status: 'ready',
        paymentStatus: 'paid',
        paymentMethod: 'card',
        subtotal: 42.90,
        deliveryFee: 8.00,
        discount: 5.00,
        total: 45.90,
        estimatedDeliveryTime: new Date(Date.now() + 45 * 60 * 1000),
        createdAt: new Date(Date.now() - 20 * 60 * 1000),
        updatedAt: new Date(),
        priority: 'urgent'
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
        status: 'preparing',
        paymentStatus: 'pending',
        paymentMethod: 'cash',
        subtotal: 44.80,
        deliveryFee: 6.00,
        discount: 0,
        total: 50.80,
        estimatedDeliveryTime: new Date(Date.now() + 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 10 * 60 * 1000),
        updatedAt: new Date(),
        priority: 'normal'
      }
    ];

    const mockDrivers: Driver[] = [
      {
        id: 'driver-1',
        name: 'Carlos Santos',
        phone: '(11) 88888-8888',
        vehicle: 'Moto Honda CG 150',
        licensePlate: 'ABC-1234',
        status: 'busy',
        currentOrder: '1'
      },
      {
        id: 'driver-2',
        name: 'Ana Oliveira',
        phone: '(11) 77777-7777',
        vehicle: 'Moto Yamaha YBR 125',
        licensePlate: 'XYZ-5678',
        status: 'available'
      },
      {
        id: 'driver-3',
        name: 'Roberto Lima',
        phone: '(11) 66666-6666',
        vehicle: 'Moto Suzuki GSX-R 150',
        licensePlate: 'DEF-9012',
        status: 'offline'
      }
    ];

    setOrders(mockOrders);
    setDrivers(mockDrivers);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'confirmed': return 'primary';
      case 'preparing': return 'warning';
      case 'ready': return 'success';
      case 'out_for_delivery': return 'primary';
      case 'delivered': return 'success';
      case 'cancelled': return 'error';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'confirmed': return 'Confirmado';
      case 'preparing': return 'Preparando';
      case 'ready': return 'Pronto';
      case 'out_for_delivery': return 'Em Entrega';
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

  const getDriverStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'success';
      case 'busy': return 'warning';
      case 'offline': return 'error';
      default: return 'secondary';
    }
  };

  const assignDriver = (orderId: string, driverId: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, driver: drivers.find(d => d.id === driverId) }
        : order
    ));
  };

  const updateOrderStatus = (orderId: string, status: DeliveryOrder['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status, updatedAt: new Date() }
        : order
    ));
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customerPhone.includes(searchQuery);
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const availableDrivers = drivers.filter(driver => driver.status === 'available');

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard de Delivery</h1>
        <p className="text-gray-600">Gerencie pedidos de delivery e rastreamento em tempo real</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pedidos Hoje</p>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Em Entrega</p>
              <p className="text-2xl font-bold text-gray-900">
                {orders.filter(o => o.status === 'out_for_delivery').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Truck className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Entregadores Ativos</p>
              <p className="text-2xl font-bold text-gray-900">
                {drivers.filter(d => d.status === 'available').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Faturamento Hoje</p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar pedidos..."
              className="pl-10 w-64"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos os status</option>
            <option value="pending">Pendente</option>
            <option value="confirmed">Confirmado</option>
            <option value="preparing">Preparando</option>
            <option value="ready">Pronto</option>
            <option value="out_for_delivery">Em Entrega</option>
            <option value="delivered">Entregue</option>
            <option value="cancelled">Cancelado</option>
          </select>

          <Button variant="secondary">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>

        <Button>
          <Truck className="h-4 w-4 mr-2" />
          Atribuir Entregador
        </Button>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setShowIfoodModal(true)}>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Importar Pedido iFood
          </Button>
        </div>
      </div>

      {showIfoodModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Simular Importação iFood</h2>
            <p className="mb-4">Deseja importar um pedido simulado do iFood?</p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowIfoodModal(false)}>Cancelar</Button>
              <Button onClick={handleImportIfoodOrder}>Importar</Button>
            </div>
          </div>
        </div>
      )}

      {/* Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredOrders.map(order => (
          <Card key={order.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">{order.customerName}</h3>
                <p className="text-sm text-gray-600">{order.customerPhone}</p>
              </div>
              <div className="flex space-x-2">
                <Badge variant={getStatusColor(order.status)}>
                  {getStatusLabel(order.status)}
                </Badge>
                <Badge variant={getPriorityColor(order.priority)}>
                  {getPriorityLabel(order.priority)}
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
            </div>

            {order.driver && (
              <div className="bg-blue-50 p-3 rounded-lg mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{order.driver.name}</p>
                    <p className="text-xs text-gray-600">{order.driver.vehicle}</p>
                  </div>
                  <Badge variant={getDriverStatusColor(order.driver.status)} size="sm">
                    {order.driver.status === 'busy' ? 'Em Entrega' : 'Disponível'}
                  </Badge>
                </div>
              </div>
            )}

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
              {order.status === 'ready' && !order.driver && (
                <Button size="sm" onClick={() => {
                  setSelectedOrder(order);
                  setShowDriverModal(true);
                }}>
                  <Truck className="h-4 w-4 mr-2" />
                  Atribuir
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold">Pedido #{selectedOrder.id}</h2>
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
                    <Badge variant={selectedOrder.paymentStatus === 'paid' ? 'success' : 'warning'}>
                      {selectedOrder.paymentStatus === 'paid' ? 'Pago' : 'Pendente'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Driver Info */}
              {selectedOrder.driver && (
                <div>
                  <h3 className="font-medium mb-3">Entregador</h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Nome:</span>
                        <span className="text-sm font-medium">{selectedOrder.driver.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Telefone:</span>
                        <span className="text-sm font-medium">{selectedOrder.driver.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Veículo:</span>
                        <span className="text-sm font-medium">{selectedOrder.driver.vehicle}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Placa:</span>
                        <span className="text-sm font-medium">{selectedOrder.driver.licensePlate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2 pt-4 border-t">
                <Button variant="secondary">
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir
                </Button>
                <Button variant="secondary">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
                <Button variant="secondary">
                  <Navigation className="h-4 w-4 mr-2" />
                  Rota
                </Button>
                {selectedOrder.status === 'ready' && (
                  <Button>
                    <Truck className="h-4 w-4 mr-2" />
                    Iniciar Entrega
                  </Button>
                )}
                {selectedOrder.status === 'out_for_delivery' && (
                  <Button>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirmar Entrega
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Driver Assignment Modal */}
      {showDriverModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Atribuir Entregador</h2>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowDriverModal(false)}
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
                  Selecionar Entregador
                </label>
                <div className="space-y-2">
                  {availableDrivers.map(driver => (
                    <div
                      key={driver.id}
                      className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                      onClick={() => {
                        assignDriver(selectedOrder.id, driver.id);
                        setShowDriverModal(false);
                      }}
                    >
                      <div>
                        <p className="font-medium">{driver.name}</p>
                        <p className="text-sm text-gray-600">{driver.vehicle}</p>
                      </div>
                      <Badge variant="success" size="sm">
                        Disponível
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setShowDriverModal(false)}
                >
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

export default DeliveryDashboard; 