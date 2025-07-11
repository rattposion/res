import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-32-char-encryption-key-here';

// Password hashing
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

// JWT tokens
export const generateToken = (payload: object, expiresIn: string = '24h'): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Encryption for sensitive data
export const encrypt = (text: string): string => {
  return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
};

export const decrypt = (encryptedText: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// Audit logging
export interface AuditLog {
  id: string;
  userId: string;
  tenantId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: any;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

class AuditLogger {
  private logs: AuditLog[] = [];

  log(data: Omit<AuditLog, 'id' | 'timestamp'>) {
    const log: AuditLog = {
      ...data,
      id: crypto.randomUUID(),
      timestamp: new Date()
    };
    
    this.logs.push(log);
    
    // Send to external service (Sentry, LogRocket, etc.)
    this.sendToExternalService(log);
    
    return log;
  }

  private sendToExternalService(log: AuditLog) {
    // Integração com Sentry
    if (window.Sentry) {
      window.Sentry.captureMessage(`Audit: ${log.action}`, {
        level: 'info',
        extra: log
      });
    }

    // Integração com LogRocket
    if (window.LogRocket) {
      window.LogRocket.track('audit_log', log);
    }
  }

  getLogs(filters?: Partial<AuditLog>) {
    return this.logs.filter(log => {
      if (filters?.userId && log.userId !== filters.userId) return false;
      if (filters?.tenantId && log.tenantId !== filters.tenantId) return false;
      if (filters?.action && log.action !== filters.action) return false;
      return true;
    });
  }
}

export const auditLogger = new AuditLogger();

// Rate limiting
const rateLimiter = new Map<string, { count: number; resetTime: number }>();

export const checkRateLimit = (key: string, limit: number, windowMs: number): boolean => {
  const now = Date.now();
  const record = rateLimiter.get(key);

  if (!record || now > record.resetTime) {
    rateLimiter.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
};

// Data validation
export const validateCNPJ = (cnpj: string): boolean => {
  const cleanCNPJ = cnpj.replace(/[^\d]/g, '');
  
  if (cleanCNPJ.length !== 14) return false;
  
  // Check for repeated digits
  if (/^(\d)\1+$/.test(cleanCNPJ)) return false;
  
  // Validate check digits
  let sum = 0;
  let weight = 2;
  
  for (let i = 11; i >= 0; i--) {
    sum += parseInt(cleanCNPJ[i]) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  
  const digit1 = ((sum % 11) < 2) ? 0 : 11 - (sum % 11);
  
  sum = 0;
  weight = 2;
  
  for (let i = 12; i >= 0; i--) {
    sum += parseInt(cleanCNPJ[i]) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  
  const digit2 = ((sum % 11) < 2) ? 0 : 11 - (sum % 11);
  
  return cleanCNPJ[12] === digit1.toString() && cleanCNPJ[13] === digit2.toString();
};

export const validateCreditCard = (cardNumber: string): boolean => {
  const cleanNumber = cardNumber.replace(/\s/g, '');
  
  if (!/^\d{13,19}$/.test(cleanNumber)) return false;
  
  // Luhn algorithm
  let sum = 0;
  let isEven = false;
  
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

// Backup system
export class BackupManager {
  private static instance: BackupManager;
  
  static getInstance(): BackupManager {
    if (!BackupManager.instance) {
      BackupManager.instance = new BackupManager();
    }
    return BackupManager.instance;
  }

  async createBackup(tenantId: string, data: any): Promise<string> {
    const backup = {
      id: crypto.randomUUID(),
      tenantId,
      data,
      timestamp: new Date(),
      version: '1.0'
    };

    // Encrypt backup data
    const encryptedData = encrypt(JSON.stringify(backup));
    
    // Store in cloud storage (simulated)
    await this.storeInCloud(encryptedData);
    
    return backup.id;
  }

  async restoreBackup(backupId: string): Promise<any> {
    // Retrieve from cloud storage
    const encryptedData = await this.retrieveFromCloud(backupId);
    
    // Decrypt data
    const decryptedData = decrypt(encryptedData);
    
    return JSON.parse(decryptedData);
  }

  private async storeInCloud(data: string): Promise<void> {
    // Simulate cloud storage
    console.log('Storing backup in cloud:', data.substring(0, 100) + '...');
  }

  private async retrieveFromCloud(backupId: string): Promise<string> {
    // Simulate cloud retrieval
    console.log('Retrieving backup from cloud:', backupId);
    return 'encrypted-backup-data';
  }
}

// Error monitoring
export class ErrorMonitor {
  private static instance: ErrorMonitor;
  
  static getInstance(): ErrorMonitor {
    if (!ErrorMonitor.instance) {
      ErrorMonitor.instance = new ErrorMonitor();
    }
    return ErrorMonitor.instance;
  }

  captureError(error: Error, context?: any) {
    // Send to Sentry
    if (window.Sentry) {
      window.Sentry.captureException(error, {
        extra: context
      });
    }

    // Send to LogRocket
    if (window.LogRocket) {
      window.LogRocket.track('error', {
        message: error.message,
        stack: error.stack,
        context
      });
    }

    // Log locally
    console.error('Error captured:', error, context);
  }

  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
    if (window.Sentry) {
      window.Sentry.captureMessage(message, { level });
    }

    if (window.LogRocket) {
      window.LogRocket.track('message', { message, level });
    }
  }
}

// Global error handler
window.addEventListener('error', (event) => {
  ErrorMonitor.getInstance().captureError(event.error, {
    url: event.filename,
    line: event.lineno,
    column: event.colno
  });
});

window.addEventListener('unhandledrejection', (event) => {
  ErrorMonitor.getInstance().captureError(new Error(event.reason), {
    type: 'unhandledrejection'
  });
});

// Declare global types
declare global {
  interface Window {
    Sentry?: any;
    LogRocket?: any;
  }
}