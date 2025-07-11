import React, { useState } from 'react';
import { Receipt, FileText, Download, Eye } from 'lucide-react';
import { useRestaurant } from '../../contexts/RestaurantContext';
import { Invoice, Order } from '../../types';

const InvoicesList: React.FC = () => {
  const { invoices, orders, tables } = useRestaurant();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'issued':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Pago';
      case 'issued':
        return 'Emitido';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getOrderInfo = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return null;
    
    const table = tables.find(t => t.id === order.tableId);
    return {
      tableNumber: table?.number || 'N/A',
      items: order.items,
    };
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    // In a real app, this would generate and download a PDF
    alert(`Download da NF-e ${invoice.number} iniciado`);
  };

  const totalRevenue = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.total, 0);

  const monthlyRevenue = invoices
    .filter(inv => 
      inv.status === 'paid' && 
      new Date(inv.issuedAt).getMonth() === new Date().getMonth()
    )
    .reduce((sum, inv) => sum + inv.total, 0);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Notas Fiscais</h2>
        <p className="text-gray-600">Controle de notas fiscais e faturamento</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Faturado</p>
              <p className="text-2xl font-bold text-gray-900">R$ {totalRevenue.toFixed(2)}</p>
            </div>
            <Receipt className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Faturamento Mensal</p>
              <p className="text-2xl font-bold text-gray-900">R$ {monthlyRevenue.toFixed(2)}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Notas Emitidas</p>
              <p className="text-2xl font-bold text-gray-900">{invoices.length}</p>
            </div>
            <Receipt className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico de Notas Fiscais</h3>
          
          {invoices.length === 0 ? (
            <div className="text-center py-12">
              <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma nota fiscal encontrada</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Número</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Mesa</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Data/Hora</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Valor</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => {
                    const orderInfo = getOrderInfo(invoice.orderId);
                    return (
                      <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">
                          {invoice.number}
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          Mesa {orderInfo?.tableNumber || 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {new Date(invoice.issuedAt).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          R$ {invoice.total.toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                            {getStatusLabel(invoice.status)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewInvoice(invoice)}
                              className="text-blue-600 hover:text-blue-700 transition-colors"
                              title="Visualizar"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDownloadInvoice(invoice)}
                              className="text-green-600 hover:text-green-700 transition-colors"
                              title="Download"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Nota Fiscal {selectedInvoice.number}
              </h3>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Data/Hora</p>
                    <p className="text-gray-900">{new Date(selectedInvoice.issuedAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Status</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedInvoice.status)}`}>
                      {getStatusLabel(selectedInvoice.status)}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Itens</p>
                  {(() => {
                    const orderInfo = getOrderInfo(selectedInvoice.orderId);
                    return orderInfo?.items.map((item, index) => (
                      <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                        <span>{item.name} x{item.quantity}</span>
                        <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ));
                  })()}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-xl font-bold text-blue-600">
                      R$ {selectedInvoice.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="w-full bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicesList;