import { BaseService } from './baseService';
import { validators } from '../utils/validation';
import { logger } from '../utils/logger';

class DefangService extends BaseService {
  constructor() {
    super('IOC Defanger');
  }

  async batchProcessIOCs(text, operation = 'defang') {
    if (!validators.ioc(text)) {
      throw new Error('Invalid text input for IOC processing');
    }

    if (!['defang', 'fang'].includes(operation)) {
      throw new Error('Operation must be either "defang" or "fang"');
    }

    const sanitizedText = validators.sanitizeInput(text);
    
    try {
      const data = await this.makeRequest('/api/defang/', {
        method: 'POST',
        body: JSON.stringify({ 
          text: sanitizedText,
          operation: operation
        })
      });

      if (!Array.isArray(data)) {
        throw new Error('Invalid response format: expected array');
      }

      logger.info('IOCs processed successfully', {
        operation,
        textLength: sanitizedText.length,
        processedCount: data.length,
        changedCount: data.filter(item => item.changed).length
      });

      return data;
    } catch (error) {
      logger.error('IOC processing failed', {
        operation,
        textLength: sanitizedText.length,
        error: error.message
      });
      throw new Error(`Failed to process IOCs: ${error.message}`);
    }
  }

  async defangIOC(ioc) {
    if (!validators.ioc(ioc)) {
      logger.warn('Invalid IOC for defanging', { ioc });
      return ioc;
    }

    try {
      const results = await this.batchProcessIOCs(ioc, 'defang');
      const processed = results.length > 0 ? results[0].processed : ioc;
      
      logger.debug('IOC defanged', { 
        original: ioc, 
        processed,
        changed: results[0]?.changed || false
      });
      
      return processed;
    } catch (error) {
      logger.error('IOC defanging failed', { ioc, error: error.message });
      return ioc;
    }
  }

  async fangIOC(ioc) {
    if (!validators.ioc(ioc)) {
      logger.warn('Invalid IOC for fanging', { ioc });
      return ioc;
    }

    try {
      const results = await this.batchProcessIOCs(ioc, 'fang');
      const processed = results.length > 0 ? results[0].processed : ioc;
      
      logger.debug('IOC fanged', { 
        original: ioc, 
        processed,
        changed: results[0]?.changed || false
      });
      
      return processed;
    } catch (error) {
      logger.error('IOC fanging failed', { ioc, error: error.message });
      return ioc;
    }
  }

  getProcessedIOCs(results) {
    if (!Array.isArray(results)) {
      logger.warn('Invalid results format for getProcessedIOCs', { results });
      return [];
    }

    return results.map(result => {
      if (typeof result === 'object' && result.processed) {
        return validators.sanitizeInput(result.processed);
      }
      return result;
    });
  }

  getChangedIOCs(results) {
    if (!Array.isArray(results)) {
      logger.warn('Invalid results format for getChangedIOCs', { results });
      return [];
    }

    const changed = results.filter(result => 
      typeof result === 'object' && result.changed === true
    );
    
    logger.debug('Filtered changed IOCs', { 
      total: results.length, 
      changed: changed.length 
    });
    
    return changed;
  }

  getIOCsByType(results, type) {
    if (!Array.isArray(results)) {
      logger.warn('Invalid results format for getIOCsByType', { results, type });
      return [];
    }

    if (!type || typeof type !== 'string') {
      logger.warn('Invalid type parameter for getIOCsByType', { type });
      return [];
    }

    const filtered = results.filter(result => 
      typeof result === 'object' && 
      Array.isArray(result.types) && 
      result.types.includes(type)
    );
    
    logger.debug('Filtered IOCs by type', { 
      type, 
      total: results.length, 
      filtered: filtered.length 
    });
    
    return filtered;
  }

  getStatistics(results) {
    if (!Array.isArray(results)) {
      return { total: 0, changed: 0, unchanged: 0 };
    }

    const stats = {
      total: results.length,
      changed: results.filter(r => r.changed).length,
      unchanged: results.filter(r => !r.changed).length,
      byType: {}
    };

    results.forEach(result => {
      if (Array.isArray(result.types)) {
        result.types.forEach(type => {
          stats.byType[type] = (stats.byType[type] || 0) + 1;
        });
      }
    });

    return stats;
  }
}

export const defangService = new DefangService();

// Legacy exports for backward compatibility
export const batchProcessIOCs = (text, operation) => defangService.batchProcessIOCs(text, operation);
export const defangIOC = (ioc) => defangService.defangIOC(ioc);
export const fangIOC = (ioc) => defangService.fangIOC(ioc);
export const getProcessedIOCs = (results) => defangService.getProcessedIOCs(results);
export const getChangedIOCs = (results) => defangService.getChangedIOCs(results);
export const getIOCsByType = (results, type) => defangService.getIOCsByType(results, type);
