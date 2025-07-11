// FinancialDashboard - Updated with Wallet icon instead of Cash
import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  Wallet,
  Calendar,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
  FileText,
  Receipt,
  Users,
  Package,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  MessageSquare
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';

interface FinancialTransaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  date: Date;
  dueDate?: Date;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  paymentMethod: 'cash' | 'card' | 'pix' | 'transfer' | 'check';
  reference?: string;
  notes?: string;
  tags: string[];
}

interface CashFlow {
  date: Date;
  income: number;
  expenses: number;
  balance: number;
}

interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  pendingReceivables: number;
  pendingPayables: number;
  cashBalance: number;
  monthlyGrowth: number;
}

const FinancialDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'receivables' | 'payables' | 'reports'>('overview');
  const [reportPeriod, setReportPeriod] = useState<string>('month');
  const [reportType, setReportType] = useState<string>('cashflow');
  const [showExportModal, setShowExportModal] = useState(false);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [cashFlow, setCashFlow] = useState<CashFlow[]>([]);
  const [summary, setSummary] = useState<FinancialSummary>({
    totalIncome: 0,
    totalExpenses: 0,
    netProfit: 0,
    pendingReceivables: 0,
    pendingPayables: 0,
    cashBalance: 0,
    monthlyGrowth: 0
  });
  const [filterPeriod, setFilterPeriod] = useState<string>('month');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<FinancialTransaction | null>(null);

  const categories = {
    income: ['Vendas', 'Delivery', 'Catering', 'Investimentos', 'Outros'],
    expense: ['Fornecedores', 'Funcionários', 'Aluguel', 'Impostos', 'Marketing', 'Manutenção', 'Outros']
  };

  useEffect(() => {
    // Load mock data
    const mockTransactions: FinancialTransaction[] = [
      {
        id: '1',
        type: 'income',
        category: 'Vendas',
        description: 'Vendas do dia - Mesa 1, 2, 3',
        amount: 1250.50,
        date: new Date(),
        status: 'paid',
        paymentMethod: 'card',
        reference: 'VDA-001',
        tags: ['vendas', 'balcão']
      },
      {
        id: '2',
        type: 'income',
        category: 'Delivery',
        description: 'Pedidos delivery - iFood, WhatsApp',
        amount: 890.30,
        date: new Date(),
        status: 'paid',
        paymentMethod: 'pix',
        reference: 'DEL-001',
        tags: ['delivery', 'online']
      },
      {
        id: '3',
        type: 'expense',
        category: 'Fornecedores',
        description: 'Compra de ingredientes - Laticínios Silva',
        amount: 450.00,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'pending',
        paymentMethod: 'transfer',
        reference: 'FOR-001',
        tags: ['fornecedores', 'ingredientes']
      },
      {
        id: '4',
        type: 'expense',
        category: 'Funcionários',
        description: 'Salários - Equipe de cozinha',
        amount: 2800.00,
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        status: 'pending',
        paymentMethod: 'transfer',
        reference: 'FUN-001',
        tags: ['funcionários', 'salários']
      },
      {
        id: '5',
        type: 'expense',
        category: 'Aluguel',
        description: 'Aluguel do estabelecimento',
        amount: 3500.00,
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        status: 'overdue',
        paymentMethod: 'transfer',
        reference: 'ALU-001',
        tags: ['aluguel', 'fixo']
      },
      {
        id: '6',
        type: 'income',
        category: 'Catering',
        description: 'Evento corporativo - Empresa ABC',
        amount: 2500.00,
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        status: 'pending',
        paymentMethod: 'check',
        reference: 'CAT-001',
        tags: ['catering', 'evento']
      }
    ];

    const mockCashFlow: CashFlow[] = [
      { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), income: 1200, expenses: 800, balance: 400 },
      { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), income: 1500, expenses: 1200, balance: 300 },
      { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), income: 1800, expenses: 900, balance: 900 },
      { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), income: 1400, expenses: 1100, balance: 300 },
      { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), income: 1600, expenses: 1300, balance: 300 },
      { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), income: 1900, expenses: 1000, balance: 900 },
      { date: new Date(), income: 2140.80, expenses: 1500, balance: 640.80 }
    ];

    setTransactions(mockTransactions);
    setCashFlow(mockCashFlow);

    // Calculate summary
    const totalIncome = mockTransactions
      .filter(t => t.type === 'income' && t.status === 'paid')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = mockTransactions
      .filter(t => t.type === 'expense' && t.status === 'paid')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const pendingReceivables = mockTransactions
      .filter(t => t.type === 'income' && t.status === 'pending')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const pendingPayables = mockTransactions
      .filter(t => t.type === 'expense' && (t.status === 'pending' || t.status === 'overdue'))
      .reduce((sum, t) => sum + t.amount, 0);

    setSummary({
      totalIncome,
      totalExpenses,
      netProfit: totalIncome - totalExpenses,
      pendingReceivables,
      pendingPayables,
      cashBalance: totalIncome - totalExpenses,
      monthlyGrowth: 12.5
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'overdue': return 'error';
      case 'cancelled': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Pago';
      case 'pending': return 'Pendente';
      case 'overdue': return 'Vencido';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'cash': return 'Dinheiro';
      case 'card': return 'Cartão';
      case 'pix': return 'PIX';
      case 'transfer': return 'Transferência';
      case 'check': return 'Cheque';
      default: return method;
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'income' ? 'success' : 'error';
  };

  const getTypeIcon = (type: string) => {
    return type === 'income' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />;
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.reference?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const receivables = transactions.filter(t => t.type === 'income' && t.status !== 'paid');
  const payables = transactions.filter(t => t.type === 'expense' && t.status !== 'paid');

  const handleExportReport = (format: 'csv' | 'pdf') => {
    // Simular exportação
    const data = `Relatório Financeiro - ${reportPeriod}\n\n`;
    const filename = `relatorio_financeiro_${reportPeriod}_${new Date().toISOString().split('T')[0]}.${format}`;
    
    if (format === 'csv') {
      const csvContent = `Data,Descrição,Categoria,Tipo,Valor,Status\n` +
        transactions.map(t => `${t.date.toLocaleDateString()},${t.description},${t.category},${t.type},${t.amount},${t.status}`).join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
    } else {
      // Simular PDF
      alert(`Relatório PDF "${filename}" seria gerado aqui.`);
    }
    setShowExportModal(false);
  };

  const getReportData = () => {
    const now = new Date();
    const startDate = new Date();
    
    switch (reportPeriod) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    return transactions.filter(t => t.date >= startDate);
  };

  const getChartData = () => {
    const data = getReportData();
    const categories = [...new Set(data.map(t => t.category))];
    
    return categories.map(category => {
      const categoryData = data.filter(t => t.category === category);
      const income = categoryData.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const expense = categoryData.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      
      return {
        category,
        income,
        expense,
        net: income - expense
      };
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Financeiro</h1>
        <p className="text-gray-600">Controle financeiro, fluxo de caixa e relatórios</p>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Receita Total</p>
              <p className="text-2xl font-bold text-green-600">R$ {summary.totalIncome.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-green-600">+{summary.monthlyGrowth}%</span>
            <span className="text-gray-600 ml-1">vs mês anterior</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Despesas Totais</p>
              <p className="text-2xl font-bold text-red-600">R$ {summary.totalExpenses.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Lucro Líquido</p>
              <p className={`text-2xl font-bold ${summary.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                R$ {summary.netProfit.toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Saldo em Caixa</p>
              <p className="text-2xl font-bold text-blue-600">R$ {summary.cashBalance.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Wallet className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Contas a Receber</h3>
            <Badge variant="warning">{receivables.length} pendentes</Badge>
          </div>
          <p className="text-2xl font-bold text-green-600">R$ {summary.pendingReceivables.toFixed(2)}</p>
          <p className="text-sm text-gray-600 mt-1">Valor total pendente</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Contas a Pagar</h3>
            <Badge variant="error">{payables.length} pendentes</Badge>
          </div>
          <p className="text-2xl font-bold text-red-600">R$ {summary.pendingPayables.toFixed(2)}</p>
          <p className="text-sm text-gray-600 mt-1">Valor total pendente</p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'overview'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <BarChart3 className="h-4 w-4 inline mr-2" />
          Visão Geral
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'transactions'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Receipt className="h-4 w-4 inline mr-2" />
          Transações
        </button>
        <button
          onClick={() => setActiveTab('receivables')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'receivables'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <TrendingUp className="h-4 w-4 inline mr-2" />
          A Receber
        </button>
        <button
          onClick={() => setActiveTab('payables')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'payables'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <TrendingDown className="h-4 w-4 inline mr-2" />
          A Pagar
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'reports'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FileText className="h-4 w-4 inline mr-2" />
          Relatórios
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
              placeholder="Buscar transações..."
              className="pl-10 w-64"
            />
          </div>

          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="today">Hoje</option>
            <option value="week">Esta semana</option>
            <option value="month">Este mês</option>
            <option value="quarter">Este trimestre</option>
            <option value="year">Este ano</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todas as categorias</option>
            {categories.income.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
            {categories.expense.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="flex space-x-2">
          <Button variant="secondary">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={() => setShowTransactionModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Transação
          </Button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Cash Flow Chart */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Fluxo de Caixa - Últimos 7 dias</h3>
            <div className="space-y-4">
              {cashFlow.map((day, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm font-medium">
                      {day.date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit' })}
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600">R$ {day.income.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrendingDown className="h-4 w-4 text-red-600" />
                        <span className="text-sm text-red-600">R$ {day.expenses.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`font-semibold ${day.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    R$ {day.balance.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Transactions */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Transações Recentes</h3>
            <div className="space-y-3">
              {transactions.slice(0, 5).map(transaction => (
                <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                      {getTypeIcon(transaction.type)}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-gray-600">{transaction.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.type === 'income' ? '+' : '-'}R$ {transaction.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">{transaction.date.toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="space-y-4">
          {filteredTransactions.map(transaction => (
            <Card key={transaction.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                    {getTypeIcon(transaction.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{transaction.description}</h3>
                    <p className="text-sm text-gray-600">{transaction.category}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getStatusColor(transaction.status)}>
                    {getStatusLabel(transaction.status)}
                  </Badge>
                  <Badge variant={getTypeColor(transaction.type)}>
                    {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Valor</p>
                  <p className={`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    R$ {transaction.amount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Data</p>
                  <p className="font-semibold">{transaction.date.toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Método</p>
                  <p className="font-semibold">{getPaymentMethodLabel(transaction.paymentMethod)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Referência</p>
                  <p className="font-semibold">{transaction.reference || '-'}</p>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Detalhes
                </Button>
                <Button size="sm" variant="secondary">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                {transaction.status === 'pending' && (
                  <Button size="sm" variant="secondary">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Marcar Pago
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'receivables' && (
        <div className="space-y-4">
          {receivables.map(transaction => (
            <Card key={transaction.id} className="p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">{transaction.description}</h3>
                  <p className="text-sm text-gray-600">{transaction.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">R$ {transaction.amount.toFixed(2)}</p>
                  <Badge variant={getStatusColor(transaction.status)}>
                    {getStatusLabel(transaction.status)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Vencimento</p>
                  <p className="font-semibold">
                    {transaction.dueDate?.toLocaleDateString() || 'Não definido'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Método</p>
                  <p className="font-semibold">{getPaymentMethodLabel(transaction.paymentMethod)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Referência</p>
                  <p className="font-semibold">{transaction.reference || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Dias em Atraso</p>
                  <p className="font-semibold">
                    {transaction.dueDate ? Math.max(0, Math.floor((Date.now() - transaction.dueDate.getTime()) / (1000 * 60 * 60 * 24))) : 0}
                  </p>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button size="sm">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Marcar Recebido
                </Button>
                <Button size="sm" variant="secondary">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Lembrar
                </Button>
                <Button size="sm" variant="secondary">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'payables' && (
        <div className="space-y-4">
          {payables.map(transaction => (
            <Card key={transaction.id} className={`p-6 border-l-4 ${transaction.status === 'overdue' ? 'border-red-500' : 'border-orange-500'}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">{transaction.description}</h3>
                  <p className="text-sm text-gray-600">{transaction.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-red-600">R$ {transaction.amount.toFixed(2)}</p>
                  <Badge variant={getStatusColor(transaction.status)}>
                    {getStatusLabel(transaction.status)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Vencimento</p>
                  <p className="font-semibold">
                    {transaction.dueDate?.toLocaleDateString() || 'Não definido'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Método</p>
                  <p className="font-semibold">{getPaymentMethodLabel(transaction.paymentMethod)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Referência</p>
                  <p className="font-semibold">{transaction.reference || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Dias em Atraso</p>
                  <p className="font-semibold">
                    {transaction.dueDate ? Math.max(0, Math.floor((Date.now() - transaction.dueDate.getTime()) / (1000 * 60 * 60 * 24))) : 0}
                  </p>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button size="sm">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Marcar Pago
                </Button>
                <Button size="sm" variant="secondary">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button size="sm" variant="secondary">
                  <Calendar className="h-4 w-4 mr-2" />
                  Agendar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Relatórios Avançados</h2>
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
                <option value="cashflow">Fluxo de Caixa</option>
                <option value="revenue">Receitas</option>
                <option value="expenses">Despesas</option>
                <option value="profit">Lucro/Prejuízo</option>
              </select>
              <Button onClick={() => setShowExportModal(true)}>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Resumo por Categoria</h3>
              <div className="space-y-3">
                {getChartData().map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="font-medium">{item.category}</span>
                    <div className="text-right">
                      <div className="text-green-600">+R$ {item.income.toFixed(2)}</div>
                      <div className="text-red-600">-R$ {item.expense.toFixed(2)}</div>
                      <div className={`font-semibold ${item.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {item.net >= 0 ? '+' : ''}R$ {item.net.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Métricas do Período</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Receitas:</span>
                  <span className="font-semibold text-green-600">
                    R$ {getReportData().filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Despesas:</span>
                  <span className="font-semibold text-red-600">
                    R$ {getReportData().filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span>Resultado:</span>
                  <span className={`font-semibold ${getReportData().reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    R$ {getReportData().reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Transações:</span>
                  <span className="font-semibold">{getReportData().length}</span>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Gráfico de Fluxo de Caixa</h3>
            <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Gráfico interativo seria renderizado aqui</p>
                <p className="text-sm text-gray-500">Integração com Chart.js ou Recharts</p>
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

export default FinancialDashboard; 