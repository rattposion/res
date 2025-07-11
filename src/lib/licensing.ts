import { License, Plan, TenantPlan, Subscription, PaymentGateway } from '../types/advanced';

export class LicenseManager {
  private static instance: LicenseManager;
  private currentLicense: License | null = null;
  private licenses: Map<string, License> = new Map();

  static getInstance(): LicenseManager {
    if (!LicenseManager.instance) {
      LicenseManager.instance = new LicenseManager();
    }
    return LicenseManager.instance;
  }

  setLicense(license: License) {
    this.currentLicense = license;
    this.licenses.set(license.tenantId, license);
  }

  getLicense(tenantId: string): License | null {
    return this.licenses.get(tenantId) || null;
  }

  isFeatureEnabled(feature: string): boolean {
    if (!this.currentLicense || this.currentLicense.status !== 'active') {
      return false;
    }

    if (new Date() > this.currentLicense.expiresAt) {
      return false;
    }

    return this.currentLicense.features.includes(feature);
  }

  checkUsageLimit(resource: string, currentUsage: number): boolean {
    if (!this.currentLicense || this.currentLicense.status !== 'active') {
      return false;
    }

    const limit = this.currentLicense.limits[resource];
    return limit ? currentUsage < limit : true;
  }

  getRemainingDays(): number {
    if (!this.currentLicense) return 0;
    
    const now = new Date();
    const expiry = this.currentLicense.expiresAt;
    const diffTime = expiry.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  isExpiringSoon(days: number = 7): boolean {
    return this.getRemainingDays() <= days;
  }

  getUsagePercentage(resource: string, currentUsage: number): number {
    if (!this.currentLicense) return 0;
    
    const limit = this.currentLicense.limits[resource];
    if (!limit || limit === -1) return 0;
    
    return Math.min((currentUsage / limit) * 100, 100);
  }
}

// Subscription plans
export const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfeito para pequenos negócios',
    price: 49.90,
    interval: 'month',
    features: [
      'Até 500 pedidos/mês',
      '2 usuários',
      'PDV básico',
      'Relatórios básicos',
      'Suporte por email',
      'Backup automático'
    ],
    limits: {
      orders: 500,
      users: 2,
      locations: 1,
      menuItems: 100,
      storage: 1,
      integrations: 2
    }
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Para restaurantes em crescimento',
    price: 99.90,
    interval: 'month',
    features: [
      'Até 2.000 pedidos/mês',
      '5 usuários',
      'PDV completo',
      'Delivery integrado',
      'Controle de estoque',
      'Relatórios avançados',
      'Suporte prioritário',
      'White-label básico'
    ],
    limits: {
      orders: 2000,
      users: 5,
      locations: 2,
      menuItems: 500,
      storage: 5,
      integrations: 5
    },
    isPopular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Para grandes operações',
    price: 199.90,
    interval: 'month',
    features: [
      'Pedidos ilimitados',
      'Usuários ilimitados',
      'Múltiplas localizações',
      'White-label completo',
      'API personalizada',
      'Integrações avançadas',
      'Suporte 24/7',
      'Gerente de conta dedicado',
      'Customização completa'
    ],
    limits: {
      orders: -1, // unlimited
      users: -1,
      locations: -1,
      menuItems: -1,
      storage: 50,
      integrations: -1
    }
  }
];

