import { BaseService } from './baseService';
import { validators } from '../utils/validation';
import { logger } from '../utils/logger';

class ExtractorService extends BaseService {
  constructor() {
    super('IOC Extractor');
  }

  async extractIOCsFromText(text) {
    if (!validators.ioc(text)) {
      throw new Error('Invalid text input for IOC extraction');
    }

    const sanitizedText = validators.sanitizeInput(text);
    
    try {
      const data = await this.makeRequest('/api/extractor/text/', {
        method: 'POST',
        body: JSON.stringify({ text: sanitizedText })
      });

      this.validateResponse(data, ['ips', 'urls', 'domains', 'emails']);
      
      logger.info('IOCs extracted successfully', {
        textLength: sanitizedText.length,
        totalIOCs: this.countTotalIOCs(data)
      });

      return data;
    } catch (error) {
      logger.error('IOC extraction failed', {
        textLength: sanitizedText.length,
        error: error.message
      });
      throw new Error(`Failed to extract IOCs: ${error.message}`);
    }
  }

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
            value: validators.sanitizeInput(ioc),
            type: typeMapping[key]
          });
        });
      }
    });
    
    logger.debug('IOCs flattened from extraction', { count: allIOCs.length });
    return allIOCs;
  }

  async detectIOCTypes(ioc) {
    if (!validators.ioc(ioc)) {
      logger.warn('Invalid IOC for type detection', { ioc });
      return ['Unknown'];
    }

    try {
      const extractedData = await this.extractIOCsFromText(ioc);
      const allIOCs = this.getAllIOCsFromExtraction(extractedData);
      
      const foundIOC = allIOCs.find(item => item.value === ioc);
      const types = foundIOC ? [foundIOC.type] : ['Unknown'];
      
      logger.debug('IOC type detected', { ioc, types });
      return types;
    } catch (error) {
      logger.error('IOC type detection failed', { ioc, error: error.message });
      return ['Unknown'];
    }
  }

  async batchDetectIOCTypes(iocs) {
    if (!Array.isArray(iocs) || iocs.length === 0) {
      logger.warn('Invalid IOCs array for batch detection', { iocs });
      return {};
    }

    const validIOCs = iocs.filter(ioc => validators.ioc(ioc));
    if (validIOCs.length === 0) {
      logger.warn('No valid IOCs found for batch detection');
      return this.createDefaultTypeMap(iocs);
    }

    try {
      const combinedText = validIOCs.join('\n');
      const extractedData = await this.extractIOCsFromText(combinedText);
      const allIOCs = this.getAllIOCsFromExtraction(extractedData);
      
      const iocTypeMap = {};
      allIOCs.forEach(item => {
        if (!iocTypeMap[item.value]) {
          iocTypeMap[item.value] = [];
        }
        if (!iocTypeMap[item.value].includes(item.type)) {
          iocTypeMap[item.value].push(item.type);
        }
      });
      
      iocs.forEach(ioc => {
        if (!iocTypeMap[ioc]) {
          iocTypeMap[ioc] = ['Unknown'];
        }
      });
      
      logger.info('Batch IOC type detection completed', {
        totalIOCs: iocs.length,
        detectedIOCs: Object.keys(iocTypeMap).length
      });
      
      return iocTypeMap;
    } catch (error) {
      logger.error('Batch IOC type detection failed', {
        iocCount: iocs.length,
        error: error.message
      });
      return this.createDefaultTypeMap(iocs);
    }
  }

  countTotalIOCs(extractedData) {
    let total = 0;
    Object.values(extractedData).forEach(values => {
      if (Array.isArray(values)) {
        total += values.length;
      }
    });
    return total;
  }

  createDefaultTypeMap(iocs) {
    const defaultMap = {};
    iocs.forEach(ioc => {
      defaultMap[ioc] = ['Unknown'];
    });
    return defaultMap;
  }
}

export const extractorService = new ExtractorService();

// Legacy exports for backward compatibility
export const extractIOCsFromText = (text) => extractorService.extractIOCsFromText(text);
export const getAllIOCsFromExtraction = (data) => extractorService.getAllIOCsFromExtraction(data);
export const detectIOCTypes = (ioc) => extractorService.detectIOCTypes(ioc);
export const batchDetectIOCTypes = (iocs) => extractorService.batchDetectIOCTypes(iocs);
