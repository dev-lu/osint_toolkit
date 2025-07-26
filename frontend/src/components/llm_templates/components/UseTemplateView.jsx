import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Divider,
  Stack
} from '@mui/material';
import { styled, useTheme, alpha } from '@mui/material/styles';
import {
  Info as InfoIcon,
  Edit as EditIcon,
  PlayArrow as PlayArrowIcon,
  Search as SearchIcon,
  ContentCopy as CopyIcon,
  DragIndicator as DragIcon
} from '@mui/icons-material';
import MDEditor from '@uiw/react-md-editor';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { templatesService, TemplateAPIError } from '../service/api';
import TemplateCard from './TemplateCard';
import TemplateExampleDialog from '../common/TemplateExampleDialog';
import EditTemplateDialog from './EditTemplateDialog';
import LoadingSkeleton from './LoadingSkeleton';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 1.5,
  transition: 'box-shadow 0.2s ease-in-out',
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

const ResultBox = styled(Box)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.paper, 0.7),
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
}));

const SidebarContainer = styled(Box)(({ theme }) => ({
  flex: '0 0 350px',
  overflowY: 'auto',
  paddingRight: theme.spacing(1),
  position: 'sticky',
  top: 0,
  maxHeight: '90%',
}));

const MainContent = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
}));

/**
 * Custom hook for managing template state and operations
 */
const useTemplateManager = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await templatesService.getTemplates();
      setTemplates(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch templates:', err);
      setError(err instanceof TemplateAPIError ? err.message : 'Failed to load templates');
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const reorderTemplates = useCallback(async (sourceIndex, destinationIndex) => {
    const items = Array.from(templates);
    const [moved] = items.splice(sourceIndex, 1);
    items.splice(destinationIndex, 0, moved);
    
    // Optimistically update UI
    setTemplates(items);
    
    try {
      await templatesService.reorderTemplates(items.map(t => t.id));
    } catch (err) {
      console.error('Failed to reorder templates:', err);
      // Revert on failure
      fetchTemplates();
      throw err;
    }
  }, [templates, fetchTemplates]);

  const deleteTemplate = useCallback(async (templateId) => {
    try {
      await templatesService.deleteTemplate(templateId);
      setTemplates(prev => prev.filter(t => t.id !== templateId));
    } catch (err) {
      console.error('Failed to delete template:', err);
      throw err;
    }
  }, []);

  return {
    templates,
    setTemplates,
    loading,
    error,
    fetchTemplates,
    reorderTemplates,
    deleteTemplate
  };
};

/**
 * Custom hook for managing template execution
 */
const useTemplateExecution = () => {
  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState('');

  const executeTemplate = useCallback(async (template, payload) => {
    setExecuting(true);
    setResult('');

    try {
      const execPayload = {
        template_id: template.id,
        payload_data: payload,
      };

      if (template.model) {
        execPayload.override_model = template.model;
      }
      if (template.temperature !== undefined) {
        execPayload.override_temperature = template.temperature;
      }

      const data = await templatesService.executeTemplate(template.id, execPayload);
      setResult(data.result || '');
      return data;
    } finally {
      setExecuting(false);
    }
  }, []);

  const clearResult = useCallback(() => {
    setResult('');
  }, []);

  return {
    executing,
    result,
    executeTemplate,
    clearResult
  };
};

/**
 * Main UseTemplateView component
 */
