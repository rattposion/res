// Tipos principais do sistema
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'waiter' | 'kitchen' | 'delivery';
  avatar?: string;
  phone?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isActive: boolean;
  preparationTime: number; // em minutos
  ingredients: string[];
  allergens: string[];
  nutritionalInfo?: NutritionalInfo;
  createdAt: Date;
  updatedAt: Date;
}

export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  order: number;
  isActive: boolean;
}

export interface Order {
  id: string;
  number: string;
  type: 'dine_in' | 'takeaway' | 'delivery';
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  tableId?: string;
  customerId?: string;
  waiterId?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod?: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  notes?: string;
  estimatedTime?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
  modifications?: string[];
}

export interface Table {
  id: string;
  number: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  currentOrderId?: string;
  position: { x: number; y: number };
  shape: 'round' | 'square' | 'rectangle';
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address?: Address;
  orders: Order[];
  loyaltyPoints: number;
  isVip: boolean;
  createdAt: Date;
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates?: { lat: number; lng: number };
}

export interface Ingredient {
  id: string;
  name: string;
  unit: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  cost: number;
  supplier?: string;
  expirationDate?: Date;
}

export interface Recipe {
  id: string;
  productId: string;
  ingredients: RecipeIngredient[];
  instructions: string[];
  preparationTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface RecipeIngredient {
  ingredientId: string;
  ingredient: Ingredient;
  quantity: number;
  unit: string;
}

export interface Promotion {
  id: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed' | 'buy_x_get_y';
  value: number;
  minOrderValue?: number;
  validFrom: Date;
  validTo: Date;
  isActive: boolean;
  usageLimit?: number;
  usageCount: number;
}

export interface LoyaltyProgram {
  id: string;
  name: string;
  pointsPerReal: number;
  redeemRate: number; // pontos necessários para 1 real
  bonusRules: BonusRule[];
  isActive: boolean;
}

export interface BonusRule {
  id: string;
  condition: string;
  bonusPoints: number;
  description: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  coordinates: Array<{ lat: number; lng: number }>;
  deliveryFee: number;
  minOrderValue: number;
  estimatedTime: number;
  isActive: boolean;
}

export interface Delivery {
  id: string;
  orderId: string;
  order: Order;
  deliveryPersonId?: string;
  deliveryPerson?: User;
  address: Address;
  status: 'pending' | 'assigned' | 'picked_up' | 'on_route' | 'delivered' | 'failed';
  estimatedTime: number;
  actualTime?: number;
  trackingCode: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: 'cash' | 'card' | 'pix' | 'voucher';
  status: 'pending' | 'approved' | 'declined' | 'refunded';
  transactionId?: string;
  createdAt: Date;
}

export interface CashFlow {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  paymentMethod: string;
  date: Date;
  userId: string;
  orderId?: string;
}

export interface Report {
  id: string;
  type: 'sales' | 'inventory' | 'financial' | 'customer';
  period: { from: Date; to: Date };
  data: any;
  generatedAt: Date;
  generatedBy: string;
}

// Estados da aplicação
export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  currentModule: string;
  notifications: Notification[];
  settings: AppSettings;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export interface AppSettings {
  restaurantName: string;
  currency: string;
  timezone: string;
  language: string;
  theme: 'light' | 'dark';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}