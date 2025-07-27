import { logger } from '../utils/logger';
import { validators } from '../utils/validation';

export class BaseService {
  constructor(serviceName = 'Unknown Service') {
    this.serviceName = serviceName;
    this.defaultTimeout = 10000;
  }

  async makeRequest(url, options = {}) {
    const requestId = Math.random().toString(36).substr(2, 9);
    
    logger.debug(`${this.serviceName} API request started`, {
      requestId,
      url,
      method: options.method || 'GET'
    });

    const defaultOptions = {
      timeout: this.defaultTimeout,
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    };

    const mergedOptions = { ...defaultOptions, ...options };
    
    if (mergedOptions.body && typeof mergedOptions.body === 'string') {
      try {
        const parsed = JSON.parse(mergedOptions.body);
        mergedOptions.body = JSON.stringify(this.sanitizeObject(parsed));
      } catch (err) {
        logger.warn(`${this.serviceName} failed to sanitize request body`, {
          requestId,
          error: err.message
        });
      }
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), mergedOptions.timeout);
      
      const response = await fetch(url, {
        ...mergedOptions,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      logger.info(`${this.serviceName} API request completed`, {
        requestId,
        status: response.status,
        dataSize: JSON.stringify(data).length
      });

      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        logger.error(`${this.serviceName} API request timeout`, {
          requestId,
          timeout: mergedOptions.timeout
        });
        throw new Error(`Request timeout after ${mergedOptions.timeout}ms`);
      }

      logger.error(`${this.serviceName} API request failed`, {
        requestId,
        error: error.message,
        url
      });
      
      throw error;
    }
  }

  sanitizeObject(obj) {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = validators.sanitizeInput(value);
      } else if (typeof value === 'object') {
        sanitized[key] = this.sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }

  validateResponse(data, requiredFields = []) {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format');
    }

    for (const field of requiredFields) {
      if (!(field in data)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    return true;
  }
}