// Payment gateways
export const PAYMENT_GATEWAYS: PaymentGateway[] = [
  {
    id: 'stripe',
    name: 'Stripe',
    type: 'stripe',
    isActive: true,
    credentials: {
      publishableKey: process.env.VITE_STRIPE_PUBLISHABLE_KEY,
      secretKey: process.env.VITE_STRIPE_SECRET_KEY
    },
    settings: {
      webhookUrl: '/api/webhooks/stripe',
      autoCapture: true,
      installments: [1, 2, 3, 6, 12]
    }
  },
  {
    id: 'efi',
    name: 'Efí',
    type: 'efi',
    isActive: true,
    credentials: {
      clientId: process.env.VITE_EFI_CLIENT_ID,
      clientSecret: process.env.VITE_EFI_CLIENT_SECRET
    },
    settings: {
      webhookUrl: '/api/webhooks/efi',
      autoCapture: false,
      installments: [1, 2, 3, 6, 12]
    }
  },
  {
    id: 'asaas',
    name: 'Asaas',
    type: 'asaas',
    isActive: true,
    credentials: {
      apiKey: process.env.VITE_ASAAS_API_KEY
    },
    settings: {
      webhookUrl: '/api/webhooks/asaas',
      autoCapture: true,
      installments: [1, 2, 3, 6, 12]
    }
  }
];

// Subscription management
export class SubscriptionManager {
  private static instance: SubscriptionManager;
  private subscriptions: Map<string, Subscription> = new Map();

  static getInstance(): SubscriptionManager {
    if (!SubscriptionManager.instance) {
      SubscriptionManager.instance = new SubscriptionManager();
    }
    return SubscriptionManager.instance;
  }

