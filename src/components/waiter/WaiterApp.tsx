import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Modal, Badge } from '../ui';
import { 
  User, 
  MapPin, 
  Clock, 
  Plus, 
  Minus, 
  Trash2, 
  Check, 
  X,
  Bell,
  Users,
  DollarSign,
  ShoppingCart,
  Printer,
  MessageSquare,
  Settings
} from 'lucide-react';
import WaiterAdvancedFeatures from './WaiterAdvancedFeatures';

// Tipos
interface Waiter {
  id: string;
  name: string;
  code: string;
  sector: string;
}

interface Table {
  id: string;
  number: number;
  sector: string;
  status: 'free' | 'occupied' | 'waiting';
  waiterId?: string;
  customerName?: string;
  peopleCount?: number;
  openedAt?: Date;
}

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  variations?: {
    name: string;
    options: string[];
  }[];
  addons?: {
    name: string;
    price: number;
  }[];
}

interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
  variations?: string[];
  addons?: string[];
  notes?: string;
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
}

interface Comanda {
  id: string;
  tableId: string;
  waiterId: string;
  customerName?: string;
  peopleCount?: number;
  items: OrderItem[];
  status: 'open' | 'closed';
  openedAt: Date;
  closedAt?: Date;
  total: number;
}

// Dados mockados
const mockWaiters: Waiter[] = [
  { id: '1', name: 'João Silva', code: 'JS001', sector: 'Salão' },
  { id: '2', name: 'Maria Santos', code: 'MS002', sector: 'Varanda' },
];

const mockTables: Table[] = [
  { id: '1', number: 1, sector: 'Salão', status: 'free' },
  { id: '2', number: 2, sector: 'Salão', status: 'occupied', waiterId: '1', customerName: 'Ana', peopleCount: 4, openedAt: new Date() },
  { id: '3', number: 3, sector: 'Salão', status: 'waiting', waiterId: '1', customerName: 'Carlos', peopleCount: 2, openedAt: new Date() },
  { id: '4', number: 4, sector: 'Varanda', status: 'free' },
  { id: '5', number: 5, sector: 'Varanda', status: 'occupied', waiterId: '2', customerName: 'Pedro', peopleCount: 6, openedAt: new Date() },
];

const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Pizza Margherita',
    category: 'Pizzas',
    price: 35.00,
    variations: [
      {
        name: 'Tamanho',
        options: ['Pequena', 'Média', 'Grande']
      }
    ],
    addons: [
      { name: 'Borda Recheada', price: 5.00 },
      { name: 'Queijo Extra', price: 3.00 }
    ]
  },
  {
    id: '2',
    name: 'Hambúrguer Clássico',
    category: 'Lanches',
    price: 25.00,
    variations: [
      {
        name: 'Ponto',
        options: ['Mal passado', 'Ao ponto', 'Bem passado']
      }
    ],
    addons: [
      { name: 'Bacon', price: 4.00 },
      { name: 'Queijo', price: 2.00 }
    ]
  },
  {
    id: '3',
    name: 'Coca-Cola',
    category: 'Bebidas',
    price: 8.00,
    variations: [
      {
        name: 'Tamanho',
        options: ['300ml', '500ml', '1L']
      }
    ]
  }
];

