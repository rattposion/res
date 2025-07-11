import React from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useNotificationHelpers } from '../../contexts/NotificationContext';
import { 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  XCircle,
  Zap,
  ShoppingCart,
  Truck,
  DollarSign
} from 'lucide-react';

export const NotificationDemo: React.FC = () => {
  const { success, error, warning, info } = useNotificationHelpers();

  const demoNotifications = [
    {
      title: 'Pedido Confirmado',
      message: 'Pedido #1234 foi confirmado e está sendo preparado',
      type: 'success' as const,
      icon: <CheckCircle className="w-5 h-5" />
    },
    {
      title: 'Erro de Pagamento',
      message: 'Falha ao processar pagamento. Tente novamente.',
      type: 'error' as const,
      icon: <XCircle className="w-5 h-5" />
    },
    {
      title: 'Estoque Baixo',
      message: 'Produto "Hambúrguer" está com estoque baixo',
      type: 'warning' as const,
      icon: <AlertCircle className="w-5 h-5" />
    },
    {
      title: 'Nova Integração',
      message: 'Integração com iFood foi configurada com sucesso',
      type: 'info' as const,
      icon: <Info className="w-5 h-5" />
    },
    {
      title: 'Delivery Ativo',
      message: 'Sistema de delivery está funcionando normalmente',
      type: 'success' as const,
      icon: <Truck className="w-5 h-5" />
    },
    {
      title: 'Venda Realizada',
      message: 'Venda de R$ 45,90 registrada no PDV',
      type: 'success' as const,
      icon: <DollarSign className="w-5 h-5" />
    }
  ];

  const handleNotification = (notification: typeof demoNotifications[0]) => {
    switch (notification.type) {
      case 'success':
        success(notification.title, notification.message);
        break;
      case 'error':
        error(notification.title, notification.message);
        break;
      case 'warning':
        warning(notification.title, notification.message);
        break;
      case 'info':
        info(notification.title, notification.message);
        break;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Bell className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Demonstração de Notificações
        </h3>
      </div>
      
      <p className="text-gray-600 mb-6">
        Teste diferentes tipos de notificações e toasts. As notificações aparecerão no painel e os toasts no canto superior direito.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {demoNotifications.map((notification, index) => (
          <Button
            key={index}
            variant="outline"
            onClick={() => handleNotification(notification)}
            className="h-auto p-4 flex items-center space-x-3 justify-start"
          >
            <div className={`text-${notification.type === 'success' ? 'green' : notification.type === 'error' ? 'red' : notification.type === 'warning' ? 'yellow' : 'blue'}-500`}>
              {notification.icon}
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900">{notification.title}</div>
              <div className="text-sm text-gray-500">{notification.message}</div>
            </div>
          </Button>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">Ações Rápidas</h4>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            onClick={() => success('Teste Rápido', 'Esta é uma notificação de sucesso')}
            className="bg-green-500 hover:bg-green-600"
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            Sucesso
          </Button>
          <Button
            size="sm"
            onClick={() => error('Erro Teste', 'Esta é uma notificação de erro')}
            className="bg-red-500 hover:bg-red-600"
          >
            <XCircle className="w-4 h-4 mr-1" />
            Erro
          </Button>
          <Button
            size="sm"
            onClick={() => warning('Aviso Teste', 'Esta é uma notificação de aviso')}
            className="bg-yellow-500 hover:bg-yellow-600"
          >
            <AlertCircle className="w-4 h-4 mr-1" />
            Aviso
          </Button>
          <Button
            size="sm"
            onClick={() => info('Info Teste', 'Esta é uma notificação informativa')}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Info className="w-4 h-4 mr-1" />
            Info
          </Button>
        </div>
      </div>
    </Card>
  );
}; 