import api from '../../../../../api';

/**
 * IOC Extractor API Service
 * Pure functions for IOC extraction operations - no React dependencies
 */
export const extractorApi = {
  /**
   * Extract IOCs from text content
   * @param {string} text - Text content to extract IOCs from
   * @returns {Promise<Object>} - Extracted IOCs data
   */
  async extractFromText(text) {
    const response = await api.post('/api/extractor/text/', {
      text: text
    });
    return response.data;
  },

  /**
   * Extract IOCs from uploaded file
   * @param {File} file - File to extract IOCs from
   * @param {Function} onUploadProgress - Progress callback function
   * @returns {Promise<Object>} - Extracted IOCs data
   */
  async extractFromFile(file, onUploadProgress) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/api/extractor/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: onUploadProgress
    });

    return response.data;
  }
};

/**
 * Utility functions for processing extractor results
 */
export const extractorUtils = {
  /**
   * Get all IOCs from extraction data and flatten into a single array
   * @param {Object} extractedData - Data from IOC extraction
   * @returns {Array} - Array of IOC objects with value and type
   */
  getAllIOCsFromExtraction(extractedData) {
    const allIOCs = [];
    
    const typeMapping = {
      'ips': 'IP Address',
      'md5': 'MD5 Hash',
      'sha1': 'SHA1 Hash',
      'sha256': 'SHA256 Hash',
      'urls': 'URL',
      'domains': 'Domain',
      'emails': 'Email',
      'cves': 'CVE'
    };
    
    Object.entries(extractedData).forEach(([key, values]) => {
      if (Array.isArray(values) && typeMapping[key]) {
        values.forEach(ioc => {
          allIOCs.push({
            value: ioc,
            type: typeMapping[key]
          });
        });
      }
    });
    
    return allIOCs;
  },

  /**
   * Count total IOCs in extracted data
   * @param {Object} extractedData - Data from IOC extraction
   * @returns {number} - Total count of IOCs
   */
  countTotalIOCs(extractedData) {
    let total = 0;
    Object.values(extractedData).forEach(values => {
      if (Array.isArray(values)) {
        total += values.length;
      }
    });
    return total;
  },

  /**
   * Get IOCs by type from extracted data
   * @param {Object} extractedData - Data from IOC extraction
   * @param {string} type - IOC type key (e.g., 'ips', 'domains')
   * @returns {Array} - Array of IOCs of the specified type
   */
  getIOCsByType(extractedData, type) {
    return extractedData[type] || [];
  }
};
