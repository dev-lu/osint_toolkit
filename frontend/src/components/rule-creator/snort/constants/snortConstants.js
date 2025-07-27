export const SNORT_CONSTANTS = {
  ACTIONS: {
    ALERT: 'alert',
    LOG: 'log',
    PASS: 'pass',
    ACTIVATE: 'activate',
    DYNAMIC: 'dynamic',
    DROP: 'drop',
    REJECT: 'reject',
    SDROP: 'sdrop'
  },

  PROTOCOLS: {
    TCP: 'tcp',
    UDP: 'udp',
    ICMP: 'icmp',
    IP: 'ip',
    HTTP: 'http',
    FTP: 'ftp',
    TLS: 'tls',
    SMB: 'smb',
    DNS: 'dns',
    SSH: 'ssh'
  },

  DIRECTIONS: {
    TO: '->',
    FROM: '<-',
    BIDIRECTIONAL: '<>'
  },

  CLASSTYPES: [
    'attempted-admin',
    'attempted-user',
    'kickass-porn',
    'policy-violation',
    'shellcode-detect',
    'successful-admin',
    'successful-user',
    'trojan-activity',
    'unsuccessful-user',
    'web-application-attack',
    'attempted-dos',
    'attempted-recon',
    'bad-unknown',
    'default-login-attempt',
    'denial-of-service',
    'misc-attack',
    'non-standard-protocol',
    'rpc-portmap-decode',
    'successful-dos',
    'successful-recon-largescale',
    'successful-recon-limited',
    'suspicious-filename-detect',
    'suspicious-login',
    'system-call-detect',
    'unusual-client-port-connection',
    'web-application-activity',
    'icmp-event',
    'misc-activity',
    'network-scan',
    'not-suspicious',
    'protocol-command-decode',
    'string-detect',
    'unknown',
    'tcp-connection'
  ],

  PRIORITIES: [
    { value: '1', label: '1 (High)' },
    { value: '2', label: '2 (Medium-High)' },
    { value: '3', label: '3 (Medium)' },
    { value: '4', label: '4 (Low)' }
  ],

  REFERENCE_TYPES: [
    'arachnids',
    'bugtraq',
    'cve',
    'mcafee',
    'nessus',
    'url',
    'et',
    'tlp'
  ],

  CONTENT_MODIFIERS: [
    'nocase',
    'rawbytes',
    'depth',
    'offset',
    'distance',
    'within',
    'http_client_body',
    'http_cookie',
    'http_raw_cookie',
    'http_header',
    'http_raw_header',
    'http_method',
    'http_uri',
    'http_raw_uri',
    'http_stat_code',
    'http_stat_msg',
    'http_encode',
    'fast_pattern',
    'startswith',
    'endswith',
    'bsize'
  ],

  FLOWBIT_ACTIONS: [
    'set',
    'isset',
    'toggle',
    'unset',
    'setx',
    'issetx',
    'togglex',
    'unsetx'
  ],

  METADATA_KEYS: [
    'policy',
    'created_at',
    'updated_at',
    'former_category',
    'attack_target',
    'deployment',
    'tag',
    'signature_severity',
    'malware_family'
  ],

  ATTACK_TARGETS: [
    'Client_Endpoint',
    'Server_Endpoint',
    'Email_Servers',
    'Web_Servers',
    'DNS_Servers',
    'Database_Servers'
  ],

  DEPLOYMENTS: [
    'Perimeter',
    'Internal',
    'DMZ',
    'Datacenter'
  ],

  SIGNATURE_SEVERITIES: [
    'Minor',
    'Major',
    'Critical'
  ]
};
