import api from '../../../../../api';

/**
 * IOC Defanger API Service
 * Pure functions for IOC defanging/fanging operations - no React dependencies
 */
export const defangApi = {
  /**
   * Process IOCs for defanging or fanging using the backend service
   * @param {string} text - Text content containing IOCs
   * @param {string} operation - 'defang' or 'fang'
   * @returns {Promise<Array>} - Array of processed IOC objects
   */
  async batchProcessIOCs(text, operation = 'defang') {
    const response = await api.post('/api/defang/', {
      text: text,
      operation: operation
    });
    return response.data;
  },

  /**
   * Defang a single IOC
   * @param {string} ioc - The IOC to defang
   * @returns {Promise<string>} - The defanged IOC
   */
  async defangIOC(ioc) {
    const results = await this.batchProcessIOCs(ioc, 'defang');
    return results.length > 0 ? results[0].processed : ioc;
  },

  /**
   * Fang a single IOC
   * @param {string} ioc - The IOC to fang
   * @returns {Promise<string>} - The fanged IOC
   */
  async fangIOC(ioc) {
    const results = await this.batchProcessIOCs(ioc, 'fang');
    return results.length > 0 ? results[0].processed : ioc;
  }
};

/**
 * Utility functions for processing defanger results
 */
export const defangUtils = {
  /**
   * Get all processed IOCs from batch results
   * @param {Array} results - Results from batchProcessIOCs
   * @returns {Array<string>} - Array of processed IOC strings
   */
  getProcessedIOCs(results) {
    return results.map(result => result.processed);
  },

  /**
   * Get only changed IOCs from batch results
   * @param {Array} results - Results from batchProcessIOCs
   * @returns {Array} - Array of changed IOC objects
   */
  getChangedIOCs(results) {
    return results.filter(result => result.changed);
  },

  /**
   * Get IOCs by type from batch results
   * @param {Array} results - Results from batchProcessIOCs
   * @param {string} type - IOC type to filter by
   * @returns {Array} - Array of IOC objects of the specified type
   */
  getIOCsByType(results, type) {
    return results.filter(result => result.types.includes(type));
  }
};
