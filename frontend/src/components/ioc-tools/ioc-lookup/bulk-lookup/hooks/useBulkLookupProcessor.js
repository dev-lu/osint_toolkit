import { useState, useCallback, useMemo, useRef } from 'react';
import { determineIocType, IOC_TYPES, getOverallTlp } from '../utils/iocUtils';
import { SERVICE_DEFINITIONS } from '../../shared/config/serviceConfig';

const initialCategorizedIocsState = Object.fromEntries(
  Object.values(IOC_TYPES).map(type => [type, []])
);

export function useBulkLookupProcessor() {
  const [categorizedIocs, setCategorizedIocs] = useState(initialCategorizedIocsState);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processorError, setProcessorError] = useState('');
  
  const iocMapRef = useRef(new Map());

  const updateIocServiceData = useCallback((iocValue, serviceName, updates) => {
    setCategorizedIocs(prev => {
      const iocToUpdate = iocMapRef.current.get(iocValue);
      if (!iocToUpdate) {
        console.warn(`[updateIocServiceData] IOC "${iocValue}" not found in map.`);
        return prev;
      }
      
      const newCategorized = { ...prev };
      const iocType = iocToUpdate.type;
      const iocIndex = newCategorized[iocType].findIndex(i => i.id === iocToUpdate.id);
      
      if (iocIndex === -1) {
        console.warn(`[updateIocServiceData] IOC ID "${iocToUpdate.id}" not found in type "${iocType}".`);
        return prev;
      }

      const updatedIoc = { ...newCategorized[iocType][iocIndex] };
      updatedIoc.services[serviceName] = {
        ...updatedIoc.services[serviceName],
        ...updates,
      };

      const serviceTlps = Object.values(updatedIoc.services).map(s => s.tlp).filter(Boolean);
      updatedIoc.overallTlp = getOverallTlp(serviceTlps);
      
      newCategorized[iocType][iocIndex] = updatedIoc;
      iocMapRef.current.set(iocValue, updatedIoc);
      
      return newCategorized;
    });
  }, []);

  const performLookup = useCallback(async (iocsInput, selectedServices) => {
    setProcessorError('');
    if (selectedServices.length === 0) {
      setProcessorError("Please select at least one service to perform the lookup.");
      return;
    }
    setLoading(true);
    setProgress(0);
    iocMapRef.current.clear();
    
    const freshInitialCategorizedIocs = Object.fromEntries(
      Object.values(IOC_TYPES).map(type => [type, []])
    );

    const lines = iocsInput.split(/[ ,\n]+/).map(line => line.trim()).filter(Boolean);
    const uniqueIocs = Array.from(new Set(lines));

    if (uniqueIocs.length === 0) {
      setProcessorError("Please enter at least one IOC, or check input for valid formatting.");
      setLoading(false);
      return;
    }

    uniqueIocs.forEach((iocStr, index) => {
        const type = determineIocType(iocStr);
        const iocId = `${type}-${iocStr}-${Date.now()}-${index}`;
        const services = {};
        selectedServices.forEach(serviceName => {
            services[serviceName] = { status: 'idle', summary: 'Queued', tlp: 'WHITE' };
        });

        const iocObject = { id: iocId, value: iocStr, type: type, services, overallTlp: 'WHITE' };
        if (freshInitialCategorizedIocs[type]) {
            freshInitialCategorizedIocs[type].push(iocObject);
            iocMapRef.current.set(iocStr, iocObject);
        }
    });
    setCategorizedIocs(freshInitialCategorizedIocs);
    
    const isDevelopment = process.env.NODE_ENV === 'development';
    const baseURL = isDevelopment ? 'http://localhost:8000' : '';

    try {
        const response = await fetch(`${baseURL}/api/ioc-lookup/bulk`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'text/event-stream'
            },
            body: JSON.stringify({ iocs: uniqueIocs, services: selectedServices })
        });

        if (!response.ok || !response.body) {
            throw new Error(`Server error: ${response.statusText}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let completedRequests = 0;
        const totalRequests = uniqueIocs.length * selectedServices.length;

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            buffer += decoder.decode(value, { stream: true });
            const eventChunks = buffer.split('\n\n');
            buffer = eventChunks.pop(); 

            for (const chunk of eventChunks) {
                if (chunk.startsWith('data: ')) {
                    completedRequests++;
                    const dataStr = chunk.substring(6);
                    try {
                        const eventData = JSON.parse(dataStr);
                        const { ioc, service, data, error } = eventData;
                        
                        if (error) {
                            updateIocServiceData(ioc, service, {
                                status: 'error',
                                summary: error,
                                tlp: 'WHITE',
                                error: { message: error }
                            });
                        } else {
                            const serviceDef = SERVICE_DEFINITIONS[service];
                            if (serviceDef) {
                                const iocType = determineIocType(ioc);
                                const analysisResult = serviceDef.getSummaryAndTlp(data, iocType);
                                updateIocServiceData(ioc, service, {
                                    status: 'completed',
                                    data: data,
                                    summary: analysisResult.summary,
                                    tlp: analysisResult.tlp,
                                    keyMetric: analysisResult.keyMetric,
                                });
                            }
                        }
                    } catch (e) {
                        console.error("Error parsing SSE data:", e, "Data:", dataStr);
                    }
                    setProgress(totalRequests > 0 ? (completedRequests / totalRequests) * 100 : 0);
                }
            }
        }
    } catch (err) {
        console.error("SSE connection error:", err);
        setProcessorError(`Failed to connect or stream results: ${err.message}`);
    } finally {
        setLoading(false);
        setProgress(100);
    }

  }, [updateIocServiceData]);

  const orderedIocTypes = useMemo(() => {
    const preferredOrder = [
      IOC_TYPES.IPV4, IOC_TYPES.IPV6, IOC_TYPES.DOMAIN, IOC_TYPES.URL,  
      IOC_TYPES.MD5, IOC_TYPES.SHA1, IOC_TYPES.SHA256,  
      IOC_TYPES.EMAIL, IOC_TYPES.CVE, IOC_TYPES.UNKNOWN
    ];
    const typesPresent = Object.keys(categorizedIocs).filter(type => categorizedIocs[type]?.length > 0);
    const sortedTypes = preferredOrder.filter(type => typesPresent.includes(type));
    const otherTypes = typesPresent.filter(type => !preferredOrder.includes(type));
    return [...sortedTypes, ...otherTypes];
  }, [categorizedIocs]);

  return {
    categorizedIocs,
    loading,
    progress,
    processorError,
    setProcessorError,
    performLookup,
    orderedIocTypes,
  };
}
