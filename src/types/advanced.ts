// Tipos avançados para funcionalidades SaaS

export interface License {
  id: string;
  tenantId: string;
  key: string;
  status: 'active' | 'expired' | 'suspended' | 'cancelled';
  expiresAt: Date;
  features: string[];
  limits: Record<string, number>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  limits: Record<string, number>;
  isPopular?: boolean;
  isCustom?: boolean;
}

export interface TenantPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  limits: Record<string, number>;
  expiresAt: Date;
  status: 'active' | 'cancelled' | 'past_due' | 'unpaid';
}

export interface TenantTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  logo: string;
  favicon: string;
  customCSS: string;
}

export interface WhiteLabelSettings {
  enabled: boolean;
  customDomain?: string;
  branding: {
    name: string;
    logo: string;
    colors: {
      primary: string;
      secondary: string;
    };
  };
}

export interface TenantSettings {
  theme: TenantTheme;
  features: {
    pos: boolean;
    delivery: boolean;
    inventory: boolean;
    analytics: boolean;
    whiteLabel: boolean;
    api: boolean;
    multiLocation: boolean;
    loyalty: boolean;
    marketing: boolean;
  };
  limits: {
    maxOrders: number;
    maxUsers: number;
    maxLocations: number;
    maxMenuItems: number;
    maxStorageGB: number;
    maxIntegrations: number;
  };
  apiEndpoint?: string;
  whiteLabel: WhiteLabelSettings;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  integrations: {
    paymentGateways: string[];
    deliveryServices: string[];
    accounting: string[];
  };
}

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  domains: string[];
  settings: TenantSettings;
  plan: TenantPlan;
  status: 'active' | 'suspended' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  metadata: Record<string, any>;
}

export interface Subscription {
  id: string;
  tenantId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'past_due' | 'unpaid';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  paymentMethod: {
    type: 'card' | 'pix' | 'boleto';
    last4?: string;
    brand?: string;
  };
  amount: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentGateway {
  id: string;
  name: string;
  type: 'stripe' | 'efi' | 'asaas' | 'mercadopago';
  isActive: boolean;
  credentials: Record<string, any>;
  settings: {
    webhookUrl: string;
    autoCapture: boolean;
    installments: number[];
  };
}

export interface Affiliate {
  id: string;
  name: string;
  email: string;
  code: string;
  commission: number;
  status: 'active' | 'inactive';
  totalEarnings: number;
  referrals: Referral[];
  createdAt: Date;
}

export interface Referral {
  id: string;
  affiliateId: string;
  tenantId: string;
  status: 'pending' | 'active' | 'cancelled';
  commission: number;
  createdAt: Date;
}

export interface AuditLog {
  id: string;
  tenantId: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

export interface Notification {
  id: string;
  tenantId: string;
  userId?: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: Date;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html: string;
  text: string;
  variables: string[];
  isActive: boolean;
  createdAt: Date;
}

export interface EmailCampaign {
  id: string;
  name: string;
  templateId: string;
  recipients: string[];
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled';
  scheduledAt?: Date;
  sentAt?: Date;
  stats: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
  };
  createdAt: Date;
}

export interface SupportTicket {
  id: string;
  tenantId: string;
  userId: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  category: string;
  assignedTo?: string;
  messages: TicketMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  userId: string;
  message: string;
  isInternal: boolean;
  attachments: string[];
  createdAt: Date;
}

export interface Analytics {
  id: string;
  tenantId: string;
  metric: string;
  value: number;
  dimension?: string;
  date: Date;
  metadata: Record<string, any>;
}

export interface Backup {
  id: string;
  tenantId: string;
  type: 'manual' | 'automatic';
  size: number;
  status: 'pending' | 'completed' | 'failed';
  downloadUrl?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface Integration {
  id: string;
  tenantId: string;
  name: string;
  type: 'payment' | 'delivery' | 'accounting' | 'marketing';
  provider: string;
  isActive: boolean;
  credentials: Record<string, any>;
  settings: Record<string, any>;
  lastSync?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Webhook {
  id: string;
  tenantId: string;
  name: string;
  url: string;
  events: string[];
  isActive: boolean;
  secret: string;
  lastTriggered?: Date;
  createdAt: Date;
}

export interface APIKey {
  id: string;
  tenantId: string;
  name: string;
  key: string;
  permissions: string[];
  isActive: boolean;
  lastUsed?: Date;
  createdAt: Date;
}

export interface CustomDomain {
  id: string;
  tenantId: string;
  domain: string;
  status: 'pending' | 'active' | 'failed';
  sslCertificate?: string;
  createdAt: Date;
  activatedAt?: Date;
}

export interface WhiteLabelBranding {
  id: string;
  tenantId: string;
  name: string;
  logo: string;
  favicon: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  customCSS: string;
  isActive: boolean;
  createdAt: Date;
}

export interface TrialAccount {
  id: string;
  email: string;
  name: string;
  businessName: string;
  phone?: string;
  planId: string;
  expiresAt: Date;
  isActive: boolean;
  createdAt: Date;
}

export interface UsageMetrics {
  tenantId: string;
  date: Date;
  orders: number;
  users: number;
  storage: number;
  apiCalls: number;
  integrations: number;
}

export interface BillingCycle {
  id: string;
  tenantId: string;
  startDate: Date;
  endDate: Date;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  invoiceUrl?: string;
  createdAt: Date;
  paidAt?: Date;
}

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  rolloutPercentage: number;
  conditions: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface SystemMetrics {
  totalTenants: number;
  activeTenants: number;
  totalRevenue: number;
  monthlyRecurringRevenue: number;
  churnRate: number;
  averageOrderValue: number;
  systemUptime: number;
  errorRate: number;
  lastUpdated: Date;
}