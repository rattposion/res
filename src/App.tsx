import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import POS from './components/pos/POS';
import TableManager from './components/pos/TableManager';
import DeliveryDashboard from './components/delivery/DeliveryDashboard';
import DeliveryDriverApp from './components/delivery/DeliveryDriverApp';
import InventoryManager from './components/inventory/InventoryManager';
import FinancialDashboard from './components/financial/FinancialDashboard';
import WaiterApp from './components/waiter/WaiterApp';
import MarketingDashboard from './components/marketing/MarketingDashboard';
import FiscalManager from './components/fiscal/FiscalManager';
import SupportCenter from './components/support/SupportCenter';
import AIAnalytics from './components/ai/AIAnalytics';
import WhiteLabelManager from './components/admin/WhiteLabelManager';
import LoginPage from './components/auth/LoginPage';
import { RestaurantProvider } from './contexts/RestaurantContext';
import SecurityManager from './components/security/SecurityManager';
import MultitenancyManager from './components/multitenancy/MultitenancyManager';
import LicensingManager from './components/licensing/LicensingManager';
import IntegrationsManager from './components/integrations/IntegrationsManager';
import IFoodManager from './components/integrations/IFoodManager';
import TEFPOSManager from './components/integrations/TEFPOSManager';
import GoogleMapsManager from './components/integrations/GoogleMapsManager';
import WhatsAppManager from './components/integrations/WhatsAppManager';
import TotemManager from './components/totem/TotemManager';
import { UserProvider } from './contexts/UserContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ToastContainer } from './components/ui/ToastContainer';

function App() {
  return (
    <UserProvider>
      <NotificationProvider>
        <RestaurantProvider>
          <Router>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/dashboard" element={
                <ProtectedRoute permission="dashboard.view">
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* PDV e Pedidos */}
              <Route path="/pos" element={
                <ProtectedRoute permission="pdv.view">
                  <Layout>
                    <POS />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/tables" element={
                <ProtectedRoute permission="pdv.view">
                  <Layout>
                    <TableManager />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Delivery */}
              <Route path="/delivery" element={
                <ProtectedRoute permission="delivery.view">
                  <Layout>
                    <DeliveryDashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/delivery-driver" element={
                <ProtectedRoute permission="delivery.view">
                  <Layout>
                    <DeliveryDriverApp />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Estoque */}
              <Route path="/inventory" element={
                <ProtectedRoute permission="inventory.view">
                  <Layout>
                    <InventoryManager />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Financeiro */}
              <Route path="/financial" element={
                <ProtectedRoute permission="financial.view">
                  <Layout>
                    <FinancialDashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Garçom */}
              <Route path="/waiter" element={
                <ProtectedRoute permission="waiter.view">
                  <Layout>
                    <WaiterApp />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Marketing */}
              <Route path="/marketing" element={
                <ProtectedRoute permission="marketing.view">
                  <Layout>
                    <MarketingDashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Fiscal */}
              <Route path="/fiscal" element={
                <ProtectedRoute permission="fiscal.view">
                  <Layout>
                    <FiscalManager />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Suporte */}
              <Route path="/support" element={
                <ProtectedRoute permission="support.view">
                  <Layout>
                    <SupportCenter />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* IA */}
              <Route path="/ai" element={
                <ProtectedRoute permission="ai.view" roles={['admin']}>
                  <Layout>
                    <AIAnalytics />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* White Label */}
              <Route path="/white-label" element={
                <ProtectedRoute permission="white-label.view" roles={['admin']}>
                  <Layout>
                    <WhiteLabelManager />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Novos módulos */}
              <Route path="/security" element={
                <ProtectedRoute permission="security.view" roles={['admin']}>
                  <Layout>
                    <SecurityManager />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/multitenancy" element={
                <ProtectedRoute permission="multitenancy.view" roles={['admin']}>
                  <Layout>
                    <MultitenancyManager />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/licensing" element={
                <ProtectedRoute permission="licensing.view" roles={['admin']}>
                  <Layout>
                    <LicensingManager />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/integrations" element={
                <ProtectedRoute permission="integrations.view" roles={['admin']}>
                  <Layout>
                    <IntegrationsManager />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/ifood" element={
                <ProtectedRoute permission="integrations.view" roles={['admin']}>
                  <Layout>
                    <IFoodManager />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/tef-pos" element={
                <ProtectedRoute permission="integrations.view" roles={['admin']}>
                  <Layout>
                    <TEFPOSManager />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/google-maps" element={
                <ProtectedRoute permission="integrations.view" roles={['admin']}>
                  <Layout>
                    <GoogleMapsManager />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/whatsapp" element={
                <ProtectedRoute permission="integrations.view" roles={['admin']}>
                  <Layout>
                    <WhatsAppManager />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/totem" element={
                <ProtectedRoute permission="totem.view">
                  <Layout>
                    <TotemManager />
                  </Layout>
                </ProtectedRoute>
              } />
            </Routes>
          </Router>
        </RestaurantProvider>
        <ToastContainer />
      </NotificationProvider>
    </UserProvider>
  );
}

export default App;