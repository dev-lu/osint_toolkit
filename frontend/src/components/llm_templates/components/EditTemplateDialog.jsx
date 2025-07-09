import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider
} from '@mui/material';
import MDEditor from '@uiw/react-md-editor';

import { templatesService } from '../service/api';
import {
  ResizableTextField,
  PayloadFieldsEditor,
  StaticContextsEditor
} from '../common/TemplateFormComponents';

export default function EditTemplateDialog({
  open,
  onClose,
  template,
  onSave,
  onDelete: onDeleteSuccess,
}) {
  const [tpl, setTpl] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (open && template) {
      setTpl({
        ...template,
        payload_fields: Array.isArray(template.payload_fields) ? template.payload_fields : [],
        static_contexts: Array.isArray(template.static_contexts) ? template.static_contexts : [],
      });
    }
  }, [open, template]);

  const updateField = useCallback((key, value) => {
    setTpl(prev => ({ ...prev, [key]: value }));
  }, []);

  // payload fields handlers
  const addPayloadField = () =>
    setTpl(prev => ({
      ...prev,
      payload_fields: [...prev.payload_fields, { name: '', description: '', required: false }],
    }));
  const updatePayloadField = (idx, field) =>
    setTpl(prev => ({
      ...prev,
      payload_fields: prev.payload_fields.map((f, i) => (i === idx ? field : f)),
    }));
  const deletePayloadField = idx =>
    setTpl(prev => ({
      ...prev,
      payload_fields: prev.payload_fields.filter((_, i) => i !== idx),
    }));

  // static contexts handlers
  const addStaticContext = () =>
    setTpl(prev => ({
      ...prev,
      static_contexts: [...prev.static_contexts, { name: '', description: '', content: '' }],
    }));
  const updateStaticContext = (idx, ctx) =>
    setTpl(prev => ({
      ...prev,
      static_contexts: prev.static_contexts.map((c, i) => (i === idx ? ctx : c)),
    }));
  const deleteStaticContext = idx =>
    setTpl(prev => ({
      ...prev,
      static_contexts: prev.static_contexts.filter((_, i) => i !== idx),
    }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await templatesService.updateTemplate(tpl.id, tpl);
      onSave(updated);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to save template');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this template?')) return;
    setDeleting(true);
    try {
      await templatesService.deleteTemplate(tpl.id);
      onDeleteSuccess(tpl.id);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to delete template');
    } finally {
      setDeleting(false);
    }
  };

  if (!tpl) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Template</DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle1" gutterBottom>Basic Information</Typography>
        <ResizableTextField
          label="Title"
          fullWidth
          value={tpl.title}
          onChange={e => updateField('title', e.target.value)}
          required
          sx={{ mb: 2 }}
        />
        <ResizableTextField
          label="Description"
          fullWidth
          multiline
          minRows={2}
          value={tpl.description}
          onChange={e => updateField('description', e.target.value)}
        />

        <Box my={2}>
          <Typography variant="subtitle1" gutterBottom>Model & Temperature</Typography>
          <FormControl sx={{ minWidth: 200, mr: 2 }}>
            <InputLabel>LLM Model</InputLabel>
            <Select
              value={tpl.model}
              label="LLM Model"
              onChange={e => updateField('model', e.target.value)}
            >
              {['gpt-4o', 'gpt-4', 'gpt-4-turbo', 'gpt-35-turbo'].map(id => (
                <MenuItem key={id} value={id}>{id}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ display: 'inline-block', width: '40%' }}>
            <Typography>Temperature: {tpl.temperature.toFixed(2)}</Typography>
            <Slider
              value={tpl.temperature}
              onChange={(_, v) => updateField('temperature', v)}
              step={0.05}
              min={0}
              max={1}
              valueLabelDisplay="auto"
            />
          </Box>
        </Box>

        <Box my={2}>
          <Typography variant="subtitle1" gutterBottom>AI Agent Configuration</Typography>
          <ResizableTextField
            label="AI Agent Role"
            fullWidth
            multiline
            minRows={1}
            value={tpl.ai_agent_role}
            onChange={e => updateField('ai_agent_role', e.target.value)}
            sx={{ mb: 2 }}
          />
          <ResizableTextField
            label="AI Agent Task"
            fullWidth
            multiline
            minRows={2}
            value={tpl.ai_agent_task}
            onChange={e => updateField('ai_agent_task', e.target.value)}
          />
        </Box>

        <Box my={2}>
          <PayloadFieldsEditor
            fields={tpl.payload_fields}
            onAdd={addPayloadField}
            onUpdate={updatePayloadField}
            onDelete={deletePayloadField}
          />
        </Box>

        <Box my={2}>
          <StaticContextsEditor
            contexts={tpl.static_contexts}
            onAdd={addStaticContext}
            onUpdate={updateStaticContext}
            onDelete={deleteStaticContext}
          />
        </Box>

        <Box my={2}>
          <Typography variant="subtitle1" gutterBottom>Example (Markdown)</Typography>
          <MDEditor
            value={tpl.example_input_output}
            onChange={val => updateField('example_input_output', val)}
            height={200}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button color="error" onClick={handleDelete} disabled={deleting}>
          {deleting ? <CircularProgress size={20} /> : 'Delete'}
        </Button>
        <Box sx={{ flex: 1 }} />
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={saving}>
          {saving ? <CircularProgress size={20} /> : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
