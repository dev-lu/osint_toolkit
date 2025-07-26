import api from '../../../api';

/**
 * Custom error class for template API operations
 */
class TemplateAPIError extends Error {
  constructor(message, status, details = null) {
    super(message);
    this.name = 'TemplateAPIError';
    this.status = status;
    this.details = details;
  }
}

/**
 * Transform API error into a more user-friendly format
 */
const handleAPIError = (error) => {
  const status = error.response?.status || 500;
  const message = error.response?.data?.detail || error.message || 'An unexpected error occurred';
  const details = error.response?.data || null;
  
  console.error('Template API Error:', { status, message, details });
  throw new TemplateAPIError(message, status, details);
};

/**
 * Validate template data before sending to API
 */
const validateTemplateData = (data) => {
  const errors = [];
  
  if (!data.title?.trim()) {
    errors.push('Title is required');
  }
  
  if (!data.ai_agent_role?.trim()) {
    errors.push('AI agent role is required');
  }
  
  if (!data.ai_agent_task?.trim()) {
    errors.push('AI agent task is required');
  }
  
  if (!Array.isArray(data.payload_fields)) {
    errors.push('Payload fields must be an array');
  }
  
  if (data.temperature !== undefined && (data.temperature < 0 || data.temperature > 1)) {
    errors.push('Temperature must be between 0 and 1');
  }
  
  if (errors.length > 0) {
    throw new TemplateAPIError(`Validation failed: ${errors.join(', ')}`, 400);
  }
};

/**
 * Transform template data for API requests
 */
const transformTemplateForAPI = (template) => {
  return {
    ...template,
    payload_fields: Array.isArray(template.payload_fields) ? template.payload_fields : [],
    static_contexts: Array.isArray(template.static_contexts) ? template.static_contexts : [],
    web_contexts: Array.isArray(template.web_contexts) ? template.web_contexts : [],
    temperature: template.temperature || 0.7,
    model: template.model || 'gpt-4'
  };
};

/**
 * Templates service with comprehensive API operations
 */
