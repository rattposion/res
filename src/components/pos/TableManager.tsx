import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  List, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Clock,
  Receipt,
  CheckCircle,
  AlertCircle,
  XCircle,
  MapPin,
  DollarSign,
  Eye,
  Printer
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';

interface Table {
  id: string;
  number: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  capacity: number;
  location: string;
  currentOrder?: Order;
  reservation?: Reservation;
  lastUpdated: Date;
}

interface Order {
  id: string;
  tableNumber: number;
  customerName?: string;
  items: OrderItem[];
  status: 'open' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'partial';
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
}

interface Reservation {
  id: string;
  customerName: string;
  phone: string;
  date: Date;
  time: string;
  guests: number;
  notes?: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

const TableManager: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load mock data
    const mockTables: Table[] = [
      {
        id: '1',
        number: 1,
        status: 'available',
        capacity: 4,
        location: 'Sala Principal',
        lastUpdated: new Date()
      },
      {
        id: '2',
        number: 2,
        status: 'occupied',
        capacity: 6,
        location: 'Sala Principal',
        currentOrder: {
          id: 'order-1',
          tableNumber: 2,
          customerName: 'João Silva',
          items: [
            {
              id: 'item-1',
              productName: 'Pizza Margherita',
              quantity: 2,
              unitPrice: 35.90,
              totalPrice: 71.80,
              status: 'ready'
            },
            {
              id: 'item-2',
              productName: 'Refrigerante Coca-Cola',
              quantity: 3,
              unitPrice: 6.90,
              totalPrice: 20.70,
              status: 'delivered'
            }
          ],
          status: 'open',
          paymentStatus: 'pending',
          subtotal: 92.50,
          tax: 9.25,
          discount: 0,
          total: 101.75,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          updatedAt: new Date()
        },
        lastUpdated: new Date()
      },
      {
        id: '3',
        number: 3,
        status: 'reserved',
        capacity: 4,
        location: 'Varanda',
        reservation: {
          id: 'res-1',
          customerName: 'Maria Santos',
          phone: '(11) 99999-9999',
          date: new Date(),
          time: '19:00',
          guests: 4,
          notes: 'Aniversário',
          status: 'confirmed'
        },
        lastUpdated: new Date()
      },
      {
        id: '4',
        number: 4,
        status: 'cleaning',
        capacity: 8,
        location: 'Sala VIP',
        lastUpdated: new Date(Date.now() - 30 * 60 * 1000)
      },
      {
        id: '5',
        number: 5,
        status: 'available',
        capacity: 2,
        location: 'Bar',
        lastUpdated: new Date()
      },
      {
        id: '6',
        number: 6,
        status: 'occupied',
        capacity: 4,
        location: 'Sala Principal',
        currentOrder: {
          id: 'order-2',
          tableNumber: 6,
          customerName: 'Pedro Costa',
          items: [
            {
              id: 'item-3',
              productName: 'Pizza Quatro Queijos',
              quantity: 1,
              unitPrice: 42.90,
              totalPrice: 42.90,
              status: 'preparing'
            }
          ],
          status: 'preparing',
          paymentStatus: 'pending',
          subtotal: 42.90,
          tax: 4.29,
          discount: 0,
          total: 47.19,
          createdAt: new Date(Date.now() - 45 * 60 * 1000),
          updatedAt: new Date()
        },
        lastUpdated: new Date()
      }
    ];

