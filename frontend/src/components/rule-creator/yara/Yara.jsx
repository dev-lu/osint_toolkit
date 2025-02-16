import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Chip,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Autocomplete,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
} from '@mui/material';
import RulePreview from '../utils/RulePreview';

import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DescriptionIcon from '@mui/icons-material/Description';
import SecurityIcon from '@mui/icons-material/Security';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import CodeIcon from '@mui/icons-material/Code';
import DownloadIcon from '@mui/icons-material/Download';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PreviewIcon from '@mui/icons-material/Preview';

const initialMetadata = {
  ruleName: '',
  author: '',
  description: '',
  reference: '',
  hash: '',
  version: '1.0',
};

const initialConditions = {
  all: false,
  any: false,
  filesize: '',
  filetype: '',
};

export default function Yara() {
  const [metadata, setMetadata] = useState(initialMetadata);
  const [strings, setStrings] = useState([]);
  const [conditions, setConditions] = useState(initialConditions);
  const [currentString, setCurrentString] = useState({
    identifier: '',
    type: 'text',
    value: '',
    modifiers: [],
  });
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [rulePreview, setRulePreview] = useState('');

  const stringTypes = ['text', 'hex', 'regex', 'wide'];
  const modifiers = ['nocase', 'ascii', 'wide', 'fullword'];
  const fileTypes = ['exe', 'dll', 'pdf', 'doc', 'xls', 'ppt', 'zip', 'tar', 'rar'];

  const handleMetadataChange = (field, value) => {
    setMetadata(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddString = () => {
    if (currentString.identifier.trim() === '' || currentString.value.trim() === '') {
      alert('Identifier and Value are required.');
      return;
    }
    if (strings.some(s => s.identifier === currentString.identifier.trim())) {
      alert('Identifier must be unique.');
      return;
    }
    setStrings(prev => [...prev, { ...currentString, identifier: currentString.identifier.trim(), value: currentString.value.trim() }]);
    setCurrentString({
      identifier: '',
      type: 'text',
      value: '',
      modifiers: [],
    });
  };

  const handleDeleteString = (index) => {
    setStrings(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddTag = () => {
    const trimmedTag = currentTag.trim();
    if (trimmedTag === '' || tags.includes(trimmedTag)) {
      return;
    }
    setTags(prev => [...prev, trimmedTag]);
    setCurrentTag('');
  };

  const handleDeleteTag = (tagToDelete) => {
    setTags(prev => prev.filter(tag => tag !== tagToDelete));
  };

  const generateYaraRule = () => {
    let rule = `rule ${metadata.ruleName.replace(/\s+/g, '_')}`;
    
    if (tags.length > 0) {
      rule += ` : ${tags.join(' ')}`;
    }
    
    rule += ' {\n';
    
    // Metadata section
    rule += '  meta:\n';
    Object.entries(metadata).forEach(([key, value]) => {
      if (value) {
        rule += `    ${key} = "${value}"\n`;
      }
    });
    
    // Strings section
    if (strings.length > 0) {
      rule += '\n  strings:\n';
      strings.forEach(s => {
        const modifierStr = s.modifiers.length > 0 ? ` ${s.modifiers.join(' ')}` : '';
        if (s.type === 'hex') {
          rule += `    $${s.identifier} = { ${s.value} }${modifierStr}\n`;
        } else if (s.type === 'regex') {
          rule += `    $${s.identifier} = /${s.value}/${modifierStr}\n`;
        } else {
          rule += `    $${s.identifier} = "${s.value}"${modifierStr}\n`;
        }
      });
    }
    
    // Condition section
    rule += '\n  condition:\n';
    let conditionStr = [];
    
    if (conditions.all) {
      conditionStr.push('all of them');
    } else if (conditions.any) {
      conditionStr.push('any of them');
    }
    
    if (conditions.filesize) {
      conditionStr.push(`filesize < ${conditions.filesize}KB`);
    }
    
    if (conditions.filetype) {
      conditionStr.push(`uint16(0) == 0x${conditions.filetype}`);
    }
    
    rule += `    ${conditionStr.join(' and ')}\n`;
    rule += '}';
    
    return rule;
  };

  const handleExport = () => {
    const rule = generateYaraRule();
    const blob = new Blob([rule], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${metadata.ruleName.replace(/\s+/g, '_')}.yar`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handlePreview = () => {
    const rule = generateYaraRule();
    setRulePreview(rule);
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setRulePreview('');
  };

  return (
    <Box sx={{ width: '100%', p: { xs: 1, sm: 2 }, minHeight: '100vh' }}>
      <Typography variant="h5" align="center" gutterBottom>
        YARA Rule Builder
      </Typography>

      {/* Metadata Section */}
      <Accordion sx={{ border: 'none', boxShadow: 'none' }} defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            px: 1,
            py: 0.5,
            minHeight: '40px',
            '& .MuiAccordionSummary-content': {
              margin: 0,
            },
          }}
        >
          <Box display="flex" alignItems="center">
            <DescriptionIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="subtitle2">Rule Metadata</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 1, py: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Rule Name"
                value={metadata.ruleName}
                onChange={(e) => handleMetadataChange('ruleName', e.target.value)}
                required
                size="small"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Author"
                value={metadata.author}
                onChange={(e) => handleMetadataChange('author', e.target.value)}
                size="small"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={2}
                value={metadata.description}
                onChange={(e) => handleMetadataChange('description', e.target.value)}
                size="small"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Reference"
                value={metadata.reference}
                onChange={(e) => handleMetadataChange('reference', e.target.value)}
                size="small"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                label="Hash"
                value={metadata.hash}
                onChange={(e) => handleMetadataChange('hash', e.target.value)}
                size="small"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                label="Version"
                value={metadata.version}
                onChange={(e) => handleMetadataChange('version', e.target.value)}
                size="small"
                variant="outlined"
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Tags Section */}
      <Accordion sx={{ border: 'none', boxShadow: 'none', mt: 1 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            px: 1,
            py: 0.5,
            minHeight: '40px',
            '& .MuiAccordionSummary-content': {
              margin: 0,
            },
          }}
        >
          <Box display="flex" alignItems="center">
            <FingerprintIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="subtitle2">Tags</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 1, py: 1 }}>
          <Stack spacing={1}>
            <TextField
              label="Add Tag"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              size="small"
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <Tooltip title="Add Tag">
                    <IconButton onClick={handleAddTag} disabled={!currentTag.trim()} size="small">
                      <AddCircleIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                ),
              }}
              placeholder="Enter tag and press Enter or click Add"
            />
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => handleDeleteTag(tag)}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Stack>
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* Strings Section */}
      <Accordion sx={{ border: 'none', boxShadow: 'none', mt: 1 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            px: 1,
            py: 0.5,
            minHeight: '40px',
            '& .MuiAccordionSummary-content': {
              margin: 0,
            },
          }}
        >
          <Box display="flex" alignItems="center">
            <CodeIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="subtitle2">Strings</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 1, py: 1 }}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Identifier"
                value={currentString.identifier}
                onChange={(e) => setCurrentString(prev => ({
                  ...prev,
                  identifier: e.target.value,
                }))}
                required
                size="small"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Type</InputLabel>
                <Select
                  value={currentString.type}
                  label="Type"
                  onChange={(e) => setCurrentString(prev => ({
                    ...prev,
                    type: e.target.value,
                  }))}
                >
                  {stringTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type.toUpperCase()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Value"
                value={currentString.value}
                onChange={(e) => setCurrentString(prev => ({
                  ...prev,
                  value: e.target.value,
                }))}
                required
                size="small"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Autocomplete
                multiple
                options={modifiers}
                value={currentString.modifiers}
                onChange={(_, newValue) => setCurrentString(prev => ({
                  ...prev,
                  modifiers: newValue,
                }))}
                renderInput={(params) => (
                  <TextField {...params} label="Modifiers" placeholder="Select" size="small" />
                )}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={1}>
              <Button
                variant="contained"
                startIcon={<AddCircleIcon />}
                onClick={handleAddString}
                disabled={!currentString.identifier.trim() || !currentString.value.trim()}
                size="small"
                fullWidth
              >
                Add
              </Button>
            </Grid>
          </Grid>

          {/* List of Strings */}
          {strings.length > 0 && (
            <List sx={{ mt: 2, maxHeight: 200, overflow: 'auto' }}>
              {strings.map((string, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <Tooltip title="Delete String">
                      <IconButton edge="end" onClick={() => handleDeleteString(index)} size="small">
                        <DeleteIcon fontSize="small" color="error" />
                      </IconButton>
                    </Tooltip>
                  }
                  sx={{ py: 0.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 30 }}>
                    <CodeIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`$${string.identifier}`}
                    secondary={
                      <>
                        <Typography component="span" variant="caption" color="text.primary">
                          Type: {string.type.toUpperCase()}
                        </Typography>
                        {string.modifiers.length > 0 && ` | Modifiers: ${string.modifiers.join(', ')}`}
                        <br />
                        <Typography component="span" variant="caption" color="text.secondary">
                          Value: {string.value}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Conditions Section */}
      <Accordion sx={{ border: 'none', boxShadow: 'none', mt: 1 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            px: 1,
            py: 0.5,
            minHeight: '40px',
            '& .MuiAccordionSummary-content': {
              margin: 0,
            },
          }}
        >
          <Box display="flex" alignItems="center">
            <SecurityIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="subtitle2">Conditions</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 1, py: 1 }}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>String Match</InputLabel>
                <Select
                  value={conditions.all ? 'all' : conditions.any ? 'any' : ''}
                  label="String Match"
                  onChange={(e) => {
                    const value = e.target.value;
                    setConditions(prev => ({
                      ...prev,
                      all: value === 'all',
                      any: value === 'any',
                    }));
                  }}
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="all">All of them</MenuItem>
                  <MenuItem value="any">Any of them</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={4}>
              <TextField
                fullWidth
                label="File Size (KB)"
                type="number"
                value={conditions.filesize}
                onChange={(e) => setConditions(prev => ({
                  ...prev,
                  filesize: e.target.value,
                }))}
                size="small"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>File Type</InputLabel>
                <Select
                  value={conditions.filetype}
                  label="File Type"
                  onChange={(e) => setConditions(prev => ({
                    ...prev,
                    filetype: e.target.value,
                  }))}
                >
                  <MenuItem value="">None</MenuItem>
                  {fileTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type.toUpperCase()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Export and Preview Buttons */}
      <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <Button
            variant="outlined"
            startIcon={<PreviewIcon />}
            onClick={handlePreview}
            disabled={metadata.ruleName.trim() === ''}
            size="small"
          >
            Preview Rule
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
            disabled={metadata.ruleName.trim() === ''}
            size="small"
          >
            Export YARA Rule
          </Button>
        </Stack>
      </Box>

      {/* Preview Dialog */}
      <RulePreview open={previewOpen} onClose={handleClosePreview} rulePreview={rulePreview} />
    </Box>
  );
}