const WaiterApp: React.FC = () => {
  // Estados
  const [currentWaiter, setCurrentWaiter] = useState<Waiter | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [showTables, setShowTables] = useState(false);
  const [showComanda, setShowComanda] = useState(false);
  const [showOrder, setShowOrder] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [selectedComanda, setSelectedComanda] = useState<Comanda | null>(null);
  const [tables, setTables] = useState<Table[]>(mockTables);
  const [comandas, setComandas] = useState<Comanda[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);
  const [selectedCategory, setSelectedCategory] = useState<string>('Pizzas');
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [loginCode, setLoginCode] = useState('');
  const [newComandaData, setNewComandaData] = useState({
    customerName: '',
    peopleCount: 1
  });
  const [showAdvancedFeatures, setShowAdvancedFeatures] = useState(false);

  // WebSocket simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Simular notificações de pedidos prontos
      if (Math.random() > 0.95) {
        setNotifications(prev => [...prev, `Pedido pronto - Mesa ${Math.floor(Math.random() * 10) + 1}`]);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Login do garçom
  const handleLogin = () => {
    const waiter = mockWaiters.find(w => w.code === loginCode);
    if (waiter) {
      setCurrentWaiter(waiter);
      setIsLoggedIn(true);
      setShowLogin(false);
      setShowTables(true);
      setLoginCode('');
    } else {
      alert('Código inválido!');
    }
  };

  // Logout
  const handleLogout = () => {
    setCurrentWaiter(null);
    setIsLoggedIn(false);
    setShowLogin(true);
    setShowTables(false);
    setSelectedTable(null);
    setSelectedComanda(null);
    setCart([]);
  };

  // Abrir comanda
  const handleOpenComanda = () => {
    if (!selectedTable || !currentWaiter) return;

    const newComanda: Comanda = {
      id: Date.now().toString(),
      tableId: selectedTable.id,
      waiterId: currentWaiter.id,
      customerName: newComandaData.customerName || undefined,
      peopleCount: newComandaData.peopleCount,
      items: [],
      status: 'open',
      openedAt: new Date(),
      total: 0
    };

    setComandas(prev => [...prev, newComanda]);
    
    // Atualizar status da mesa
    setTables(prev => prev.map(table => 
      table.id === selectedTable.id 
        ? { ...table, status: 'occupied', waiterId: currentWaiter.id, customerName: newComandaData.customerName, peopleCount: newComandaData.peopleCount, openedAt: new Date() }
        : table
    ));

    setSelectedComanda(newComanda);
    setShowComanda(false);
    setShowOrder(true);
    setNewComandaData({ customerName: '', peopleCount: 1 });
  };

  // Adicionar item ao carrinho
  const handleAddToCart = (item: MenuItem) => {
    const newOrderItem: OrderItem = {
      id: Date.now().toString(),
      menuItemId: item.id,
      name: item.name,
      quantity: 1,
      price: item.price,
      status: 'pending'
    };

    setCart(prev => [...prev, newOrderItem]);
  };

  // Remover item do carrinho
  const handleRemoveFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  // Enviar pedido
  const handleSendOrder = () => {
    if (!selectedComanda || cart.length === 0) return;

    const updatedComanda = {
      ...selectedComanda,
      items: [...selectedComanda.items, ...cart],
      total: selectedComanda.total + cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };

    setComandas(prev => prev.map(c => c.id === selectedComanda.id ? updatedComanda : c));
    setCart([]);
    setShowOrder(false);
    
    // Simular envio para cozinha
    alert('Pedido enviado para cozinha!');
  };

  // Fechar comanda
  const handleCloseComanda = () => {
    if (!selectedComanda) return;

    const updatedComanda = {
      ...selectedComanda,
      status: 'closed' as const,
      closedAt: new Date()
    };

    setComandas(prev => prev.map(c => c.id === selectedComanda.id ? updatedComanda : c));
    
    // Liberar mesa
    setTables(prev => prev.map(table => 
      table.id === selectedComanda.tableId 
        ? { ...table, status: 'free', waiterId: undefined, customerName: undefined, peopleCount: undefined, openedAt: undefined }
        : table
    ));

    setSelectedComanda(null);
    setShowComanda(false);
    alert('Comanda fechada! Mesa liberada.');
  };

  // Renderizar tela de login
  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Login do Garçom</h2>
            <p className="text-gray-600 mt-2">Digite seu código de acesso</p>
          </div>

          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Código do garçom"
              value={loginCode}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLoginCode(e.target.value)}
              className="text-center text-lg font-mono"
            />
            
            <Button 
              onClick={handleLogin}
              className="w-full bg-blue-500 hover:bg-blue-600"
              disabled={!loginCode}
            >
              Entrar
            </Button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Códigos de teste:</p>
            <p className="font-mono">JS001 - João (Salão)</p>
            <p className="font-mono">MS002 - Maria (Varanda)</p>
          </div>
        </Card>
      </div>
    );
  }

  // Renderizar tela principal
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <User className="w-6 h-6 text-blue-500" />
            <div>
              <h1 className="font-semibold text-gray-800">{currentWaiter?.name}</h1>
              <p className="text-sm text-gray-500">{currentWaiter?.sector}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {notifications.length > 0 && (
              <Badge className="bg-red-500 text-white">
                {notifications.length}
              </Badge>
            )}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowAdvancedFeatures(!showAdvancedFeatures)}
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleLogout}
            >
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Notificações */}
      {notifications.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-yellow-600" />
            <p className="text-yellow-800 font-medium">Notificações</p>
          </div>
          {notifications.map((notification, index) => (
            <p key={index} className="text-yellow-700 text-sm mt-1">{notification}</p>
          ))}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setNotifications([])}
            className="mt-2 text-yellow-600 hover:text-yellow-700"
          >
            Limpar
          </Button>
        </div>
      )}

              {/* Conteúdo principal */}
        <div className="p-4">
          {showAdvancedFeatures && (
            <div className="mb-6">
              <WaiterAdvancedFeatures />
            </div>
          )}
          
          {showTables && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Mesas - {currentWaiter?.sector}</h2>
              <Badge className="bg-green-500">
                {tables.filter(t => t.status === 'free').length} Livres
              </Badge>
            </div>

            {/* Filtros */}
            <div className="flex space-x-2 overflow-x-auto pb-2">
              <Button 
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
              >
                Todas
              </Button>
              <Button 
                variant={selectedCategory === 'Salão' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('Salão')}
              >
                Salão
              </Button>
              <Button 
                variant={selectedCategory === 'Varanda' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('Varanda')}
              >
                Varanda
              </Button>
            </div>

            {/* Grid de mesas */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {tables
                .filter(table => selectedCategory === 'all' || table.sector === selectedCategory)
                .map(table => (
                  <Card 
                    key={table.id}
                    className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                      table.status === 'free' ? 'bg-green-50 border-green-200' :
                      table.status === 'occupied' ? 'bg-red-50 border-red-200' :
                      'bg-yellow-50 border-yellow-200'
                    }`}
                    onClick={() => {
                      setSelectedTable(table);
                      if (table.status === 'free') {
                        setShowComanda(true);
                      } else {
                        const comanda = comandas.find(c => c.tableId === table.id);
                        setSelectedComanda(comanda || null);
                        setShowOrder(true);
                      }
                    }}
                  >
                    <div className="text-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                        table.status === 'free' ? 'bg-green-500' :
                        table.status === 'occupied' ? 'bg-red-500' :
                        'bg-yellow-500'
                      }`}>
                        <span className="text-white font-bold">{table.number}</span>
                      </div>
                      
                      <h3 className="font-semibold text-gray-800">Mesa {table.number}</h3>
                      <p className="text-sm text-gray-500">{table.sector}</p>
                      
                      {table.status === 'occupied' && (
                        <div className="mt-2 text-xs">
                          <p className="text-gray-600">{table.customerName}</p>
                          <p className="text-gray-500">{table.peopleCount} pessoas</p>
                        </div>
                      )}
                      
                      <Badge className={`mt-2 ${
                        table.status === 'free' ? 'bg-green-500' :
                        table.status === 'occupied' ? 'bg-red-500' :
                        'bg-yellow-500'
                      }`}>
                        {table.status === 'free' ? 'Livre' :
                         table.status === 'occupied' ? 'Ocupada' :
                         'Aguardando'}
                      </Badge>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        )}

        {/* Modal - Abrir Comanda */}
        {showComanda && selectedTable && (
          <Modal
            isOpen={showComanda}
            onClose={() => setShowComanda(false)}
            title="Abrir Comanda"
          >
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800">Mesa {selectedTable.number}</h3>
                <p className="text-blue-600">{selectedTable.sector}</p>
              </div>

              <Input
                placeholder="Nome do cliente (opcional)"
                value={newComandaData.customerName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewComandaData(prev => ({ ...prev, customerName: e.target.value }))}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de pessoas
                </label>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setNewComandaData(prev => ({ ...prev, peopleCount: Math.max(1, prev.peopleCount - 1) }))}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold">{newComandaData.peopleCount}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setNewComandaData(prev => ({ ...prev, peopleCount: prev.peopleCount + 1 }))}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button 
                  onClick={handleOpenComanda}
                  className="flex-1 bg-blue-500 hover:bg-blue-600"
                >
                  Abrir Comanda
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowComanda(false)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </Modal>
        )}

        {/* Modal - Pedido */}
        {showOrder && selectedComanda && (
          <Modal
            isOpen={showOrder}
            onClose={() => setShowOrder(false)}
            title={`Comanda - Mesa ${tables.find(t => t.id === selectedComanda.tableId)?.number}`}
            size="lg"
          >
            <div className="space-y-4">
              {/* Info da comanda */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">
                      {selectedComanda.customerName || 'Cliente'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {selectedComanda.peopleCount} pessoas
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      R$ {selectedComanda.total.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {selectedComanda.items.length} itens
                    </p>
                  </div>
                </div>
              </div>

              {/* Categorias do menu */}
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {Array.from(new Set(menuItems.map(item => item.category))).map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* Itens do menu */}
              <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                {menuItems
                  .filter(item => item.category === selectedCategory)
                  .map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-500">R$ {item.price.toFixed(2)}</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(item)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
              </div>

              {/* Carrinho */}
              {cart.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Carrinho</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">R$ {item.price.toFixed(2)}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveFromCart(item.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold text-green-600">
                      R$ {cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              {/* Ações */}
              <div className="flex space-x-2">
                <Button 
                  onClick={handleSendOrder}
                  className="flex-1 bg-green-500 hover:bg-green-600"
                  disabled={cart.length === 0}
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Enviar Pedido
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowOrder(false)}
                >
                  Fechar
                </Button>
              </div>

              {/* Botão fechar comanda */}
              <Button 
                variant="destructive"
                onClick={handleCloseComanda}
                className="w-full"
              >
                <X className="w-4 h-4 mr-2" />
                Fechar Comanda
              </Button>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default WaiterApp; 