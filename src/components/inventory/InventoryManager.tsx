import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingDown,
  TrendingUp,
  BarChart3,
  Download,
  Upload,
  Eye,
  Settings,
  Calculator,
  FileText,
  Scale,
  Clock
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';

interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  price: number;
  cost: number;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  supplier: string;
  lastUpdated: Date;
  status: 'active' | 'inactive' | 'discontinued';
}

interface Ingredient {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  cost: number;
  supplier: string;
  lastUpdated: Date;
  status: 'active' | 'inactive' | 'out_of_stock';
}

interface Recipe {
  id: string;
  productId: string;
  productName: string;
  ingredients: RecipeIngredient[];
  yield: number;
  yieldUnit: string;
  preparationTime: number;
  instructions: string;
  cost: number;
  lastUpdated: Date;
}

interface RecipeIngredient {
  ingredientId: string;
  ingredientName: string;
  quantity: number;
  unit: string;
  cost: number;
}

interface StockMovement {
  id: string;
  type: 'in' | 'out' | 'adjustment' | 'waste';
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  reason: string;
  cost: number;
  date: Date;
  userId: string;
  userName: string;
}

const InventoryManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'ingredients' | 'recipes' | 'movements' | 'alerts' | 'reports'>('products');
  const [reportPeriod, setReportPeriod] = useState<string>('month');
  const [reportType, setReportType] = useState<string>('movements');
  const [showExportModal, setShowExportModal] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showProductModal, setShowProductModal] = useState(false);
  const [showIngredientModal, setShowIngredientModal] = useState(false);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const categories = [
    'Pizzas',
    'Bebidas',
    'Sobremesas',
    'Entradas',
    'Insumos',
    'Embalagens'
  ];

  useEffect(() => {
    // Load mock data
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Pizza Margherita',
        category: 'Pizzas',
        sku: 'PIZ-001',
        price: 35.90,
        cost: 12.50,
        currentStock: 50,
        minStock: 10,
        maxStock: 100,
        unit: 'unidade',
        supplier: 'Fornecedor A',
        lastUpdated: new Date(),
        status: 'active'
      },
      {
        id: '2',
        name: 'Queijo Mussarela',
        category: 'Insumos',
        sku: 'INS-001',
        price: 0,
        cost: 45.00,
        currentStock: 8.5,
        minStock: 5,
        maxStock: 20,
        unit: 'kg',
        supplier: 'Laticínios Silva',
        lastUpdated: new Date(),
        status: 'active'
      },
      {
        id: '3',
        name: 'Refrigerante Coca-Cola',
        category: 'Bebidas',
        sku: 'BEB-001',
        price: 6.90,
        cost: 3.50,
        currentStock: 120,
        minStock: 20,
        maxStock: 200,
        unit: 'unidade',
        supplier: 'Distribuidora ABC',
        lastUpdated: new Date(),
        status: 'active'
      }
    ];

    const mockIngredients: Ingredient[] = [
      {
        id: '1',
        name: 'Farinha de Trigo',
        category: 'Insumos',
        currentStock: 25.5,
        minStock: 10,
        maxStock: 50,
        unit: 'kg',
        cost: 3.50,
        supplier: 'Moinho Central',
        lastUpdated: new Date(),
        status: 'active'
      },
      {
        id: '2',
        name: 'Queijo Mussarela',
        category: 'Insumos',
        currentStock: 8.5,
        minStock: 5,
        maxStock: 20,
        unit: 'kg',
        cost: 45.00,
        supplier: 'Laticínios Silva',
        lastUpdated: new Date(),
        status: 'active'
      },
      {
        id: '3',
        name: 'Tomate',
        category: 'Insumos',
        currentStock: 2.1,
        minStock: 5,
        maxStock: 15,
        unit: 'kg',
        cost: 8.00,
        supplier: 'Hortifruti Verde',
        lastUpdated: new Date(),
        status: 'out_of_stock'
      }
    ];

    const mockRecipes: Recipe[] = [
      {
        id: '1',
        productId: '1',
        productName: 'Pizza Margherita',
        ingredients: [
          {
            ingredientId: '1',
            ingredientName: 'Farinha de Trigo',
            quantity: 0.3,
            unit: 'kg',
            cost: 1.05
          },
          {
            ingredientId: '2',
            ingredientName: 'Queijo Mussarela',
            quantity: 0.15,
            unit: 'kg',
            cost: 6.75
          },
          {
            ingredientId: '3',
            ingredientName: 'Tomate',
            quantity: 0.1,
            unit: 'kg',
            cost: 0.80
          }
        ],
        yield: 1,
        yieldUnit: 'pizza',
        preparationTime: 15,
        instructions: '1. Preparar massa\n2. Adicionar molho\n3. Adicionar queijo\n4. Assar por 15 min',
        cost: 8.60,
        lastUpdated: new Date()
      }
    ];

    const mockMovements: StockMovement[] = [
      {
        id: '1',
        type: 'in',
        productId: '2',
        productName: 'Queijo Mussarela',
        quantity: 5,
        unit: 'kg',
        reason: 'Compra',
        cost: 225.00,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        userId: 'user-1',
        userName: 'João Silva'
      },
      {
        id: '2',
        type: 'out',
        productId: '2',
        productName: 'Queijo Mussarela',
        quantity: 1.5,
        unit: 'kg',
        reason: 'Produção',
        cost: 67.50,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        userId: 'user-1',
        userName: 'João Silva'
      }
    ];

    setProducts(mockProducts);
    setIngredients(mockIngredients);
    setRecipes(mockRecipes);
    setStockMovements(mockMovements);
  }, []);

  const getStockStatus = (current: number, min: number) => {
    if (current <= 0) return { color: 'error', label: 'Sem Estoque' };
    if (current <= min) return { color: 'warning', label: 'Estoque Baixo' };
    return { color: 'success', label: 'OK' };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'secondary';
      case 'discontinued': return 'error';
      case 'out_of_stock': return 'error';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'discontinued': return 'Descontinuado';
      case 'out_of_stock': return 'Sem Estoque';
      default: return status;
    }
  };

  const getMovementTypeColor = (type: string) => {
    switch (type) {
      case 'in': return 'success';
      case 'out': return 'error';
      case 'adjustment': return 'warning';
      case 'waste': return 'error';
      default: return 'secondary';
    }
  };

  const getMovementTypeLabel = (type: string) => {
    switch (type) {
      case 'in': return 'Entrada';
      case 'out': return 'Saída';
      case 'adjustment': return 'Ajuste';
      case 'waste': return 'Perda';
      default: return type;
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredIngredients = ingredients.filter(ingredient => {
    const matchesSearch = ingredient.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || ingredient.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockItems = [...products, ...ingredients].filter(item => 
    item.currentStock <= item.minStock
  );

  const handleExportReport = (format: 'csv' | 'pdf') => {
    const data = `Relatório de Estoque - ${reportPeriod}\n\n`;
    const filename = `relatorio_estoque_${reportPeriod}_${new Date().toISOString().split('T')[0]}.${format}`;
    
    if (format === 'csv') {
      const csvContent = `Data,Produto,Categoria,Tipo,Quantidade,Valor,Responsável\n` +
        stockMovements.map(m => `${m.date.toLocaleDateString()},${m.productName},${m.type},${m.quantity},${m.cost},${m.userName}`).join('\n');
      
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
    
    return stockMovements.filter(m => m.date >= startDate);
  };

  const getInventoryMetrics = () => {
    const totalProducts = products.length;
    const totalIngredients = ingredients.length;
    const lowStockProducts = products.filter(p => p.currentStock <= p.minStock).length;
    const outOfStockIngredients = ingredients.filter(i => i.currentStock === 0).length;
    const totalValue = products.reduce((sum, p) => sum + (p.currentStock * p.cost), 0) +
                      ingredients.reduce((sum, i) => sum + (i.currentStock * i.cost), 0);
    
    return {
      totalProducts,
      totalIngredients,
      lowStockProducts,
      outOfStockIngredients,
      totalValue
    };
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestão de Estoque</h1>
        <p className="text-gray-600">Controle de produtos, ingredientes e fichas técnicas</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Produtos</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ingredientes</p>
              <p className="text-2xl font-bold text-gray-900">{ingredients.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Scale className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Fichas Técnicas</p>
              <p className="text-2xl font-bold text-gray-900">{recipes.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Estoque Baixo</p>
              <p className="text-2xl font-bold text-red-600">{lowStockItems.length}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'products'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Package className="h-4 w-4 inline mr-2" />
          Produtos
        </button>
        <button
          onClick={() => setActiveTab('ingredients')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'ingredients'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Scale className="h-4 w-4 inline mr-2" />
          Insumos
        </button>
        <button
          onClick={() => setActiveTab('recipes')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'recipes'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FileText className="h-4 w-4 inline mr-2" />
          Fichas Técnicas
        </button>
        <button
          onClick={() => setActiveTab('movements')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'movements'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <BarChart3 className="h-4 w-4 inline mr-2" />
          Movimentações
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'alerts'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <AlertTriangle className="h-4 w-4 inline mr-2" />
          Alertas
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
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar..."
              className="pl-10 w-64"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todas as categorias</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="flex space-x-2">
          <Button variant="secondary">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button variant="secondary">
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
          {activeTab === 'products' && (
            <Button onClick={() => setShowProductModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Produto
            </Button>
          )}
          {activeTab === 'ingredients' && (
            <Button onClick={() => setShowIngredientModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Insumo
            </Button>
          )}
          {activeTab === 'recipes' && (
            <Button onClick={() => setShowRecipeModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Ficha Técnica
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          {filteredProducts.map(product => {
            const stockStatus = getStockStatus(product.currentStock, product.minStock);
            return (
              <Card key={product.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatusColor(product.status)}>
                      {getStatusLabel(product.status)}
                    </Badge>
                    <Badge variant={stockStatus.color}>
                      {stockStatus.label}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Estoque Atual</p>
                    <p className="font-semibold">{product.currentStock} {product.unit}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Estoque Mínimo</p>
                    <p className="font-semibold">{product.minStock} {product.unit}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Preço de Venda</p>
                    <p className="font-semibold">R$ {product.price.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Custo</p>
                    <p className="font-semibold">R$ {product.cost.toFixed(2)}</p>
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
                  <Button size="sm" variant="secondary">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Entrada
                  </Button>
                  <Button size="sm" variant="secondary">
                    <TrendingDown className="h-4 w-4 mr-2" />
                    Saída
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {activeTab === 'ingredients' && (
        <div className="space-y-4">
          {filteredIngredients.map(ingredient => {
            const stockStatus = getStockStatus(ingredient.currentStock, ingredient.minStock);
            return (
              <Card key={ingredient.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{ingredient.name}</h3>
                    <p className="text-sm text-gray-600">{ingredient.category}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatusColor(ingredient.status)}>
                      {getStatusLabel(ingredient.status)}
                    </Badge>
                    <Badge variant={stockStatus.color}>
                      {stockStatus.label}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Estoque Atual</p>
                    <p className="font-semibold">{ingredient.currentStock} {ingredient.unit}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Estoque Mínimo</p>
                    <p className="font-semibold">{ingredient.minStock} {ingredient.unit}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Custo Unitário</p>
                    <p className="font-semibold">R$ {ingredient.cost.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fornecedor</p>
                    <p className="font-semibold">{ingredient.supplier}</p>
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
                  <Button size="sm" variant="secondary">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Entrada
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Calculator className="h-4 w-4 mr-2" />
                    Ficha Técnica
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {activeTab === 'recipes' && (
        <div className="space-y-4">
          {recipes.map(recipe => (
            <Card key={recipe.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{recipe.productName}</h3>
                  <p className="text-sm text-gray-600">
                    Rendimento: {recipe.yield} {recipe.yieldUnit} • Tempo: {recipe.preparationTime} min
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Custo Total</p>
                  <p className="font-semibold text-lg">R$ {recipe.cost.toFixed(2)}</p>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium mb-2">Ingredientes</h4>
                <div className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="font-medium">{ingredient.ingredientName}</span>
                      <div className="flex items-center space-x-4">
                        <span>{ingredient.quantity} {ingredient.unit}</span>
                        <span className="text-sm text-gray-600">R$ {ingredient.cost.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
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
                <Button size="sm" variant="secondary">
                  <Calculator className="h-4 w-4 mr-2" />
                  Calcular Custo
                </Button>
                <Button size="sm" variant="secondary">
                  <FileText className="h-4 w-4 mr-2" />
                  Imprimir
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'movements' && (
        <div className="space-y-4">
          {stockMovements.map(movement => (
            <Card key={movement.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{movement.productName}</h3>
                  <p className="text-sm text-gray-600">{movement.reason}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge variant={getMovementTypeColor(movement.type)}>
                      {getMovementTypeLabel(movement.type)}
                    </Badge>
                    <span className="font-semibold">
                      {movement.type === 'in' ? '+' : '-'}{movement.quantity} {movement.unit}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    R$ {movement.cost.toFixed(2)} • {movement.date.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="space-y-4">
          {lowStockItems.map(item => {
            const stockStatus = getStockStatus(item.currentStock, item.minStock);
            return (
              <Card key={item.id} className="p-6 border-l-4 border-red-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.category}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="error">
                      Estoque Baixo
                    </Badge>
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Estoque Atual</p>
                    <p className="font-semibold text-red-600">{item.currentStock} {item.unit}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Estoque Mínimo</p>
                    <p className="font-semibold">{item.minStock} {item.unit}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Diferença</p>
                    <p className="font-semibold text-red-600">
                      {item.currentStock - item.minStock} {item.unit}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex space-x-2">
                  <Button size="sm">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Fazer Pedido
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Edit className="h-4 w-4 mr-2" />
                    Ajustar Estoque
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Relatórios de Estoque</h2>
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
                <option value="movements">Movimentações</option>
                <option value="inventory">Inventário</option>
                <option value="costs">Custos</option>
                <option value="alerts">Alertas</option>
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
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Produtos:</span>
                  <span className="font-semibold">{getInventoryMetrics().totalProducts}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Insumos:</span>
                  <span className="font-semibold">{getInventoryMetrics().totalIngredients}</span>
                </div>
                <div className="flex justify-between">
                  <span>Baixo Estoque:</span>
                  <span className="font-semibold text-orange-600">{getInventoryMetrics().lowStockProducts}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sem Estoque:</span>
                  <span className="font-semibold text-red-600">{getInventoryMetrics().outOfStockIngredients}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span>Valor Total:</span>
                  <span className="font-semibold text-green-600">R$ {getInventoryMetrics().totalValue.toFixed(2)}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Movimentações</h3>
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="space-y-3">
                {getReportData().slice(0, 5).map((movement, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <span className="font-medium text-sm">{movement.productName}</span>
                      <p className="text-xs text-gray-600">{movement.date.toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-medium ${movement.type === 'in' ? 'text-green-600' : 'text-red-600'}`}>
                        {movement.type === 'in' ? '+' : '-'}{movement.quantity} {movement.unit}
                      </span>
                      <p className="text-xs text-gray-600">R$ {movement.cost.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Análise de Custos</h3>
                <Calculator className="h-6 w-6 text-purple-600" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Maior Custo:</span>
                  <span className="font-semibold text-red-600">
                    {ingredients.reduce((max, i) => i.cost > max ? i.cost : max, 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Custo Médio:</span>
                  <span className="font-semibold">
                    R$ {(ingredients.reduce((sum, i) => sum + i.cost, 0) / ingredients.length).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Investido:</span>
                  <span className="font-semibold text-green-600">
                    R$ {ingredients.reduce((sum, i) => sum + (i.currentStock * i.cost), 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Gráfico de Movimentações</h3>
            <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Gráfico de movimentações seria renderizado aqui</p>
                <p className="text-sm text-gray-500">Entradas vs Saídas por período</p>
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

export default InventoryManager; 