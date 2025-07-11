import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Settings,
  RefreshCw,
  ExternalLink,
  DollarSign,
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
  Car,
  Bike,
  Truck,
  Users,
  Package,
  Globe,
  Route,
  Target,
  Compass,
  Calendar,
  Clock3
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface DeliveryRoute {
  id: string;
  driverName: string;
  vehicleType: 'car' | 'bike' | 'truck';
  startLocation: string;
  endLocation: string;
  waypoints: string[];
  totalDistance: number;
  estimatedTime: number;
  actualTime?: number;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  orders: DeliveryOrder[];
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

interface DeliveryOrder {
  id: string;
  customerName: string;
  address: string;
  coordinates: { lat: number; lng: number };
  estimatedDelivery: Date;
  actualDelivery?: Date;
  status: 'pending' | 'picked_up' | 'delivering' | 'delivered' | 'failed';
  notes?: string;
}

interface DeliveryZone {
  id: string;
  name: string;
  center: { lat: number; lng: number };
  radius: number;
  deliveryFee: number;
  estimatedTime: number;
  active: boolean;
  color: string;
}

interface MapsMetrics {
  totalRoutes: number;
  totalDistance: number;
  averageDeliveryTime: number;
  onTimeDeliveries: number;
  totalDeliveries: number;
  topDeliveryAreas: Array<{area: string, deliveries: number, revenue: number}>;
  vehicleStats: Array<{vehicle: string, routes: number, distance: number}>;
}

const GoogleMapsManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'routes' | 'zones' | 'metrics' | 'settings'>('routes');
  const [routes, setRoutes] = useState<DeliveryRoute[]>([]);
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [metrics, setMetrics] = useState<MapsMetrics | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<DeliveryRoute | null>(null);
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showZoneModal, setShowZoneModal] = useState(false);

  useEffect(() => {
    // Mock data for delivery routes
    const mockRoutes: DeliveryRoute[] = [
      {
        id: '1',
        driverName: 'João Silva',
        vehicleType: 'car',
        startLocation: 'Restaurante - Rua das Flores, 123',
        endLocation: 'Av. Paulista, 1000',
        waypoints: ['Rua Augusta, 500', 'Rua Consolação, 800'],
        totalDistance: 8.5,
        estimatedTime: 25,
        actualTime: 28,
        status: 'completed',
        orders: [
          {
            id: '1',
            customerName: 'Maria Santos',
            address: 'Av. Paulista, 1000 - São Paulo, SP',
            coordinates: { lat: -23.5505, lng: -46.6333 },
            estimatedDelivery: new Date(Date.now() - 30 * 60 * 1000),
            actualDelivery: new Date(Date.now() - 25 * 60 * 1000),
            status: 'delivered'
          }
        ],
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        startedAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
      },
      {
        id: '2',
        driverName: 'Pedro Costa',
        vehicleType: 'bike',
        startLocation: 'Restaurante - Rua das Flores, 123',
        endLocation: 'Rua Oscar Freire, 200',
        waypoints: ['Rua Haddock Lobo, 150'],
        totalDistance: 3.2,
        estimatedTime: 15,
        status: 'in_progress',
        orders: [
          {
            id: '2',
            customerName: 'Ana Oliveira',
            address: 'Rua Oscar Freire, 200 - São Paulo, SP',
            coordinates: { lat: -23.5605, lng: -46.6733 },
            estimatedDelivery: new Date(Date.now() + 10 * 60 * 1000),
            status: 'delivering'
          }
        ],
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
        startedAt: new Date(Date.now() - 20 * 60 * 1000)
      },
      {
        id: '3',
        driverName: 'Carlos Lima',
        vehicleType: 'truck',
        startLocation: 'Restaurante - Rua das Flores, 123',
        endLocation: 'Av. Brigadeiro Faria Lima, 1500',
        waypoints: ['Av. Rebouças, 1000', 'Rua Butantã, 500'],
        totalDistance: 12.8,
        estimatedTime: 35,
        status: 'planned',
        orders: [
          {
            id: '3',
            customerName: 'Roberto Santos',
            address: 'Av. Brigadeiro Faria Lima, 1500 - São Paulo, SP',
            coordinates: { lat: -23.5705, lng: -46.6833 },
            estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000),
            status: 'pending'
          }
        ],
        createdAt: new Date(Date.now() - 10 * 60 * 1000)
      }
    ];

    // Mock data for delivery zones
    const mockZones: DeliveryZone[] = [
      {
        id: '1',
        name: 'Zona Central',
        center: { lat: -23.5505, lng: -46.6333 },
        radius: 5000,
        deliveryFee: 5.00,
        estimatedTime: 30,
        active: true,
        color: '#3B82F6'
      },
      {
        id: '2',
        name: 'Zona Norte',
        center: { lat: -23.5605, lng: -46.6733 },
        radius: 3000,
        deliveryFee: 8.00,
        estimatedTime: 45,
        active: true,
        color: '#10B981'
      },
      {
        id: '3',
        name: 'Zona Sul',
        center: { lat: -23.5705, lng: -46.6833 },
        radius: 4000,
        deliveryFee: 6.50,
        estimatedTime: 35,
        active: false,
        color: '#F59E0B'
      }
    ];

    const mockMetrics: MapsMetrics = {
      totalRoutes: 156,
      totalDistance: 1245.8,
      averageDeliveryTime: 28,
      onTimeDeliveries: 142,
      totalDeliveries: 156,
      topDeliveryAreas: [
        { area: 'Zona Central', deliveries: 67, revenue: 2345.50 },
        { area: 'Zona Norte', deliveries: 45, revenue: 1890.30 },
        { area: 'Zona Sul', deliveries: 34, revenue: 1234.80 }
      ],
      vehicleStats: [
        { vehicle: 'Carro', routes: 89, distance: 756.4 },
        { vehicle: 'Moto', routes: 45, distance: 234.2 },
        { vehicle: 'Bicicleta', routes: 22, distance: 255.2 }
      ]
    };

    setRoutes(mockRoutes);
    setZones(mockZones);
    setMetrics(mockMetrics);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <Navigation className="w-5 h-5 text-blue-500" />;
      case 'planned':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500 text-white">Concluída</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-500 text-white">Em Andamento</Badge>;
      case 'planned':
        return <Badge className="bg-yellow-500 text-white">Planejada</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500 text-white">Cancelada</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">Desconhecido</Badge>;
    }
  };

  const getVehicleIcon = (vehicle: string) => {
    switch (vehicle) {
      case 'car':
        return <Car className="w-4 h-4" />;
      case 'bike':
        return <Bike className="w-4 h-4" />;
      case 'truck':
        return <Truck className="w-4 h-4" />;
      default:
        return <Car className="w-4 h-4" />;
    }
  };

  const handleRouteStatusChange = (routeId: string, newStatus: DeliveryRoute['status']) => {
    setRoutes(prev => 
      prev.map(route => 
        route.id === routeId 
          ? { 
              ...route, 
              status: newStatus,
              startedAt: newStatus === 'in_progress' ? new Date() : route.startedAt,
              completedAt: newStatus === 'completed' ? new Date() : route.completedAt
            }
          : route
      )
    );
  };

  const filteredRoutes = routes.filter(route => {
    const matchesSearch = route.driverName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || route.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeZones = zones.filter(z => z.active).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white">
                <MapPin className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Google Maps Manager</h1>
                <p className="text-gray-600">Gerencie rotas, zonas de entrega e geolocalização</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => window.location.reload()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar
              </Button>
              <Button>
                <ExternalLink className="w-4 h-4 mr-2" />
                Abrir Maps
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
                  <p className="text-sm font-medium text-gray-600">Rotas Ativas</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.totalRoutes}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Route className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Distância Total</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.totalDistance.toFixed(1)} km</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Navigation className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.averageDeliveryTime} min</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock3 className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Entregas no Prazo</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.onTimeDeliveries}/{metrics.totalDeliveries}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
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
            { id: 'routes', name: 'Rotas', icon: <Route className="w-4 h-4" /> },
            { id: 'zones', name: 'Zonas', icon: <Target className="w-4 h-4" /> },
            { id: 'metrics', name: 'Métricas', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'settings', name: 'Configurações', icon: <Settings className="w-4 h-4" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === tab.id 
                  ? 'border-green-500 text-green-600' 
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
        {activeTab === 'routes' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar por motorista..."
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
                <option value="planned">Planejada</option>
                <option value="in_progress">Em Andamento</option>
                <option value="completed">Concluída</option>
                <option value="cancelled">Cancelada</option>
              </select>
            </div>

            {/* Routes List */}
            <div className="space-y-4">
              {filteredRoutes.map(route => (
                <Card key={route.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{route.driverName}</h3>
                        <p className="text-sm text-gray-600">Rota #{route.id}</p>
                      </div>
                      {getStatusIcon(route.status)}
                      {getStatusBadge(route.status)}
                      {getVehicleIcon(route.vehicleType)}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{route.totalDistance} km</p>
                      <p className="text-sm text-gray-600">{route.estimatedTime} min</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">De: {route.startLocation}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Para: {route.endLocation}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{route.orders.length} pedidos</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        {route.status === 'planned' && (
                          <Button size="sm" onClick={() => handleRouteStatusChange(route.id, 'in_progress')}>
                            <Navigation className="w-4 h-4 mr-1" />
                            Iniciar Rota
                          </Button>
                        )}
                        {route.status === 'in_progress' && (
                          <Button size="sm" onClick={() => handleRouteStatusChange(route.id, 'completed')}>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Finalizar
                          </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={() => setSelectedRoute(route)}>
                          <Eye className="w-4 h-4 mr-1" />
                          Ver Detalhes
                        </Button>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <MapPin className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'zones' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Zonas de Entrega</h2>
              <Button onClick={() => setShowZoneModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Zona
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {zones.map(zone => (
                <Card key={zone.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{zone.name}</h3>
                      <p className="text-sm text-gray-600">Raio: {zone.radius}m</p>
                    </div>
                    <Badge className={zone.active ? 'bg-green-500' : 'bg-red-500'}>
                      {zone.active ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Taxa de entrega:</span>
                      <span className="text-gray-900">R$ {zone.deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tempo estimado:</span>
                      <span className="text-gray-900">{zone.estimatedTime} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Coordenadas:</span>
                      <span className="text-gray-900">{zone.center.lat.toFixed(4)}, {zone.center.lng.toFixed(4)}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      Ver no Maps
                    </Button>
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
                <h3 className="text-lg font-semibold mb-4">Principais Áreas de Entrega</h3>
                <div className="space-y-3">
                  {metrics.topDeliveryAreas.map((area, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{area.area}</span>
                      <div className="text-right">
                        <span className="font-semibold text-gray-900">{area.deliveries}</span>
                        <span className="text-xs text-gray-500 ml-2">R$ {area.revenue.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Estatísticas por Veículo</h3>
                <div className="space-y-3">
                  {metrics.vehicleStats.map((vehicle, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getVehicleIcon(vehicle.vehicle)}
                        <span className="text-sm text-gray-600">{vehicle.vehicle}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-gray-900">{vehicle.routes}</span>
                        <span className="text-xs text-gray-500 ml-2">{vehicle.distance.toFixed(1)} km</span>
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
              <h3 className="text-lg font-semibold mb-4">Configurações do Google Maps</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    API Key
                  </label>
                  <input
                    type="text"
                    value="AIzaSyB..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Centro Padrão
                  </label>
                  <input
                    type="text"
                    value="-23.5505, -46.6333"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Zoom Padrão
                  </label>
                  <input
                    type="number"
                    value="12"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    readOnly
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="optimizeRoutes" defaultChecked />
                  <label htmlFor="optimizeRoutes" className="text-sm text-gray-700">
                    Otimizar rotas automaticamente
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="realTimeTracking" defaultChecked />
                  <label htmlFor="realTimeTracking" className="text-sm text-gray-700">
                    Rastreamento em tempo real
                  </label>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Route Details Modal */}
      {selectedRoute && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Detalhes da Rota</h3>
              <Button variant="ghost" onClick={() => setSelectedRoute(null)}>
                <XCircle className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Motorista</p>
                  <p className="text-gray-900">{selectedRoute.driverName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Veículo</p>
                  <p className="text-gray-900">{selectedRoute.vehicleType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Distância</p>
                  <p className="text-gray-900">{selectedRoute.totalDistance} km</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Tempo Estimado</p>
                  <p className="text-gray-900">{selectedRoute.estimatedTime} min</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Origem</p>
                  <p className="text-gray-900">{selectedRoute.startLocation}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Destino</p>
                  <p className="text-gray-900">{selectedRoute.endLocation}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Pedidos na Rota</p>
                <div className="space-y-2">
                  {selectedRoute.orders.map(order => (
                    <div key={order.id} className="p-2 bg-gray-50 rounded">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{order.customerName}</span>
                        <Badge className={order.status === 'delivered' ? 'bg-green-500' : 'bg-yellow-500'}>
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">{order.address}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600">Criada em</p>
                <p className="text-gray-900">{selectedRoute.createdAt.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleMapsManager; 