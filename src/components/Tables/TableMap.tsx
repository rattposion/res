import React, { useState } from 'react';
import { useRestaurant } from '../../contexts/RestaurantContext';
import { Table } from '../../types';
import OrderModal from './OrderModal';

const TableMap: React.FC = () => {
  const { tables, setTables } = useRestaurant();
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const getTableStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500 hover:bg-green-600';
      case 'occupied':
        return 'bg-red-500 hover:bg-red-600';
      case 'reserved':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'cleaning':
        return 'bg-yellow-500 hover:bg-yellow-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available':
        return 'Disponível';
      case 'occupied':
        return 'Ocupada';
      case 'reserved':
        return 'Reservada';
      case 'cleaning':
        return 'Limpeza';
      default:
        return status;
    }
  };

  const handleTableClick = (table: Table) => {
    setSelectedTable(table);
    if (table.status === 'available') {
      setShowOrderModal(true);
    }
  };

  const handleTableStatusChange = (tableId: string, newStatus: Table['status']) => {
    setTables(prevTables => 
      prevTables.map(table => 
        table.id === tableId 
          ? { ...table, status: newStatus, occupiedAt: newStatus === 'occupied' ? new Date() : undefined }
          : table
      )
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Mapa de Mesas</h2>
        <p className="text-gray-600">Clique em uma mesa para gerenciar seu status</p>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="relative bg-gray-50 rounded-lg" style={{ height: '500px' }}>
          {tables.map((table) => (
            <div
              key={table.id}
              className={`absolute cursor-pointer transition-all duration-200 ${getTableStatusColor(table.status)} text-white rounded-lg shadow-md`}
              style={{
                left: `${table.position.x}px`,
                top: `${table.position.y}px`,
                width: '100px',
                height: '80px',
              }}
              onClick={() => handleTableClick(table)}
            >
              <div className="flex flex-col items-center justify-center h-full p-2">
                <div className="text-lg font-bold">Mesa {table.number}</div>
                <div className="text-xs opacity-90">{table.seats} lugares</div>
                <div className="text-xs opacity-90">{getStatusLabel(table.status)}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-700">Disponível</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-700">Ocupada</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-700">Reservada</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-sm text-gray-700">Limpeza</span>
          </div>
        </div>
      </div>

      {selectedTable && (
        <div className="mt-6 bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Mesa {selectedTable.number} - {getStatusLabel(selectedTable.status)}
          </h3>
          <div className="flex flex-wrap gap-2">
            {(['available', 'occupied', 'reserved', 'cleaning'] as const).map((status) => (
              <button
                key={status}
                onClick={() => handleTableStatusChange(selectedTable.id, status)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedTable.status === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {getStatusLabel(status)}
              </button>
            ))}
          </div>
          {selectedTable.status === 'occupied' && selectedTable.occupiedAt && (
            <div className="mt-4 text-sm text-gray-600">
              Ocupada desde: {new Date(selectedTable.occupiedAt).toLocaleString()}
            </div>
          )}
        </div>
      )}

      {showOrderModal && selectedTable && (
        <OrderModal
          table={selectedTable}
          onClose={() => setShowOrderModal(false)}
        />
      )}
    </div>
  );
};

export default TableMap;