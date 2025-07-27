import React, { useState, useEffect, useRef, useCallback } from 'react';
import api from '../../../../../../api';
import ServiceResultRow from './ServiceResultRow.jsx';

function ServiceFetcherRow({ ioc, iocType, serviceConfigEntry }) {
  const [loading, setLoading] = useState(true);
  const [apiResult, setApiResult] = useState(null);
  const [displayProps, setDisplayProps] = useState({ summary: "Loading...", tlp: 'WHITE' });

  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  const getDisplayData = useCallback((data) => {
    if (serviceConfigEntry?.getSummaryAndTlp) {
      try {
        return serviceConfigEntry.getSummaryAndTlp(data, iocType);
      } catch (e) {
        console.error(`Error in getSummaryAndTlp for ${serviceConfigEntry.name}:`, e);
        return { summary: "Error processing result", tlp: 'WHITE' };
      }
    }
    return { summary: "Data received, no summary available", tlp: 'BLUE' };
  }, [iocType, serviceConfigEntry]);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setDisplayProps({ summary: "Loading...", tlp: 'WHITE' });

      const endpointFunc = serviceConfigEntry.lookupEndpoint;

      if (typeof endpointFunc !== 'function') {
        const errorData = { error: 500, message: `No lookup endpoint configured for ${serviceConfigEntry.name}.` };
        if (isMountedRef.current) {
            setApiResult(errorData);
            setDisplayProps(getDisplayData(errorData));
            setLoading(false);
        }
        return;
      }

      const apiUrl = endpointFunc(ioc, iocType);
      console.log(`[${serviceConfigEntry.name}] Fetching from: ${apiUrl}`);

      try {
        const response = await api.get(apiUrl, { signal: abortController.signal });
        if (isMountedRef.current) {
          console.log(`[${serviceConfigEntry.name}] Response received:`, response.data);
          setApiResult(response.data);
          setDisplayProps(getDisplayData(response.data));
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log(`[${serviceConfigEntry.name}] Request cancelled.`);
          return;
        }

        console.error(`[${serviceConfigEntry.name}] API Error:`, error);
        if (isMountedRef.current) {
          const errorData = {
            error: error.response?.status || 'NETWORK_ERROR',
            message: error.response?.data?.detail || error.response?.data?.message || error.message,
            ...error.response?.data,
          };
          setApiResult(errorData);
          setDisplayProps(getDisplayData(errorData));
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => abortController.abort();

  }, [ioc, iocType, serviceConfigEntry, getDisplayData]);

  const serviceForChild = {
    name: serviceConfigEntry?.name || "Unknown Service",
    icon: serviceConfigEntry?.icon || 'default_icon',
    detailComponent: serviceConfigEntry?.detailComponent,
  };

  return (
    <ServiceResultRow
      serviceKey={serviceConfigEntry?.key || serviceConfigEntry?.name}
      service={serviceForChild}
      loading={loading}
      result={apiResult}
      summary={displayProps.summary}
      tlp={displayProps.tlp}
      ioc={ioc}
      iocType={iocType}
    />
  );
}

export default React.memo(ServiceFetcherRow);
