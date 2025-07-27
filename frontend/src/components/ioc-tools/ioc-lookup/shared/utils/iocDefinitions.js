export const IOC_TYPES = {
    IPV4: 'IPv4',
    IPV6: 'IPv6',
    MD5: 'MD5',
    SHA1: 'SHA1',
    SHA256: 'SHA256',
    URL: 'URL',
    DOMAIN: 'Domain',
    EMAIL: 'Email',
    CVE: 'CVE',
    UNKNOWN: 'unknown',
};

export const IOC_TYPE_PATTERNS = {
    [IOC_TYPES.MD5]: /^[a-f0-9]{32}$/i,
    [IOC_TYPES.SHA1]: /^[a-f0-9]{40}$/i,
    [IOC_TYPES.SHA256]: /^[a-f0-9]{64}$/i,
    [IOC_TYPES.IPV4]: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    [IOC_TYPES.IPV6]: /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/i,
    [IOC_TYPES.URL]: /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i,
    [IOC_TYPES.DOMAIN]: /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}$/,
    [IOC_TYPES.EMAIL]: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    [IOC_TYPES.CVE]: /^CVE-[0-9]{4}-[0-9]{4,}$/i,
};

/**
 * Determines the type of an Indicator of Compromise (IOC) in a specific order.
 * @param {string} ioc - The IOC string to analyze.
 * @returns {string} The determined IOC type from IOC_TYPES.
 */
export const determineIocType = (ioc) => {
    const trimmedIoc = ioc.trim();

    // order is important to prevent misclassification
    const checkOrder = [
        IOC_TYPES.MD5,
        IOC_TYPES.SHA1,
        IOC_TYPES.SHA256,
        IOC_TYPES.IPV4,
        IOC_TYPES.IPV6,
        IOC_TYPES.CVE,
        IOC_TYPES.URL,
        IOC_TYPES.DOMAIN,
        IOC_TYPES.EMAIL,
    ];

    for (const type of checkOrder) {
        if (IOC_TYPE_PATTERNS[type].test(trimmedIoc)) {
            return type;
        }
    }

    return IOC_TYPES.UNKNOWN;
};