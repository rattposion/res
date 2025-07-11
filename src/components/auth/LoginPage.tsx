import React, { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '../ui';
import { 
  Store, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle,
  AlertCircle,
  Info,
  Zap,
  Shield,
  Globe,
  CreditCard,
  ShoppingCart,
  Truck,
  Smartphone,
  Package
} from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const demoUsers = [
    { email: 'admin@restaurante.com', password: '123456', role: 'Administrador', color: 'bg-red-500' },
    { email: 'gerente@restaurante.com', password: '123456', role: 'Gerente', color: 'bg-blue-500' },
    { email: 'caixa@restaurante.com', password: '123456', role: 'Caixa', color: 'bg-green-500' },
    { email: 'garcom@restaurante.com', password: '123456', role: 'Garçom', color: 'bg-orange-500' }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor, preencha email e senha');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      if (!success) {
        setError('Email ou senha incorretos. Use os dados de demonstração.');
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (demoUser: typeof demoUsers[0]) => {
    setEmail(demoUser.email);
    setPassword(demoUser.password);
    setIsLoading(true);
    setError('');

    try {
      const success = await login(demoUser.email, demoUser.password);
      if (!success) {
        setError('Erro ao fazer login com usuário de demonstração.');
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Login Form */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md p-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Store className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">RestaurantSaaS</h1>
                  <p className="text-gray-600">Sistema de Gestão</p>
                </div>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Bem-vindo de volta</h2>
              <p className="text-gray-600">Faça login para acessar o sistema</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-700">{error}</span>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Usuários de Demonstração</h3>
              <div className="space-y-2">
                {demoUsers.map((user, index) => (
                  <button
                    key={index}
                    onClick={() => handleDemoLogin(user)}
                    disabled={isLoading}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    <div className={`w-8 h-8 ${user.color} rounded-full flex items-center justify-center`}>
                      <span className="text-white text-sm font-medium">
                        {user.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium text-gray-900">{user.role}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </button>
                ))}
              </div>
              
              {/* Debug Button */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                  className="w-full p-2 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                >
                  🔧 Limpar Cache e Recarregar
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Side - Features */}
        <div className="flex items-center justify-center">
          <div className="max-w-md">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Sistema Completo para Restaurantes
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Gerencie todos os aspectos do seu restaurante com uma plataforma integrada e moderna.
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">PDV Completo</h3>
                  <p className="text-gray-600">Sistema de vendas com mesas, comandas e teclado numérico</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Truck className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Delivery Integrado</h3>
                  <p className="text-gray-600">Site para clientes, app para entregadores e rastreamento</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">App do Garçom</h3>
                  <p className="text-gray-600">Aplicativo mobile com QR Code, voz e mapa de mesas</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Gestão Completa</h3>
                  <p className="text-gray-600">Estoque, financeiro, marketing e fiscal integrados</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Info className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Demonstração</span>
              </div>
              <p className="text-sm text-blue-700">
                Use qualquer usuário de demonstração para testar o sistema completo com dados simulados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 