import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  CreditCard, 
  Receipt, 
  Users, 
  Clock,
  Plus,
  Minus,
  Trash2,
  Printer,
  Calculator,
  Search,
  Filter,
  Grid,
  List,
  DollarSign,
  Percent,
  X,
  Check,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  description?: string;
  available: boolean;
  preparationTime: number;
}

interface OrderItem {
  product: Product;
  quantity: number;
  notes: string;
  unitPrice: number;
  totalPrice: number;
}

interface Order {
  id: string;
  tableNumber?: number;
  customerName?: string;
  items: OrderItem[];
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  paymentMethod: 'cash' | 'card' | 'pix' | 'transfer';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Table {
  id: string;
  number: number;
  status: 'available' | 'occupied' | 'reserved';
  currentOrder?: Order;
  capacity: number;
  location: string;
}

const POS: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sales' | 'tables' | 'orders'>('sales');
  const [products, setProducts] = useState<Product[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [paymentModal, setPaymentModal] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'pix' | 'transfer'>('cash');
  const [cashAmount, setCashAmount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [showTefModal, setShowTefModal] = useState(false);
  const [tefStatus, setTefStatus] = useState<'idle' | 'processing' | 'approved' | 'rejected'>('idle');

  const categories = [
    'Pizzas',
    'Bebidas',
    'Sobremesas',
    'Entradas',
    'Especiais'
  ];

  useEffect(() => {
    // Load mock data
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Pizza Margherita',
        price: 35.90,
        category: 'Pizzas',
        description: 'Molho de tomate, mussarela, manjericão',
        available: true,
        preparationTime: 15
      },
      {
        id: '2',
        name: 'Pizza Quatro Queijos',
        price: 42.90,
        category: 'Pizzas',
        description: 'Mussarela, parmesão, provolone, gorgonzola',
        available: true,
        preparationTime: 18
      },
      {
        id: '3',
        name: 'Refrigerante Coca-Cola',
        price: 6.90,
        category: 'Bebidas',
        available: true,
        preparationTime: 1
      },
      {
        id: '4',
        name: 'Suco Natural Laranja',
        price: 8.90,
        category: 'Bebidas',
        available: true,
        preparationTime: 3
      },
      {
        id: '5',
        name: 'Tiramisu',
        price: 12.90,
        category: 'Sobremesas',
        description: 'Sobremesa italiana tradicional',
        available: true,
        preparationTime: 5
      }
    ];

    const mockTables: Table[] = [
      { id: '1', number: 1, status: 'available', capacity: 4, location: 'Sala Principal' },
      { id: '2', number: 2, status: 'occupied', capacity: 6, location: 'Sala Principal' },
      { id: '3', number: 3, status: 'available', capacity: 4, location: 'Varanda' },
      { id: '4', number: 4, status: 'reserved', capacity: 8, location: 'Sala VIP' },
      { id: '5', number: 5, status: 'available', capacity: 2, location: 'Bar' },
      { id: '6', number: 6, status: 'occupied', capacity: 4, location: 'Sala Principal' }
    ];

    setProducts(mockProducts);
    setTables(mockTables);
  }, []);

