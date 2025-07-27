import { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { apiKeysState } from '../../../../../state';
import api from '../../../../../api';

export const useServiceDefinitions = () => {
  const [serviceDefinitions, setServiceDefinitions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiKeys = useRecoilValue(apiKeysState);

  const fetchServiceDefinitions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/ioc/service-definitions');
      setServiceDefinitions(response.data.serviceDefinitions || {});
    } catch (err) {
      console.error('Failed to fetch service definitions:', err);
      setError('Failed to load service definitions');
    } finally {
      setLoading(false);
    }
  };

  // Fetch service definitions on mount and when API keys change
  useEffect(() => {
    fetchServiceDefinitions();
  }, [apiKeys]);

  const getAvailableServices = () => {
    return Object.entries(serviceDefinitions)
      .filter(([_, config]) => config.isAvailable)
      .reduce((acc, [key, config]) => {
        acc[key] = config;
        return acc;
      }, {});
  };

  const getServicesByIocType = (iocType) => {
    return Object.entries(serviceDefinitions)
      .filter(([_, config]) => 
        config.isAvailable && config.supportedIocTypes.includes(iocType)
      )
      .reduce((acc, [key, config]) => {
        acc[key] = config;
        return acc;
      }, {});
  };

  const isServiceAvailable = (serviceName) => {
    return serviceDefinitions[serviceName]?.isAvailable || false;
  };

  return {
    serviceDefinitions,
    loading,
    error,
    refetch: fetchServiceDefinitions,
    getAvailableServices,
    getServicesByIocType,
    isServiceAvailable,
  };
};
