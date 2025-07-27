import { SERVICE_DEFINITIONS } from '../../shared/config/serviceConfig';

import { TLP_COLORS, TLP_HIERARCHY, getOverallTlp } from '../../shared/utils/tlpUtils';
import { IOC_TYPES, IOC_TYPE_PATTERNS, determineIocType } from '../../shared/utils/iocDefinitions';

export { TLP_COLORS, TLP_HIERARCHY, getOverallTlp, IOC_TYPES, IOC_TYPE_PATTERNS, determineIocType };

export const SERVICES_CONFIG = Object.entries(SERVICE_DEFINITIONS)
  .reduce((acc, [key, def]) => {
    const hasBulkSupport = def.lookupEndpoints?.bulk && 
      (def.lookupEndpoints.bulk.default || 
       Object.keys(def.lookupEndpoints.bulk).some(k => typeof def.lookupEndpoints.bulk[k] === 'function'));
    
    if (hasBulkSupport) {
      acc[key] = {
        name: def.name,
        icon: def.icon,
        getSummaryAndTlp: def.getSummaryAndTlp,
        DetailComponent: def.component || def.detailComponent,
        requiredKeys: def.requiredKeys || [],
      };
    }
    return acc;
  }, {});