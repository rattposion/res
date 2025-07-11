import React from 'react';
import { CreditCard } from 'lucide-react';

const LicensingManager: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto py-12">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center text-white">
          <CreditCard className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Licenciamento</h1>
          <p className="text-gray-600">Gerencie planos, pagamentos, trials e faturamento.</p>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-2">Funcionalidades futuras:</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>Planos flexíveis</li>
          <li>Gateways de pagamento</li>
          <li>Trials gratuitos</li>
          <li>Faturamento automático</li>
        </ul>
      </div>
    </div>
  );
};

export default LicensingManager; 