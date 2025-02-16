import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  PlayArrow as PlayArrowIcon,
} from '@mui/icons-material';
import MDEditor from '@uiw/react-md-editor';
import api from '../../api';

import { LoadingSkeleton } from './LoadingSkeleton';
import { StyledPaper } from './StyledComponents';
import TemplateCard from './TemplateCard';
import EditTemplateDialog from './EditTemplateDialog';
import TemplateExampleDialog from './TemplateExampleDialog';

const UseTemplate = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [payloadData, setPayloadData] = useState({});
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [showExample, setShowExample] = useState(false);
  const [exampleTemplate, setExampleTemplate] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [templateToEdit, setTemplateToEdit] = useState(null);

  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching templates...');
      const { data } = await api.get('/api/ai-templates', {
        params: {
          skip: 0,
          limit: 100
        }
      });
      console.log('Received templates:', data);
      setTemplates(Array.isArray(data) ? data : []);
      setError(null);
    } catch (error) {
      console.error('Error fetching templates:', error);
      setError('Failed to load templates. Please try again later.');
      setSnackbar({
        open: true,
        message: error.response?.data?.detail || 'Failed to fetch templates',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleTemplateSelect = useCallback((template) => {
    setSelectedTemplate(template);
    setPayloadData({});
    setResult('');
  }, []);

  const handleShowExample = useCallback((template) => {
    setExampleTemplate(template);
    setShowExample(true);
  }, []);

  const handleEditTemplate = useCallback((template) => {
    setTemplateToEdit(template);
    setEditDialogOpen(true);
  }, []);

  const handleTemplateUpdate = useCallback((updatedTemplate) => {
    setTemplates(prev => prev.map(t => 
      t.id === updatedTemplate.id ? updatedTemplate : t
    ));
    if (selectedTemplate?.id === updatedTemplate.id) {
      setSelectedTemplate(updatedTemplate);
    }
    setSnackbar({
      open: true,
      message: 'Template updated successfully!',
      severity: 'success',
    });
  }, [selectedTemplate?.id]);

  const handlePayloadChange = useCallback((fieldName, value) => {
    setPayloadData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  }, []);

  const isPayloadValid = useMemo(() => {
    if (!selectedTemplate) return false;
    return selectedTemplate.payload_fields.every(field => 
      !field.required || payloadData[field.name]?.trim()
    );
  }, [selectedTemplate, payloadData]);

  const executeTemplate = async () => {
    if (!isPayloadValid) return;
    
    setExecuting(true);
    setError(null);
    
    try {
      console.log('Executing template with payload:', payloadData);
      const { data } = await api.post(`/api/ai-templates/execute/${selectedTemplate.id}`, {
        template_id: selectedTemplate.id,
        payload_data: payloadData,
      });
      
      console.log('Template execution result:', data);
      setResult(data.result);
      
      setSnackbar({
        open: true,
        message: 'Template executed successfully!',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error executing template:', error);
      setError('Failed to execute template. Please try again.');
      setSnackbar({
        open: true,
        message: error.response?.data?.detail || 'Failed to execute template',
        severity: 'error',
      });
    } finally {
      setExecuting(false);
    }
  };

  const renderSelectedTemplate = () => {
    if (!selectedTemplate) {
      return (
        <StyledPaper elevation={3}>
          <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center"
            justifyContent="center"
            minHeight={300}
            gap={2}
          >
            <Typography variant="h6" color="text.secondary">
              Select a template to get started
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Choose from the available templates on the left
            </Typography>
          </Box>
        </StyledPaper>
      );
    }

    return (
      <Box>
        <StyledPaper elevation={3}>
          <Typography variant="h6" gutterBottom>
            {selectedTemplate.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {selectedTemplate.description}
          </Typography>

          {selectedTemplate.ai_agent_role && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom>
                Prompt Configuration
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                <strong>AI Agent Role:</strong> {selectedTemplate.ai_agent_role}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                <strong>AI Agent Task:</strong> {selectedTemplate.ai_agent_task}
              </Typography>
            </>
          )}
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle1" gutterBottom>
            Input Fields
          </Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            {selectedTemplate.payload_fields.map((field) => (
              <TextField
                key={field.name}
                label={field.name}
                value={payloadData[field.name] || ''}
                onChange={(e) => handlePayloadChange(field.name, e.target.value)}
                required={field.required}
                multiline
                rows={2}
                helperText={field.description}
                error={field.required && !payloadData[field.name]?.trim()}
              />
            ))}
          </Box>
          
          <Box display="flex" justifyContent="flex-end" mt={3}>
            <Button
              variant="contained"
              startIcon={executing ? <CircularProgress size={20} /> : <PlayArrowIcon />}
              onClick={executeTemplate}
              disabled={!isPayloadValid || executing}
            >
              Execute Template
            </Button>
          </Box>
        </StyledPaper>

        {result && (
          <StyledPaper elevation={3}>
            <Typography variant="h6" gutterBottom>
              Result
            </Typography>
            <MDEditor.Markdown sx={{backgroundColor: 'transparent', color: 'inherit'}} source={result} />
          </StyledPaper>
        )}
      </Box>
    );
  };

  return (
    <Box maxWidth="lg" margin="auto" padding={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Use AI Templates
        </Typography>
        <Button
          startIcon={<RefreshIcon />}
          onClick={fetchTemplates}
          disabled={loading}
        >
          Refresh Templates
        </Button>
      </Box>

      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      ) : templates.length === 0 ? (
        <Alert severity="info" sx={{ mb: 3 }}>No templates available</Alert>
      ) : (
        <Box display="flex" gap={3}>
          <Box flex={1}>
            <Typography variant="h6" gutterBottom>
              Available Templates
            </Typography>
            {templates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                selected={selectedTemplate?.id === template.id}
                onSelect={handleTemplateSelect}
                onShowExample={handleShowExample}
                onEdit={handleEditTemplate}
              />
            ))}
          </Box>

          <Box flex={2}>
            {renderSelectedTemplate()}
          </Box>
        </Box>
      )}

      <TemplateExampleDialog
        open={showExample}
        onClose={() => setShowExample(false)}
        template={exampleTemplate}
      />

      <EditTemplateDialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setTemplateToEdit(null);
        }}
        template={templateToEdit}
        onSave={handleTemplateUpdate}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UseTemplate;
