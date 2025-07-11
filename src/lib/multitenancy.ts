import { Tenant, TenantSettings, TenantPlan } from '../types/advanced';

// Tenant context management
export class TenantManager {
  private static instance: TenantManager;
  private currentTenant: Tenant | null = null;
  private tenants: Map<string, Tenant> = new Map();

  static getInstance(): TenantManager {
    if (!TenantManager.instance) {
      TenantManager.instance = new TenantManager();
    }
    return TenantManager.instance;
  }

  setTenant(tenant: Tenant) {
    this.currentTenant = tenant;
    this.tenants.set(tenant.id, tenant);
    
    // Apply tenant-specific configurations
    this.applyTenantTheme(tenant.settings);
    this.setupTenantContext(tenant);
  }

  getCurrentTenant(): Tenant | null {
    return this.currentTenant;
  }

  getTenantId(): string | null {
    return this.currentTenant?.id || null;
  }

  getTenantByDomain(domain: string): Tenant | null {
    for (const tenant of this.tenants.values()) {
      if (tenant.domains.includes(domain)) {
        return tenant;
      }
    }
    return null;
  }

  private applyTenantTheme(settings: TenantSettings) {
    const root = document.documentElement;
    
    // Apply CSS custom properties
    root.style.setProperty('--primary-color', settings.theme.primaryColor);
    root.style.setProperty('--secondary-color', settings.theme.secondaryColor);
    root.style.setProperty('--accent-color', settings.theme.accentColor);
    root.style.setProperty('--font-family', settings.theme.fontFamily);
    
    // Update favicon
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (favicon && settings.theme.favicon) {
      favicon.href = settings.theme.favicon;
    }

    // Update title and meta
    if (settings.theme.logo) {
      document.title = `${this.currentTenant?.name} - RestaurantePRO`;
    }

    // Apply custom CSS
    this.applyCustomCSS(settings.theme.customCSS);
  }

  private applyCustomCSS(customCSS: string) {
    let styleElement = document.getElementById('tenant-custom-css');
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'tenant-custom-css';
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = customCSS;
  }

  private setupTenantContext(tenant: Tenant) {
    // Set tenant context in localStorage
    localStorage.setItem('current-tenant-id', tenant.id);
    localStorage.setItem('tenant-settings', JSON.stringify(tenant.settings));
    
    // Set up tenant-specific API endpoints
    this.setupTenantAPI(tenant);
  }

  private setupTenantAPI(tenant: Tenant) {
    // Configure API base URL for tenant
    const apiBaseUrl = tenant.settings.apiEndpoint || `/api/tenants/${tenant.id}`;
    window.__TENANT_API_BASE__ = apiBaseUrl;
  }

  hasFeature(feature: keyof TenantSettings['features']): boolean {
    return this.currentTenant?.settings.features[feature] || false;
  }

  checkLimit(resource: string, current: number): boolean {
    const limits = this.currentTenant?.settings.limits;
    if (!limits) return true;

    switch (resource) {
      case 'orders':
        return current < limits.maxOrders;
      case 'users':
        return current < limits.maxUsers;
      case 'locations':
        return current < limits.maxLocations;
      case 'menuItems':
        return current < limits.maxMenuItems;
      case 'storage':
        return current < limits.maxStorageGB;
      default:
        return true;
    }
  }

  getUsagePercentage(resource: string, current: number): number {
    const limits = this.currentTenant?.settings.limits;
    if (!limits) return 0;

    const limit = limits[`max${resource.charAt(0).toUpperCase() + resource.slice(1)}` as keyof typeof limits];
    if (!limit || limit === -1) return 0;

    return Math.min((current / limit) * 100, 100);
  }

  isPlanExpired(): boolean {
    if (!this.currentTenant) return true;
    
    const now = new Date();
    const expiryDate = new Date(this.currentTenant.plan.expiresAt);
    
    return now > expiryDate;
  }

  getDaysUntilExpiry(): number {
    if (!this.currentTenant) return 0;
    
    const now = new Date();
    const expiryDate = new Date(this.currentTenant.plan.expiresAt);
    const diffTime = expiryDate.getTime() - now.getTime();
    
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // White-label functionality
  setupWhiteLabel(tenant: Tenant) {
    if (!tenant.settings.whiteLabel.enabled) return;

    // Custom domain handling
    if (tenant.settings.whiteLabel.customDomain) {
      this.setupCustomDomain(tenant.settings.whiteLabel.customDomain);
    }

    // Custom branding
    this.applyCustomBranding(tenant.settings.whiteLabel.branding);
  }

  private setupCustomDomain(domain: string) {
    // Configure custom domain routing
    console.log(`Setting up custom domain: ${domain}`);
  }

  private applyCustomBranding(branding: any) {
    // Apply custom logos, colors, etc.
    if (branding.logo) {
      const logoElement = document.querySelector('.brand-logo') as HTMLImageElement;
      if (logoElement) {
        logoElement.src = branding.logo;
        logoElement.alt = branding.name || 'Logo';
      }
    }
  }
}

// Tenant data isolation
export class TenantDataManager {
  private static instance: TenantDataManager;
  private tenantData: Map<string, Map<string, any>> = new Map();

  static getInstance(): TenantDataManager {
    if (!TenantDataManager.instance) {
      TenantDataManager.instance = new TenantDataManager();
    }
    return TenantDataManager.instance;
  }

  setData<T>(tenantId: string, key: string, data: T): void {
    if (!this.tenantData.has(tenantId)) {
      this.tenantData.set(tenantId, new Map());
    }
    
    const tenantMap = this.tenantData.get(tenantId)!;
    tenantMap.set(key, data);
  }

  getData<T>(tenantId: string, key: string): T | null {
    const tenantMap = this.tenantData.get(tenantId);
    if (!tenantMap) return null;
    
    return tenantMap.get(key) || null;
  }

  deleteData(tenantId: string, key: string): boolean {
    const tenantMap = this.tenantData.get(tenantId);
    if (!tenantMap) return false;
    
    return tenantMap.delete(key);
  }

  clearTenantData(tenantId: string): void {
    this.tenantData.delete(tenantId);
  }

  // Isolated API calls
  async tenantApiCall<T>(
    tenantId: string, 
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const tenant = TenantManager.getInstance().getCurrentTenant();
    if (!tenant || tenant.id !== tenantId) {
      throw new Error('Tenant not authorized');
    }

    const baseUrl = window.__TENANT_API_BASE__ || '/api';
    const url = `${baseUrl}/${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-Tenant-ID': tenantId,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    return response.json();
  }
}

// Tenant subscription management
export class SubscriptionManager {
  private static instance: SubscriptionManager;

  static getInstance(): SubscriptionManager {
    if (!SubscriptionManager.instance) {
      SubscriptionManager.instance = new SubscriptionManager();
    }
    return SubscriptionManager.instance;
  }

  async createSubscription(tenantId: string, plan: TenantPlan): Promise<void> {
    // Create subscription in payment provider
    console.log(`Creating subscription for tenant ${tenantId} with plan ${plan.id}`);
  }

  async cancelSubscription(tenantId: string): Promise<void> {
    // Cancel subscription in payment provider
    console.log(`Cancelling subscription for tenant ${tenantId}`);
  }

  async updateSubscription(tenantId: string, newPlan: TenantPlan): Promise<void> {
    // Update subscription in payment provider
    console.log(`Updating subscription for tenant ${tenantId} to plan ${newPlan.id}`);
  }

  async getSubscriptionStatus(tenantId: string): Promise<'active' | 'cancelled' | 'past_due' | 'unpaid'> {
    // Get status from payment provider
    return 'active';
  }
}

// Declare global types
declare global {
  interface Window {
    __TENANT_API_BASE__?: string;
  }
}