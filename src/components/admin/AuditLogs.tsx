import React, { useState, useEffect } from 'react';
import { Shield, Search, Filter, Download, Eye } from 'lucide-react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { AuditLog } from '../../types/advanced';

const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState('all');
  const [selectedUser, setSelectedUser] = useState('all');

  useEffect(() => {
    // Simulate audit logs data
    const mockLogs: AuditLog[] = [
      {
        id: '1',
        tenantId: 'tenant-1',
        userId: 'user-1',
        action: 'CREATE',
        resource: 'order',
        resourceId: 'order-123',
        newValues: { total: 45.90, status: 'pending' },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0...',
        timestamp: new Date(2024, 11, 15, 14, 30)
      },
      {
        id: '2',
        tenantId: 'tenant-1',
        userId: 'user-2',
        action: 'UPDATE',
        resource: 'menu_item',
        resourceId: 'item-456',
        oldValues: { price: 25.90 },
        newValues: { price: 29.90 },
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0...',
        timestamp: new Date(2024, 11, 15, 13, 15)
      },
      {
        id: '3',
        tenantId: 'tenant-1',
        userId: 'user-1',
        action: 'DELETE',
        resource: 'customer',
        resourceId: 'customer-789',
        oldValues: { name: 'João Silva', email: 'joao@email.com' },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0...',
        timestamp: new Date(2024, 11, 15, 12, 45)
      }
    ];
    
    setLogs(mockLogs);
    setFilteredLogs(mockLogs);
  }, []);

  useEffect(() => {
    let filtered = logs;

    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.resourceId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedAction !== 'all') {
      filtered = filtered.filter(log => log.action === selectedAction);
    }

    if (selectedUser !== 'all') {
      filtered = filtered.filter(log => log.userId === selectedUser);
    }

    setFilteredLogs(filtered);
  }, [logs, searchTerm, selectedAction, selectedUser]);

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'success';
      case 'UPDATE': return 'warning';
      case 'DELETE': return 'error';
      default: return 'secondary';
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'CREATE': return 'Criação';
      case 'UPDATE': return 'Atualização';
      case 'DELETE': return 'Exclusão';
      default: return action;
    }
  };

  const getResourceLabel = (resource: string) => {
    switch (resource) {
      case 'order': return 'Pedido';
      case 'menu_item': return 'Item do Menu';
      case 'customer': return 'Cliente';
      case 'user': return 'Usuário';
      default: return resource;
    }
  };

  const exportLogs = () => {
    const csvContent = [
      ['Data/Hora', 'Usuário', 'Ação', 'Recurso', 'ID do Recurso', 'IP'],
      ...filteredLogs.map(log => [
        log.timestamp.toLocaleString(),
        log.userId,
        log.action,
        log.resource,
        log.resourceId,
        log.ipAddress
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Logs de Auditoria</h2>
          <p className="text-gray-600">Histórico completo de ações no sistema</p>
        </div>
        <Button onClick={exportLogs} variant="secondary">
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ação
            </label>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas as ações</option>
              <option value="CREATE">Criação</option>
              <option value="UPDATE">Atualização</option>
              <option value="DELETE">Exclusão</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Usuário
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos os usuários</option>
              <option value="user-1">João Silva</option>
              <option value="user-2">Maria Santos</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button variant="secondary" className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
          </div>
        </div>
      </Card>

      {/* Logs Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Data/Hora</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Usuário</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Ação</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Recurso</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">IP</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {log.timestamp.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {log.userId}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={getActionColor(log.action)}>
                      {getActionLabel(log.action)}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {getResourceLabel(log.resource)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700 font-mono">
                    {log.resourceId}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700 font-mono">
                    {log.ipAddress}
                  </td>
                  <td className="py-3 px-4">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum log encontrado</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AuditLogs;