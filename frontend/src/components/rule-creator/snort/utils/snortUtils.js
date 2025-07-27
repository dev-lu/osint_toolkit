export const snortUtils = {
  generateSID() {
    return Math.floor(Math.random() * 900000) + 100000; // Generate 6-digit SID
  },

  getCurrentDate() {
    return new Date().toISOString().split('T')[0];
  },

  validateRuleOptions(ruleOptions) {
    const errors = [];
    
    if (!ruleOptions.msg || !ruleOptions.msg.trim()) {
      errors.push('Message is required');
    }
    
    if (!ruleOptions.sid || !ruleOptions.sid.trim()) {
      errors.push('SID is required');
    }
    
    return errors;
  },

  buildRuleString(ruleHeader, ruleOptions, ruleContent, ruleMetadata) {
    const validationErrors = this.validateRuleOptions(ruleOptions);
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(', '));
    }

    // Build rule header
    let rule = `${ruleHeader.action} ${ruleHeader.protocol} ${ruleHeader.sourceIP} ${ruleHeader.sourcePort} ${ruleHeader.direction} ${ruleHeader.destIP} ${ruleHeader.destPort} (`;

    // Build rule options
    const options = [];
    
    // Required options
    options.push(`msg:"${ruleOptions.msg}"`);
    options.push(`sid:${ruleOptions.sid}`);
    options.push(`rev:${ruleOptions.rev}`);

    // Optional basic options
    if (ruleOptions.classtype) options.push(`classtype:${ruleOptions.classtype}`);
    if (ruleOptions.priority) options.push(`priority:${ruleOptions.priority}`);

    // Content options
    ruleContent.content.forEach(content => {
      let contentStr = `content:"${content.value}"`;
      if (content.modifiers && content.modifiers.length > 0) {
        contentStr += `; ${content.modifiers.join('; ')}`;
      }
      options.push(contentStr);
    });

    // PCRE options
    ruleContent.pcre.forEach(pcre => {
      options.push(`pcre:"${pcre.pattern}"`);
    });

    // Flowbits options
    ruleContent.flowbits.forEach(flowbit => {
      options.push(`flowbits:${flowbit.action},${flowbit.name}`);
    });

    // Threshold and detection filter
    if (ruleContent.threshold) options.push(`threshold:${ruleContent.threshold}`);
    if (ruleContent.detection_filter) options.push(`detection_filter:${ruleContent.detection_filter}`);

    // References
    ruleOptions.reference.forEach(ref => {
      options.push(`reference:${ref.type},${ref.value}`);
    });

    // Metadata
    const allMetadata = this.buildMetadata(ruleOptions.metadata, ruleMetadata);
    if (allMetadata.length > 0) {
      options.push(`metadata:${allMetadata.join(', ')}`);
    }

    rule += options.join('; ');
    rule += ')';

    return rule;
  },

  buildMetadata(basicMetadata, enhancedMetadata) {
    const metadata = [];
    
    // Basic metadata
    basicMetadata.forEach(meta => {
      metadata.push(`${meta.key} ${meta.value}`);
    });

    // Enhanced metadata
    if (enhancedMetadata.created_at) metadata.push(`created_at ${enhancedMetadata.created_at}`);
    if (enhancedMetadata.updated_at) metadata.push(`updated_at ${enhancedMetadata.updated_at}`);
    if (enhancedMetadata.policy) metadata.push(`policy ${enhancedMetadata.policy}`);
    if (enhancedMetadata.former_category) metadata.push(`former_category ${enhancedMetadata.former_category}`);
    if (enhancedMetadata.signature_severity) metadata.push(`signature_severity ${enhancedMetadata.signature_severity}`);
    
    enhancedMetadata.attack_target?.forEach(target => metadata.push(`attack_target ${target}`));
    enhancedMetadata.deployment?.forEach(deploy => metadata.push(`deployment ${deploy}`));
    enhancedMetadata.tag?.forEach(tag => metadata.push(`tag ${tag}`));
    enhancedMetadata.malware_family?.forEach(family => metadata.push(`malware_family ${family}`));

    return metadata;
  },

  exportRule(rule, sid) {
    const blob = new Blob([rule], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `snort_rule_${sid}.rules`;
    link.click();
    window.URL.revokeObjectURL(url);
  },

  resetConfirmation() {
    return window.confirm('Are you sure you want to reset the form? All data will be lost.');
  }
};
