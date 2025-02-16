import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import MDEditor from '@uiw/react-md-editor';
import api from '../../api';

const EditTemplateDialog = ({ open, onClose, template, onSave, onDelete }) => {
  const [editedTemplate, setEditedTemplate] = useState({
    title: '',
    description: '',
    ai_agent_role: '',
    ai_agent_task: '',
    example_input_output: '',
    payload_fields: [],
    is_public: false,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (template && open) {
      setEditedTemplate(template);
    } else {
      setEditedTemplate({
        title: '',
        description: '',
        ai_agent_role: '',
        ai_agent_task: '',
        example_input_output: '',
        payload_fields: [],
        is_public: false,
      });
    }
  }, [template, open]);

  const handleSave = async () => {
    if (!editedTemplate) return;
    
    try {
      setSaving(true);
      const { data } = await api.put(`/api/ai-templates/${editedTemplate.id}`, editedTemplate);
      onSave(data);
      onClose();
    } catch (error) {
      console.error('Error saving template:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!editedTemplate?.id) return;
    
    try {
      await api.delete(`/api/ai-templates/${editedTemplate.id}`);
      onDelete(editedTemplate.id);
      onClose();
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Template</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} pt={1}>
          <TextField
            label="Title"
            value={editedTemplate.title || ''}
            onChange={(e) => setEditedTemplate(prev => ({ ...prev, title: e.target.value }))}
            fullWidth
            required
          />
          <TextField
            label="Description"
            value={editedTemplate.description || ''}
            onChange={(e) => setEditedTemplate(prev => ({ ...prev, description: e.target.value }))}
            fullWidth
            multiline
            rows={2}
          />
          <TextField
            label="AI Agent Role"
            value={editedTemplate.ai_agent_role || ''}
            onChange={(e) => setEditedTemplate(prev => ({ ...prev, ai_agent_role: e.target.value }))}
            fullWidth
            multiline
            rows={3}
            required
          />
          <TextField
            label="AI Agent Task"
            value={editedTemplate.ai_agent_task || ''}
            onChange={(e) => setEditedTemplate(prev => ({ 
              ...prev, 
              ai_agent_task: e.target.value 
            }))}
            fullWidth
            multiline
            rows={4}
            required
          />
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Example (Markdown)
            </Typography>
            <MDEditor
              value={editedTemplate.example_input_output || ''}
              onChange={(value) => setEditedTemplate(prev => ({ ...prev, example_input_output: value }))}
              preview="edit"
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={handleDelete}
          color="error"
          startIcon={<DeleteIcon />}
        >
          Delete
        </Button>
        <Box sx={{ flex: 1 }} />
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          disabled={saving}
          startIcon={saving && <CircularProgress size={20} />}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTemplateDialog;
