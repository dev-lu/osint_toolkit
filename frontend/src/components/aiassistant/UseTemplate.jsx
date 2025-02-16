import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
  Snackbar,
  Alert,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Skeleton,
  IconButton,
  Tooltip,
  Divider,
  Container
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Public as PublicIcon,
  Lock as LockIcon,
  Info as InfoIcon,
  Edit as EditIcon,
  PlayArrow as PlayArrowIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import MDEditor from '@uiw/react-md-editor';
import api from '../../api';
import EditTemplateDialog from './EditTemplateDialog';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const LoadingSkeleton = () => (
  <Box>
    {[1, 2, 3].map((i) => (
      <Card key={i} sx={{ mb: 2 }}>
        <CardContent>
          <Skeleton variant="text" width="60%" height={32} />
          <Skeleton variant="text" width="80%" />
          <Box mt={2}>
            <Skeleton variant="rectangular" height={56} />
          </Box>
        </CardContent>
      </Card>
    ))}
  </Box>
);

const TemplateCard = ({ template, selected, onSelect, onShowExample, onEdit }) => (
  <Card 
    sx={{ 
      mb: 2,
      border: selected ? 2 : 0,
      borderColor: 'primary.main',
      cursor: 'pointer',
      '&:hover': {
        boxShadow: (theme) => theme.shadows[4],
      },
    }}
    onClick={() => onSelect(template)}
  >
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" component="div">
          {template.title}
        </Typography>
        <Chip
          icon={template.is_public ? <PublicIcon /> : <LockIcon />}
          label={template.is_public ? "Public" : "Private"}
          size="small"
          color={template.is_public ? "primary" : "default"}
        />
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        {template.description}
      </Typography>
    </CardContent>
    <CardActions>
      <Button 
        size="small" 
        startIcon={<InfoIcon />}
        onClick={(e) => {
          e.stopPropagation();
          onShowExample(template);
        }}
      >
        View Example
      </Button>
      <Button 
        size="small" 
        startIcon={<EditIcon />}
        onClick={(e) => {
          e.stopPropagation();
          onEdit(template);
        }}
      >
        Edit
      </Button>
    </CardActions>
  </Card>
);

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
        params: { skip: 0, limit: 100 }
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

  const handleEditTemplate = useCallback((template) => {
    setTemplateToEdit(template);
    setEditDialogOpen(true);
  }, []);

  const handleTemplateUpdate = useCallback((updatedTemplate) => {
    setTemplates(prev =>
      prev.map(t => (t.id === updatedTemplate.id ? updatedTemplate : t))
    );
    if (selectedTemplate?.id === updatedTemplate.id) {
      setSelectedTemplate(updatedTemplate);
    }
    setSnackbar({
      open: true,
      message: 'Template updated successfully!',
      severity: 'success',
    });
  }, [selectedTemplate?.id]);

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

  const handlePayloadChange = useCallback((fieldName, value) => {
    setPayloadData(prev => ({ ...prev, [fieldName]: value }));
  }, []);

  const handleTemplateDelete = useCallback((templateId) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
    if (selectedTemplate?.id === templateId) {
      setSelectedTemplate(null);
    }
    setSnackbar({
      open: true,
      message: 'Template deleted successfully!',
      severity: 'success',
    });
  }, [selectedTemplate?.id]);

  const isPayloadValid = useMemo(() => {
    if (!selectedTemplate) return false;
    return selectedTemplate.payload_fields.every(field =>
      !field.required || (payloadData[field.name] && payloadData[field.name].trim())
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

  const handleCloseExample = () => {
    setShowExample(false);
    setExampleTemplate(null);
  };

  return (
    <Container maxWidth={false}>
      <Box display="flex" justifyContent="flex-end" alignItems="center" mb={1}>
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
        <Box 
          display="flex" 
          gap={3}
          sx={{
            height: 'calc(100vh - 140px)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Left column: Template List - Scrollable */}
          <Box 
            flex="0 0 350px" 
            sx={{
              overflowY: 'auto',
              pr: 2,
              position: 'sticky',
              top: 0,
              maxHeight: '100%',
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(0,0,0,0.1)',
                borderRadius: '4px',
              }
            }}
          >
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

          {/* Right column: Template Details & Execution */}
          <Box 
            flex={1}
            sx={{
              overflowY: 'auto',
              maxHeight: '100%',
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(0,0,0,0.1)',
                borderRadius: '4px',
              }
            }}
          >
            {selectedTemplate ? (
              <Box>
                <StyledPaper elevation={3}>
                  <Typography variant="h6" gutterBottom>
                    {selectedTemplate.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {selectedTemplate.description}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" gutterBottom>
                    Input Data:
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
                        rows={field.name.toLowerCase().includes('prompt') ? 10 : 4}
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
                    <MDEditor.Markdown source={result} />
                  </StyledPaper>
                )}
              </Box>
            ) : (
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
            )}
          </Box>
        </Box>
      )}

      {/* Example Dialog */}
      <Dialog
        open={showExample}
        onClose={handleCloseExample}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Example</DialogTitle>
        <DialogContent>
          {exampleTemplate && (
            <Box p={0}>
              <MDEditor.Markdown source={exampleTemplate.example_input_output} />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseExample}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Template Dialog */}
      {templateToEdit && (
        <EditTemplateDialog
          open={editDialogOpen}
          onClose={() => {
            setEditDialogOpen(false);
            setTemplateToEdit(null);
          }}
          template={templateToEdit}
          onSave={handleTemplateUpdate}
          onDelete={handleTemplateDelete}
        />
      )}

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
    </Container>
  );
};

export default UseTemplate;
