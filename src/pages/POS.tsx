import React, { useState } from 'react';
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Calculator,
  CreditCard,
  Banknote,
  Smartphone,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { formatCurrency } from '../lib/utils';

// Mock data
const categories = [
  { id: '1', name: 'Hambúrguers', color: 'bg-red-500' },
  { id: '2', name: 'Pizzas', color: 'bg-yellow-500' },
  { id: '3', name: 'Bebidas', color: 'bg-blue-500' },
  { id: '4', name: 'Sobremesas', color: 'bg-purple-500' },
  { id: '5', name: 'Acompanhamentos', color: 'bg-green-500' },
];

const products = [
  {
    id: '1',
    name: 'X-Burger Clássico',
    price: 25.90,
    category: '1',
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: '2',
    name: 'X-Bacon',
    price: 29.90,
    category: '1',
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: '3',
    name: 'Pizza Margherita',
    price: 35.90,
    category: '2',
    image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: '4',
    name: 'Coca-Cola 350ml',
    price: 5.90,
    category: '3',
    image: 'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: '5',
    name: 'Batata Frita',
    price: 12.90,
    category: '5',
    image: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
];

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export function POS() {
  const [selectedCategory, setSelectedCategory] = useState('1');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('');

  const filteredProducts = products.filter(
    (product) => product.category === selectedCategory
  );

  const addToCart = (product: typeof products[0]) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ];
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setCustomerName('');
    setTableNumber('');
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const handleCheckout = (paymentMethod: string) => {
    // Implementar lógica de checkout
    console.log('Checkout:', { cart, customerName, tableNumber, paymentMethod, total });
    alert(`Pedido finalizado! Método: ${paymentMethod} - Total: ${formatCurrency(total)}`);
    clearCart();
  };

  return (
    <div className="flex h-full gap-6">
      {/* Left Panel - Products */}
      <div className="flex-1 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">PDV - Ponto de Venda</h1>
          <p className="text-gray-600">Selecione os produtos para o pedido</p>
        </div>

        {/* Categories */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => addToCart(product)}
            >
              <CardContent className="p-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                <p className="text-lg font-bold text-primary-600">
                  {formatCurrency(product.price)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Right Panel - Cart */}
      <div className="w-96 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Pedido Atual
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Customer Info */}
            <div className="space-y-3">
              <Input
                label="Nome do Cliente"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Digite o nome..."
              />
              <Input
                label="Mesa/Comanda"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="Número da mesa..."
              />
            </div>

            {/* Cart Items */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Nenhum item no pedido
                </p>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        {formatCurrency(item.price)} cada
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Order Summary */}
            {cart.length > 0 && (
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Taxa de serviço (10%):</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            )}

            {/* Payment Methods */}
            {cart.length > 0 && (
              <div className="space-y-3">
                <p className="font-medium text-gray-900">Forma de Pagamento:</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => handleCheckout('Dinheiro')}
                    className="flex flex-col items-center p-3 h-auto"
                  >
                    <Banknote className="h-5 w-5 mb-1" />
                    <span className="text-xs">Dinheiro</span>
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleCheckout('Cartão')}
                    className="flex flex-col items-center p-3 h-auto"
                  >
                    <CreditCard className="h-5 w-5 mb-1" />
                    <span className="text-xs">Cartão</span>
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleCheckout('PIX')}
                    className="flex flex-col items-center p-3 h-auto"
                  >
                    <Smartphone className="h-5 w-5 mb-1" />
                    <span className="text-xs">PIX</span>
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleCheckout('Fiado')}
                    className="flex flex-col items-center p-3 h-auto"
                  >
                    <Calculator className="h-5 w-5 mb-1" />
                    <span className="text-xs">Fiado</span>
                  </Button>
                </div>
              </div>
            )}

            {/* Clear Cart */}
            {cart.length > 0 && (
              <Button
                variant="error"
                onClick={clearCart}
                className="w-full"
              >
                Limpar Pedido
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}