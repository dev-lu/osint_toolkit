import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  IconButton,
  Card,
  CardContent,
  Snackbar,
  Alert,
  Switch,
  FormControlLabel,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon,
  Preview as PreviewIcon,
  Help as HelpIcon,
  AutoFixHigh as AutoFixHighIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import MDEditor from '@uiw/react-md-editor';
import api from '../../api';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const PayloadField = ({ field, onUpdate, onDelete }) => (
  <Card sx={{ mb: 2, position: 'relative' }}>
    <CardContent>
      <Box display="flex" gap={2} alignItems="flex-start">
        <TextField
          label="Field Name"
          value={field.name}
          onChange={(e) => onUpdate({ ...field, name: e.target.value })}
          size="small"
          sx={{ flex: 1 }}
        />
        <TextField
          label="Description"
          value={field.description}
          onChange={(e) => onUpdate({ ...field, description: e.target.value })}
          size="small"
          sx={{ flex: 2 }}
        />
        <FormControlLabel
          control={
            <Switch
              checked={field.required}
              onChange={(e) => onUpdate({ ...field, required: e.target.checked })}
            />
          }
          label="Required"
        />
        <IconButton 
          color="error" 
          onClick={onDelete}
          sx={{ mt: 1 }}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    </CardContent>
  </Card>
);

