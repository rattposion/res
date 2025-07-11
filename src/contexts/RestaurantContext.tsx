import React, { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { 
  Table, Order, Customer, Reservation, Invoice, MenuItem, 
  StockItem, CashRegister, Promotion, DeliveryDriver, User,
  Integration, Analytics, Notification, LoyaltyProgram,
  FinancialAccount, Supplier, Recipe
} from '../types';

interface RestaurantContextType {
  // Core Data
  tables: Table[];
  orders: Order[];
  customers: Customer[];
  reservations: Reservation[];
  invoices: Invoice[];
  menuItems: MenuItem[];
  stockItems: StockItem[];
  cashRegister: CashRegister | null;
  promotions: Promotion[];
  deliveryDrivers: DeliveryDriver[];
  users: User[];
  integrations: Integration[];
  notifications: Notification[];
  loyaltyPrograms: LoyaltyProgram[];
  financialAccounts: FinancialAccount[];
  suppliers: Supplier[];
  recipes: Recipe[];
  
  // Setters
  setTables: (tables: Table[] | ((prev: Table[]) => Table[])) => void;
  setOrders: (orders: Order[] | ((prev: Order[]) => Order[])) => void;
  setCustomers: (customers: Customer[] | ((prev: Customer[]) => Customer[])) => void;
  setReservations: (reservations: Reservation[] | ((prev: Reservation[]) => Reservation[])) => void;
  setInvoices: (invoices: Invoice[] | ((prev: Invoice[]) => Invoice[])) => void;
  setMenuItems: (menuItems: MenuItem[] | ((prev: MenuItem[]) => MenuItem[])) => void;
  setStockItems: (stockItems: StockItem[] | ((prev: StockItem[]) => StockItem[])) => void;
  setCashRegister: (cashRegister: CashRegister | null) => void;
  setPromotions: (promotions: Promotion[] | ((prev: Promotion[]) => Promotion[])) => void;
  setDeliveryDrivers: (drivers: DeliveryDriver[] | ((prev: DeliveryDriver[]) => DeliveryDriver[])) => void;
  setUsers: (users: User[] | ((prev: User[]) => User[])) => void;
  setIntegrations: (integrations: Integration[] | ((prev: Integration[]) => Integration[])) => void;
  setNotifications: (notifications: Notification[] | ((prev: Notification[]) => Notification[])) => void;
  setLoyaltyPrograms: (programs: LoyaltyProgram[] | ((prev: LoyaltyProgram[]) => LoyaltyProgram[])) => void;
  setFinancialAccounts: (accounts: FinancialAccount[] | ((prev: FinancialAccount[]) => FinancialAccount[])) => void;
  setSuppliers: (suppliers: Supplier[] | ((prev: Supplier[]) => Supplier[])) => void;
  setRecipes: (recipes: Recipe[] | ((prev: Recipe[]) => Recipe[])) => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};

// Initial Data
const initialTables: Table[] = [
  { id: '1', number: 1, seats: 2, status: 'available', position: { x: 50, y: 50 }, qrCode: 'QR001' },
  { id: '2', number: 2, seats: 4, status: 'occupied', position: { x: 200, y: 50 }, orderId: '1', occupiedAt: new Date(), qrCode: 'QR002' },
  { id: '3', number: 3, seats: 6, status: 'reserved', position: { x: 350, y: 50 }, reservationId: '1', qrCode: 'QR003' },
  { id: '4', number: 4, seats: 4, status: 'available', position: { x: 50, y: 200 }, qrCode: 'QR004' },
  { id: '5', number: 5, seats: 2, status: 'cleaning', position: { x: 200, y: 200 }, qrCode: 'QR005' },
  { id: '6', number: 6, seats: 8, status: 'available', position: { x: 350, y: 200 }, qrCode: 'QR006' },
  { id: '7', number: 7, seats: 4, status: 'available', position: { x: 500, y: 50 }, qrCode: 'QR007' },
  { id: '8', number: 8, seats: 2, status: 'available', position: { x: 500, y: 200 }, qrCode: 'QR008' },
];

const initialOrders: Order[] = [
  {
    id: '1',
    tableId: '2',
    items: [
      { id: '1', name: 'Hambúrguer Artesanal', price: 32.90, quantity: 2, category: 'Principais', ingredients: ['Pão', 'Carne', 'Queijo'] },
      { id: '2', name: 'Refrigerante', price: 8.50, quantity: 2, category: 'Bebidas', ingredients: [] },
    ],
    status: 'preparing',
    type: 'dine-in',
    total: 82.80,
    subtotal: 82.80,
    tax: 0,
    discount: 0,
    createdAt: new Date(),
    estimatedTime: 25,
    channel: 'table'
  },
  {
    id: '2',
    customerId: '1',
    items: [
      { id: '3', name: 'Pizza Margherita', price: 45.90, quantity: 1, category: 'Principais', ingredients: ['Massa', 'Molho', 'Queijo', 'Manjericão'] },
    ],
    status: 'pending',
    type: 'delivery',
    total: 45.90,
    subtotal: 45.90,
    tax: 0,
    discount: 0,
    createdAt: new Date(),
    deliveryAddress: 'Rua das Flores, 123',
    estimatedTime: 35,
    channel: 'delivery'
  },
];

const initialCustomers: Customer[] = [
  { 
    id: '1', 
    name: 'João Silva', 
    phone: '(11) 99999-9999', 
    email: 'joao@email.com',
    address: 'Rua das Flores, 123',
    loyaltyPoints: 150,
    totalOrders: 12,
    totalSpent: 450.80,
    createdAt: new Date(2024, 0, 15),
    lastOrderAt: new Date(),
    birthday: new Date(1990, 5, 15)
  },
  { 
    id: '2', 
    name: 'Maria Santos', 
    phone: '(11) 88888-8888', 
    email: 'maria@email.com',
    loyaltyPoints: 89,
    totalOrders: 8,
    totalSpent: 320.50,
    createdAt: new Date(2024, 1, 10),
    lastOrderAt: new Date(2024, 11, 20),
    birthday: new Date(1985, 8, 22)
  },
];

const initialMenuItems: MenuItem[] = [
  { 
    id: '1', 
    name: 'Hambúrguer Artesanal', 
    description: 'Pão brioche, blend 180g, queijo, alface, tomate', 
    price: 32.90, 
    category: 'Principais', 
    available: true,
    ingredients: ['Pão brioche', 'Carne 180g', 'Queijo cheddar', 'Alface', 'Tomate'],
    preparationTime: 15,
    calories: 650,
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg'
  },
  { 
    id: '2', 
    name: 'Pizza Margherita', 
    description: 'Molho de tomate, mussarela, manjericão fresco', 
    price: 45.90, 
    category: 'Principais', 
    available: true,
    ingredients: ['Massa de pizza', 'Molho de tomate', 'Mussarela', 'Manjericão'],
    preparationTime: 20,
    calories: 890,
    sizes: [
      { name: 'Pequena', price: 35.90 },
      { name: 'Média', price: 45.90 },
      { name: 'Grande', price: 55.90 }
    ],
    image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg'
  },
  { 
    id: '3', 
    name: 'Salmão Grelhado', 
    description: 'Filé de salmão com legumes na manteiga', 
    price: 58.90, 
    category: 'Principais', 
    available: true,
    ingredients: ['Salmão', 'Brócolis', 'Cenoura', 'Manteiga'],
    preparationTime: 18,
    calories: 420,
    image: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg'
  },
  { 
    id: '4', 
    name: 'Refrigerante', 
    description: 'Coca-Cola, Sprite, Fanta', 
    price: 8.50, 
    category: 'Bebidas', 
    available: true,
    ingredients: [],
    preparationTime: 2,
    calories: 150
  },
  { 
    id: '5', 
    name: 'Suco Natural', 
    description: 'Laranja, limão, abacaxi', 
    price: 12.90, 
    category: 'Bebidas', 
    available: true,
    ingredients: ['Fruta natural', 'Água', 'Açúcar'],
    preparationTime: 5,
    calories: 120
  },
  { 
    id: '6', 
    name: 'Tiramisu', 
    description: 'Sobremesa italiana tradicional', 
    price: 18.90, 
    category: 'Sobremesas', 
    available: true,
    ingredients: ['Mascarpone', 'Café', 'Biscoito', 'Cacau'],
    preparationTime: 5,
    calories: 380,
    image: 'https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg'
  },
];

const initialStockItems: StockItem[] = [
  {
    id: '1',
    name: 'Carne Bovina (kg)',
    category: 'Carnes',
    unit: 'kg',
    currentStock: 25,
    minStock: 10,
    maxStock: 50,
    cost: 35.00,
    supplier: 'Açougue Central',
    lastUpdated: new Date(),
    expirationDate: new Date(2025, 2, 15)
  },
  {
    id: '2',
    name: 'Queijo Mussarela (kg)',
    category: 'Laticínios',
    unit: 'kg',
    currentStock: 8,
    minStock: 5,
    maxStock: 20,
    cost: 28.00,
    supplier: 'Laticínios São Paulo',
    lastUpdated: new Date(),
    expirationDate: new Date(2025, 1, 20)
  },
  {
    id: '3',
    name: 'Tomate (kg)',
    category: 'Vegetais',
    unit: 'kg',
    currentStock: 15,
    minStock: 8,
    maxStock: 30,
    cost: 6.50,
    supplier: 'Hortifruti Verde',
    lastUpdated: new Date(),
    expirationDate: new Date(2025, 0, 25)
  }
];

const initialPromotions: Promotion[] = [
  {
    id: '1',
    name: 'Desconto 10% - Primeira Compra',
    description: 'Ganhe 10% de desconto na sua primeira compra',
    type: 'discount',
    value: 10,
    minOrderValue: 30,
    validFrom: new Date(),
    validTo: new Date(2025, 11, 31),
    active: true,
    usageLimit: 100,
    usageCount: 23
  },
  {
    id: '2',
    name: 'Cashback 5%',
    description: 'Receba 5% de volta em pontos de fidelidade',
    type: 'cashback',
    value: 5,
    minOrderValue: 50,
    validFrom: new Date(),
    validTo: new Date(2025, 11, 31),
    active: true,
    usageCount: 45
  }
];

const initialDrivers: DeliveryDriver[] = [
  {
    id: '1',
    name: 'Carlos Silva',
    phone: '(11) 99999-1111',
    vehicle: 'Moto Honda CG 160',
    status: 'available',
    activeOrders: [],
    totalDeliveries: 245,
    rating: 4.8
  },
  {
    id: '2',
    name: 'Ana Costa',
    phone: '(11) 99999-2222',
    vehicle: 'Bicicleta Elétrica',
    status: 'busy',
    activeOrders: ['2'],
    totalDeliveries: 189,
    rating: 4.9
  }
];

const initialUsers: User[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@restaurante.com',
    role: 'admin',
    permissions: ['all'],
    isActive: true,
    createdAt: new Date(2024, 0, 1),
    lastLogin: new Date()
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@restaurante.com',
    role: 'waiter',
    permissions: ['tables', 'orders'],
    isActive: true,
    createdAt: new Date(2024, 1, 15),
    lastLogin: new Date()
  }
];

