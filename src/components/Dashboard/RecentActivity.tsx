import React from 'react';
import { Clock, CheckCircle, AlertCircle, Truck, Users } from 'lucide-react';
import { useRestaurant } from '../../contexts/RestaurantContext';

const RecentActivity: React.FC = () => {
  const { orders, reservations, customers } = useRestaurant();

  // Generate recent activities from orders and reservations
  const activities = [
    ...orders.slice(0, 3).map(order => ({
      id: `order-${order.id}`,
      type: 'order',
      message: `Pedido #${order.id} - ${order.type === 'delivery' ? 'Delivery' : `Mesa ${order.tableId}`}`,
      status: order.status,
      time: new Date(order.createdAt),
      value: order.total
    })),
    ...reservations.slice(0, 2).map(reservation => ({
      id: `reservation-${reservation.id}`,
      type: 'reservation',
      message: `Reserva confirmada - Mesa ${reservation.tableId}`,
      status: reservation.status,
      time: new Date(reservation.createdAt),
      value: null
    }))
  ].sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 8);

  const getActivityIcon = (type: string, status: string) => {
    if (type === 'order') {
      switch (status) {
        case 'completed':
          return <CheckCircle className="h-4 w-4 text-green-500" />;
        case 'preparing':
          return <Clock className="h-4 w-4 text-orange-500" />;
        case 'delivery':
          return <Truck className="h-4 w-4 text-blue-500" />;
        default:
          return <AlertCircle className="h-4 w-4 text-gray-500" />;
      }
    }
    return <Users className="h-4 w-4 text-purple-500" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'confirmed':
        return 'text-green-600 bg-green-100';
      case 'preparing':
      case 'pending':
        return 'text-orange-600 bg-orange-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusLabel = (type: string, status: string) => {
    if (type === 'order') {
      switch (status) {
        case 'pending': return 'Pendente';
        case 'preparing': return 'Preparando';
        case 'ready': return 'Pronto';
        case 'delivered': return 'Entregue';
        case 'completed': return 'Finalizado';
        case 'cancelled': return 'Cancelado';
        default: return status;
      }
    }
    switch (status) {
      case 'confirmed': return 'Confirmada';
      case 'pending': return 'Pendente';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Atividade Recente</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          Ver todas
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex-shrink-0">
              {getActivityIcon(activity.type, activity.status)}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {activity.message}
              </p>
              <p className="text-xs text-gray-500">
                {activity.time.toLocaleTimeString()} - {activity.time.toLocaleDateString()}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              {activity.value && (
                <span className="text-sm font-semibold text-gray-900">
                  R$ {activity.value.toFixed(2)}
                </span>
              )}
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(activity.status)}`}>
                {getStatusLabel(activity.type, activity.status)}
              </span>
            </div>
          </div>
        ))}

        {activities.length === 0 && (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma atividade recente</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;