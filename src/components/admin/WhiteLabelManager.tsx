import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  Globe, 
  Image, 
  Settings, 
  Eye, 
  Download,
  Upload,
  Save,
  Undo,
  Check,
  X,
  Copy,
  ExternalLink,
  Layout,
  Type,
  Plus,
  Edit
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';

interface WhiteLabelConfig {
  id: string;
  name: string;
  isActive: boolean;
  branding: {
    name: string;
    logo: string;
    favicon: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontFamily: string;
  };
  domain: {
    customDomain?: string;
    subdomain?: string;
    sslCertificate?: string;
    status: 'pending' | 'active' | 'failed';
  };
  customization: {
    hidePoweredBy: boolean;
    customCSS: string;
    customJS: string;
    footerText: string;
    headerText: string;
  };
  features: {
    customEmail: boolean;
    customSupport: boolean;
    customAnalytics: boolean;
    apiAccess: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const WhiteLabelManager: React.FC = () => {
  const [configs, setConfigs] = useState<WhiteLabelConfig[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<WhiteLabelConfig | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'branding' | 'domain' | 'customization' | 'features'>('branding');

  const [editForm, setEditForm] = useState({
    name: '',
    branding: {
      name: '',
      logo: '',
      favicon: '',
      primaryColor: '#3B82F6',
      secondaryColor: '#1F2937',
      accentColor: '#10B981',
      fontFamily: 'Inter'
    },
    domain: {
      customDomain: '',
      subdomain: '',
      sslCertificate: '',
      status: 'pending' as const
    },
    customization: {
      hidePoweredBy: false,
      customCSS: '',
      customJS: '',
      footerText: '',
      headerText: ''
    },
    features: {
      customEmail: false,
      customSupport: false,
      customAnalytics: false,
      apiAccess: false
    }
  });

  useEffect(() => {
    // Load mock white-label configurations
    const mockConfigs: WhiteLabelConfig[] = [
      {
        id: '1',
        name: 'Pizzaria do João',
        isActive: true,
        branding: {
          name: 'Pizzaria do João',
          logo: 'https://via.placeholder.com/200x80/FF6B35/FFFFFF?text=Pizzaria+do+João',
          favicon: 'https://via.placeholder.com/32x32/FF6B35/FFFFFF?text=P',
          primaryColor: '#FF6B35',
          secondaryColor: '#2C3E50',
          accentColor: '#E74C3C',
          fontFamily: 'Poppins'
        },
        domain: {
          customDomain: 'pizzariadojoao.restaurantepro.com',
          subdomain: 'joao',
          sslCertificate: 'active',
          status: 'active'
        },
        customization: {
          hidePoweredBy: true,
          customCSS: `
            :root {
              --primary-color: #FF6B35;
              --secondary-color: #2C3E50;
              --accent-color: #E74C3C;
            }
            .brand-logo {
              font-family: 'Poppins', sans-serif;
              font-weight: 700;
            }
          `,
          customJS: `
            // Custom JavaScript for Pizzaria do João
            console.log('Pizzaria do João loaded');
          `,
          footerText: '© 2024 Pizzaria do João - Todos os direitos reservados',
          headerText: 'Sistema de Gestão - Pizzaria do João'
        },
        features: {
          customEmail: true,
          customSupport: true,
          customAnalytics: false,
          apiAccess: true
        },
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        name: 'Restaurante Sabor & Arte',
        isActive: true,
        branding: {
          name: 'Sabor & Arte',
          logo: 'https://via.placeholder.com/200x80/8B5CF6/FFFFFF?text=Sabor+%26+Arte',
          favicon: 'https://via.placeholder.com/32x32/8B5CF6/FFFFFF?text=S',
          primaryColor: '#8B5CF6',
          secondaryColor: '#1F2937',
          accentColor: '#F59E0B',
          fontFamily: 'Playfair Display'
        },
        domain: {
          customDomain: 'saborearte.restaurantepro.com',
          subdomain: 'sabor',
          sslCertificate: 'active',
          status: 'active'
        },
        customization: {
          hidePoweredBy: true,
          customCSS: `
            :root {
              --primary-color: #8B5CF6;
              --secondary-color: #1F2937;
              --accent-color: #F59E0B;
            }
            .brand-logo {
              font-family: 'Playfair Display', serif;
              font-weight: 600;
            }
          `,
          customJS: `
            // Custom JavaScript for Sabor & Arte
            console.log('Sabor & Arte loaded');
          `,
          footerText: '© 2024 Sabor & Arte - Gastronomia de qualidade',
          headerText: 'Sistema de Gestão - Sabor & Arte'
        },
        features: {
          customEmail: true,
          customSupport: true,
          customAnalytics: true,
          apiAccess: true
        },
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ];

    setConfigs(mockConfigs);
    if (mockConfigs.length > 0) {
      setSelectedConfig(mockConfigs[0]);
    }
  }, []);

  const handleEdit = (config: WhiteLabelConfig) => {
    setSelectedConfig(config);
    setEditForm({
      name: config.name,
      branding: { ...config.branding },
      domain: { ...config.domain },
      customization: { ...config.customization },
      features: { ...config.features }
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!selectedConfig) return;

    const updatedConfig: WhiteLabelConfig = {
      ...selectedConfig,
      ...editForm,
      updatedAt: new Date()
    };

    setConfigs(prev => prev.map(config => 
      config.id === selectedConfig.id ? updatedConfig : config
    ));
    setSelectedConfig(updatedConfig);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (selectedConfig) {
      setEditForm({
        name: selectedConfig.name,
        branding: { ...selectedConfig.branding },
        domain: { ...selectedConfig.domain },
        customization: { ...selectedConfig.customization },
        features: { ...selectedConfig.features }
      });
    }
  };

  const getDomainStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      default: return 'secondary';
    }
  };

  const getDomainStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'pending': return 'Pendente';
      case 'failed': return 'Falhou';
      default: return status;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">White-Label Manager</h1>
        <p className="text-gray-600">Gerencie configurações de marca personalizada para seus clientes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configurations List */}
        <div className="lg:col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Configurações</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Configuração
            </Button>
          </div>
          
          <div className="space-y-3">
            {configs.map(config => (
              <Card
                key={config.id}
                className={`p-4 cursor-pointer hover:shadow-md transition-shadow ${
                  selectedConfig?.id === config.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedConfig(config)}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{config.name}</h3>
                  <Badge variant={config.isActive ? 'success' : 'secondary'}>
                    {config.isActive ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Domínio:</span>
                    <span className="font-medium">{config.domain.customDomain || config.domain.subdomain}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge variant={getDomainStatusColor(config.domain.status)} size="sm">
                      {getDomainStatusLabel(config.domain.status)}
                    </Badge>
                  </div>
                </div>

                <div className="mt-3 flex space-x-2">
                  <Button size="sm" variant="secondary" onClick={() => handleEdit(config)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Configuration Details */}
        <div className="lg:col-span-2">
          {selectedConfig ? (
            <Card className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold">{selectedConfig.name}</h2>
                  <p className="text-gray-600">Configuração de white-label</p>
                </div>
                <div className="flex space-x-2">
                  {isEditing ? (
                    <>
                      <Button onClick={handleSave}>
                        <Save className="h-4 w-4 mr-2" />
                        Salvar
                      </Button>
                      <Button variant="secondary" onClick={handleCancel}>
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="secondary" onClick={() => setPreviewMode(!previewMode)}>
                        <Eye className="h-4 w-4 mr-2" />
                        {previewMode ? 'Editar' : 'Visualizar'}
                      </Button>
                      <Button variant="secondary">
                        <Download className="h-4 w-4 mr-2" />
                        Exportar
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Tabs */}
              <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('branding')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'branding'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                                     <Palette className="h-4 w-4 inline mr-2" />
                   Marca
                </button>
                <button
                  onClick={() => setActiveTab('domain')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'domain'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Globe className="h-4 w-4 inline mr-2" />
                  Domínio
                </button>
                <button
                  onClick={() => setActiveTab('customization')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'customization'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Settings className="h-4 w-4 inline mr-2" />
                  Customização
                </button>
                <button
                  onClick={() => setActiveTab('features')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'features'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Layout className="h-4 w-4 inline mr-2" />
                  Recursos
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'branding' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome da Marca
                      </label>
                      <Input
                        value={isEditing ? editForm.branding.name : selectedConfig.branding.name}
                        onChange={(e) => isEditing && setEditForm(prev => ({
                          ...prev,
                          branding: { ...prev.branding, name: e.target.value }
                        }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fonte Principal
                      </label>
                      <select
                        value={isEditing ? editForm.branding.fontFamily : selectedConfig.branding.fontFamily}
                        onChange={(e) => isEditing && setEditForm(prev => ({
                          ...prev,
                          branding: { ...prev.branding, fontFamily: e.target.value }
                        }))}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Inter">Inter</option>
                        <option value="Poppins">Poppins</option>
                        <option value="Playfair Display">Playfair Display</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Open Sans">Open Sans</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cor Primária
                      </label>
                      <div className="flex space-x-2">
                        <Input
                          type="color"
                          value={isEditing ? editForm.branding.primaryColor : selectedConfig.branding.primaryColor}
                          onChange={(e) => isEditing && setEditForm(prev => ({
                            ...prev,
                            branding: { ...prev.branding, primaryColor: e.target.value }
                          }))}
                          disabled={!isEditing}
                          className="w-16 h-10"
                        />
                        <Input
                          value={isEditing ? editForm.branding.primaryColor : selectedConfig.branding.primaryColor}
                          onChange={(e) => isEditing && setEditForm(prev => ({
                            ...prev,
                            branding: { ...prev.branding, primaryColor: e.target.value }
                          }))}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cor Secundária
                      </label>
                      <div className="flex space-x-2">
                        <Input
                          type="color"
                          value={isEditing ? editForm.branding.secondaryColor : selectedConfig.branding.secondaryColor}
                          onChange={(e) => isEditing && setEditForm(prev => ({
                            ...prev,
                            branding: { ...prev.branding, secondaryColor: e.target.value }
                          }))}
                          disabled={!isEditing}
                          className="w-16 h-10"
                        />
                        <Input
                          value={isEditing ? editForm.branding.secondaryColor : selectedConfig.branding.secondaryColor}
                          onChange={(e) => isEditing && setEditForm(prev => ({
                            ...prev,
                            branding: { ...prev.branding, secondaryColor: e.target.value }
                          }))}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cor de Destaque
                      </label>
                      <div className="flex space-x-2">
                        <Input
                          type="color"
                          value={isEditing ? editForm.branding.accentColor : selectedConfig.branding.accentColor}
                          onChange={(e) => isEditing && setEditForm(prev => ({
                            ...prev,
                            branding: { ...prev.branding, accentColor: e.target.value }
                          }))}
                          disabled={!isEditing}
                          className="w-16 h-10"
                        />
                        <Input
                          value={isEditing ? editForm.branding.accentColor : selectedConfig.branding.accentColor}
                          onChange={(e) => isEditing && setEditForm(prev => ({
                            ...prev,
                            branding: { ...prev.branding, accentColor: e.target.value }
                          }))}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Logo
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Image className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          {isEditing ? 'Clique para fazer upload' : 'Logo carregado'}
                        </p>
                        {isEditing && (
                          <Button size="sm" className="mt-2">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Logo
                          </Button>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Favicon
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Image className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          {isEditing ? 'Clique para fazer upload' : 'Favicon carregado'}
                        </p>
                        {isEditing && (
                          <Button size="sm" className="mt-2">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Favicon
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'domain' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Domínio Personalizado
                    </label>
                    <Input
                      value={isEditing ? editForm.domain.customDomain : selectedConfig.domain.customDomain || ''}
                      onChange={(e) => isEditing && setEditForm(prev => ({
                        ...prev,
                        domain: { ...prev.domain, customDomain: e.target.value }
                      }))}
                      placeholder="exemplo.com"
                      disabled={!isEditing}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Configure o DNS para apontar para nossos servidores
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subdomínio
                    </label>
                    <Input
                      value={isEditing ? editForm.domain.subdomain : selectedConfig.domain.subdomain || ''}
                      onChange={(e) => isEditing && setEditForm(prev => ({
                        ...prev,
                        domain: { ...prev.domain, subdomain: e.target.value }
                      }))}
                      placeholder="seu-restaurante"
                      disabled={!isEditing}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Seu restaurante ficará disponível em: seu-restaurante.restaurantepro.com
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Status do SSL</h4>
                      <p className="text-sm text-gray-600">Certificado de segurança</p>
                    </div>
                    <Badge variant={getDomainStatusColor(selectedConfig.domain.status)}>
                      {getDomainStatusLabel(selectedConfig.domain.status)}
                    </Badge>
                  </div>
                </div>
              )}

              {activeTab === 'customization' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Texto do Cabeçalho
                      </label>
                      <Input
                        value={isEditing ? editForm.customization.headerText : selectedConfig.customization.headerText}
                        onChange={(e) => isEditing && setEditForm(prev => ({
                          ...prev,
                          customization: { ...prev.customization, headerText: e.target.value }
                        }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Texto do Rodapé
                      </label>
                      <Input
                        value={isEditing ? editForm.customization.footerText : selectedConfig.customization.footerText}
                        onChange={(e) => isEditing && setEditForm(prev => ({
                          ...prev,
                          customization: { ...prev.customization, footerText: e.target.value }
                        }))}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 mb-2">
                      <input
                        type="checkbox"
                        checked={isEditing ? editForm.customization.hidePoweredBy : selectedConfig.customization.hidePoweredBy}
                        onChange={(e) => isEditing && setEditForm(prev => ({
                          ...prev,
                          customization: { ...prev.customization, hidePoweredBy: e.target.checked }
                        }))}
                        disabled={!isEditing}
                        className="rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Ocultar "Powered by RestaurantePRO"
                      </span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CSS Personalizado
                    </label>
                    <textarea
                      value={isEditing ? editForm.customization.customCSS : selectedConfig.customization.customCSS}
                      onChange={(e) => isEditing && setEditForm(prev => ({
                        ...prev,
                        customization: { ...prev.customization, customCSS: e.target.value }
                      }))}
                      disabled={!isEditing}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                      placeholder="/* Seu CSS personalizado aqui */"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      JavaScript Personalizado
                    </label>
                    <textarea
                      value={isEditing ? editForm.customization.customJS : selectedConfig.customization.customJS}
                      onChange={(e) => isEditing && setEditForm(prev => ({
                        ...prev,
                        customization: { ...prev.customization, customJS: e.target.value }
                      }))}
                      disabled={!isEditing}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                      placeholder="// Seu JavaScript personalizado aqui"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'features' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Recursos de Email</h4>
                      <div className="space-y-3">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={isEditing ? editForm.features.customEmail : selectedConfig.features.customEmail}
                            onChange={(e) => isEditing && setEditForm(prev => ({
                              ...prev,
                              features: { ...prev.features, customEmail: e.target.checked }
                            }))}
                            disabled={!isEditing}
                            className="rounded"
                          />
                          <span className="text-sm text-gray-700">Email personalizado</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={isEditing ? editForm.features.customSupport : selectedConfig.features.customSupport}
                            onChange={(e) => isEditing && setEditForm(prev => ({
                              ...prev,
                              features: { ...prev.features, customSupport: e.target.checked }
                            }))}
                            disabled={!isEditing}
                            className="rounded"
                          />
                          <span className="text-sm text-gray-700">Suporte personalizado</span>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Recursos Avançados</h4>
                      <div className="space-y-3">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={isEditing ? editForm.features.customAnalytics : selectedConfig.features.customAnalytics}
                            onChange={(e) => isEditing && setEditForm(prev => ({
                              ...prev,
                              features: { ...prev.features, customAnalytics: e.target.checked }
                            }))}
                            disabled={!isEditing}
                            className="rounded"
                          />
                          <span className="text-sm text-gray-700">Analytics personalizado</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={isEditing ? editForm.features.apiAccess : selectedConfig.features.apiAccess}
                            onChange={(e) => isEditing && setEditForm(prev => ({
                              ...prev,
                              features: { ...prev.features, apiAccess: e.target.checked }
                            }))}
                            disabled={!isEditing}
                            className="rounded"
                          />
                          <span className="text-sm text-gray-700">Acesso à API</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="font-medium mb-4">URLs de Acesso</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium">URL Principal</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">
                            {selectedConfig.domain.customDomain || `${selectedConfig.domain.subdomain}.restaurantepro.com`}
                          </span>
                          <Button size="sm" variant="secondary">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium">URL de Admin</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">
                            admin.{selectedConfig.domain.customDomain || `${selectedConfig.domain.subdomain}.restaurantepro.com`}
                          </span>
                          <Button size="sm" variant="secondary">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ) : (
                         <Card className="p-6 text-center">
               <Palette className="h-12 w-12 text-gray-400 mx-auto mb-4" />
               <h3 className="text-lg font-medium text-gray-900 mb-2">Selecione uma configuração</h3>
               <p className="text-gray-600">Escolha uma configuração de white-label para editar</p>
             </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhiteLabelManager; 