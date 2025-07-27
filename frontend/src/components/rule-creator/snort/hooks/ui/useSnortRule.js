import { useState, useEffect } from 'react';
import { snortUtils } from '../../utils/snortUtils';
import { SNORT_CONSTANTS } from '../../constants/snortConstants';

const initialRuleHeader = {
  action: SNORT_CONSTANTS.ACTIONS.ALERT,
  protocol: SNORT_CONSTANTS.PROTOCOLS.TCP,
  sourceIP: 'any',
  sourcePort: 'any',
  direction: SNORT_CONSTANTS.DIRECTIONS.TO,
  destIP: 'any',
  destPort: 'any',
};

const initialRuleOptions = {
  msg: '',
  sid: '',
  rev: '1',
  classtype: '',
  priority: '3',
  reference: [],
  metadata: [],
};

const initialRuleContent = {
  content: [],
  pcre: [],
  flowbits: [],
  threshold: '',
  detection_filter: '',
};

const initialRuleMetadata = {
  created_at: '',
  updated_at: '',
  policy: '',
  former_category: '',
  attack_target: [],
  deployment: [],
  tag: [],
  signature_severity: '',
  malware_family: [],
};

export function useSnortRule() {
  const [ruleHeader, setRuleHeader] = useState(initialRuleHeader);
  const [ruleOptions, setRuleOptions] = useState(initialRuleOptions);
  const [ruleContent, setRuleContent] = useState(initialRuleContent);
  const [ruleMetadata, setRuleMetadata] = useState(initialRuleMetadata);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [rulePreview, setRulePreview] = useState('');

  useEffect(() => {
    // Initialize with generated SID and current dates
    setRuleOptions(prev => ({
      ...prev,
      sid: snortUtils.generateSID().toString(),
    }));
    
    const currentDate = snortUtils.getCurrentDate();
    setRuleMetadata(prev => ({
      ...prev,
      created_at: currentDate,
      updated_at: currentDate,
    }));
  }, []);

  const generateRule = () => {
    try {
      return snortUtils.buildRuleString(ruleHeader, ruleOptions, ruleContent, ruleMetadata);
    } catch (error) {
      throw error;
    }
  };

  const handlePreview = () => {
    try {
      const rule = generateRule();
      setRulePreview(rule);
      setPreviewOpen(true);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleExport = () => {
    try {
      const rule = generateRule();
      snortUtils.exportRule(rule, ruleOptions.sid);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleReset = () => {
    if (snortUtils.resetConfirmation()) {
      setRuleHeader(initialRuleHeader);
      setRuleOptions(initialRuleOptions);
      setRuleContent(initialRuleContent);
      setRuleMetadata(initialRuleMetadata);
      setRulePreview('');
      setPreviewOpen(false);

      // Re-initialize with new SID and dates
      setRuleOptions(prev => ({
        ...prev,
        sid: snortUtils.generateSID().toString(),
      }));
      
      const currentDate = snortUtils.getCurrentDate();
      setRuleMetadata(prev => ({
        ...prev,
        created_at: currentDate,
        updated_at: currentDate,
      }));
    }
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setRulePreview('');
  };

  const isRuleValid = () => {
    return ruleOptions.msg.trim() && ruleOptions.sid.trim();
  };

  return {
    // State
    ruleHeader,
    ruleOptions,
    ruleContent,
    ruleMetadata,
    previewOpen,
    rulePreview,
    
    // State setters
    setRuleHeader,
    setRuleOptions,
    setRuleContent,
    setRuleMetadata,
    
    // Actions
    handlePreview,
    handleExport,
    handleReset,
    handleClosePreview,
    generateRule,
    isRuleValid,
  };
}