export default function UseTemplateView() {
  const theme = useTheme();
  
  // State management hooks
  const {
    templates,
    setTemplates,
    loading,
    error: templatesError,
    fetchTemplates,
    reorderTemplates,
    deleteTemplate
  } = useTemplateManager();
  
  const {
    executing,
    result,
    executeTemplate,
    clearResult
  } = useTemplateExecution();

  // Local state
  const [selected, setSelected] = useState(null);
  const [payload, setPayload] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [showExample, setShowExample] = useState(false);
  const [exampleTpl, setExampleTpl] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [tplToEdit, setTplToEdit] = useState(null);
  const [search, setSearch] = useState('');

  // Effects
  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  // Event handlers
  const handleSelect = useCallback((tpl) => {
    setSelected(tpl);
    setPayload({});
    clearResult();
  }, [clearResult]);

  const handlePayloadChange = useCallback((name, value) => {
    setPayload(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleExecute = useCallback(async () => {
    if (!selected) return;

    try {
      await executeTemplate(selected, payload);
      showSnackbar('Template executed successfully!', 'success');
    } catch (err) {
      console.error('Template execution failed:', err);
      const message = err instanceof TemplateAPIError 
        ? err.message 
        : 'Template execution failed';
      showSnackbar(message, 'error');
    }
  }, [selected, payload, executeTemplate]);

  const handleDragEnd = useCallback(async (result) => {
    if (!result.destination) return;

    try {
      await reorderTemplates(result.source.index, result.destination.index);
    } catch (err) {
      showSnackbar('Failed to reorder templates', 'error');
    }
  }, [reorderTemplates]);

  const handleTemplateDelete = useCallback(async (tpl) => {
    if (!window.confirm(`Delete "${tpl.title}"? This cannot be undone.`)) return;

    try {
      await deleteTemplate(tpl.id);
      if (selected?.id === tpl.id) setSelected(null);
      showSnackbar('Template deleted successfully!', 'success');
    } catch (err) {
      console.error('Failed to delete template:', err);
      const message = err instanceof TemplateAPIError 
        ? err.message 
        : 'Failed to delete template';
      showSnackbar(message, 'error');
    }
  }, [deleteTemplate, selected]);

  const handleCopyResult = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(result);
      showSnackbar('Result copied to clipboard!', 'success');
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      showSnackbar('Failed to copy to clipboard', 'error');
    }
  }, [result]);

  // Utility functions
  const showSnackbar = useCallback((message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const closeSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  // Computed values
  const filtered = useMemo(() => {
    if (!search.trim()) return templates;
    const term = search.toLowerCase().trim();
    return templates.filter(t =>
      t.title.toLowerCase().includes(term) ||
      (t.description && t.description.toLowerCase().includes(term))
    );
  }, [templates, search]);

  const isPayloadValid = useMemo(() => {
    if (!selected) return false;
    const fields = Array.isArray(selected.payload_fields) ? selected.payload_fields : [];
    return fields.every(field =>
      !field.required || (payload[field.name] && payload[field.name].trim())
    );
  }, [selected, payload]);

  // Error handling
  if (templatesError) {
    return (
      <Container maxWidth={false} sx={{ p: 2 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {templatesError}
          <Button 
            size="small" 
            onClick={fetchTemplates} 
            sx={{ ml: 2 }}
          >
            Retry
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth={false} sx={{ p: 0 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" p={1}>
        <Typography variant="subtitle1" color="text.secondary">
          {filtered.length} {filtered.length === 1 ? 'template' : 'templates'}
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            size="small"
            placeholder="Search templates..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              sx: { borderRadius: 1 }
            }}
            sx={{ width: 220 }}
          />
        </Stack>
      </Box>

      {/* Main Content */}
      {loading ? (
        <LoadingSkeleton />
      ) : filtered.length === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          {search ? 'No templates match your search' : 'No templates available'}
        </Alert>
      ) : (
        <Box display="flex" sx={{ height: 'calc(100vh - 80px)' }}>
          {/* Sidebar */}
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="templateList">
              {provided => (
                <SidebarContainer
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {filtered.map((tpl, idx) => (
                    <Draggable key={tpl.id} draggableId={tpl.id} index={idx}>
                      {prov => (
                        <Box
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          {...prov.dragHandleProps}
                          sx={{ mb: 1, cursor: 'grab' }}
                        >
                          <TemplateCard
                            template={tpl}
                            selected={selected?.id === tpl.id}
                            onSelect={handleSelect}
                            onShowExample={tpl => {
                              setExampleTpl(tpl);
                              setShowExample(true);
                            }}
                            onEdit={tpl => {
                              setTplToEdit(tpl);
                              setEditOpen(true);
                            }}
                            onDelete={handleTemplateDelete}
                            dragIcon={
                              <DragIcon
                                fontSize="small"
                                sx={{
                                  mr: 1,
                                  color: 'text.disabled',
                                  '&:hover': { color: 'text.primary' },
                                }}
                              />
                            }
                          />
                        </Box>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </SidebarContainer>
              )}
            </Droppable>
          </DragDropContext>

          {/* Main Content Area */}
          <MainContent>
            {selected ? (
              <Box>
                {/* Template Header */}
                <StyledPaper elevation={2}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight={600}>
                      {selected.title}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="View Example">
                        <IconButton size="small" onClick={() => {
                          setExampleTpl(selected);
                          setShowExample(true);
                        }}>
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Template">
                        <IconButton size="small" onClick={() => {
                          setTplToEdit(selected);
                          setEditOpen(true);
                        }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Box>

                  {selected.description && (
                    <Typography variant="body2" color="text.secondary" paragraph sx={{ mt: 1 }}>
                      {selected.description}
                    </Typography>
                  )}

                  <Divider sx={{ my: 2 }} />

                  {/* Payload Fields */}
                  <Stack spacing={2} mt={1}>
                    {Array.isArray(selected.payload_fields) && selected.payload_fields.length > 0 ? (
                      selected.payload_fields.map(field => (
                        <TextField
                          key={field.name}
                          label={field.name}
                          value={payload[field.name] || ''}
                          onChange={e => handlePayloadChange(field.name, e.target.value)}
                          required={field.required}
                          multiline
                          rows={10}
                          helperText={field.description}
                          error={field.required && !payload[field.name]?.trim()}
                          size="small"
                          variant="outlined"
                          InputProps={{ sx: { borderRadius: 1.5, fontSize: '0.9rem' } }}
                          fullWidth
                        />
                      ))
                    ) : (
                      <TextField
                        label="Input"
                        value={payload.input || ''}
                        onChange={e => handlePayloadChange('input', e.target.value)}
                        multiline
                        rows={10}
                        size="small"
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  </Stack>

                  {/* Execute Button */}
                  <Box display="flex" justifyContent="flex-end" mt={3}>
                    <Button
                      variant="contained"
                      startIcon={executing ? <CircularProgress size={18} color="inherit" /> : <PlayArrowIcon />}
                      onClick={handleExecute}
                      disabled={!isPayloadValid || executing}
                      sx={{ borderRadius: 1.5, px: 3 }}
                    >
                      {executing ? 'Executing…' : 'Execute Template'}
                    </Button>
                  </Box>
                </StyledPaper>

                {/* Results */}
                {result && (
                  <StyledPaper elevation={2} sx={{ mt: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="h6" fontWeight={600}>Result</Typography>
                      <Tooltip title="Copy result">
                        <IconButton onClick={handleCopyResult}>
                          <CopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <ResultBox sx={{
                      border: 0,
                      backgroundColor: 'background.paper',
                      '& .wmde-markdown, & .wmde-markdown pre': {
                        backgroundColor: 'transparent !important',
                        padding: 0,
                      },
                    }}>
                      <MDEditor.Markdown source={result} />
                    </ResultBox>
                  </StyledPaper>
                )}
              </Box>
            ) : (
              <StyledPaper elevation={2} sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="h6" color="text.secondary">
                  Select a template to get started
                </Typography>
                {search && (
                  <Button variant="text" size="small" onClick={() => setSearch('')} sx={{ mt: 1 }}>
                    Clear search
                  </Button>
                )}
              </StyledPaper>
            )}
          </MainContent>
        </Box>
      )}

      {/* Dialogs */}
      <TemplateExampleDialog
        open={showExample}
        template={exampleTpl}
        onClose={() => setShowExample(false)}
      />

      {tplToEdit && (
        <EditTemplateDialog
          open={editOpen}
          template={tplToEdit}
          onSave={updated => {
            setTemplates(prev => prev.map(t => t.id === updated.id ? updated : t));
            if (selected?.id === updated.id) setSelected(updated);
            showSnackbar('Template updated successfully!', 'success');
          }}
          onDelete={deletedId => {
            setTemplates(prev => prev.filter(t => t.id !== deletedId));
            if (selected?.id === deletedId) setSelected(null);
            showSnackbar('Template deleted successfully!', 'success');
          }}
          onClose={() => setEditOpen(false)}
        />
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={closeSnackbar}
          variant="filled"
          elevation={6}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
