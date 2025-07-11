import React from 'react';
import { Shield } from 'lucide-react';

const SecurityManager: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto py-12">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-white">
          <Shield className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Segurança</h1>
          <p className="text-gray-600">Gerencie criptografia, auditoria, JWT, rate limiting e mais.</p>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-2">Funcionalidades futuras:</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>Configuração de criptografia</li>
          <li>Logs de auditoria</li>
          <li>Gerenciamento de tokens JWT</li>
          <li>Rate limiting</li>
        </ul>
      </div>
    </div>
  );
};

export default SecurityManager; 