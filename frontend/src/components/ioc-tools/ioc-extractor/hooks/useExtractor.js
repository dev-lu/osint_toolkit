import { useState, useCallback } from 'react';
import { useAsyncOperation } from '../../shared/hooks/useAsyncOperation';
import { extractorService } from '../../shared/services/extractorService';
import { logger } from '../../shared/utils/logger';
import api from '../../../../api';

export function useExtractor() {
  const [extractedData, setExtractedData] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { isLoading, error, executeAsync, clearError } = useAsyncOperation();

  const extractFromFile = useCallback(async (file) => {
    if (!file) {
      throw new Error('No file provided');
    }

    logger.info('Starting file extraction', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    setUploadProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/api/extractor/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });

      const data = response.data;
      
      logger.info('File extraction completed', {
        fileName: file.name,
        totalIOCs: data.statistics?.total_unique_iocs || 0
      });

      setExtractedData(data);
      setUploadProgress(0);
      
      return data;
    } catch (error) {
      setUploadProgress(0);
      logger.error('File extraction failed', {
        fileName: file.name,
        error: error.message
      });
      throw error;
    }
  }, []);

  const extractFromText = useCallback(async (text) => {
    const result = await executeAsync(
      () => extractorService.extractIOCsFromText(text),
      'Text IOC Extraction'
    );
    
    setExtractedData(result);
    return result;
  }, [executeAsync]);

  const getAllIOCs = useCallback(() => {
    if (!extractedData) return [];

    const allIOCs = [
      ...(extractedData.domains || []),
      ...(extractedData.ips || []),
      ...(extractedData.urls || []),
      ...(extractedData.emails || []),
      ...(extractedData.md5 || []),
      ...(extractedData.sha1 || []),
      ...(extractedData.sha256 || []),
      ...(extractedData.cves || [])
    ];

    logger.debug('Retrieved all IOCs', { count: allIOCs.length });
    return allIOCs;
  }, [extractedData]);

  const copyAllIOCs = useCallback(async () => {
    const allIOCs = getAllIOCs();
    
    if (allIOCs.length === 0) {
      throw new Error('No IOCs to copy');
    }

    try {
      const text = allIOCs.join('\n');
      await navigator.clipboard.writeText(text);
      
      logger.info('IOCs copied to clipboard', { count: allIOCs.length });
      return { count: allIOCs.length, message: `Copied ${allIOCs.length} IOCs to clipboard` };
    } catch (error) {
      logger.error('Failed to copy IOCs to clipboard', { error: error.message });
      throw new Error('Failed to copy to clipboard');
    }
  }, [getAllIOCs]);

  const exportAllIOCs = useCallback(() => {
    const allIOCs = getAllIOCs();
    
    if (allIOCs.length === 0) {
      throw new Error('No IOCs to export');
    }

    try {
      const text = allIOCs.join('\n');
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `extracted_iocs_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      logger.info('IOCs exported to file', { count: allIOCs.length });
      return { count: allIOCs.length, message: `Exported ${allIOCs.length} IOCs to file` };
    } catch (error) {
      logger.error('Failed to export IOCs', { error: error.message });
      throw new Error('Failed to export IOCs');
    }
  }, [getAllIOCs]);

  const reset = useCallback(() => {
    setExtractedData(null);
    setUploadProgress(0);
    clearError();
    logger.debug('Extractor state reset');
  }, [clearError]);

  const getStatistics = useCallback(() => {
    return extractedData?.statistics || null;
  }, [extractedData]);

  const hasResults = Boolean(extractedData);

  return {
    extractedData,
    uploadProgress,
    isLoading,
    error,
    hasResults,
    extractFromFile,
    extractFromText,
    getAllIOCs,
    copyAllIOCs,
    exportAllIOCs,
    getStatistics,
    reset,
    clearError
  };
}
