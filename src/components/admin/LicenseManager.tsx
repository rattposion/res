import React, { useState, useEffect } from 'react';
import { Shield, Calendar, Users, Package, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { LicenseManager } from '../../lib/licensing';
import { PLANS } from '../../lib/licensing';

const LicenseManagerComponent: React.FC = () => {
  const [license, setLicense] = useState<any>(null);
  const [usage, setUsage] = useState({
    orders: 1250,
    users: 3,
    locations: 1
  });

  const licenseManager = LicenseManager.getInstance();

  useEffect(() => {
    // Simulate license data
    const mockLicense = {
      id: '1',
      tenantId: 'tenant-1',
      key: 'PRO-2024-ABCD-1234',
      status: 'active',
      expiresAt: new Date(2024, 11, 31),
      features: ['pos', 'delivery', 'inventory', 'analytics'],
      limits: {
        orders: 2000,
        users: 5,
        locations: 2
      }
    };
    
    setLicense(mockLicense);
    licenseManager.setLicense(mockLicense);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'expired': return 'error';
      case 'suspended': return 'warning';
      default: return 'secondary';
    }
  };

  const getUsagePercentage = (current: number, limit: number) => {
    if (limit === -1) return 0; // unlimited
    return (current / limit) * 100;
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'error';
    if (percentage >= 75) return 'warning';
    return 'success';
  };

  const remainingDays = licenseManager.getRemainingDays();
  const isExpiringSoon = licenseManager.isExpiringSoon();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gerenciamento de Licença</h2>
          <p className="text-gray-600">Controle sua assinatura e limites de uso</p>
        </div>
        <Button variant="primary">
          Fazer Upgrade
        </Button>
      </div>

      {/* License Status */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold">Status da Licença</h3>
              <p className="text-sm text-gray-600">Chave: {license?.key}</p>
            </div>
          </div>
          <Badge variant={getStatusColor(license?.status)}>
            {license?.status === 'active' ? 'Ativa' : 'Inativa'}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Calendar className="h-6 w-6 text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Expira em</p>
            <p className={`font-semibold ${isExpiringSoon ? 'text-red-600' : 'text-gray-900'}`}>
              {remainingDays} dias
            </p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Package className="h-6 w-6 text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Plano Atual</p>
            <p className="font-semibold text-gray-900">Professional</p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Próximo Pagamento</p>
            <p className="font-semibold text-gray-900">15/01/2025</p>
          </div>
        </div>

        {isExpiringSoon && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <p className="text-yellow-800">
                Sua licença expira em {remainingDays} dias. Renove agora para evitar interrupções.
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Usage Limits */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Uso Atual</h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Pedidos este mês</span>
              <span className="text-sm text-gray-600">
                {usage.orders} / {license?.limits.orders === -1 ? '∞' : license?.limits.orders}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full bg-${getUsageColor(getUsagePercentage(usage.orders, license?.limits.orders))}-500`}
                style={{ width: `${Math.min(getUsagePercentage(usage.orders, license?.limits.orders), 100)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Usuários ativos</span>
              <span className="text-sm text-gray-600">
                {usage.users} / {license?.limits.users === -1 ? '∞' : license?.limits.users}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full bg-${getUsageColor(getUsagePercentage(usage.users, license?.limits.users))}-500`}
                style={{ width: `${Math.min(getUsagePercentage(usage.users, license?.limits.users), 100)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Localizações</span>
              <span className="text-sm text-gray-600">
                {usage.locations} / {license?.limits.locations === -1 ? '∞' : license?.limits.locations}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full bg-${getUsageColor(getUsagePercentage(usage.locations, license?.limits.locations))}-500`}
                style={{ width: `${Math.min(getUsagePercentage(usage.locations, license?.limits.locations), 100)}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Available Plans */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Planos Disponíveis</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div key={plan.id} className={`border rounded-lg p-6 ${plan.isPopular ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
              {plan.isPopular && (
                <Badge variant="primary" className="mb-4">Mais Popular</Badge>
              )}
              
              <h4 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h4>
              <p className="text-gray-600 mb-4">{plan.description}</p>
              
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">R$ {plan.price}</span>
                <span className="text-gray-600">/{plan.interval === 'month' ? 'mês' : 'ano'}</span>
              </div>
              
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                variant={plan.isPopular ? "primary" : "secondary"} 
                className="w-full"
              >
                {plan.id === 'professional' ? 'Plano Atual' : 'Selecionar Plano'}
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default LicenseManagerComponent;