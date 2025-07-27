import { logger } from './logger';

export const validators = {
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  ip: (ip) => {
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  },

  domain: (domain) => {
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return domainRegex.test(domain) && domain.length <= 253;
  },

  url: (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  hash: (hash) => {
    const md5Regex = /^[a-fA-F0-9]{32}$/;
    const sha1Regex = /^[a-fA-F0-9]{40}$/;
    const sha256Regex = /^[a-fA-F0-9]{64}$/;
    return md5Regex.test(hash) || sha1Regex.test(hash) || sha256Regex.test(hash);
  },

  ioc: (ioc) => {
    if (!ioc || typeof ioc !== 'string') {
      logger.warn('Invalid IOC input', { ioc, type: typeof ioc });
      return false;
    }

    const sanitized = ioc.trim();
    if (sanitized.length === 0) {
      logger.warn('Empty IOC provided');
      return false;
    }
    
    if (sanitized.length > 1000) {
      logger.warn('IOC too long', { length: sanitized.length });
      return false;
    }

    return true;
  },

  sanitizeHtml: (input) => {
    if (typeof input !== 'string') return input;
    
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  },

  sanitizeInput: (input) => {
    if (typeof input !== 'string') return input;
    
    return input
      .trim()
      .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
      .substring(0, 1000); // Limit length
  }
};

export const validateBulkInput = (input) => {
  if (!input || typeof input !== 'string') {
    return { isValid: false, error: 'Input must be a string' };
  }

  const lines = input.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) {
    return { isValid: false, error: 'No valid IOCs found' };
  }

  if (lines.length > 1000) {
    return { isValid: false, error: 'Too many IOCs (maximum 1000)' };
  }

  return { isValid: true, lines };
};