export const templatesService = {
  /**
   * Create a new AI template
   * @param {Object} data - Template data
   * @returns {Promise<Object>} Created template
   */
  async createTemplate(data) {
    try {
      validateTemplateData(data);
      const transformedData = transformTemplateForAPI(data);
      
      console.log('Creating template:', transformedData.title);
      const response = await api.post('/api/ai-templates', transformedData);
      
      console.log('Template created successfully:', response.data.id);
      return response.data;
    } catch (error) {
      handleAPIError(error);
    }
  },

  /**
   * Fetch all templates with optional filtering
   * @param {Object} options - Query options
   * @param {number} options.skip - Number of records to skip
   * @param {number} options.limit - Maximum number of records
   * @param {string} options.user_id - Filter by user ID
   * @returns {Promise<Array>} List of templates
   */
  async getTemplates({ skip = 0, limit = 100, user_id = null } = {}) {
    try {
      console.log('Fetching templates:', { skip, limit, user_id });
      
      const params = { skip, limit };
      if (user_id) {
        params.user_id = user_id;
      }
      
      const response = await api.get('/api/ai-templates', { params });
      
      console.log(`Retrieved ${response.data.length} templates`);
      return response.data;
    } catch (error) {
      handleAPIError(error);
    }
  },

  /**
   * Fetch a single template by ID
   * @param {string} templateId - Template ID
   * @returns {Promise<Object>} Template data
   */
  async getTemplate(templateId) {
    try {
      if (!templateId?.trim()) {
        throw new TemplateAPIError('Template ID is required', 400);
      }
      
      console.log('Fetching template:', templateId);
      const response = await api.get(`/api/ai-templates/${templateId}`);
      
      console.log('Template retrieved successfully:', response.data.title);
      return response.data;
    } catch (error) {
      handleAPIError(error);
    }
  },

  /**
   * Update an existing template
   * @param {string} templateId - Template ID
   * @param {Object} data - Updated template data
   * @returns {Promise<Object>} Updated template
   */
  async updateTemplate(templateId, data) {
    try {
      if (!templateId?.trim()) {
        throw new TemplateAPIError('Template ID is required', 400);
      }
      
      validateTemplateData(data);
      const transformedData = transformTemplateForAPI(data);
      
      console.log('Updating template:', templateId);
      const response = await api.put(`/api/ai-templates/${templateId}`, transformedData);
      
      console.log('Template updated successfully:', response.data.id);
      return response.data;
    } catch (error) {
      handleAPIError(error);
    }
  },

  /**
   * Delete a template
   * @param {string} templateId - Template ID
   * @returns {Promise<Object>} Deletion result
   */
  async deleteTemplate(templateId) {
    try {
      if (!templateId?.trim()) {
        throw new TemplateAPIError('Template ID is required', 400);
      }
      
      console.log('Deleting template:', templateId);
      const response = await api.delete(`/api/ai-templates/${templateId}`);
      
      console.log('Template deleted successfully:', templateId);
      return response.data;
    } catch (error) {
      handleAPIError(error);
    }
  },

  /**
   * Execute a template with payload data
   * @param {string} templateId - Template ID
   * @param {Object} executionData - Execution parameters
   * @param {Object} executionData.payload_data - Field values
   * @param {number} executionData.override_temperature - Optional temperature override
   * @param {string} executionData.override_model - Optional model override
   * @returns {Promise<Object>} Execution result
   */
  async executeTemplate(templateId, executionData) {
    try {
      if (!templateId?.trim()) {
        throw new TemplateAPIError('Template ID is required', 400);
      }
      
      if (!executionData?.payload_data || typeof executionData.payload_data !== 'object') {
        throw new TemplateAPIError('Payload data is required and must be an object', 400);
      }
      
      // Validate temperature if provided
      if (executionData.override_temperature !== undefined) {
        const temp = executionData.override_temperature;
        if (typeof temp !== 'number' || temp < 0 || temp > 1) {
          throw new TemplateAPIError('Temperature must be a number between 0 and 1', 400);
        }
      }
      
      console.log('Executing template:', templateId);
      const response = await api.post(`/api/ai-templates/execute/${templateId}`, executionData);
      
      console.log('Template executed successfully:', templateId);
      return response.data;
    } catch (error) {
      handleAPIError(error);
    }
  },

  /**
   * Generate prompt configuration using AI
   * @param {Object} payload - Prompt engineering parameters
   * @param {string} payload.title - Template title
   * @param {string} payload.description - Template description
   * @param {string} payload.model_id - Model to use for generation
   * @returns {Promise<Object>} Generated prompt configuration
   */
  async engineerPrompt(payload) {
    try {
      if (!payload?.title?.trim()) {
        throw new TemplateAPIError('Title is required for prompt engineering', 400);
      }
      
      if (!payload?.description?.trim()) {
        throw new TemplateAPIError('Description is required for prompt engineering', 400);
      }
      
      const requestData = {
        title: payload.title.trim(),
        description: payload.description.trim(),
        model_id: payload.model_id || 'gpt-4'
      };
      
      console.log('Engineering prompt for:', requestData.title);
      const response = await api.post('/api/ai-templates/prompt-engineer', requestData);
      
      console.log('Prompt engineering completed successfully');
      return response.data;
    } catch (error) {
      handleAPIError(error);
    }
  },

  /**
   * Reorder templates
   * @param {Array<string>} templateIds - Ordered array of template IDs
   * @returns {Promise<Object>} Reorder result
   */
  async reorderTemplates(templateIds) {
    try {
      if (!Array.isArray(templateIds)) {
        throw new TemplateAPIError('Template IDs must be an array', 400);
      }
      
      if (templateIds.length === 0) {
        throw new TemplateAPIError('At least one template ID is required', 400);
      }
      
      // Validate all IDs are strings
      const invalidIds = templateIds.filter(id => typeof id !== 'string' || !id.trim());
      if (invalidIds.length > 0) {
        throw new TemplateAPIError('All template IDs must be non-empty strings', 400);
      }
      
      console.log(`Reordering ${templateIds.length} templates`);
      const response = await api.post('/api/ai-templates/reorder', { 
        template_ids: templateIds 
      });
      
      console.log('Templates reordered successfully');
      return response.data;
    } catch (error) {
      handleAPIError(error);
    }
  },

  /**
   * Validate template execution payload
   * @param {Object} template - Template object
   * @param {Object} payloadData - Payload data to validate
   * @returns {Object} Validation result with errors
   */
  validateExecutionPayload(template, payloadData) {
    const errors = [];
    const warnings = [];
    
    if (!template) {
      errors.push('Template is required');
      return { isValid: false, errors, warnings };
    }
    
    if (!payloadData || typeof payloadData !== 'object') {
      errors.push('Payload data must be an object');
      return { isValid: false, errors, warnings };
    }
    
    const payloadFields = Array.isArray(template.payload_fields) ? template.payload_fields : [];
    const providedFields = Object.keys(payloadData);
    
    // Check required fields
    const requiredFields = payloadFields.filter(field => field.required);
    for (const field of requiredFields) {
      const value = payloadData[field.name];
      if (!value || typeof value !== 'string' || !value.trim()) {
        errors.push(`Required field "${field.name}" is missing or empty`);
      }
    }
    
    // Check for unexpected fields
    const expectedFields = payloadFields.map(field => field.name);
    const unexpectedFields = providedFields.filter(field => !expectedFields.includes(field));
    if (unexpectedFields.length > 0) {
      warnings.push(`Unexpected fields: ${unexpectedFields.join(', ')}`);
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
};

export default templatesService;
export { TemplateAPIError };
