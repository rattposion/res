import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Lightbulb,
  BarChart3,
  Activity,
  Target,
  Zap,
  MessageSquare,
  Star,
  Clock,
  DollarSign,
  Users,
  Package,
  Send
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';

interface AIInsight {
  id: string;
  type: 'sales_prediction' | 'product_recommendation' | 'inventory_alert' | 'customer_behavior' | 'revenue_optimization';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  data: Record<string, any>;
  createdAt: Date;
  isRead: boolean;
}

interface SalesPrediction {
  date: Date;
  predictedSales: number;
  actualSales?: number;
  confidence: number;
}

interface ProductRecommendation {
  productId: string;
  productName: string;
  recommendation: string;
  expectedImpact: number;
  confidence: number;
}

interface CustomerSegment {
  id: string;
  name: string;
  size: number;
  avgOrderValue: number;
  frequency: number;
  lifetimeValue: number;
  churnRisk: number;
}

const AIAnalytics: React.FC = () => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [salesPredictions, setSalesPredictions] = useState<SalesPrediction[]>([]);
  const [productRecommendations, setProductRecommendations] = useState<ProductRecommendation[]>([]);
  const [customerSegments, setCustomerSegments] = useState<CustomerSegment[]>([]);
  const [activeTab, setActiveTab] = useState<'insights' | 'predictions' | 'recommendations' | 'segments' | 'chat'>('insights');

  useEffect(() => {
    // Load mock AI insights
    const mockInsights: AIInsight[] = [
      {
        id: '1',
        type: 'sales_prediction',
        title: 'Pico de vendas previsto para sexta-feira',
        description: 'Com base no histórico de vendas e eventos locais, esperamos um aumento de 35% nas vendas na próxima sexta-feira. Recomendamos aumentar o estoque de produtos populares.',
        confidence: 87,
        actionable: true,
        priority: 'high',
        data: { predictedIncrease: 35, recommendedStock: ['pizza_margherita', 'refrigerante'] },
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isRead: false
      },
      {
        id: '2',
        type: 'product_recommendation',
        title: 'Oportunidade de upsell identificada',
        description: 'Clientes que pedem pizza margherita têm 68% de probabilidade de adicionar refrigerante. Considere criar um combo promocional.',
        confidence: 92,
        actionable: true,
        priority: 'medium',
        data: { product: 'pizza_margherita', upsellProduct: 'refrigerante', probability: 68 },
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        isRead: true
      },
      {
        id: '3',
        type: 'inventory_alert',
        title: 'Estoque baixo detectado',
        description: 'Queijo mussarela está com estoque baixo (8kg restantes). Com o volume atual de vendas, pode acabar em 2 dias.',
        confidence: 95,
        actionable: true,
        priority: 'critical',
        data: { product: 'queijo_mussarela', currentStock: 8, daysUntilEmpty: 2 },
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        isRead: false
      },
      {
        id: '4',
        type: 'customer_behavior',
        title: 'Padrão de pedidos identificado',
        description: 'Clientes que pedem às sextas-feiras entre 18h-20h preferem pizzas grandes. Considere ajustar a produção.',
        confidence: 78,
        actionable: true,
        priority: 'medium',
        data: { dayOfWeek: 'friday', timeRange: '18:00-20:00', preference: 'large_pizzas' },
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        isRead: true
      },
      {
        id: '5',
        type: 'revenue_optimization',
        title: 'Oportunidade de otimização de preços',
        description: 'Análise mostra que pizzas médias podem ter preço aumentado em 8% sem impacto significativo na demanda.',
        confidence: 85,
        actionable: true,
        priority: 'high',
        data: { productCategory: 'medium_pizzas', suggestedIncrease: 8, demandImpact: 'low' },
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
        isRead: false
      }
    ];

    const mockPredictions: SalesPrediction[] = [
      { date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), predictedSales: 1250, confidence: 87 },
      { date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), predictedSales: 1180, confidence: 82 },
      { date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), predictedSales: 1320, confidence: 89 },
      { date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), predictedSales: 1450, confidence: 91 },
      { date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), predictedSales: 1380, confidence: 85 }
    ];

    const mockRecommendations: ProductRecommendation[] = [
      {
        productId: '1',
        productName: 'Pizza Margherita',
        recommendation: 'Aumentar preço em 5% - baixo impacto na demanda',
        expectedImpact: 12.5,
        confidence: 85
      },
      {
        productId: '2',
        productName: 'Refrigerante',
        recommendation: 'Criar combo com pizza - aumenta ticket médio',
        expectedImpact: 18.3,
        confidence: 92
      },
      {
        productId: '3',
        productName: 'Pizza Quatro Queijos',
        recommendation: 'Promover aos clientes que pedem margherita',
        expectedImpact: 15.7,
        confidence: 78
      }
    ];

    const mockSegments: CustomerSegment[] = [
      {
        id: '1',
        name: 'Clientes VIP',
        size: 45,
        avgOrderValue: 89.50,
        frequency: 3.2,
        lifetimeValue: 1250.00,
        churnRisk: 0.05
      },
      {
        id: '2',
        name: 'Clientes Regulares',
        size: 120,
        avgOrderValue: 45.30,
        frequency: 1.8,
        lifetimeValue: 680.00,
        churnRisk: 0.12
      },
      {
        id: '3',
        name: 'Clientes Ocasionais',
        size: 280,
        avgOrderValue: 32.10,
        frequency: 0.6,
        lifetimeValue: 190.00,
        churnRisk: 0.35
      }
    ];

    setInsights(mockInsights);
    setSalesPredictions(mockPredictions);
    setProductRecommendations(mockRecommendations);
    setCustomerSegments(mockSegments);
  }, []);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'sales_prediction': return <TrendingUp className="h-5 w-5" />;
      case 'product_recommendation': return <Lightbulb className="h-5 w-5" />;
      case 'inventory_alert': return <AlertTriangle className="h-5 w-5" />;
      case 'customer_behavior': return <Users className="h-5 w-5" />;
      case 'revenue_optimization': return <DollarSign className="h-5 w-5" />;
      default: return <Brain className="h-5 w-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      case 'critical': return 'error';
      default: return 'secondary';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'success';
    if (confidence >= 75) return 'warning';
    return 'error';
  };

  const markAsRead = (insightId: string) => {
    setInsights(prev => prev.map(insight => 
      insight.id === insightId ? { ...insight, isRead: true } : insight
    ));
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">IA Analytics</h1>
        <p className="text-gray-600">Insights inteligentes e recomendações baseadas em IA</p>
      </div>

      {/* AI Status */}
      <Card className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">IA Ativa</h3>
              <p className="text-sm text-gray-600">Analisando dados em tempo real</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Última atualização</p>
            <p className="font-semibold">{new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('insights')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'insights'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Lightbulb className="h-4 w-4 inline mr-2" />
          Insights
        </button>
        <button
          onClick={() => setActiveTab('predictions')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'predictions'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <TrendingUp className="h-4 w-4 inline mr-2" />
          Previsões
        </button>
        <button
          onClick={() => setActiveTab('recommendations')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'recommendations'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Target className="h-4 w-4 inline mr-2" />
          Recomendações
        </button>
        <button
          onClick={() => setActiveTab('segments')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'segments'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Users className="h-4 w-4 inline mr-2" />
          Segmentos
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'chat'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <MessageSquare className="h-4 w-4 inline mr-2" />
          Chat IA
        </button>
      </div>

      {/* Content */}
      {activeTab === 'insights' && (
        <div className="space-y-4">
          {insights.map(insight => (
            <Card key={insight.id} className={`p-6 ${!insight.isRead ? 'ring-2 ring-blue-500' : ''}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    {getInsightIcon(insight.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-lg">{insight.title}</h3>
                      <Badge variant={getPriorityColor(insight.priority)}>
                        {insight.priority === 'critical' ? 'Crítico' : 
                         insight.priority === 'high' ? 'Alto' :
                         insight.priority === 'medium' ? 'Médio' : 'Baixo'}
                      </Badge>
                      <Badge variant={getConfidenceColor(insight.confidence)}>
                        {insight.confidence}% confiança
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{insight.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{insight.createdAt.toLocaleDateString()}</span>
                      {insight.actionable && (
                        <span className="flex items-center">
                          <Zap className="h-4 w-4 mr-1" />
                          Ação recomendada
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {!insight.isRead && (
                    <Button size="sm" variant="secondary" onClick={() => markAsRead(insight.id)}>
                      Marcar como lido
                    </Button>
                  )}
                  <Button size="sm" variant="secondary">
                    Ver detalhes
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'predictions' && (
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Previsão de Vendas (Próximos 5 dias)</h3>
              <div className="space-y-3">
                {salesPredictions.map((prediction, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{prediction.date.toLocaleDateString()}</p>
                      <p className="text-sm text-gray-600">
                        Confiança: {prediction.confidence}%
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg">
                        R$ {prediction.predictedSales.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">Vendas previstas</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Tendências de Demanda</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Pizzas grandes</span>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="font-semibold text-green-600">+15%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Refrigerantes</span>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="font-semibold text-green-600">+8%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Sobremesas</span>
                  <div className="flex items-center space-x-2">
                    <TrendingDown className="h-4 w-4 text-red-500" />
                    <span className="font-semibold text-red-600">-3%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'recommendations' && (
        <div className="space-y-4">
          {productRecommendations.map(recommendation => (
            <Card key={recommendation.productId} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{recommendation.productName}</h3>
                  <p className="text-gray-600">{recommendation.recommendation}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">
                    +{recommendation.expectedImpact}%
                  </p>
                  <p className="text-sm text-gray-600">Impacto esperado</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant={getConfidenceColor(recommendation.confidence)}>
                    {recommendation.confidence}% confiança
                  </Badge>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="secondary">
                    Ver análise
                  </Button>
                  <Button size="sm">
                    Aplicar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'segments' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {customerSegments.map(segment => (
            <Card key={segment.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">{segment.name}</h3>
                <Badge variant={segment.churnRisk > 0.2 ? 'error' : 'success'}>
                  {segment.churnRisk > 0.2 ? 'Alto risco' : 'Baixo risco'}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tamanho:</span>
                  <span className="font-semibold">{segment.size} clientes</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ticket médio:</span>
                  <span className="font-semibold">R$ {segment.avgOrderValue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Frequência:</span>
                  <span className="font-semibold">{segment.frequency} pedidos/mês</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">LTV:</span>
                  <span className="font-semibold">R$ {segment.lifetimeValue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Risco de churn:</span>
                  <span className="font-semibold">{(segment.churnRisk * 100).toFixed(1)}%</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <h4 className="font-medium mb-2">Recomendações para {segment.name}</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {segment.name === 'Clientes VIP' && (
                    <>
                      <li>• Programa de fidelidade exclusivo</li>
                      <li>• Atendimento prioritário</li>
                      <li>• Produtos premium</li>
                    </>
                  )}
                  {segment.name === 'Clientes Regulares' && (
                    <>
                      <li>• Promoções personalizadas</li>
                      <li>• Upsell de produtos</li>
                      <li>• Programa de pontos</li>
                    </>
                  )}
                  {segment.name === 'Clientes Ocasionais' && (
                    <>
                      <li>• Campanhas de reativação</li>
                      <li>• Ofertas especiais</li>
                      <li>• Melhorar experiência</li>
                    </>
                  )}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'chat' && (
        <div className="max-w-2xl mx-auto">
          <Card className="h-96 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Brain className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Assistente IA</h3>
                  <p className="text-sm text-gray-600">Analista de dados inteligente</p>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="flex justify-start">
                <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-blue-100 text-gray-900">
                  <p className="text-sm">
                    Olá! Sou seu assistente de IA. Posso ajudar com análises de dados, 
                    previsões de vendas, otimizações de estoque e muito mais. 
                    O que você gostaria de saber?
                  </p>
                </div>
              </div>
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  placeholder="Pergunte sobre seus dados..."
                  className="flex-1"
                />
                <Button>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <Button size="sm" variant="secondary">
                  Como aumentar vendas?
                </Button>
                <Button size="sm" variant="secondary">
                  Previsão de estoque
                </Button>
                <Button size="sm" variant="secondary">
                  Análise de clientes
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AIAnalytics; 