  const addToOrder = (product: Product) => {
    if (!currentOrder) {
      const newOrder: Order = {
        id: crypto.randomUUID(),
        items: [],
        status: 'pending',
        paymentMethod: 'cash',
        paymentStatus: 'pending',
        subtotal: 0,
        tax: 0,
        discount: 0,
        total: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setCurrentOrder(newOrder);
    }

    const existingItem = currentOrder?.items.find(item => item.product.id === product.id);
    
    if (existingItem) {
      setCurrentOrder(prev => prev ? {
        ...prev,
        items: prev.items.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1, totalPrice: (item.quantity + 1) * item.unitPrice }
            : item
        )
      } : null);
    } else {
      const newItem: OrderItem = {
        product,
        quantity: 1,
        notes: '',
        unitPrice: product.price,
        totalPrice: product.price
      };
      
      setCurrentOrder(prev => prev ? {
        ...prev,
        items: [...prev.items, newItem]
      } : null);
    }
  };

  const updateItemQuantity = (productId: string, quantity: number) => {
    if (!currentOrder) return;

    if (quantity <= 0) {
      setCurrentOrder(prev => prev ? {
        ...prev,
        items: prev.items.filter(item => item.product.id !== productId)
      } : null);
    } else {
      setCurrentOrder(prev => prev ? {
        ...prev,
        items: prev.items.map(item => 
          item.product.id === productId 
            ? { ...item, quantity, totalPrice: quantity * item.unitPrice }
            : item
        )
      } : null);
    }
  };

  const removeItem = (productId: string) => {
    setCurrentOrder(prev => prev ? {
      ...prev,
      items: prev.items.filter(item => item.product.id !== productId)
    } : null);
  };

  const calculateTotals = () => {
    if (!currentOrder) return { subtotal: 0, tax: 0, total: 0 };

    const subtotal = currentOrder.items.reduce((sum, item) => sum + item.totalPrice, 0);
    const tax = subtotal * 0.1; // 10% de taxa
    const total = subtotal + tax - discount;

    return { subtotal, tax, total };
  };

  const handlePayment = () => {
    if (!currentOrder) return;

    const { subtotal, tax, total } = calculateTotals();
    
    const updatedOrder: Order = {
      ...currentOrder,
      subtotal,
      tax,
      discount,
      total,
      paymentMethod,
      status: 'preparing',
      updatedAt: new Date()
    };

    setOrders(prev => [updatedOrder, ...prev]);
    setCurrentOrder(null);
    setPaymentModal(false);
    setCustomerName('');
    setPaymentMethod('cash');
    setCashAmount(0);
    setDiscount(0);
  };

  const handleSimulateTEF = () => {
    setTefStatus('processing');
    setTimeout(() => {
      // Simula aprovação ou recusa aleatória
      const approved = Math.random() > 0.3;
      setTefStatus(approved ? 'approved' : 'rejected');
      if (approved) {
        setTimeout(() => {
          setShowTefModal(false);
          setTefStatus('idle');
          handlePayment();
        }, 1200);
      }
    }, 1800);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory && product.available;
  });

  const getTableStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'success';
      case 'occupied': return 'error';
      case 'reserved': return 'warning';
      default: return 'secondary';
    }
  };

  const getTableStatusLabel = (status: string) => {
    switch (status) {
      case 'available': return 'Livre';
      case 'occupied': return 'Ocupada';
      case 'reserved': return 'Reservada';
      default: return status;
    }
  };

  const { subtotal, tax, total } = calculateTotals();
  const change = cashAmount - total;

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar - Products */}
      <div className="w-1/2 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">PDV</h1>
            <div className="flex space-x-2">
              <Button variant="secondary" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </Button>
              <Button variant="secondary" size="sm">
                <Calculator className="h-4 w-4 mr-2" />
                Calculadora
              </Button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar produtos..."
                className="pl-10"
              />
            </div>
            
            <div className="flex space-x-2">
              {categories.map(category => (
                <Button
                  key={category}
                  size="sm"
                  variant={selectedCategory === category ? 'default' : 'secondary'}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="p-4 cursor-pointer hover:shadow-md transition-shadow bg-white rounded border"
                onClick={() => addToOrder(product)}
              >
                <div className="text-center">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-24 object-cover rounded mb-2" />
                  ) : (
                    <div className="w-full h-24 bg-gray-200 rounded mb-2 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">{product.name}</span>
                    </div>
                  )}
                  <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
                  <p className="text-lg font-bold text-green-600">R$ {product.price.toFixed(2)}</p>
                  {product.description && (
                    <p className="text-xs text-gray-600 mt-1">{product.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content - Order */}
      <div className="w-1/2 flex flex-col">
        {/* Order Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Pedido Atual</h2>
              {selectedTable && (
                <p className="text-sm text-gray-600">Mesa {selectedTable.number}</p>
              )}
            </div>
            <div className="flex space-x-2">
              <Button variant="secondary" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Cliente
              </Button>
              <Button variant="secondary" size="sm">
                <Clock className="h-4 w-4 mr-2" />
                Histórico
              </Button>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {currentOrder && currentOrder.items.length > 0 ? (
            <div className="space-y-3">
              {currentOrder.items.map((item, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.product.name}</h3>
                      <p className="text-sm text-gray-600">R$ {item.unitPrice.toFixed(2)} cada</p>
                      {item.notes && (
                        <p className="text-xs text-gray-500 mt-1">Obs: {item.notes}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => updateItemQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="font-semibold min-w-[2rem] text-center">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => updateItemQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">R$ {item.totalPrice.toFixed(2)}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => removeItem(item.product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum item no pedido</h3>
              <p className="text-gray-600">Adicione produtos para começar</p>
            </div>
          )}
        </div>

        {/* Order Summary */}
        {currentOrder && currentOrder.items.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxa (10%):</span>
                <span>R$ {tax.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Desconto:</span>
                  <span>-R$ {discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setDiscount(total * 0.1)} // 10% discount
              >
                <Percent className="h-4 w-4 mr-2" />
                Desconto
              </Button>
              <Button
                className="flex-1"
                onClick={() => setPaymentModal(true)}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Finalizar
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {paymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Finalizar Pedido</h2>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPaymentModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Cliente
                </label>
                <Input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nome do cliente"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Método de Pagamento
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['cash', 'card', 'pix', 'transfer'] as const).map(method => (
                    <Button
                      key={method}
                      variant={paymentMethod === method ? 'default' : 'secondary'}
                      size="sm"
                      onClick={() => setPaymentMethod(method)}
                    >
                      {method === 'cash' && 'Dinheiro'}
                      {method === 'card' && 'Cartão'}
                      {method === 'pix' && 'PIX'}
                      {method === 'transfer' && 'Transferência'}
                    </Button>
                  ))}
                </div>
              </div>

              {paymentMethod === 'cash' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor Recebido
                  </label>
                  <Input
                    type="number"
                    value={cashAmount}
                    onChange={(e) => setCashAmount(Number(e.target.value))}
                    placeholder="0.00"
                  />
                  {change > 0 && (
                    <p className="text-sm text-green-600 mt-1">
                      Troco: R$ {change.toFixed(2)}
                    </p>
                  )}
                </div>
              )}

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setPaymentModal(false)}
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1"
                  onClick={handlePayment}
                  disabled={paymentMethod === 'cash' && cashAmount < total}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Confirmar
                </Button>
                {paymentMethod === 'card' && (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowTefModal(true)}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Simular TEF/POS
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
      {showTefModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96 p-8 flex flex-col items-center">
            <CreditCard className="h-10 w-10 text-blue-600 mb-4" />
            <h2 className="text-xl font-bold mb-2">Simulação TEF/POS</h2>
            {tefStatus === 'idle' && (
              <Button onClick={handleSimulateTEF} className="w-full mt-4">Iniciar Pagamento</Button>
            )}
            {tefStatus === 'processing' && (
              <>
                <div className="animate-spin mb-2"><RefreshCw className="h-6 w-6 text-blue-500" /></div>
                <p className="text-blue-600 font-semibold">Processando transação...</p>
              </>
            )}
            {tefStatus === 'approved' && (
              <>
                <Check className="h-8 w-8 text-green-500 mb-2" />
                <p className="text-green-600 font-semibold">Pagamento aprovado!</p>
              </>
            )}
            {tefStatus === 'rejected' && (
              <>
                <X className="h-8 w-8 text-red-500 mb-2" />
                <p className="text-red-600 font-semibold">Pagamento recusado!</p>
                <Button onClick={() => setTefStatus('idle')} className="w-full mt-4">Tentar Novamente</Button>
              </>
            )}
            <Button variant="outline" className="w-full mt-4" onClick={() => { setShowTefModal(false); setTefStatus('idle'); }}>Fechar</Button>
          </Card>
        </div>
      )}
    </div>
  );
};

export default POS; 