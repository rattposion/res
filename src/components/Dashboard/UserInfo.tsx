import React from 'react';
import { useUser } from '../../contexts/UserContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { User, Shield, Clock, CheckCircle } from 'lucide-react';

export const UserInfo: React.FC = () => {
  const { user } = useUser();

  if (!user) return null;

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'gerente': return 'Gerente';
      case 'caixa': return 'Caixa';
      case 'garcom': return 'Garçom';
      default: return role;
    }
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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-4">
        <div className={`w-16 h-16 ${getRoleColor(user.role)} rounded-full flex items-center justify-center`}>
          <User className="w-8 h-8 text-white" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-xl font-semibold text-gray-900">{user.name}</h3>
            <Badge className={getRoleColor(user.role)}>
              {getRoleLabel(user.role)}
            </Badge>
          </div>
          
          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>{user.permissions.length} permissões ativas</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Último login: {formatDate(user.lastLogin)}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Status: {user.isActive ? 'Ativo' : 'Inativo'}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-2">Permissões Principais:</h4>
        <div className="flex flex-wrap gap-2">
          {user.permissions.slice(0, 6).map((permission, index) => (
            <Badge key={index} className="text-xs bg-gray-100 text-gray-700">
              {permission}
            </Badge>
          ))}
          {user.permissions.length > 6 && (
            <Badge className="text-xs bg-gray-100 text-gray-700">
              +{user.permissions.length - 6} mais
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}; 