import React, { useState } from 'react';
import { X, Eye, EyeOff, Mail, Lock, User, Building, Phone } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';

interface TrialSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignup: (data: TrialSignupData) => void;
  onLogin: () => void;
}

interface TrialSignupData {
  name: string;
  email: string;
  password: string;
  businessName: string;
  phone: string;
}

export const TrialSignupModal: React.FC<TrialSignupModalProps> = ({
  isOpen,
  onClose,
  onSignup,
  onLogin
}) => {
  const [formData, setFormData] = useState<TrialSignupData>({
    name: '',
    email: '',
    password: '',
    businessName: '',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Simular delay de cadastro
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Validação básica
      if (!formData.name || !formData.email || !formData.password || !formData.businessName) {
        setError('Por favor, preencha todos os campos obrigatórios');
        return;
      }

      if (!formData.email.includes('@')) {
        setError('Por favor, insira um email válido');
        return;
      }

      if (formData.password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres');
        return;
      }

      // Simular cadastro bem-sucedido
      onSignup(formData);
    } catch (err) {
      setError('Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof TrialSignupData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Teste Grátis</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">🎉 14 dias grátis</h3>
          <p className="text-blue-700 text-sm">
            Teste todos os recursos do RestaurantePRO por 14 dias sem compromisso. 
            Não é necessário cartão de crédito.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nome Completo *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Seu nome completo"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="seu@email.com"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Negócio *
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="businessName"
                type="text"
                value={formData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                placeholder="Nome do seu restaurante"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Telefone
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="(11) 99999-9999"
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Senha *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Crie uma senha"
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Criando conta...' : 'Começar Teste Grátis'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-4">Já tem uma conta?</p>
          <Button
            variant="secondary"
            onClick={onLogin}
            className="w-full"
          >
            Fazer Login
          </Button>
        </div>

        <div className="mt-4 text-xs text-gray-500 text-center">
          Ao criar uma conta, você concorda com nossos{' '}
          <a href="#" className="text-blue-600 hover:text-blue-800">
            Termos de Serviço
          </a>{' '}
          e{' '}
          <a href="#" className="text-blue-600 hover:text-blue-800">
            Política de Privacidade
          </a>
          .
        </div>
      </Card>
    </div>
  );
}; 