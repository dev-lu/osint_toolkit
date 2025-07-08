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

import { templatesService } from '../service/api';
import TemplateCard from './TemplateCard';
import TemplateExampleDialog from '../common/TemplateExampleDialog';
import EditTemplateDialog from './EditTemplateDialog';
import LoadingSkeleton from './LoadingSkeleton';

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

export default function UseTemplateView() {
  const theme = useTheme();
  const [templates, setTemplates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [payload, setPayload] = useState({});
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [showExample, setShowExample] = useState(false);
  const [exampleTpl, setExampleTpl] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [tplToEdit, setTplToEdit] = useState(null);
  const [search, setSearch] = useState('');

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const data = await templatesService.getTemplates();
      setTemplates(Array.isArray(data) ? data : []);
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleSelect = tpl => {
    setSelected(tpl);
    setPayload({});
    setResult('');
  };

  const handlePayloadChange = (name, value) => {
    setPayload(prev => ({ ...prev, [name]: value }));
  };

  const isPayloadValid = useMemo(() => {
    if (!selected) return false;
    const fields = Array.isArray(selected.payload_fields) ? selected.payload_fields : [];
    return fields.every(field =>
      !field.required || (payload[field.name] && payload[field.name].trim())
    );
  }, [selected, payload]);

  const handleExecute = async () => {
    if (!selected) return;
    setExecuting(true);

    const execPayload = {
      template_id: selected.id,
      payload_data: payload,
    };

    if (selected.model) {
      execPayload.model_id = selected.model;
    }
    if (selected.temperature !== undefined) {
      execPayload.temperature = selected.temperature;
    }

    try {
      const data = await templatesService.executeTemplate(selected.id, execPayload);
      setResult(data.result);
      setSnackbar({
        open: true,
        message: 'Template executed!',
        severity: 'success'
      });
    } catch (err) {
      const detail = err.response?.data?.detail || err.message;
      setSnackbar({
        open: true,
        message: `Execution failed: ${JSON.stringify(detail)}`,
        severity: 'error'
      });
    } finally {
      setExecuting(false);
    }
  };


  const filtered = useMemo(() => {
    if (!search.trim()) return templates;
    const term = search.toLowerCase().trim();
    return templates.filter(t =>
      t.title.toLowerCase().includes(term) ||
      t.description.toLowerCase().includes(term)
    );
  }, [templates, search]);

  const onDragEnd = async result => {
    if (!result.destination) return;
    const items = Array.from(templates);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setTemplates(items);
    try {
      await templatesService.reorderTemplates(items.map(t => t.id));
    } catch {
      setSnackbar({ open: true, message: 'Failed to reorder', severity: 'error' });
    }
  };

  const handleTemplateDelete = async tpl => {
    if (!window.confirm(`Delete "${tpl.title}"? This cannot be undone.`)) return;
    try {
      await templatesService.deleteTemplate(tpl.id);
      setTemplates(prev => prev.filter(t => t.id !== tpl.id));
      if (selected?.id === tpl.id) setSelected(null);
      setSnackbar({ open: true, message: 'Template deleted!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    }
  };

  return (
    <Container maxWidth={false} sx={{ p: 0 }}>
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

      {loading ? (
        <LoadingSkeleton />
      ) : filtered.length === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          {search ? 'No templates match your search' : 'No templates available'}
        </Alert>
      ) : (
        <Box display="flex" sx={{ height: 'calc(100vh - 80px)' }}>
          {/* Sidebar */}
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="templateList">
              {provided => (
                <Box
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  sx={{
                    flex: '0 0 350px',
                    overflowY: 'auto',
                    pr: 1,
                    position: 'sticky',
                    top: 0,
                    maxHeight: '90%',
                  }}
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
                </Box>
              )}
            </Droppable>
          </DragDropContext>

          {/* Main Content */}
          <Box flex={1} sx={{ overflowY: 'auto', px: 1 }}>
            {selected ? (
              <Box>
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

                  <Typography variant="body2" color="text.secondary" paragraph sx={{ mt: 1 }}>
                    {selected.description}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

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

                {result && (
                  <StyledPaper elevation={2} sx={{ mt: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="h6" fontWeight={600}>Result</Typography>
                      <Tooltip title="Copy result">
                        <IconButton onClick={() => {
                          navigator.clipboard.writeText(result);
                          setSnackbar({ open: true, message: 'Copied!', severity: 'success' });
                        }}>
                          <CopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <ResultBox>
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
          </Box>
        </Box>
      )}

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
            setSnackbar({ open: true, message: 'Template updated!', severity: 'success' });
          }}
          onDelete={deletedId => {
            setTemplates(prev => prev.filter(t => t.id !== deletedId));
            if (selected?.id === deletedId) setSelected(null);
            setSnackbar({ open: true, message: 'Template deleted!', severity: 'success' });
          }}
          onClose={() => setEditOpen(false)}
        />
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar(s => ({ ...s, open: false }))}
          variant="filled"
          elevation={6}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
