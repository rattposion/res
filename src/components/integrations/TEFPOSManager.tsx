import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Printer, 
  Receipt, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Settings,
  RefreshCw,
  ExternalLink,
  DollarSign,
  Clock,
  TrendingUp,
  BarChart3,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Wifi,
  WifiOff,
  Smartphone,
  Tablet,
  Monitor,
  Shield,
  Key,
  Database,
  FileText,
  Calendar,
  Users,
  Package
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface TEFTransaction {
  id: string;
  terminalId: string;
  transactionType: 'sale' | 'refund' | 'void' | 'installment';
  amount: number;
  cardType: 'credit' | 'debit' | 'pix' | 'qr_code';
  cardBrand: 'visa' | 'mastercard' | 'elo' | 'hipercard' | 'pix';
  authorizationCode: string;
  status: 'approved' | 'declined' | 'pending' | 'cancelled';
  customerName?: string;
  customerDocument?: string;
  installments?: number;
  createdAt: Date;
  processedAt?: Date;
  receiptUrl?: string;
  nsu: string;
  tid: string;
}

interface Terminal {
  id: string;
  name: string;
  model: string;
  serialNumber: string;
  status: 'online' | 'offline' | 'error' | 'maintenance';
  lastSync?: Date;
  ipAddress: string;
  port: number;
  merchantId: string;
  terminalId: string;
  config: {
    autoPrint: boolean;
    printLogo: boolean;
    printCustomerCopy: boolean;
    printMerchantCopy: boolean;
    timeout: number;
    language: string;
  };
}

interface TEFMetrics {
  totalTransactions: number;
  totalAmount: number;
  averageTransaction: number;
  successRate: number;
  topCardBrands: Array<{brand: string, transactions: number, amount: number}>;
  transactionsByType: Array<{type: string, count: number, amount: number}>;
}

const TEFPOSManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'terminals' | 'transactions' | 'metrics' | 'settings'>('terminals');
  const [terminals, setTerminals] = useState<Terminal[]>([]);
  const [transactions, setTransactions] = useState<TEFTransaction[]>([]);
  const [metrics, setMetrics] = useState<TEFMetrics | null>(null);
  const [selectedTerminal, setSelectedTerminal] = useState<Terminal | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<TEFTransaction | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showTerminalModal, setShowTerminalModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  useEffect(() => {
    // Mock data for TEF terminals
    const mockTerminals: Terminal[] = [
      {
        id: '1',
        name: 'Terminal Principal',
        model: 'Bematech MP-4200',
        serialNumber: 'BT4200-123456',
        status: 'online',
        lastSync: new Date(Date.now() - 5 * 60 * 1000),
        ipAddress: '192.168.1.100',
        port: 9100,
        merchantId: 'MERCHANT001',
        terminalId: 'TEF001',
        config: {
          autoPrint: true,
          printLogo: true,
          printCustomerCopy: true,
          printMerchantCopy: true,
          timeout: 30,
          language: 'pt-BR'
        }
      },
      {
        id: '2',
        name: 'Terminal Delivery',
        model: 'Bematech MP-4200',
        serialNumber: 'BT4200-789012',
        status: 'online',
        lastSync: new Date(Date.now() - 2 * 60 * 1000),
        ipAddress: '192.168.1.101',
        port: 9100,
        merchantId: 'MERCHANT001',
        terminalId: 'TEF002',
        config: {
          autoPrint: true,
          printLogo: true,
          printCustomerCopy: true,
          printMerchantCopy: false,
          timeout: 30,
          language: 'pt-BR'
        }
      },
      {
        id: '3',
        name: 'Terminal Backup',
        model: 'Bematech MP-4200',
        serialNumber: 'BT4200-345678',
        status: 'offline',
        lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000),
        ipAddress: '192.168.1.102',
        port: 9100,
        merchantId: 'MERCHANT001',
        terminalId: 'TEF003',
        config: {
          autoPrint: true,
          printLogo: true,
          printCustomerCopy: true,
          printMerchantCopy: true,
          timeout: 30,
          language: 'pt-BR'
        }
      }
    ];

    // Mock data for TEF transactions
    const mockTransactions: TEFTransaction[] = [
      {
        id: '1',
        terminalId: 'TEF001',
        transactionType: 'sale',
        amount: 156.80,
        cardType: 'credit',
        cardBrand: 'visa',
        authorizationCode: '12345678901234567890',
        status: 'approved',
        customerName: 'João Silva',
        customerDocument: '123.456.789-00',
        installments: 3,
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
        processedAt: new Date(Date.now() - 29 * 60 * 1000),
        nsu: '123456789',
        tid: 'TEF001'
      },
      {
        id: '2',
        terminalId: 'TEF002',
        transactionType: 'sale',
        amount: 89.50,
        cardType: 'debit',
        cardBrand: 'mastercard',
        authorizationCode: '09876543210987654321',
        status: 'approved',
        customerName: 'Maria Santos',
        customerDocument: '987.654.321-00',
        createdAt: new Date(Date.now() - 45 * 60 * 1000),
        processedAt: new Date(Date.now() - 44 * 60 * 1000),
        nsu: '987654321',
        tid: 'TEF002'
      },
      {
        id: '3',
        terminalId: 'TEF001',
        transactionType: 'sale',
        amount: 234.90,
        cardType: 'pix',
        cardBrand: 'pix',
        authorizationCode: 'PIX123456789',
        status: 'approved',
        customerName: 'Pedro Costa',
        customerDocument: '456.789.123-00',
        createdAt: new Date(Date.now() - 15 * 60 * 1000),
        processedAt: new Date(Date.now() - 14 * 60 * 1000),
        nsu: '456789123',
        tid: 'TEF001'
      },
      {
        id: '4',
        terminalId: 'TEF002',
        transactionType: 'refund',
        amount: 45.90,
        cardType: 'credit',
        cardBrand: 'visa',
        authorizationCode: 'REFUND123456789',
        status: 'approved',
        customerName: 'Ana Oliveira',
        customerDocument: '789.123.456-00',
        createdAt: new Date(Date.now() - 60 * 60 * 1000),
        processedAt: new Date(Date.now() - 59 * 60 * 1000),
        nsu: '789123456',
        tid: 'TEF002'
      }
    ];

    const mockMetrics: TEFMetrics = {
      totalTransactions: 892,
      totalAmount: 45678.90,
      averageTransaction: 51.21,
      successRate: 98.5,
      topCardBrands: [
        { brand: 'Visa', transactions: 345, amount: 17654.50 },
        { brand: 'Mastercard', transactions: 298, amount: 15234.80 },
        { brand: 'PIX', transactions: 156, amount: 7989.60 },
        { brand: 'Elo', transactions: 89, amount: 4556.00 }
      ],
      transactionsByType: [
        { type: 'Venda', count: 756, amount: 38745.60 },
        { type: 'Estorno', count: 89, amount: 4556.30 },
        { type: 'Parcelado', count: 47, amount: 2377.00 }
      ]
    };

    setTerminals(mockTerminals);
    setTransactions(mockTransactions);
    setMetrics(mockMetrics);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'offline':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'maintenance':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      default:
        return <XCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <Badge className="bg-green-500 text-white">Online</Badge>;
      case 'offline':
        return <Badge className="bg-red-500 text-white">Offline</Badge>;
      case 'error':
        return <Badge className="bg-yellow-500 text-white">Erro</Badge>;
      case 'maintenance':
        return <Badge className="bg-orange-500 text-white">Manutenção</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">Desconhecido</Badge>;
    }
  };

  const getTransactionStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500 text-white">Aprovada</Badge>;
      case 'declined':
        return <Badge className="bg-red-500 text-white">Negada</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 text-white">Pendente</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-500 text-white">Cancelada</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">Desconhecido</Badge>;
    }
  };

  const getCardBrandIcon = (brand: string) => {
    switch (brand) {
      case 'visa':
        return <CreditCard className="w-4 h-4 text-blue-600" />;
      case 'mastercard':
        return <CreditCard className="w-4 h-4 text-red-600" />;
      case 'elo':
        return <CreditCard className="w-4 h-4 text-yellow-600" />;
      case 'pix':
        return <Smartphone className="w-4 h-4 text-green-600" />;
      default:
        return <CreditCard className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleTerminalStatusChange = (terminalId: string, newStatus: Terminal['status']) => {
    setTerminals(prev => 
      prev.map(terminal => 
        terminal.id === terminalId 
          ? { ...terminal, status: newStatus, lastSync: new Date() }
          : terminal
      )
    );
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.nsu.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const onlineTerminals = terminals.filter(t => t.status === 'online').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                <CreditCard className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">TEF/POS Manager</h1>
                <p className="text-gray-600">Gerencie terminais, transações e impressora fiscal</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => window.location.reload()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Sincronizar
              </Button>
              <Button>
                <ExternalLink className="w-4 h-4 mr-2" />
                Abrir TEF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      {metrics && (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Terminais Online</p>
                  <p className="text-2xl font-bold text-gray-900">{onlineTerminals}/{terminals.length}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Wifi className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Transações</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.totalTransactions}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Receipt className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Valor Total</p>
                  <p className="text-2xl font-bold text-gray-900">R$ {metrics.totalAmount.toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taxa Sucesso</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.successRate}%</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-8 border-b">
          {[
            { id: 'terminals', name: 'Terminais', icon: <Monitor className="w-4 h-4" /> },
            { id: 'transactions', name: 'Transações', icon: <Receipt className="w-4 h-4" /> },
            { id: 'metrics', name: 'Métricas', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'settings', name: 'Configurações', icon: <Settings className="w-4 h-4" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === tab.id 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'terminals' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Terminais TEF</h2>
              <Button onClick={() => setShowTerminalModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Terminal
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {terminals.map(terminal => (
                <Card key={terminal.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Monitor className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{terminal.name}</h3>
                        <p className="text-sm text-gray-600">{terminal.model}</p>
                      </div>
                    </div>
                    {getStatusIcon(terminal.status)}
                  </div>

                  <div className="mb-4">
                    {getStatusBadge(terminal.status)}
                  </div>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Serial:</span>
                      <span className="text-gray-900">{terminal.serialNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">IP:</span>
                      <span className="text-gray-900">{terminal.ipAddress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Terminal ID:</span>
                      <span className="text-gray-900">{terminal.terminalId}</span>
                    </div>
                    {terminal.lastSync && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Última sincronização:</span>
                        <span className="text-gray-900">{terminal.lastSync.toLocaleTimeString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    {terminal.status === 'offline' && (
                      <Button 
                        size="sm"
                        onClick={() => handleTerminalStatusChange(terminal.id, 'online')}
                      >
                        <Wifi className="w-4 h-4 mr-1" />
                        Conectar
                      </Button>
                    )}
                    {terminal.status === 'online' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleTerminalStatusChange(terminal.id, 'offline')}
                      >
                        <WifiOff className="w-4 h-4 mr-1" />
                        Desconectar
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar por cliente ou NSU..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">Todos os status</option>
                <option value="approved">Aprovada</option>
                <option value="declined">Negada</option>
                <option value="pending">Pendente</option>
                <option value="cancelled">Cancelada</option>
              </select>
            </div>

            {/* Transactions List */}
            <div className="space-y-4">
              {filteredTransactions.map(transaction => (
                <Card key={transaction.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">NSU: {transaction.nsu}</h3>
                        <p className="text-sm text-gray-600">{transaction.customerName}</p>
                      </div>
                      {getTransactionStatusBadge(transaction.status)}
                      {getCardBrandIcon(transaction.cardBrand)}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">R$ {transaction.amount.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">{transaction.createdAt.toLocaleTimeString()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{transaction.cardBrand.toUpperCase()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Terminal: {transaction.terminalId}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {transaction.processedAt?.toLocaleTimeString() || 'Processando...'}
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => setSelectedTransaction(transaction)}>
                          <Eye className="w-4 h-4 mr-1" />
                          Ver Detalhes
                        </Button>
                        <Button variant="outline" size="sm">
                          <Printer className="w-4 h-4 mr-1" />
                          Imprimir
                        </Button>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <FileText className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'metrics' && metrics && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Bandeiras Mais Usadas</h3>
                <div className="space-y-3">
                  {metrics.topCardBrands.map((brand, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getCardBrandIcon(brand.brand)}
                        <span className="text-sm text-gray-600">{brand.brand}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-gray-900">{brand.transactions}</span>
                        <span className="text-xs text-gray-500 ml-2">R$ {brand.amount.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Transações por Tipo</h3>
                <div className="space-y-3">
                  {metrics.transactionsByType.map((type, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{type.type}</span>
                      <div className="text-right">
                        <span className="font-semibold text-gray-900">{type.count}</span>
                        <span className="text-xs text-gray-500 ml-2">R$ {type.amount.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Configurações TEF</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Merchant ID
                  </label>
                  <input
                    type="text"
                    value="MERCHANT001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Terminal ID
                  </label>
                  <input
                    type="text"
                    value="TEF001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    IP do Terminal
                  </label>
                  <input
                    type="text"
                    value="192.168.1.100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    readOnly
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="autoPrint" defaultChecked />
                  <label htmlFor="autoPrint" className="text-sm text-gray-700">
                    Impressão automática
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="printLogo" defaultChecked />
                  <label htmlFor="printLogo" className="text-sm text-gray-700">
                    Imprimir logo
                  </label>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Detalhes da Transação</h3>
              <Button variant="ghost" onClick={() => setSelectedTransaction(null)}>
                <XCircle className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">NSU</p>
                  <p className="text-gray-900">{selectedTransaction.nsu}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">TID</p>
                  <p className="text-gray-900">{selectedTransaction.tid}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Código de Autorização</p>
                  <p className="text-gray-900">{selectedTransaction.authorizationCode}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Valor</p>
                  <p className="text-gray-900">R$ {selectedTransaction.amount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Bandeira</p>
                  <p className="text-gray-900">{selectedTransaction.cardBrand.toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Tipo</p>
                  <p className="text-gray-900">{selectedTransaction.cardType}</p>
                </div>
                {selectedTransaction.installments && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Parcelas</p>
                    <p className="text-gray-900">{selectedTransaction.installments}x</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  {getTransactionStatusBadge(selectedTransaction.status)}
                </div>
              </div>

              {selectedTransaction.customerName && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Cliente</p>
                  <p className="text-gray-900">{selectedTransaction.customerName}</p>
                  {selectedTransaction.customerDocument && (
                    <p className="text-sm text-gray-600">{selectedTransaction.customerDocument}</p>
                  )}
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-gray-600">Data/Hora</p>
                <p className="text-gray-900">{selectedTransaction.createdAt.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TEFPOSManager; 