  async createSubscription(tenantId: string, planId: string, paymentMethod: any): Promise<Subscription> {
    const plan = PLANS.find(p => p.id === planId);
    if (!plan) {
      throw new Error('Plan not found');
    }

    const subscription: Subscription = {
      id: crypto.randomUUID(),
      tenantId,
      planId,
      status: 'active',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      cancelAtPeriodEnd: false,
      paymentMethod,
      amount: plan.price,
      currency: 'BRL',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.subscriptions.set(tenantId, subscription);
    
    // Process payment
    await this.processPayment(subscription, paymentMethod);
    
    return subscription;
  }

  async cancelSubscription(tenantId: string): Promise<void> {
    const subscription = this.subscriptions.get(tenantId);
    if (!subscription) {
      throw new Error('Subscription not found');
    }

    subscription.status = 'cancelled';
    subscription.cancelAtPeriodEnd = true;
    subscription.updatedAt = new Date();

    // Cancel in payment provider
    await this.cancelPaymentProvider(subscription);
  }

  async updateSubscription(tenantId: string, newPlanId: string): Promise<Subscription> {
    const subscription = this.subscriptions.get(tenantId);
    if (!subscription) {
      throw new Error('Subscription not found');
    }

    const newPlan = PLANS.find(p => p.id === newPlanId);
    if (!newPlan) {
      throw new Error('Plan not found');
    }

    // Update subscription
    subscription.planId = newPlanId;
    subscription.amount = newPlan.price;
    subscription.updatedAt = new Date();

    // Process payment adjustment
    await this.processPaymentAdjustment(subscription, newPlan.price);

    return subscription;
  }

  getSubscription(tenantId: string): Subscription | null {
    return this.subscriptions.get(tenantId) || null;
  }

  isSubscriptionActive(tenantId: string): boolean {
    const subscription = this.subscriptions.get(tenantId);
    return subscription?.status === 'active';
  }

  private async processPayment(subscription: Subscription, paymentMethod: any): Promise<void> {
    // Integrate with payment provider
    console.log('Processing payment for subscription:', subscription.id);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  private async cancelPaymentProvider(subscription: Subscription): Promise<void> {
    // Cancel in payment provider
    console.log('Cancelling subscription in payment provider:', subscription.id);
  }

  private async processPaymentAdjustment(subscription: Subscription, newAmount: number): Promise<void> {
    // Process payment adjustment
    console.log('Processing payment adjustment:', subscription.id, newAmount);
  }
}

// Trial management
export class TrialManager {
  private static instance: TrialManager;
  private trials: Map<string, any> = new Map();

  static getInstance(): TrialManager {
    if (!TrialManager.instance) {
      TrialManager.instance = new TrialManager();
    }
    return TrialManager.instance;
  }

  createTrial(tenantId: string, planId: string, duration: number = 14): any {
    const trial = {
      id: crypto.randomUUID(),
      tenantId,
      planId,
      startDate: new Date(),
      endDate: new Date(Date.now() + duration * 24 * 60 * 60 * 1000),
      status: 'active',
      createdAt: new Date()
    };

    this.trials.set(tenantId, trial);
    return trial;
  }

  isTrialActive(tenantId: string): boolean {
    const trial = this.trials.get(tenantId);
    if (!trial) return false;

    return trial.status === 'active' && new Date() < trial.endDate;
  }

  getTrialDaysRemaining(tenantId: string): number {
    const trial = this.trials.get(tenantId);
    if (!trial || trial.status !== 'active') return 0;

    const now = new Date();
    const endDate = trial.endDate;
    const diffTime = endDate.getTime() - now.getTime();
    
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }

  convertTrialToPaid(tenantId: string, planId: string, paymentMethod: any): Promise<Subscription> {
    const trial = this.trials.get(tenantId);
    if (!trial) {
      throw new Error('Trial not found');
    }

    // End trial
    trial.status = 'converted';
    trial.convertedAt = new Date();

    // Create paid subscription
    return SubscriptionManager.getInstance().createSubscription(tenantId, planId, paymentMethod);
  }
}

// Billing and invoicing
export class BillingManager {
  private static instance: BillingManager;

  static getInstance(): BillingManager {
    if (!BillingManager.instance) {
      BillingManager.instance = new BillingManager();
    }
    return BillingManager.instance;
  }

  async generateInvoice(subscription: Subscription): Promise<string> {
    // Generate invoice PDF
    const invoiceData = {
      id: crypto.randomUUID(),
      subscriptionId: subscription.id,
      tenantId: subscription.tenantId,
      amount: subscription.amount,
      currency: subscription.currency,
      dueDate: subscription.currentPeriodEnd,
      status: 'pending',
      items: [
        {
          description: 'Assinatura RestaurantePRO',
          quantity: 1,
          unitPrice: subscription.amount,
          total: subscription.amount
        }
      ]
    };

    // Generate PDF (simulated)
    console.log('Generating invoice:', invoiceData.id);
    
    return `https://api.restaurantepro.com/invoices/${invoiceData.id}.pdf`;
  }

  async processPayment(invoiceId: string, paymentMethod: any): Promise<boolean> {
    // Process payment
    console.log('Processing payment for invoice:', invoiceId);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return true;
  }

  async sendPaymentReminder(tenantId: string): Promise<void> {
    // Send payment reminder email
    console.log('Sending payment reminder to tenant:', tenantId);
  }
}

// Usage tracking
export class UsageTracker {
  private static instance: UsageTracker;
  private usage: Map<string, Record<string, number>> = new Map();

  static getInstance(): UsageTracker {
    if (!UsageTracker.instance) {
      UsageTracker.instance = new UsageTracker();
    }
    return UsageTracker.instance;
  }

  incrementUsage(tenantId: string, resource: string, amount: number = 1): void {
    if (!this.usage.has(tenantId)) {
      this.usage.set(tenantId, {});
    }

    const tenantUsage = this.usage.get(tenantId)!;
    tenantUsage[resource] = (tenantUsage[resource] || 0) + amount;
  }

  getUsage(tenantId: string, resource: string): number {
    const tenantUsage = this.usage.get(tenantId);
    return tenantUsage?.[resource] || 0;
  }

  getAllUsage(tenantId: string): Record<string, number> {
    return this.usage.get(tenantId) || {};
  }

  resetUsage(tenantId: string, resource?: string): void {
    if (resource) {
      const tenantUsage = this.usage.get(tenantId);
      if (tenantUsage) {
        delete tenantUsage[resource];
      }
    } else {
      this.usage.delete(tenantId);
    }
  }
}