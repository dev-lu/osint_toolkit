import api from '../../../api';

export const templatesService = {
  // Create a new AI template
  createTemplate: (data) =>
    api.post('/api/ai-templates', data).then(res => res.data),

  // Fetch all templates
  getTemplates: ({ skip = 0, limit = 100, user_id = null } = {}) =>
    api
      .get('/api/ai-templates', { params: { skip, limit, user_id } })
      .then(res => res.data),

  // Fetch one template by ID
  getTemplate: (templateId) =>
    api.get(`/api/ai-templates/${templateId}`).then(res => res.data),

  // Update an existing template
  updateTemplate: (templateId, data) =>
    api.put(`/api/ai-templates/${templateId}`, data).then(res => res.data),

  // Delete a template
  deleteTemplate: (templateId) =>
    api.delete(`/api/ai-templates/${templateId}`).then(res => res.data),

  // Execute a template
  executeTemplate: (templateId, executionData) =>
    api
      .post(`/api/ai-templates/execute/${templateId}`, executionData)
      .then(res => res.data),

  // Engineer a prompt
  engineerPrompt: (payload) =>
    api
      .post('/api/ai-templates/prompt-engineer', payload)
      .then(res => res.data),

  // Reorder templates
  reorderTemplates: (templateIds) =>
    api
      .post('/api/ai-templates/reorder', { template_ids: templateIds })
      .then(res => res.data),
};
