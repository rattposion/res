import React, { useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { User, LogOut, Settings } from 'lucide-react';

const MOCK_USERS = [
  {
    id: '1',
    name: 'Administrador',
    email: 'admin@restaurante.com',
    role: 'admin' as const,
    avatar: 'A',
    permissions: ['Todas as permissões']
  },
  {
    id: '2',
    name: 'João Gerente',
    email: 'gerente@restaurante.com',
    role: 'gerente' as const,
    avatar: 'J',
    permissions: ['Gestão operacional', 'Relatórios', 'Configurações básicas']
  },
  {
    id: '3',
    name: 'Maria Caixa',
    email: 'caixa@restaurante.com',
    role: 'caixa' as const,
    avatar: 'M',
    permissions: ['PDV', 'Delivery básico']
  },
  {
    id: '4',
    name: 'Pedro Garçom',
    email: 'garcom@restaurante.com',
    role: 'garcom' as const,
    avatar: 'P',
    permissions: ['App do garçom']
  }
];

export const UserSwitcher: React.FC = () => {
  const { user, login, logout } = useUser();
  const [showSwitcher, setShowSwitcher] = useState(false);

  const handleUserSwitch = async (email: string) => {
    await login(email, '123456');
    setShowSwitcher(false);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500';
      case 'gerente': return 'bg-blue-500';
      case 'caixa': return 'bg-green-500';
      case 'garcom': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'gerente': return 'Gerente';
      case 'caixa': return 'Caixa';
      case 'garcom': return 'Garçom';
      default: return role;
    }
  };

  if (!user) return null;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowSwitcher(!showSwitcher)}
        className="flex items-center space-x-2"
      >
        <User className="w-4 h-4" />
        <span>Trocar Usuário</span>
      </Button>

      {showSwitcher && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Trocar Usuário</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSwitcher(false)}
              >
                ×
              </Button>
            </div>

            <div className="space-y-3">
              {MOCK_USERS.map((mockUser) => (
                <div
                  key={mockUser.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    user.email === mockUser.email
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => handleUserSwitch(mockUser.email)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 ${getRoleColor(mockUser.role)} rounded-full flex items-center justify-center text-white text-sm font-medium`}>
                      {mockUser.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{mockUser.name}</span>
                        <Badge className={getRoleColor(mockUser.role)}>
                          {getRoleLabel(mockUser.role)}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500">{mockUser.email}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {mockUser.permissions.join(', ')}
                      </div>
                    </div>
                    {user.email === mockUser.email && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="w-full text-red-600 hover:text-red-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Fazer Logout
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}; 