    setTables(mockTables);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'success';
      case 'occupied': return 'error';
      case 'reserved': return 'warning';
      case 'cleaning': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available': return 'Livre';
      case 'occupied': return 'Ocupada';
      case 'reserved': return 'Reservada';
      case 'cleaning': return 'Limpeza';
      default: return status;
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'warning';
      case 'preparing': return 'primary';
      case 'ready': return 'success';
      case 'delivered': return 'success';
      case 'cancelled': return 'error';
      default: return 'secondary';
    }
  };

  const getOrderStatusLabel = (status: string) => {
    switch (status) {
      case 'open': return 'Aberta';
      case 'preparing': return 'Preparando';
      case 'ready': return 'Pronta';
      case 'delivered': return 'Entregue';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  const filteredTables = tables.filter(table => {
    const matchesSearch = table.number.toString().includes(searchQuery) ||
                         table.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || table.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const openTable = (table: Table) => {
    setSelectedTable(table);
    setShowOrderModal(true);
  };

  const closeTable = (tableId: string) => {
    setTables(prev => prev.map(table => 
      table.id === tableId 
        ? { ...table, status: 'available' as const, currentOrder: undefined }
        : table
    ));
  };

  const reserveTable = (table: Table) => {
    setSelectedTable(table);
    setShowReservationModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gerenciamento de Mesas</h1>
        <p className="text-gray-600">Controle de mesas, comandas e reservas</p>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <div className="relative">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar mesa..."
              className="w-64"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos os status</option>
            <option value="available">Livre</option>
            <option value="occupied">Ocupada</option>
            <option value="reserved">Reservada</option>
            <option value="cleaning">Limpeza</option>
          </select>
        </div>

        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Mesa
        </Button>
      </div>

      {/* Tables Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTables.map(table => (
            <Card
              key={table.id}
              className={`p-6 cursor-pointer hover:shadow-lg transition-shadow ${
                table.status === 'occupied' ? 'ring-2 ring-red-200' : ''
              }`}
              onClick={() => setSelectedTable(table)}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Mesa {table.number}</h3>
                  <p className="text-sm text-gray-600">{table.location}</p>
                </div>
                <Badge variant={getStatusColor(table.status)}>
                  {getStatusLabel(table.status)}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  <span>Capacidade: {table.capacity} pessoas</span>
                </div>

                {table.currentOrder && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Comanda Ativa</span>
                      <Badge variant={getOrderStatusColor(table.currentOrder.status)} size="sm">
                        {getOrderStatusLabel(table.currentOrder.status)}
                      </Badge>
                    </div>
                    {table.currentOrder.customerName && (
                      <p className="text-sm text-gray-600">
                        Cliente: {table.currentOrder.customerName}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span>Total:</span>
                      <span className="font-semibold">R$ {table.currentOrder.total.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>
                        {Math.floor((Date.now() - table.currentOrder.createdAt.getTime()) / (1000 * 60))} min
                      </span>
                    </div>
                  </div>
                )}

                {table.reservation && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Reserva</span>
                      <Badge variant="warning" size="sm">
                        {table.reservation.time}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {table.reservation.customerName} - {table.reservation.guests} pessoas
                    </p>
                  </div>
                )}

                <div className="flex space-x-2 pt-3 border-t">
                  {table.status === 'available' && (
                    <>
                      <Button size="sm" className="flex-1" onClick={() => openTable(table)}>
                        <Receipt className="h-4 w-4 mr-2" />
                        Abrir Comanda
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => reserveTable(table)}>
                        <Clock className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  {table.status === 'occupied' && (
                    <>
                      <Button size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Comanda
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => closeTable(table.id)}>
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  {table.status === 'reserved' && (
                    <Button size="sm" className="flex-1" variant="secondary">
                      <Edit className="h-4 w-4 mr-2" />
                      Editar Reserva
                    </Button>
                  )}
                  {table.status === 'cleaning' && (
                    <Button size="sm" className="flex-1" onClick={() => openTable(table)}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mesa Pronta
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTables.map(table => (
            <Card key={table.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <h3 className="text-xl font-bold">Mesa {table.number}</h3>
                    <p className="text-sm text-gray-600">{table.location}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatusColor(table.status)}>
                      {getStatusLabel(table.status)}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-1" />
                      {table.capacity}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {table.currentOrder && (
                    <div className="text-right">
                      <p className="font-medium">{table.currentOrder.customerName || 'Cliente'}</p>
                      <p className="text-sm text-gray-600">
                        R$ {table.currentOrder.total.toFixed(2)}
                      </p>
                      <Badge variant={getOrderStatusColor(table.currentOrder.status)} size="sm">
                        {getOrderStatusLabel(table.currentOrder.status)}
                      </Badge>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    {table.status === 'available' && (
                      <>
                        <Button size="sm" onClick={() => openTable(table)}>
                          <Receipt className="h-4 w-4 mr-2" />
                          Abrir
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => reserveTable(table)}>
                          <Clock className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {table.status === 'occupied' && (
                      <>
                        <Button size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => closeTable(table.id)}>
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button size="sm" variant="secondary">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Order Modal */}
      {showOrderModal && selectedTable && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Mesa {selectedTable.number}</h2>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowOrderModal(false)}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Cliente
                </label>
                <Input placeholder="Nome do cliente" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Pessoas
                </label>
                <Input type="number" placeholder="Quantidade" />
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setShowOrderModal(false)}
                >
                  Cancelar
                </Button>
                <Button className="flex-1">
                  <Receipt className="h-4 w-4 mr-2" />
                  Abrir Comanda
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Reservation Modal */}
      {showReservationModal && selectedTable && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Reservar Mesa {selectedTable.number}</h2>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowReservationModal(false)}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Cliente
                </label>
                <Input placeholder="Nome completo" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                <Input placeholder="(11) 99999-9999" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data
                  </label>
                  <Input type="date" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Horário
                  </label>
                  <Input type="time" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Pessoas
                </label>
                <Input type="number" placeholder="Quantidade" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Observações especiais..."
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setShowReservationModal(false)}
                >
                  Cancelar
                </Button>
                <Button className="flex-1">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirmar Reserva
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TableManager; 