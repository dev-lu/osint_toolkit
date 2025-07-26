import { Paper, Box, Typography, Button, TextField, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Add as AddIcon, Delete as DeleteIcon, Language as LanguageIcon } from '@mui/icons-material';


export const ResizableTextField = styled(TextField)({
  '& textarea': {
    resize: 'vertical',
    minHeight: '60px',
    fontSize: '0.9rem',
  },
  '& .MuiInputBase-root': {
    borderRadius: '8px',
  },
});

// Generic section wrapper for form pages
export const FormSection = ({ title, actions, children }) => (
  <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }} elevation={3}>
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography variant="h6">{title}</Typography>
      {actions}
    </Box>
    <Box mt={2}>{children}</Box>
  </Paper>
);

// Single payload field editor
export const PayloadFieldEditor = ({ field, onUpdate, onDelete }) => (
  <Paper sx={{ mb: 1.5, p: 1.5, position: 'relative' }}>
    <Box display="flex" gap={2} alignItems="flex-start">
      <ResizableTextField
        label="Field Name"
        value={field.name}
        onChange={e => onUpdate({ ...field, name: e.target.value })}
        size="small"
        sx={{ flex: 1 }}
        required
        error={field.required && !field.name.trim()}
        helperText={field.required && !field.name.trim() ? 'Required' : ''}
      />
      <ResizableTextField
        label="Description"
        value={field.description}
        onChange={e => onUpdate({ ...field, description: e.target.value })}
        size="small"
        sx={{ flex: 2 }}
      />
      <Box display="flex" alignItems="center">
        <IconButton color="error" onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
      </Box>
    </Box>
  </Paper>
);

// List of payload fields with add control
export const PayloadFieldsEditor = ({ fields, onAdd, onUpdate, onDelete }) => (
  <Box>
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
      <Typography variant="body2">Payload fields are fields the user pastes / enters the data to that will be processed by the template.</Typography>
      <Button startIcon={<AddIcon />} size="small" onClick={onAdd}>Add Field</Button>
    </Box>
    {fields.length > 0 ? (
      fields.map((f, i) => (
        <PayloadFieldEditor
          key={i}
          field={f}
          onUpdate={updated => onUpdate(i, updated)}
          onDelete={() => onDelete(i)}
        />
      ))
    ) : (
      <Typography color="text.secondary">No payload fields defined.</Typography>
    )}
  </Box>
);

// Single static context editor
export const StaticContextEditor = ({ ctx, onUpdate, onDelete }) => (
  <Paper sx={{ mb: 1.5, p: 1.5 }}>
    <Box display="flex" flexDirection="column" gap={1.5}>
      <Box display="flex" gap={2} alignItems="center">
        <ResizableTextField
          label="Context Name"
          value={ctx.name}
          onChange={e => onUpdate({ ...ctx, name: e.target.value })}
          size="small"
          sx={{ flex: 1 }}
        />
        <ResizableTextField
          label="Description"
          value={ctx.description}
          onChange={e => onUpdate({ ...ctx, description: e.target.value })}
          size="small"
          sx={{ flex: 2 }}
        />
        <IconButton color="error" onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
      </Box>
      <ResizableTextField
        label="Content"
        value={ctx.content}
        onChange={e => onUpdate({ ...ctx, content: e.target.value })}
        multiline
        minRows={2}
        fullWidth
      />
    </Box>
  </Paper>
);

// List of static contexts with add control
export const StaticContextsEditor = ({ contexts, onAdd, onUpdate, onDelete }) => (
  <Box>
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
      <Typography variant="body1">Add static context</Typography>
      <Button startIcon={<AddIcon />} size="small" onClick={onAdd}>Add Context</Button>
    </Box>
    {contexts.length > 0 ? (
      contexts.map((c, i) => (
        <StaticContextEditor
          key={i}
          ctx={c}
          onUpdate={updated => onUpdate(i, updated)}
          onDelete={() => onDelete(i)}
        />
      ))
    ) : (
      <Typography color="text.secondary">No static contexts defined.</Typography>
    )}
  </Box>
);

// Single web context editor
export const WebContextEditor = ({ ctx, onUpdate, onDelete }) => (
  <Paper sx={{ mb: 1.5, p: 1.5 }}>
    <Box display="flex" flexDirection="column" gap={1.5}>
      <Box display="flex" gap={2} alignItems="center">
        <ResizableTextField
          label="Context Name"
          value={ctx.name}
          onChange={e => onUpdate({ ...ctx, name: e.target.value })}
          size="small"
          sx={{ flex: 1 }}
          required
          error={!ctx.name.trim()}
          helperText={!ctx.name.trim() ? 'Required' : ''}
        />
        <ResizableTextField
          label="Description"
          value={ctx.description}
          onChange={e => onUpdate({ ...ctx, description: e.target.value })}
          size="small"
          sx={{ flex: 2 }}
          placeholder="Optional description of what this website provides"
        />
        <IconButton color="error" onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
      </Box>
      <ResizableTextField
        label="Website URL"
        value={ctx.url}
        onChange={e => onUpdate({ ...ctx, url: e.target.value })}
        fullWidth
        required
        error={!ctx.url.trim()}
        helperText={!ctx.url.trim() ? 'Required - Enter a valid HTTP/HTTPS URL' : 'The website content will be fetched when the template is executed'}
        placeholder="https://example.com/page"
        InputProps={{
          startAdornment: <LanguageIcon sx={{ mr: 1, color: 'text.secondary' }} />
        }}
      />
    </Box>
  </Paper>
);

// List of web contexts with add control
export const WebContextsEditor = ({ contexts, onAdd, onUpdate, onDelete }) => (
  <Box>
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
      <Typography variant="body1">Add web context</Typography>
      <Button startIcon={<AddIcon />} size="small" onClick={onAdd}>Add Website</Button>
    </Box>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
      Web contexts allow you to fetch content from websites when the template is executed. The content will be automatically extracted and included in the prompt.
    </Typography>
    {contexts.length > 0 ? (
      contexts.map((c, i) => (
        <WebContextEditor
          key={i}
          ctx={c}
          onUpdate={updated => onUpdate(i, updated)}
          onDelete={() => onDelete(i)}
        />
      ))
    ) : (
      <Typography color="text.secondary">No web contexts defined.</Typography>
    )}
  </Box>
);
