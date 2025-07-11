import React, { useState } from 'react';
import { X, Save, Trash2 } from 'lucide-react';
import { useRestaurant } from '../../contexts/RestaurantContext';
import { Reservation, Customer } from '../../types';

interface ReservationModalProps {
  reservation: Reservation | null;
  onClose: () => void;
}

const ReservationModal: React.FC<ReservationModalProps> = ({ reservation, onClose }) => {
  const { customers, tables, reservations, setReservations, setCustomers } = useRestaurant();
  const [formData, setFormData] = useState({
    customerId: reservation?.customerId || '',
    customerName: reservation ? customers.find(c => c.id === reservation.customerId)?.name || '' : '',
    customerPhone: reservation ? customers.find(c => c.id === reservation.customerId)?.phone || '' : '',
    customerEmail: reservation ? customers.find(c => c.id === reservation.customerId)?.email || '' : '',
    tableId: reservation?.tableId || '',
    date: reservation ? new Date(reservation.date).toISOString().split('T')[0] : '',
    time: reservation?.time || '',
    partySize: reservation?.partySize || 2,
    status: reservation?.status || 'pending',
    notes: reservation?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let customerId = formData.customerId;
    
    // Create new customer if needed
    if (!customerId && formData.customerName && formData.customerPhone) {
      const newCustomer: Customer = {
        id: Date.now().toString(),
        name: formData.customerName,
        phone: formData.customerPhone,
        email: formData.customerEmail,
      };
      setCustomers(prev => [...prev, newCustomer]);
      customerId = newCustomer.id;
    }

    if (reservation) {
      // Update existing reservation
      setReservations(prev => 
        prev.map(r => 
          r.id === reservation.id 
            ? {
                ...r,
                customerId,
                tableId: formData.tableId,
                date: new Date(formData.date),
                time: formData.time,
                partySize: formData.partySize,
                status: formData.status as Reservation['status'],
                notes: formData.notes,
              }
            : r
        )
      );
    } else {
      // Create new reservation
      const newReservation: Reservation = {
        id: Date.now().toString(),
        customerId,
        tableId: formData.tableId,
        date: new Date(formData.date),
        time: formData.time,
        partySize: formData.partySize,
        status: formData.status as Reservation['status'],
        notes: formData.notes,
        createdAt: new Date(),
      };
      setReservations(prev => [...prev, newReservation]);
    }

    onClose();
  };

  const handleDelete = () => {
    if (reservation && window.confirm('Tem certeza que deseja cancelar esta reserva?')) {
      setReservations(prev => prev.filter(r => r.id !== reservation.id));
      onClose();
    }
  };

  const availableTables = tables.filter(table => 
    table.status === 'available' || table.id === reservation?.tableId
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {reservation ? 'Editar Reserva' : 'Nova Reserva'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliente
              </label>
              <select
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione um cliente</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} - {customer.phone}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mesa
              </label>
              <select
                value={formData.tableId}
                onChange={(e) => setFormData({ ...formData, tableId: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecione uma mesa</option>
                {availableTables.map(table => (
                  <option key={table.id} value={table.id}>
                    Mesa {table.number} - {table.seats} lugares
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Horário
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Pessoas
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={formData.partySize}
                onChange={(e) => setFormData({ ...formData, partySize: parseInt(e.target.value) })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Pendente</option>
                <option value="confirmed">Confirmada</option>
                <option value="cancelled">Cancelada</option>
                <option value="completed">Concluída</option>
              </select>
            </div>
          </div>

          {!formData.customerId && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Novo Cliente</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email (opcional)
                  </label>
                  <input
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Observações especiais..."
            />
          </div>

          <div className="flex items-center justify-between pt-6 border-t">
            <div>
              {reservation && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Cancelar Reserva</span>
                </button>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>Salvar</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationModal;