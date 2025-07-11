import React, { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { useRestaurant } from '../../contexts/RestaurantContext';
import { Table, OrderItem, Order } from '../../types';

interface OrderModalProps {
  table: Table;
  onClose: () => void;
}

const OrderModal: React.FC<OrderModalProps> = ({ table, onClose }) => {
  const { menuItems, orders, setOrders, setTables } = useRestaurant();
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);

  const existingOrder = orders.find(order => order.tableId === table.id && order.status === 'active');

  const addItemToOrder = (menuItem: any) => {
    const existingItem = selectedItems.find(item => item.id === menuItem.id);
    if (existingItem) {
      setSelectedItems(prev => 
        prev.map(item => 
          item.id === menuItem.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setSelectedItems(prev => [...prev, {
        id: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: 1,
        category: menuItem.category,
      }]);
    }
  };

  const removeItemFromOrder = (itemId: string) => {
    setSelectedItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, quantity: Math.max(0, item.quantity - 1) }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCreateOrder = () => {
    if (selectedItems.length === 0) return;

    const newOrder: Order = {
      id: Date.now().toString(),
      tableId: table.id,
      items: selectedItems,
      status: 'active',
      total: calculateTotal(),
      createdAt: new Date(),
    };

    setOrders(prev => [...prev, newOrder]);
    setTables(prev => 
      prev.map(t => 
        t.id === table.id 
          ? { ...t, status: 'occupied', orderId: newOrder.id, occupiedAt: new Date() }
          : t
      )
    );

    onClose();
  };

  const categories = [...new Set(menuItems.map(item => item.category))];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Nova Comanda - Mesa {table.number}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex h-[600px]">
          <div className="flex-1 p-6 overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Menu</h3>
            {categories.map(category => (
              <div key={category} className="mb-6">
                <h4 className="text-md font-medium text-gray-700 mb-3">{category}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {menuItems
                    .filter(item => item.category === category && item.available)
                    .map(item => (
                      <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">{item.name}</h5>
                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                            <p className="text-lg font-bold text-blue-600 mt-2">
                              R$ {item.price.toFixed(2)}
                            </p>
                          </div>
                          <button
                            onClick={() => addItemToOrder(item)}
                            className="ml-4 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>

          <div className="w-80 bg-gray-50 p-6 border-l border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pedido</h3>
            <div className="space-y-3 mb-6">
              {selectedItems.map(item => (
                <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">R$ {item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => removeItemFromOrder(item.id)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => addItemToOrder({ id: item.id, name: item.name, price: item.price, category: item.category })}
                      className="text-blue-600 hover:text-blue-700 p-1"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              {selectedItems.length === 0 && (
                <p className="text-gray-500 text-center py-8">Nenhum item selecionado</p>
              )}
            </div>

            {selectedItems.length > 0 && (
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-xl font-bold text-blue-600">
                    R$ {calculateTotal().toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleCreateOrder}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Criar Comanda
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;