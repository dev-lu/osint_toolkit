import api from '../../../../../api';

/**
 * IOC Lookup API Service
 * Pure functions for IOC lookup operations - no React dependencies
 */
export const iocLookupApi = {
  /**
   * Perform bulk IOC lookup with streaming results
   * @param {Array<string>} iocs - Array of IOCs to lookup
   * @param {Array<string>} services - Array of service names to use
   * @returns {Promise<ReadableStream>} - Stream of lookup results
   */
  async bulkLookup(iocs, services) {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const baseURL = isDevelopment ? 'http://localhost:8000' : '';
    
    const response = await fetch(`${baseURL}/api/ioc-lookup/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream'
      },
      body: JSON.stringify({ iocs, services })
    });

    if (!response.ok || !response.body) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    return response.body;
  },

  /**
   * Perform single IOC lookup
   * @param {string} ioc - IOC to lookup
   * @param {Array<string>} services - Array of service names to use
   * @returns {Promise<Object>} - Lookup results
   */
  async singleLookup(ioc, services) {
    const response = await api.post('/api/ioc-lookup/single', {
      ioc,
      services
    });
    return response.data;
  }
};
