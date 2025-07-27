import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { apiKeysState } from '../../../../../state';
import { useServiceDefinitions } from './useServiceDefinitions';
import { SERVICE_DEFINITIONS } from '../config/serviceConfig';

export function useServiceFilter(iocType, externallyFilteredServices) {
  const apiKeys = useRecoilValue(apiKeysState);
  const { serviceDefinitions, loading } = useServiceDefinitions();

  const servicesToRender = useMemo(() => {
    if (externallyFilteredServices) {
      return externallyFilteredServices;
    }

    if (!iocType || loading || Object.keys(serviceDefinitions).length === 0) {
        return [];
    }

    return Object.entries(serviceDefinitions)
      .map(([serviceKey, serviceDef]) => ({ ...serviceDef, key: serviceKey }))
      .filter(serviceDef => {
        if (!serviceDef.supportedIocTypes?.includes(iocType)) {
          return false;
        }

        if (!serviceDef.isAvailable) {
          return false;
        }

        return true;
      })
      .map(serviceDef => {
        const frontendConfig = SERVICE_DEFINITIONS[serviceDef.key] || {};
        
        return {
          ...serviceDef,
          name: serviceDef.name || serviceDef.key,
          detailComponent: frontendConfig.detailComponent,
          getSummaryAndTlp: frontendConfig.getSummaryAndTlp,
          icon: frontendConfig.icon,
          lookupEndpoint: (ioc, iocType) => `/api/ioc/lookup/${serviceDef.key}?ioc=${encodeURIComponent(ioc)}&ioc_type=${encodeURIComponent(iocType)}`,
        };
      });
  }, [iocType, serviceDefinitions, loading]);

  return servicesToRender;
}
