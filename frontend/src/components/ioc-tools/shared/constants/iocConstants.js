export const IOC_TYPES = {
  IP: 'IP Address',
  URL: 'URL',
  DOMAIN: 'Domain',
  EMAIL: 'Email',
  MD5: 'MD5 Hash',
  SHA1: 'SHA1 Hash',
  SHA256: 'SHA256 Hash',
  CVE: 'CVE',
  UNKNOWN: 'Unknown'
};

export const IOC_TYPE_MAPPING = {
  'ips': IOC_TYPES.IP,
  'urls': IOC_TYPES.URL,
  'domains': IOC_TYPES.DOMAIN,
  'emails': IOC_TYPES.EMAIL,
  'md5': IOC_TYPES.MD5,
  'sha1': IOC_TYPES.SHA1,
  'sha256': IOC_TYPES.SHA256,
  'cves': IOC_TYPES.CVE
};

export const DEFANG_OPERATIONS = {
  DEFANG: 'defang',
  FANG: 'fang'
};

export const API_ENDPOINTS = {
  EXTRACTOR: '/api/extractor/text/',
  DEFANGER: '/api/defang/',
  BULK_LOOKUP: '/api/bulk-lookup/',
  SINGLE_LOOKUP: '/api/single-lookup/'
};

export const REQUEST_LIMITS = {
  MAX_TEXT_LENGTH: 1000000,
  MAX_BULK_IOCS: 1000,
  DEFAULT_TIMEOUT: 10000,
  BULK_TIMEOUT: 30000
};

export const ERROR_MESSAGES = {
  INVALID_INPUT: 'Invalid input provided',
  NETWORK_ERROR: 'Network error occurred',
  TIMEOUT_ERROR: 'Request timeout',
  SERVER_ERROR: 'Server error occurred',
  VALIDATION_ERROR: 'Input validation failed',
  EMPTY_RESULTS: 'No results found',
  TOO_MANY_IOCS: `Too many IOCs (maximum ${REQUEST_LIMITS.MAX_BULK_IOCS})`,
  TEXT_TOO_LONG: `Text too long (maximum ${REQUEST_LIMITS.MAX_TEXT_LENGTH} characters)`
};

export const SUCCESS_MESSAGES = {
  EXTRACTION_COMPLETE: 'IOC extraction completed successfully',
  DEFANG_COMPLETE: 'IOC defanging completed successfully',
  FANG_COMPLETE: 'IOC fanging completed successfully',
  LOOKUP_COMPLETE: 'IOC lookup completed successfully'
};

export const LOG_CONTEXTS = {
  EXTRACTION: 'IOC_EXTRACTION',
  DEFANG: 'IOC_DEFANG',
  LOOKUP: 'IOC_LOOKUP',
  VALIDATION: 'IOC_VALIDATION'
};

export const UI_CONSTANTS = {
  DEBOUNCE_DELAY: 300,
  PAGINATION_SIZE: 50,
  MAX_DISPLAY_ITEMS: 100,
  LOADING_DELAY: 200
};

export const REGEX_PATTERNS = {
  IPV4: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  IPV6: /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  DOMAIN: /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  MD5: /^[a-fA-F0-9]{32}$/,
  SHA1: /^[a-fA-F0-9]{40}$/,
  SHA256: /^[a-fA-F0-9]{64}$/,
  CVE: /^CVE-\d{4}-\d{4,}$/
};

export const TOOL_NAMES = {
  EXTRACTOR: 'IOC Extractor',
  DEFANGER: 'IOC Defanger',
  LOOKUP: 'IOC Lookup',
  BULK_LOOKUP: 'Bulk IOC Lookup'
};

export const FEATURE_FLAGS = {
  ENABLE_BATCH_PROCESSING: true,
  ENABLE_TYPE_DETECTION: true,
  ENABLE_STATISTICS: true,
  ENABLE_EXPORT: true
};
