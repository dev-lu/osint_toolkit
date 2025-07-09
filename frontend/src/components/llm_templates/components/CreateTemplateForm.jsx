import { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Button,
  Typography,
  IconButton,
  Snackbar,
  Alert,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  CircularProgress,
  FormHelperText,
} from '@mui/material';
import { AutoFixHigh as AutoFixHighIcon, Preview as PreviewIcon, Help as HelpIcon } from '@mui/icons-material';
import MDEditor from '@uiw/react-md-editor';

import { templatesService } from '../service/api';
import TemplateExampleDialog from '../common/TemplateExampleDialog';
import {
  FormSection,
  ResizableTextField,
  PayloadFieldsEditor,
  StaticContextsEditor
} from '../common/TemplateFormComponents';

export default function CreateTemplateForm() {
  const [template, setTemplate] = useState({
    title: '',
    description: '',
    ai_agent_role: '',
    ai_agent_task: '',
    payload_fields: [],
    static_contexts: [],
    example_input_output: '',
    is_public: true,
    temperature: 0.7,
    model: 'gpt-4o',
  });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEngineering, setIsEngineering] = useState(false);

  const availableModels = [
    { id: 'gpt-4o', name: 'GPT-4o' },
    { id: 'gpt-4', name: 'GPT-4' },
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
    { id: 'gpt-35-turbo', name: 'GPT-3.5 Turbo' }
  ];

  // Payload fields handlers
  const handleFieldUpdate = useCallback((idx, updated) => {
    setTemplate(t => ({
      ...t,
      payload_fields: t.payload_fields.map((f, i) => i === idx ? updated : f)
    }));
  }, []);
  const handleFieldDelete = useCallback(idx => {
    setTemplate(t => ({
      ...t,
      payload_fields: t.payload_fields.filter((_, i) => i !== idx)
    }));
  }, []);
  const addField = () => setTemplate(t => ({
    ...t,
    payload_fields: [...t.payload_fields, { name: '', description: '', required: true }]
  }));

  // Static contexts handlers
  const updateStatic = useCallback((idx, updated) => {
    setTemplate(t => ({
      ...t,
      static_contexts: t.static_contexts.map((c, i) => i === idx ? updated : c)
    }));
  }, []);
  const deleteStatic = useCallback(idx => {
    setTemplate(t => ({
      ...t,
      static_contexts: t.static_contexts.filter((_, i) => i !== idx)
    }));
  }, []);
  const addStatic = () => setTemplate(t => ({
    ...t,
    static_contexts: [...t.static_contexts, { name: '', description: '', content: '' }]
  }));

  // Enable prompt engineering once title and description are set
  const canEngineer = useMemo(() => template.title.trim() && template.description.trim(), [template]);
  const handleEngineer = async () => {
    if (!canEngineer) return;
    setIsEngineering(true);
    try {
      const data = await templatesService.engineerPrompt({
        title: template.title,
        description: template.description,
        model_id: template.model,
      });
      setTemplate(t => ({
        ...t,
        ai_agent_role: data.ai_agent_role,
        ai_agent_task: data.ai_agent_task,
        payload_fields: data.payload_fields,
        example_input_output: data.example_input_output,
      }));
      setSnackbar({ open: true, message: 'Prompt engineered!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    } finally {
      setIsEngineering(false);
    }
  };

  // Validation for final submit
  const isValid = useMemo(() => {
    const okTitle = template.title.trim();
    const okRole = template.ai_agent_role.trim();
    const okTask = template.ai_agent_task.trim();
    const okFields = template.payload_fields.every(f => !f.required || f.name.trim());
    return okTitle && okRole && okTask && okFields;
  }, [template]);

  const handleSubmit = async () => {
    if (!isValid) return;
    setIsSubmitting(true);
    try {
      await templatesService.createTemplate(template);
      setSnackbar({ open: true, message: 'Template created!', severity: 'success' });
      // reset form
      setTemplate({
        title: '', description: '', ai_agent_role: '', ai_agent_task: '',
        payload_fields: [], static_contexts: [], example_input_output: '',
        is_public: true, temperature: 0.7, model: 'gpt-4o',
      });
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box width="90%" mx="auto" pt={2}>
      <FormSection
        title="Basic Information"
        actions={
          <Tooltip title="Generate template based on title and description" arrow>
            <IconButton onClick={handleEngineer} disabled={!canEngineer}>
              {isEngineering ? <CircularProgress size={24} /> : <AutoFixHighIcon />}
            </IconButton>
          </Tooltip>
        }
      >
        <ResizableTextField
          label="Title"
          value={template.title}
          onChange={e => setTemplate({ ...template, title: e.target.value })}
          fullWidth required
          error={!template.title.trim()}
          helperText={!template.title.trim() ? 'Enter a concise template title (required)' : 'Unique name for your template.'}
        />
        <Box mt={2}>
          <ResizableTextField
            label="Description"
            value={template.description}
            onChange={e => setTemplate({ ...template, description: e.target.value })}
            fullWidth multiline minRows={2}
            helperText="Summarize what this template is for (optional)."
          />
        </Box>
      </FormSection>

      <FormSection title="Model & Temperature">
        <Box display="flex" alignItems="center" gap={2}>
          <FormControl sx={{ minWidth: 400 }}>
            <InputLabel>LLM Model</InputLabel>
            <Select
              value={template.model}
              label="LLM Model"
              onChange={e => setTemplate({ ...template, model: e.target.value })}
            >
              {availableModels.map(m => (
                <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>
              ))}
            </Select>
            <FormHelperText>Choose the AI model version for generation.</FormHelperText>
          </FormControl>
          <Box sx={{ flex: 1 }}>
            <Typography>Temperature: {template.temperature.toFixed(2)}</Typography>
            <Slider
              value={template.temperature}
              onChange={(_, v) => setTemplate({ ...template, temperature: v })}
              step={0.05} min={0} max={1} valueLabelDisplay="auto"
            />
            <FormHelperText>Higher values yield more varied responses.</FormHelperText>
          </Box>
          <Tooltip title="Higher = more random">
            <HelpIcon />
          </Tooltip>
        </Box>
      </FormSection>

      <FormSection title="Prompt Configuration">
        <ResizableTextField
          label="AI Agent Role"
          value={template.ai_agent_role}
          onChange={e => setTemplate({ ...template, ai_agent_role: e.target.value })}
          fullWidth multiline minRows={1}
          required error={!template.ai_agent_role.trim()}
          helperText={!template.ai_agent_role.trim() ? 'Define the AI persona (required)' : 'E.g., Customer support expert.'}
        />
        <Box mt={2}>
          <ResizableTextField
            label="AI Agent Task"
          value={template.ai_agent_task}
          onChange={e => setTemplate({ ...template, ai_agent_task: e.target.value })}
          fullWidth multiline minRows={2}
          required error={!template.ai_agent_task.trim()}
          helperText={!template.ai_agent_task.trim() ? 'Describe the task (required)' : 'E.g., Generate a friendly response.'}
        />
        </Box>
      </FormSection>

      <FormSection title="Payload Fields">
        <PayloadFieldsEditor
          fields={template.payload_fields}
          onAdd={addField}
          onUpdate={handleFieldUpdate}
          onDelete={handleFieldDelete}
        />
        <FormHelperText sx={{ mt: 1 }}>Set user-input variables and mark them as required if needed.</FormHelperText>
      </FormSection>

      <FormSection title="Static Contexts">
        <StaticContextsEditor
          contexts={template.static_contexts}
          onAdd={addStatic}
          onUpdate={updateStatic}
          onDelete={deleteStatic}
        />
        <FormHelperText sx={{ mt: 1 }}>Include fixed content like guidelines or reference info.</FormHelperText>
      </FormSection>

      <FormSection title="Example Usage (Markdown)">
        <MDEditor
          value={template.example_input_output}
          onChange={val => setTemplate({ ...template, example_input_output: val })}
          preview="edit"
          height={200}
        />
        <FormHelperText sx={{ mt: 1 }}>Provide example input & output to guide users.</FormHelperText>
      </FormSection>

      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
        <Button startIcon={<PreviewIcon />} onClick={() => setPreviewOpen(true)}>
          Preview
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!isValid || isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          sx={{ ml: 2 }}
        >
          {isSubmitting ? 'Creating…' : 'Create Template'}
        </Button>
      </Box>

      <TemplateExampleDialog
        open={previewOpen}
        template={template}
        onClose={() => setPreviewOpen(false)}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}