const initialIntegrations: Integration[] = [
  {
    id: '1',
    name: 'ifood',
    isActive: true,
    credentials: {
      merchantId: 'MERCHANT123',
      token: 'TOKEN123'
    },
    settings: {
      autoAcceptOrders: true,
      preparationTime: 30,
      deliveryFee: 5.99
    }
  },
  {
    id: '2',
    name: '99food',
    isActive: false,
    credentials: {},
    settings: {
      autoAcceptOrders: false,
      preparationTime: 25,
      deliveryFee: 4.99
    }
  }
];

const initialNotifications: Notification[] = [
  {
    id: '1',
    type: 'order',
    title: 'Novo Pedido',
    message: 'Pedido #1234 recebido - Mesa 5',
    isRead: false,
    createdAt: new Date()
  },
  {
    id: '2',
    type: 'stock',
    title: 'Estoque Baixo',
    message: 'Queijo Mussarela com estoque baixo (8kg restantes)',
    isRead: false,
    createdAt: new Date()
  }
];

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tables, setTables] = useLocalStorage<Table[]>('restaurant-tables', initialTables);
  const [orders, setOrders] = useLocalStorage<Order[]>('restaurant-orders', initialOrders);
  const [customers, setCustomers] = useLocalStorage<Customer[]>('restaurant-customers', initialCustomers);
  const [reservations, setReservations] = useLocalStorage<Reservation[]>('restaurant-reservations', []);
  const [invoices, setInvoices] = useLocalStorage<Invoice[]>('restaurant-invoices', []);
  const [menuItems, setMenuItems] = useLocalStorage<MenuItem[]>('restaurant-menu', initialMenuItems);
  const [stockItems, setStockItems] = useLocalStorage<StockItem[]>('restaurant-stock', initialStockItems);
  const [cashRegister, setCashRegister] = useLocalStorage<CashRegister | null>('restaurant-cash-register', null);
  const [promotions, setPromotions] = useLocalStorage<Promotion[]>('restaurant-promotions', initialPromotions);
  const [deliveryDrivers, setDeliveryDrivers] = useLocalStorage<DeliveryDriver[]>('restaurant-drivers', initialDrivers);
  const [users, setUsers] = useLocalStorage<User[]>('restaurant-users', initialUsers);
  const [integrations, setIntegrations] = useLocalStorage<Integration[]>('restaurant-integrations', initialIntegrations);
  const [notifications, setNotifications] = useLocalStorage<Notification[]>('restaurant-notifications', initialNotifications);
  const [loyaltyPrograms, setLoyaltyPrograms] = useLocalStorage<LoyaltyProgram[]>('restaurant-loyalty', []);
  const [financialAccounts, setFinancialAccounts] = useLocalStorage<FinancialAccount[]>('restaurant-financial', []);
  const [suppliers, setSuppliers] = useLocalStorage<Supplier[]>('restaurant-suppliers', []);
  const [recipes, setRecipes] = useLocalStorage<Recipe[]>('restaurant-recipes', []);

  return (
    <RestaurantContext.Provider
      value={{
        tables,
        orders,
        customers,
        reservations,
        invoices,
        menuItems,
        stockItems,
        cashRegister,
        promotions,
        deliveryDrivers,
        users,
        integrations,
        notifications,
        loyaltyPrograms,
        financialAccounts,
        suppliers,
        recipes,
        setTables,
        setOrders,
        setCustomers,
        setReservations,
        setInvoices,
        setMenuItems,
        setStockItems,
        setCashRegister,
        setPromotions,
        setDeliveryDrivers,
        setUsers,
        setIntegrations,
        setNotifications,
        setLoyaltyPrograms,
        setFinancialAccounts,
        setSuppliers,
        setRecipes,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};