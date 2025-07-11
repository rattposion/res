import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Modal, Badge } from '../ui';
import { 
  QrCode, 
  Mic, 
  MicOff, 
  Trophy, 
  MessageSquare, 
  Users, 
  TrendingUp,
  Clock,
  Star
} from 'lucide-react';

// Tipos para funcionalidades avançadas
interface WaiterRanking {
  id: string;
  name: string;
  orders: number;
  sales: number;
  rating: number;
  avgTime: number;
}

interface ChatMessage {
  id: string;
  from: string;
  to: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'order' | 'alert';
}

interface VoiceCommand {
  command: string;
  action: string;
  example: string;
}

const WaiterAdvancedFeatures: React.FC = () => {
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showVoiceRecognition, setShowVoiceRecognition] = useState(false);
  const [showRanking, setShowRanking] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState<'kitchen' | 'cashier' | 'manager'>('kitchen');

  // Dados mockados
  const mockRanking: WaiterRanking[] = [
    { id: '1', name: 'João Silva', orders: 45, sales: 1250.50, rating: 4.8, avgTime: 12 },
    { id: '2', name: 'Maria Santos', orders: 38, sales: 980.30, rating: 4.6, avgTime: 15 },
    { id: '3', name: 'Pedro Costa', orders: 32, sales: 890.20, rating: 4.4, avgTime: 18 },
  ];

  const voiceCommands: VoiceCommand[] = [
    { command: 'pizza', action: 'Adicionar pizza ao pedido', example: '1 pizza grande calabresa' },
    { command: 'bebida', action: 'Adicionar bebida', example: '2 coca cola' },
    { command: 'mesa', action: 'Abrir comanda', example: 'abrir mesa 5' },
    { command: 'fechar', action: 'Fechar comanda', example: 'fechar mesa 3' },
  ];

  // Simular reconhecimento de voz
  const startVoiceRecognition = () => {
    setIsListening(true);
    setVoiceText('Ouvindo...');
    
    // Simular comandos de voz
    setTimeout(() => {
      const commands = [
        '1 pizza grande calabresa sem cebola',
        '2 coca cola gelada',
        'abrir mesa 7',
        'fechar mesa 2'
      ];
      const randomCommand = commands[Math.floor(Math.random() * commands.length)];
      setVoiceText(randomCommand);
      setIsListening(false);
    }, 3000);
  };

  // Simular QR Code
  const handleQRScan = (data: string) => {
    // Simular dados do QR Code da mesa
    const tableData = {
      tableId: '7',
      tableNumber: 7,
      sector: 'Salão'
    };
    
    alert(`QR Code escaneado! Mesa ${tableData.tableNumber} - ${tableData.sector}`);
    setShowQRScanner(false);
  };

  // Enviar mensagem no chat
  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      from: 'João Silva',
      to: selectedChat,
      message: newMessage,
      timestamp: new Date(),
      type: 'text'
    };

    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  // Simular mensagens automáticas
  useEffect(() => {
    const interval = setInterval(() => {
      if (showChat && Math.random() > 0.7) {
        const autoMessages = [
          { from: 'Cozinha', message: 'Pedido mesa 5 pronto!' },
          { from: 'Caixa', message: 'Conta mesa 3 solicitada' },
          { from: 'Gerente', message: 'Verificar mesa 8' }
        ];
        
        const randomMsg = autoMessages[Math.floor(Math.random() * autoMessages.length)];
        const message: ChatMessage = {
          id: Date.now().toString(),
          from: randomMsg.from,
          to: 'waiter',
          message: randomMsg.message,
          timestamp: new Date(),
          type: 'alert'
        };
        
        setChatMessages(prev => [...prev, message]);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [showChat]);

  return (
    <div className="space-y-4">
      {/* Botões de funcionalidades avançadas */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={() => setShowQRScanner(true)}
          className="bg-blue-500 hover:bg-blue-600"
        >
          <QrCode className="w-4 h-4 mr-2" />
          QR Code
        </Button>
        
        <Button
          onClick={() => setShowVoiceRecognition(true)}
          className="bg-green-500 hover:bg-green-600"
        >
          <Mic className="w-4 h-4 mr-2" />
          Voz
        </Button>
        
        <Button
          onClick={() => setShowRanking(true)}
          className="bg-yellow-500 hover:bg-yellow-600"
        >
          <Trophy className="w-4 h-4 mr-2" />
          Ranking
        </Button>
        
        <Button
          onClick={() => setShowChat(true)}
          className="bg-purple-500 hover:bg-purple-600"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Chat
        </Button>
      </div>

      {/* Modal - Scanner QR Code */}
      {showQRScanner && (
        <Modal
          isOpen={showQRScanner}
          onClose={() => setShowQRScanner(false)}
          title="Scanner QR Code"
        >
          <div className="space-y-4">
            <div className="bg-gray-100 p-8 rounded-lg text-center">
              <QrCode className="w-32 h-32 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Posicione o QR Code da mesa na câmera</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-600">QR Codes de teste:</p>
              <div className="space-y-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleQRScan('table:1:salao')}
                  className="w-full justify-start"
                >
                  Mesa 1 - Salão
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleQRScan('table:5:varanda')}
                  className="w-full justify-start"
                >
                  Mesa 5 - Varanda
                </Button>
              </div>
            </div>
            
            <Button
              onClick={() => setShowQRScanner(false)}
              className="w-full"
            >
              Fechar
            </Button>
          </div>
        </Modal>
      )}

      {/* Modal - Reconhecimento de Voz */}
      {showVoiceRecognition && (
        <Modal
          isOpen={showVoiceRecognition}
          onClose={() => setShowVoiceRecognition(false)}
          title="Reconhecimento de Voz"
        >
          <div className="space-y-4">
            <div className="bg-gray-100 p-6 rounded-lg text-center">
              {isListening ? (
                <div className="space-y-4">
                  <Mic className="w-16 h-16 mx-auto text-red-500 animate-pulse" />
                  <p className="text-red-600 font-medium">Ouvindo...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Mic className="w-16 h-16 mx-auto text-gray-400" />
                  <p className="text-gray-600">Clique para falar</p>
                </div>
              )}
              
              {voiceText && (
                <div className="bg-white p-3 rounded border">
                  <p className="text-sm font-medium">Comando reconhecido:</p>
                  <p className="text-gray-700">{voiceText}</p>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Comandos disponíveis:</p>
              <div className="space-y-1">
                {voiceCommands.map((cmd, index) => (
                  <div key={index} className="text-xs bg-gray-50 p-2 rounded">
                    <p className="font-medium">{cmd.action}</p>
                    <p className="text-gray-600">Ex: "{cmd.example}"</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                onClick={startVoiceRecognition}
                disabled={isListening}
                className="flex-1 bg-green-500 hover:bg-green-600"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                {isListening ? 'Parar' : 'Falar'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowVoiceRecognition(false)}
              >
                Fechar
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal - Ranking */}
      {showRanking && (
        <Modal
          isOpen={showRanking}
          onClose={() => setShowRanking(false)}
          title="Ranking de Garçons"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div className="bg-blue-50 p-3 rounded">
                <p className="font-medium text-blue-800">Pedidos</p>
                <p className="text-2xl font-bold text-blue-600">115</p>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <p className="font-medium text-green-800">Vendas</p>
                <p className="text-2xl font-bold text-green-600">R$ 3.120</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded">
                <p className="font-medium text-yellow-800">Avaliação</p>
                <p className="text-2xl font-bold text-yellow-600">4.6</p>
              </div>
            </div>
            
            <div className="space-y-2">
              {mockRanking.map((waiter, index) => (
                <Card key={waiter.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-gray-400' :
                        'bg-orange-500'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold">{waiter.name}</h4>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm text-gray-600">{waiter.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold text-green-600">R$ {waiter.sales.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">{waiter.orders} pedidos</p>
                      <p className="text-xs text-gray-400">{waiter.avgTime}min médio</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            <Button
              onClick={() => setShowRanking(false)}
              className="w-full"
            >
              Fechar
            </Button>
          </div>
        </Modal>
      )}

      {/* Modal - Chat Interno */}
      {showChat && (
        <Modal
          isOpen={showChat}
          onClose={() => setShowChat(false)}
          title="Chat Interno"
          size="lg"
        >
          <div className="space-y-4 h-96 flex flex-col">
            {/* Seleção de chat */}
            <div className="flex space-x-2">
              <Button
                variant={selectedChat === 'kitchen' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedChat('kitchen')}
              >
                Cozinha
              </Button>
              <Button
                variant={selectedChat === 'cashier' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedChat('cashier')}
              >
                Caixa
              </Button>
              <Button
                variant={selectedChat === 'manager' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedChat('manager')}
              >
                Gerente
              </Button>
            </div>
            
            {/* Mensagens */}
            <div className="flex-1 bg-gray-50 rounded-lg p-4 overflow-y-auto space-y-2">
              {chatMessages
                .filter(msg => msg.to === selectedChat || msg.from === selectedChat)
                .map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.from === 'João Silva' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs p-3 rounded-lg ${
                      message.from === 'João Silva' 
                        ? 'bg-blue-500 text-white' 
                        : message.type === 'alert'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-white text-gray-800'
                    }`}>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs font-medium">{message.from}</span>
                        <span className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm">{message.message}</p>
                    </div>
                  </div>
                ))}
            </div>
            
            {/* Input de mensagem */}
            <div className="flex space-x-2">
              <Input
                placeholder="Digite sua mensagem..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
              >
                Enviar
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default WaiterAdvancedFeatures; 