import React from 'react';
import { Plus, Users, UtensilsCrossed, Calendar, Receipt, QrCode, Truck } from 'lucide-react';

interface QuickActionsProps {
  onAction?: (action: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onAction }) => {
  const actions = [
    { id: 'new-order', label: 'Novo Pedido', icon: Plus, color: 'bg-blue-600 hover:bg-blue-700' },
    { id: 'new-customer', label: 'Novo Cliente', icon: Users, color: 'bg-green-600 hover:bg-green-700' },
    { id: 'new-reservation', label: 'Nova Reserva', icon: Calendar, color: 'bg-purple-600 hover:bg-purple-700' },
    { id: 'open-table', label: 'Abrir Mesa', icon: UtensilsCrossed, color: 'bg-orange-600 hover:bg-orange-700' },
    { id: 'delivery-order', label: 'Pedido Delivery', icon: Truck, color: 'bg-indigo-600 hover:bg-indigo-700' },
    { id: 'qr-menu', label: 'Gerar QR Menu', icon: QrCode, color: 'bg-pink-600 hover:bg-pink-700' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => onAction?.(action.id)}
              className={`${action.color} text-white p-4 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg`}
            >
              <Icon className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm font-medium block">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;