const CreateTemplate = () => {
  const [template, setTemplate] = useState({
    title: '',
    description: '',
    example_input_output: '',
    ai_agent_role: '',
    ai_agent_task: '',
    payload_fields: [],
    is_public: true,
  });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEngineering, setIsEngineering] = useState(false);

  const handleFieldUpdate = useCallback((index, updatedField) => {
    setTemplate(prev => ({
      ...prev,
      payload_fields: prev.payload_fields.map((field, i) => 
        i === index ? updatedField : field
      ),
    }));
  }, []);

  const handleFieldDelete = useCallback((index) => {
    setTemplate(prev => ({
      ...prev,
      payload_fields: prev.payload_fields.filter((_, i) => i !== index),
    }));
  }, []);

  const addField = useCallback(() => {
    setTemplate(prev => ({
      ...prev,
      payload_fields: [
        ...prev.payload_fields,
        { name: '', description: '', required: true }
      ],
    }));
  }, []);

  const canEngineer = useMemo(() => {
    return template.title.trim() !== '' && template.description.trim() !== '';
  }, [template.title, template.description]);

  const handleEngineerPrompt = async () => {
    if (!canEngineer) return;
    setIsEngineering(true);
    try {
      const { data } = await api.post('/api/ai-templates/prompt-engineer', {
        title: template.title,
        description: template.description,
      });
      setTemplate(prev => ({
        ...prev,
        ai_agent_role: data.ai_agent_role,
        ai_agent_task: data.ai_agent_task,
        payload_fields: data.payload_fields,
        example_input_output: data.example_input_output,
      }));
      setSnackbar({
        open: true,
        message: 'Prompt engineered successfully!',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.detail || 'Failed to engineer prompt',
        severity: 'error',
      });
    } finally {
      setIsEngineering(false);
    }
  };

  const isValid = useMemo(() => {
    return template.title &&
           template.ai_agent_role &&
           template.ai_agent_task &&
           template.payload_fields.length > 0 &&
           template.payload_fields.every(field => 
             field.name && field.description
           );
  }, [template]);

  const handleSubmit = async () => {
    if (!isValid) return;
    
    setIsSubmitting(true);
    try {
      const response = await api.post('/api/ai-templates', template);
      
      setSnackbar({
        open: true,
        message: 'Template created successfully!',
        severity: 'success',
      });
      
      setTemplate({
        title: '',
        description: '',
        example_input_output: '',
        ai_agent_role: '',
        ai_agent_task: '',
        payload_fields: [],
        is_public: false,
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.detail || 'Failed to create template',
        severity: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box maxWidth="lg" margin="auto">
      <Typography variant="h4" gutterBottom>
        Create AI Template
      </Typography>

      <StyledPaper elevation={3}>
        <Typography variant="h6" gutterBottom>
          Basic Information
        </Typography>
        <Box display="flex" flexDirection="column" gap={2} position="relative">
          <TextField
            label="Title"
            value={template.title}
            size="small"
            onChange={(e) => setTemplate(prev => ({ ...prev, title: e.target.value }))}
            fullWidth
            required
          />
          <TextField
            label="Description"
            value={template.description}
            onChange={(e) => setTemplate(prev => ({ ...prev, description: e.target.value }))}
            fullWidth
            multiline
            rows={2}
          />
          {/* Conditionally render the Engineer Prompt button */}
          {canEngineer && (
            <Box position="absolute" top={2} right={2}>
              <Tooltip title="Engineer Prompt">
                <IconButton
                  color="primary"
                  size="small"
                  onClick={handleEngineerPrompt}
                  disabled={isEngineering}
                >
                  {isEngineering ? (
                    <CircularProgress size={24} />
                  ) : (
                    <AutoFixHighIcon />
                  )}
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>
      </StyledPaper>

      <StyledPaper elevation={3}>
        <Typography variant="h6" gutterBottom>
          Prompt Configuration
        </Typography>
        <Box display="flex" flexDirection="column" gap={3}>
          <TextField
            label="AI Agent Role"
            value={template.ai_agent_role}
            onChange={(e) => setTemplate(prev => ({ ...prev, ai_agent_role: e.target.value }))}
            fullWidth
            multiline
            rows={3}
            required
            helperText="Define an expert persona for the AI (e.g., a security engineer for patch note analysis)"
          />
          <TextField
            label="AI Agent Task"
            value={template.ai_agent_task}
            onChange={(e) => setTemplate(prev => ({ ...prev, ai_agent_task: e.target.value }))}
            fullWidth
            multiline
            rows={4}
            required
            helperText="Provide detailed instructions for the task. Use <field_name> tags to mark where payload data should be inserted."
          />
        </Box>
      </StyledPaper>

      <StyledPaper elevation={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            Payload Fields
            <Tooltip title="Define fields for the input that the user needs to provide to run the template. You can position the fields within the task. If you don't specify a position the data will be injected after the task.">
              <IconButton size="small" sx={{ ml: 1 }}>
                <HelpIcon />
              </IconButton>
            </Tooltip>
          </Typography>
          <Button
            startIcon={<AddIcon />}
            onClick={addField}
            variant="outlined"
          >
            Add Field
          </Button>
        </Box>
        {template.payload_fields.map((field, index) => (
          <PayloadField
            key={index}
            field={field}
            onUpdate={(updatedField) => handleFieldUpdate(index, updatedField)}
            onDelete={() => handleFieldDelete(index)}
          />
        ))}
      </StyledPaper>

      <StyledPaper elevation={3}>
        <Typography variant="h6" gutterBottom>
          Example Usage (Markdown)
        </Typography>
        <MDEditor
          value={template.example_input_output}
          onChange={(value) => setTemplate(prev => ({ ...prev, example_input_output: value }))}
          preview="edit"
        />
      </StyledPaper>

      <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
      {/*
        <FormControlLabel
          control={
            <Switch
              checked={template.is_public}
              onChange={(e) => setTemplate(prev => ({ ...prev, is_public: e.target.checked }))}
            />
          }
          label="Make this template public"
        />
        */}
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<PreviewIcon />}
            onClick={() => setPreviewOpen(true)}
          >
            Preview
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
          >
            Create Template
          </Button>
        </Box>
      </Box>

      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Template Preview</DialogTitle>
        <DialogContent>
          <Box p={2}>
            <Typography variant="h6">{template.title}</Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {template.description}
            </Typography>
            <Typography variant="subtitle1">Example:</Typography>
            <MDEditor.Markdown source={template.example_input_output} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateTemplate;
