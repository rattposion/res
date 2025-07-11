import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  FileText, 
  Video, 
  Search, 
  Send, 
  Phone, 
  Mail, 
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  Bot,
  User
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';

interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  category: string;
  createdAt: Date;
  updatedAt: Date;
  messages: TicketMessage[];
}

interface TicketMessage {
  id: string;
  content: string;
  isFromUser: boolean;
  timestamp: Date;
  attachments?: string[];
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

interface ChatMessage {
  id: string;
  content: string;
  isFromBot: boolean;
  timestamp: Date;
  suggestions?: string[];
}

const SupportCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tickets' | 'chat' | 'faq' | 'videos'>('tickets');
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    category: '',
    priority: 'medium' as const
  });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewTicket, setShowNewTicket] = useState(false);

  const categories = [
    'PDV / Vendas',
    'Delivery',
    'Estoque',
    'Relatórios',
    'Pagamentos',
    'Configurações',
    'Integrações',
    'Outros'
  ];

  const priorities = [
    { value: 'low', label: 'Baixa', color: 'success' },
    { value: 'medium', label: 'Média', color: 'warning' },
    { value: 'high', label: 'Alta', color: 'error' },
    { value: 'urgent', label: 'Urgente', color: 'error' }
  ];

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'Como cadastrar um novo produto?',
      answer: 'Para cadastrar um novo produto, acesse o menu "Cardápio" e clique em "Adicionar Produto". Preencha as informações necessárias como nome, preço, categoria e descrição.',
      category: 'PDV / Vendas',
      tags: ['produto', 'cadastro', 'cardápio']
    },
    {
      id: '2',
      question: 'Como configurar delivery?',
      answer: 'Acesse "Configurações" > "Delivery" e configure as opções de entrega, taxas e horários de funcionamento.',
      category: 'Delivery',
      tags: ['delivery', 'configuração', 'entrega']
    },
    {
      id: '3',
      question: 'Como gerar relatórios?',
      answer: 'No menu "Relatórios" você pode gerar relatórios de vendas, estoque, financeiro e outros. Selecione o período desejado e clique em "Gerar".',
      category: 'Relatórios',
      tags: ['relatórios', 'vendas', 'financeiro']
    }
  ];

  const videoTutorials = [
    {
      id: '1',
      title: 'Primeiros Passos',
      description: 'Aprenda a configurar seu restaurante no sistema',
      duration: '5:30',
      url: 'https://www.youtube.com/watch?v=example1'
    },
    {
      id: '2',
      title: 'Configurando o PDV',
      description: 'Como configurar e usar o sistema de vendas',
      duration: '8:15',
      url: 'https://www.youtube.com/watch?v=example2'
    },
    {
      id: '3',
      title: 'Gerenciando Estoque',
      description: 'Controle de estoque e alertas',
      duration: '6:45',
      url: 'https://www.youtube.com/watch?v=example3'
    }
  ];

  useEffect(() => {
    // Load mock tickets
    const mockTickets: SupportTicket[] = [
      {
        id: '1',
        subject: 'Problema com impressora',
        description: 'A impressora não está imprimindo os pedidos corretamente',
        priority: 'high',
        status: 'open',
        category: 'PDV / Vendas',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        messages: []
    },
    {
        id: '2',
        subject: 'Dúvida sobre relatórios',
        description: 'Como gerar relatório de vendas por período?',
        priority: 'medium',
        status: 'resolved',
        category: 'Relatórios',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        messages: []
      }
    ];
    setTickets(mockTickets);

    // Initialize chat with welcome message
    setChatMessages([
      {
        id: '1',
        content: 'Olá! Sou o assistente virtual do RestaurantePRO. Como posso ajudá-lo hoje?',
        isFromBot: true,
        timestamp: new Date(),
        suggestions: ['Como cadastrar produto?', 'Problema técnico', 'Configurações', 'Relatórios']
      }
    ]);
  }, []);

  const handleCreateTicket = () => {
    if (!newTicket.subject || !newTicket.description || !newTicket.category) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const ticket: SupportTicket = {
      id: crypto.randomUUID(),
      ...newTicket,
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: []
    };

    setTickets(prev => [ticket, ...prev]);
    setNewTicket({ subject: '', description: '', category: '', priority: 'medium' });
    setShowNewTicket(false);
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      content: chatInput,
      isFromBot: false,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: crypto.randomUUID(),
        content: 'Entendi sua dúvida. Vou direcionar você para a seção apropriada ou criar um ticket de suporte.',
        isFromBot: true,
        timestamp: new Date(),
        suggestions: ['Ver FAQ', 'Criar ticket', 'Falar com humano']
      };
      setChatMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setChatInput(suggestion);
  };

  const getPriorityColor = (priority: string) => {
    const priorityObj = priorities.find(p => p.value === priority);
    return priorityObj?.color || 'secondary';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'warning';
      case 'in_progress': return 'primary';
      case 'resolved': return 'success';
      case 'closed': return 'secondary';
      default: return 'secondary';
    }
  };

  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Central de Suporte</h1>
        <p className="text-gray-600">Encontre ajuda, tire dúvidas e entre em contato conosco</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
          <Phone className="h-8 w-8 text-blue-600 mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Suporte por Telefone</h3>
          <p className="text-sm text-gray-600">0800 123 4567</p>
        </Card>
        <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
          <Mail className="h-8 w-8 text-green-600 mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Email</h3>
          <p className="text-sm text-gray-600">suporte@restaurantepro.com</p>
        </Card>
        <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
          <Clock className="h-8 w-8 text-orange-600 mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Horário</h3>
          <p className="text-sm text-gray-600">Seg-Sex: 8h às 18h</p>
        </Card>
        <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
          <CheckCircle className="h-8 w-8 text-purple-600 mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Status do Sistema</h3>
          <p className="text-sm text-green-600">Todos os sistemas operacionais</p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('tickets')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'tickets'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <MessageCircle className="h-4 w-4 inline mr-2" />
          Tickets
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'chat'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Bot className="h-4 w-4 inline mr-2" />
          Chat
        </button>
        <button
          onClick={() => setActiveTab('faq')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'faq'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FileText className="h-4 w-4 inline mr-2" />
          FAQ
        </button>
                <button
          onClick={() => setActiveTab('videos')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'videos'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Video className="h-4 w-4 inline mr-2" />
          Vídeos
        </button>
      </div>

      {/* Content */}
      {activeTab === 'tickets' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ticket List */}
          <div className="lg:col-span-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Meus Tickets</h2>
              <Button onClick={() => setShowNewTicket(true)}>
                Novo Ticket
              </Button>
            </div>
            
            <div className="space-y-3">
              {tickets.map(ticket => (
                <Card
                  key={ticket.id}
                  className={`p-4 cursor-pointer hover:shadow-md transition-shadow ${
                    selectedTicket?.id === ticket.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">{ticket.subject}</h3>
                    <Badge variant={getPriorityColor(ticket.priority)}>
                      {priorities.find(p => p.value === ticket.priority)?.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{ticket.description}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{ticket.category}</span>
                    <Badge variant={getStatusColor(ticket.status)}>
                      {ticket.status === 'open' ? 'Aberto' : 
                       ticket.status === 'in_progress' ? 'Em Andamento' :
                       ticket.status === 'resolved' ? 'Resolvido' : 'Fechado'}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
        </div>

          {/* Ticket Details */}
          <div className="lg:col-span-2">
            {selectedTicket ? (
              <Card className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">{selectedTicket.subject}</h2>
                    <p className="text-gray-600">{selectedTicket.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant={getPriorityColor(selectedTicket.priority)}>
                      {priorities.find(p => p.value === selectedTicket.priority)?.label}
                    </Badge>
                    <Badge variant={getStatusColor(selectedTicket.status)}>
                      {selectedTicket.status === 'open' ? 'Aberto' : 
                       selectedTicket.status === 'in_progress' ? 'Em Andamento' :
                       selectedTicket.status === 'resolved' ? 'Resolvido' : 'Fechado'}
                    </Badge>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Mensagens</h3>
                  {selectedTicket.messages.length === 0 ? (
                    <p className="text-gray-500">Nenhuma mensagem ainda. O suporte responderá em breve.</p>
                  ) : (
                    <div className="space-y-3">
                      {selectedTicket.messages.map(message => (
                        <div key={message.id} className="flex space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {message.timestamp.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            ) : (
              <Card className="p-6 text-center">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Selecione um ticket</h3>
                <p className="text-gray-600">Escolha um ticket da lista para ver os detalhes</p>
              </Card>
            )}
          </div>
        </div>
      )}

      {activeTab === 'chat' && (
        <div className="max-w-2xl mx-auto">
          <Card className="h-96 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b bg-gray-50 rounded-t-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Assistente Virtual</h3>
                  <p className="text-sm text-gray-600">Online agora</p>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map(message => (
                <div key={message.id} className={`flex ${message.isFromBot ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.isFromBot 
                      ? 'bg-gray-100 text-gray-900' 
                      : 'bg-blue-600 text-white'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    {message.suggestions && (
                      <div className="mt-2 space-y-1">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className={`block w-full text-left text-xs px-2 py-1 rounded ${
                              message.isFromBot 
                                ? 'bg-white text-blue-600 hover:bg-blue-50' 
                                : 'bg-blue-700 text-white hover:bg-blue-800'
                            }`}
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  onKeyPress={(e) => e.key === 'Enter' && handleChatSend()}
                  className="flex-1"
                />
                <Button onClick={handleChatSend}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'faq' && (
        <div>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar nas perguntas frequentes..."
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredFAQs.map(faq => (
              <Card key={faq.id} className="p-6">
                <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                <p className="text-gray-600 mb-3">{faq.answer}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{faq.category}</span>
                  <div className="flex space-x-1">
                    {faq.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'videos' && (
        <div>
          <h2 className="text-xl font-semibold mb-6">Tutoriais em Vídeo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoTutorials.map(video => (
              <Card key={video.id} className="p-4">
                <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <Video className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="font-semibold mb-2">{video.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{video.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">{video.duration}</span>
                  <Button size="sm" variant="secondary">
                    Assistir
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* New Ticket Modal */}
      {showNewTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Novo Ticket</h2>
              <button
                onClick={() => setShowNewTicket(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assunto *
                      </label>
                      <Input
                        value={newTicket.subject}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder="Descreva brevemente o problema"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria *
                      </label>
                      <select
                        value={newTicket.category}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                  <option value="">Selecione uma categoria</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                      </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prioridade
                    </label>
                    <select
                      value={newTicket.priority}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, priority: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                  {priorities.map(priority => (
                    <option key={priority.value} value={priority.value}>{priority.label}</option>
                  ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição *
                    </label>
                    <textarea
                      value={newTicket.description}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva detalhadamente o problema ou dúvida"
                      rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex space-x-3">
                <Button onClick={handleCreateTicket} className="flex-1">
                  Criar Ticket
                </Button>
                <Button variant="secondary" onClick={() => setShowNewTicket(false)}>
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

export default SupportCenter;