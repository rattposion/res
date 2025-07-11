import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Upload, 
  Search, 
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
  Calendar,
  DollarSign,
  Receipt,
  Settings,
  Bell,
  Home,
  Package,
  Tag,
  Percent,
  Award,
  Crown,
  User,
  Play,
  Printer,
  Send,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  Database,
  Cloud,
  Zap
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';

interface FiscalDocument {
  id: string;
  type: 'nfe' | 'nfce' | 'nfs' | 'mei';
  number: string;
  series: string;
  customerName: string;
  customerDocument: string;
  customerAddress: string;
  items: FiscalItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'authorized' | 'cancelled' | 'error';
  authorizationCode?: string;
  authorizationDate?: Date;
  cancellationReason?: string;
  createdAt: Date;
  sentAt?: Date;
  authorizedAt?: Date;
  cancelledAt?: Date;
  xmlContent?: string;
  pdfUrl?: string;
  notes?: string;
}

interface FiscalItem {
  id: string;
  description: string;
  ncm: string;
  cfop: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  taxRate: number;
  taxAmount: number;
}

interface FiscalSettings {
  companyName: string;
  cnpj: string;
  ie: string;
  address: string;
  city: string;
  state: string;
  cep: string;
  phone: string;
  email: string;
  certificatePath: string;
  certificatePassword: string;
  environment: 'production' | 'homologation';
  sefazUrl: string;
  lastSync: Date;
}

interface FiscalReport {
  id: string;
  type: 'daily' | 'monthly' | 'annual';
  period: string;
  totalDocuments: number;
  totalAmount: number;
  totalTax: number;
  status: 'pending' | 'generated' | 'sent';
  createdAt: Date;
  generatedAt?: Date;
  sentAt?: Date;
}

const FiscalManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'documents' | 'reports' | 'settings' | 'monitoring'>('documents');
  const [reportPeriod, setReportPeriod] = useState<string>('month');
  const [reportType, setReportType] = useState<string>('documents');
  const [showExportModal, setShowExportModal] = useState(false);
  const [documents, setDocuments] = useState<FiscalDocument[]>([]);
  const [reports, setReports] = useState<FiscalReport[]>([]);
  const [settings, setSettings] = useState<FiscalSettings | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<FiscalDocument | null>(null);

  useEffect(() => {
    // Load mock data
    const mockDocuments: FiscalDocument[] = [
      {
        id: '1',
        type: 'nfce',
        number: '000001',
        series: '1',
        customerName: 'João Silva',
        customerDocument: '123.456.789-00',
        customerAddress: 'Rua das Flores, 123 - São Paulo, SP',
        items: [
          {
            id: 'item-1',
            description: 'Pizza Margherita',
            ncm: '2106.90.00',
            cfop: '5102',
            quantity: 2,
            unitPrice: 35.90,
            totalPrice: 71.80,
            taxRate: 10,
            taxAmount: 7.18
          },
          {
            id: 'item-2',
            description: 'Refrigerante Coca-Cola',
            ncm: '2202.10.00',
            cfop: '5102',
            quantity: 2,
            unitPrice: 6.90,
            totalPrice: 13.80,
            taxRate: 10,
            taxAmount: 1.38
          }
        ],
        subtotal: 85.60,
        tax: 8.56,
        total: 94.16,
        status: 'authorized',
        authorizationCode: '12345678901234567890',
        authorizationDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        authorizedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: '2',
        type: 'nfe',
        number: '000002',
        series: '1',
        customerName: 'Maria Santos',
        customerDocument: '987.654.321-00',
        customerAddress: 'Av. Paulista, 1000 - São Paulo, SP',
        items: [
          {
            id: 'item-3',
            description: 'Pizza Quatro Queijos',
            ncm: '2106.90.00',
            cfop: '5102',
            quantity: 1,
            unitPrice: 42.90,
            totalPrice: 42.90,
            taxRate: 10,
            taxAmount: 4.29
          }
        ],
        subtotal: 42.90,
        tax: 4.29,
        total: 47.19,
        status: 'sent',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        sentAt: new Date(Date.now() - 30 * 60 * 1000)
      },
      {
        id: '3',
        type: 'mei',
        number: '000003',
        series: '1',
        customerName: 'Pedro Costa',
        customerDocument: '111.222.333-44',
        customerAddress: 'Rua Augusta, 500 - São Paulo, SP',
        items: [
          {
            id: 'item-4',
            description: 'Pizza Margherita',
            ncm: '2106.90.00',
            cfop: '5102',
            quantity: 1,
            unitPrice: 35.90,
            totalPrice: 35.90,
            taxRate: 0,
            taxAmount: 0
          }
        ],
        subtotal: 35.90,
        tax: 0,
        total: 35.90,
        status: 'draft',
        createdAt: new Date()
      }
    ];

    const mockReports: FiscalReport[] = [
      {
        id: '1',
        type: 'daily',
        period: '2024-01-15',
        totalDocuments: 25,
        totalAmount: 2840.50,
        totalTax: 284.05,
        status: 'generated',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        generatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        type: 'monthly',
        period: '2024-01',
        totalDocuments: 450,
        totalAmount: 45680.30,
        totalTax: 4568.03,
        status: 'sent',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        generatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        sentAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
      }
    ];

    const mockSettings: FiscalSettings = {
      companyName: 'Pizzaria Exemplo LTDA',
      cnpj: '12.345.678/0001-90',
      ie: '123.456.789.012',
      address: 'Rua das Pizzas, 123',
      city: 'São Paulo',
      state: 'SP',
      cep: '01234-567',
      phone: '(11) 99999-9999',
      email: 'fiscal@pizzaria.com',
      certificatePath: '/certificates/certificate.pfx',
      certificatePassword: '********',
      environment: 'production',
      sefazUrl: 'https://nfe.fazenda.sp.gov.br',
      lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000)
    };

    setDocuments(mockDocuments);
    setReports(mockReports);
    setSettings(mockSettings);
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'nfe': return 'primary';
      case 'nfce': return 'success';
      case 'nfs': return 'warning';
      case 'mei': return 'secondary';
      default: return 'secondary';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'nfe': return 'NFe';
      case 'nfce': return 'NFCe';
      case 'nfs': return 'NFS';
      case 'mei': return 'MEI';
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'sent': return 'warning';
      case 'authorized': return 'success';
      case 'cancelled': return 'error';
      case 'error': return 'error';
      case 'pending': return 'warning';
      case 'generated': return 'success';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Rascunho';
      case 'sent': return 'Enviado';
      case 'authorized': return 'Autorizado';
      case 'cancelled': return 'Cancelado';
      case 'error': return 'Erro';
      case 'pending': return 'Pendente';
      case 'generated': return 'Gerado';
      case 'sent': return 'Enviado';
      default: return status;
    }
  };

  const filteredDocuments = documents.filter(document => {
    const matchesSearch = document.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         document.number.includes(searchQuery);
    const matchesType = filterType === 'all' || document.type === filterType;
    const matchesStatus = filterStatus === 'all' || document.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const sendDocument = (documentId: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === documentId 
        ? { ...doc, status: 'sent' as const, sentAt: new Date() }
        : doc
    ));
  };

  const cancelDocument = (documentId: string, reason: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === documentId 
        ? { ...doc, status: 'cancelled' as const, cancellationReason: reason, cancelledAt: new Date() }
        : doc
    ));
  };

  const handleExportReport = (format: 'csv' | 'pdf') => {
    const data = `Relatório Fiscal - ${reportPeriod}\n\n`;
    const filename = `relatorio_fiscal_${reportPeriod}_${new Date().toISOString().split('T')[0]}.${format}`;
    
    if (format === 'csv') {
      const csvContent = `Data,Tipo,Número,Cliente,Valor,Impostos,Status\n` +
        documents.map(d => `${d.createdAt.toLocaleDateString()},${d.type},${d.number},${d.customerName},${d.total},${d.tax},${d.status}`).join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
    } else {
      alert(`Relatório PDF "${filename}" seria gerado aqui.`);
    }
    setShowExportModal(false);
  };

  const getFiscalMetrics = () => {
    const totalDocuments = documents.length;
    const authorizedDocuments = documents.filter(d => d.status === 'authorized').length;
    const pendingDocuments = documents.filter(d => d.status === 'sent').length;
    const cancelledDocuments = documents.filter(d => d.status === 'cancelled').length;
    const totalAmount = documents.reduce((sum, d) => sum + d.total, 0);
    const totalTax = documents.reduce((sum, d) => sum + d.tax, 0);
    
    return {
      totalDocuments,
      authorizedDocuments,
      pendingDocuments,
      cancelledDocuments,
      totalAmount,
      totalTax,
      taxRate: totalAmount > 0 ? (totalTax / totalAmount) * 100 : 0
    };
  };

  const getDocumentTypeMetrics = () => {
    const nfceCount = documents.filter(d => d.type === 'nfce').length;
    const nfeCount = documents.filter(d => d.type === 'nfe').length;
    const meiCount = documents.filter(d => d.type === 'mei').length;
    
    const nfceAmount = documents.filter(d => d.type === 'nfce').reduce((sum, d) => sum + d.total, 0);
    const nfeAmount = documents.filter(d => d.type === 'nfe').reduce((sum, d) => sum + d.total, 0);
    const meiAmount = documents.filter(d => d.type === 'mei').reduce((sum, d) => sum + d.total, 0);
    
    return {
      nfce: { count: nfceCount, amount: nfceAmount },
      nfe: { count: nfeCount, amount: nfeAmount },
      mei: { count: meiCount, amount: meiAmount }
    };
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestão Fiscal</h1>
        <p className="text-gray-600">Emissão de notas fiscais e relatórios fiscais</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Documentos Hoje</p>
              <p className="text-2xl font-bold text-gray-900">{documents.filter(d => d.createdAt.toDateString() === new Date().toDateString()).length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Autorizados</p>
              <p className="text-2xl font-bold text-green-600">{documents.filter(d => d.status === 'authorized').length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600">{documents.filter(d => d.status === 'draft' || d.status === 'sent').length}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Fiscal</p>
              <p className="text-2xl font-bold text-purple-600">R$ {documents.reduce((sum, d) => sum + d.tax, 0).toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('documents')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'documents'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FileText className="h-4 w-4 inline mr-2" />
          Documentos
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'reports'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <BarChart3 className="h-4 w-4 inline mr-2" />
          Relatórios
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'settings'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Settings className="h-4 w-4 inline mr-2" />
          Configurações
        </button>
        <button
          onClick={() => setActiveTab('monitoring')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'monitoring'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Shield className="h-4 w-4 inline mr-2" />
          Monitoramento
        </button>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar documentos..."
              className="pl-10 w-64"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos os tipos</option>
            <option value="nfe">NFe</option>
            <option value="nfce">NFCe</option>
            <option value="nfs">NFS</option>
            <option value="mei">MEI</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos os status</option>
            <option value="draft">Rascunho</option>
            <option value="sent">Enviado</option>
            <option value="authorized">Autorizado</option>
            <option value="cancelled">Cancelado</option>
            <option value="error">Erro</option>
          </select>
        </div>

        <div className="flex space-x-2">
          <Button variant="secondary">
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
          <Button variant="secondary">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={() => setShowDocumentModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Documento
          </Button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'documents' && (
        <div className="space-y-4">
          {filteredDocuments.map(document => (
            <Card key={document.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">
                    {getTypeLabel(document.type)} #{document.number}
                  </h3>
                  <p className="text-sm text-gray-600">{document.customerName}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getTypeColor(document.type)}>
                    {getTypeLabel(document.type)}
                  </Badge>
                  <Badge variant={getStatusColor(document.status)}>
                    {getStatusLabel(document.status)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Cliente</p>
                  <p className="font-semibold">{document.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">CPF/CNPJ</p>
                  <p className="font-semibold">{document.customerDocument}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="font-semibold">R$ {document.total.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Data</p>
                  <p className="font-semibold">{document.createdAt.toLocaleDateString()}</p>
                </div>
              </div>

              {document.authorizationCode && (
                <div className="bg-green-50 p-3 rounded-lg mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-800">Autorizado</p>
                      <p className="text-xs text-green-600">Código: {document.authorizationCode}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-green-600">
                        {document.authorizationDate?.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <Button size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Detalhes
                </Button>
                <Button size="sm" variant="secondary">
                  <Download className="h-4 w-4 mr-2" />
                  XML
                </Button>
                <Button size="sm" variant="secondary">
                  <Printer className="h-4 w-4 mr-2" />
                  PDF
                </Button>
                {document.status === 'draft' && (
                  <Button size="sm" onClick={() => sendDocument(document.id)}>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar
                  </Button>
                )}
                {document.status === 'authorized' && (
                  <Button size="sm" variant="secondary">
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Relatórios Fiscais</h2>
            <div className="flex space-x-2">
              <select
                value={reportPeriod}
                onChange={(e) => setReportPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="week">Última Semana</option>
                <option value="month">Último Mês</option>
                <option value="quarter">Último Trimestre</option>
                <option value="year">Último Ano</option>
              </select>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="documents">Documentos</option>
                <option value="taxes">Impostos</option>
                <option value="types">Tipos de Documento</option>
                <option value="status">Status</option>
              </select>
              <Button onClick={() => setShowExportModal(true)}>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Resumo Geral</h3>
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Documentos:</span>
                  <span className="font-semibold">{getFiscalMetrics().totalDocuments}</span>
                </div>
                <div className="flex justify-between">
                  <span>Autorizados:</span>
                  <span className="font-semibold text-green-600">{getFiscalMetrics().authorizedDocuments}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pendentes:</span>
                  <span className="font-semibold text-orange-600">{getFiscalMetrics().pendingDocuments}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cancelados:</span>
                  <span className="font-semibold text-red-600">{getFiscalMetrics().cancelledDocuments}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span>Valor Total:</span>
                  <span className="font-semibold text-green-600">R$ {getFiscalMetrics().totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Análise de Impostos</h3>
                <Percent className="h-6 w-6 text-purple-600" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Impostos:</span>
                  <span className="font-semibold text-red-600">R$ {getFiscalMetrics().totalTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxa Média:</span>
                  <span className="font-semibold text-blue-600">{getFiscalMetrics().taxRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Maior Imposto:</span>
                  <span className="font-semibold text-red-600">
                    R$ {documents.length > 0 ? Math.max(...documents.map(d => d.tax)).toFixed(2) : 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Menor Imposto:</span>
                  <span className="font-semibold text-green-600">
                    R$ {documents.length > 0 ? Math.min(...documents.map(d => d.tax)).toFixed(2) : 0}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Por Tipo de Documento</h3>
                <Receipt className="h-6 w-6 text-green-600" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>NFC-e:</span>
                  <span className="font-semibold">{getDocumentTypeMetrics().nfce.count} (R$ {getDocumentTypeMetrics().nfce.amount.toFixed(2)})</span>
                </div>
                <div className="flex justify-between">
                  <span>NFe:</span>
                  <span className="font-semibold">{getDocumentTypeMetrics().nfe.count} (R$ {getDocumentTypeMetrics().nfe.amount.toFixed(2)})</span>
                </div>
                <div className="flex justify-between">
                  <span>MEI:</span>
                  <span className="font-semibold">{getDocumentTypeMetrics().mei.count} (R$ {getDocumentTypeMetrics().mei.amount.toFixed(2)})</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span>Total:</span>
                  <span className="font-semibold text-green-600">
                    R$ {(getDocumentTypeMetrics().nfce.amount + getDocumentTypeMetrics().nfe.amount + getDocumentTypeMetrics().mei.amount).toFixed(2)}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Gráfico de Documentos Fiscais</h3>
            <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Gráfico de documentos seria renderizado aqui</p>
                <p className="text-sm text-gray-500">NFC-e, NFe, MEI por período</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'settings' && settings && (
        <div className="space-y-6">
          {/* Company Information */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Informações da Empresa</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Razão Social</label>
                <Input value={settings.companyName} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CNPJ</label>
                <Input value={settings.cnpj} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Inscrição Estadual</label>
                <Input value={settings.ie} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
                <Input value={settings.address} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
                <Input value={settings.city} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                <Input value={settings.state} readOnly />
              </div>
            </div>
          </Card>

          {/* Certificate Settings */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Certificado Digital</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Caminho do Certificado</label>
                <Input value={settings.certificatePath} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
                <Input type="password" value={settings.certificatePassword} readOnly />
              </div>
            </div>
            <div className="mt-4 flex space-x-2">
              <Button variant="secondary">
                <Upload className="h-4 w-4 mr-2" />
                Importar Certificado
              </Button>
              <Button variant="secondary">
                <Shield className="h-4 w-4 mr-2" />
                Testar Certificado
              </Button>
            </div>
          </Card>

          {/* SEFAZ Settings */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Configurações SEFAZ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ambiente</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="production" selected={settings.environment === 'production'}>Produção</option>
                  <option value="homologation" selected={settings.environment === 'homologation'}>Homologação</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL SEFAZ</label>
                <Input value={settings.sefazUrl} readOnly />
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <Badge variant="success">Conectado</Badge>
              <span className="text-sm text-gray-600">Última sincronização: {settings.lastSync.toLocaleString()}</span>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'monitoring' && (
        <div className="space-y-6">
          {/* System Status */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Status do Sistema</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium">SEFAZ Online</span>
                </div>
                <p className="text-sm text-green-600 mt-1">Conexão ativa</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Certificado Válido</span>
                </div>
                <p className="text-sm text-green-600 mt-1">Válido até 31/12/2024</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium">Contingência</span>
                </div>
                <p className="text-sm text-yellow-600 mt-1">Modo offline ativo</p>
              </div>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Atividade Recente</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="font-medium">NFCe #000001 autorizada</p>
                    <p className="text-sm text-gray-600">Há 2 horas</p>
                  </div>
                </div>
                <Badge variant="success">Autorizado</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Send className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="font-medium">NFe #000002 enviada</p>
                    <p className="text-sm text-gray-600">Há 1 hora</p>
                  </div>
                </div>
                <Badge variant="warning">Enviado</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="h-4 w-4 text-purple-600" />
                  <div>
                    <p className="font-medium">Relatório mensal gerado</p>
                    <p className="text-sm text-gray-600">Há 3 horas</p>
                  </div>
                </div>
                <Badge variant="success">Concluído</Badge>
              </div>
            </div>
          </Card>
        </div>
      )}

      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96 p-6">
            <h3 className="text-lg font-semibold mb-4">Exportar Relatório</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Formato</label>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => handleExportReport('csv')} className="flex-1">
                    <FileText className="h-4 w-4 mr-2" />
                    CSV
                  </Button>
                  <Button variant="outline" onClick={() => handleExportReport('pdf')} className="flex-1">
                    <FileText className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowExportModal(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FiscalManager; 