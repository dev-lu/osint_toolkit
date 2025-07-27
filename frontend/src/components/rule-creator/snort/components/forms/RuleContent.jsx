import React, { useState } from 'react';
import {
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Box,
  Tooltip,
  Autocomplete,
  Chip,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import CodeIcon from '@mui/icons-material/Code';
import FlowIcon from '@mui/icons-material/AccountTree';
import { SNORT_CONSTANTS } from '../../constants/snortConstants';

export default function RuleContent({ ruleContent, handleRuleContentChange }) {
  const [currentContent, setCurrentContent] = useState({
    value: '',
    modifiers: [],
  });
  const [currentPcre, setCurrentPcre] = useState({
    pattern: '',
  });
  const [currentFlowbit, setCurrentFlowbit] = useState({
    action: 'set',
    name: '',
  });

  const handleChange = (field, value) => {
    handleRuleContentChange(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddContent = () => {
    if (!currentContent.value.trim()) {
      alert('Content value is required.');
      return;
    }
    
    handleRuleContentChange(prev => ({
      ...prev,
      content: [...prev.content, {
        value: currentContent.value.trim(),
        modifiers: [...currentContent.modifiers],
      }],
    }));
    
    setCurrentContent({ value: '', modifiers: [] });
  };

  const handleDeleteContent = (index) => {
    handleRuleContentChange(prev => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== index),
    }));
  };

  const handleAddPcre = () => {
    if (!currentPcre.pattern.trim()) {
      alert('PCRE pattern is required.');
      return;
    }
    
    handleRuleContentChange(prev => ({
      ...prev,
      pcre: [...prev.pcre, {
        pattern: currentPcre.pattern.trim(),
      }],
    }));
    
    setCurrentPcre({ pattern: '' });
  };

  const handleDeletePcre = (index) => {
    handleRuleContentChange(prev => ({
      ...prev,
      pcre: prev.pcre.filter((_, i) => i !== index),
    }));
  };

  const handleAddFlowbit = () => {
    if (!currentFlowbit.name.trim()) {
      alert('Flowbit name is required.');
      return;
    }
    
    handleRuleContentChange(prev => ({
      ...prev,
      flowbits: [...prev.flowbits, {
        action: currentFlowbit.action,
        name: currentFlowbit.name.trim(),
      }],
    }));
    
    setCurrentFlowbit({ action: 'set', name: '' });
  };

  const handleDeleteFlowbit = (index) => {
    handleRuleContentChange(prev => ({
      ...prev,
      flowbits: prev.flowbits.filter((_, i) => i !== index),
    }));
  };

  return (
    <Box>
      {/* Content Matching Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Content Matching
        </Typography>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Content"
              value={currentContent.value}
              onChange={(e) => setCurrentContent(prev => ({ ...prev, value: e.target.value }))}
              size="small"
              variant="outlined"
              placeholder="String to match (e.g., GET /admin)"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Autocomplete
              multiple
              options={SNORT_CONSTANTS.CONTENT_MODIFIERS}
              value={currentContent.modifiers}
              onChange={(_, newValue) => setCurrentContent(prev => ({ ...prev, modifiers: newValue }))}
              renderInput={(params) => (
                <TextField {...params} label="Modifiers" placeholder="Select modifiers" size="small" />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant="outlined" label={option} size="small" {...getTagProps({ index })} />
                ))
              }
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              variant="contained"
              startIcon={<AddCircleIcon />}
              onClick={handleAddContent}
              disabled={!currentContent.value.trim()}
              size="small"
              fullWidth
            >
              Add
            </Button>
          </Grid>
        </Grid>

        {ruleContent.content.length > 0 && (
          <List sx={{ mt: 1, maxHeight: 150, overflow: 'auto' }}>
            {ruleContent.content.map((content, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <Tooltip title="Delete Content">
                    <IconButton edge="end" onClick={() => handleDeleteContent(index)} size="small">
                      <DeleteIcon fontSize="small" color="error" />
                    </IconButton>
                  </Tooltip>
                }
                sx={{ py: 0.5 }}
              >
                <ListItemIcon sx={{ minWidth: 30 }}>
                  <SearchIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={`"${content.value}"`}
                  secondary={content.modifiers.length > 0 ? `Modifiers: ${content.modifiers.join(', ')}` : 'No modifiers'}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      {/* PCRE Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          PCRE (Perl Compatible Regular Expressions)
        </Typography>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={12} sm={10}>
            <TextField
              fullWidth
              label="PCRE Pattern"
              value={currentPcre.pattern}
              onChange={(e) => setCurrentPcre(prev => ({ ...prev, pattern: e.target.value }))}
              size="small"
              variant="outlined"
              placeholder="/pattern/flags (e.g., /GET\s+\/admin/i)"
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              variant="contained"
              startIcon={<AddCircleIcon />}
              onClick={handleAddPcre}
              disabled={!currentPcre.pattern.trim()}
              size="small"
              fullWidth
            >
              Add
            </Button>
          </Grid>
        </Grid>

        {ruleContent.pcre.length > 0 && (
          <List sx={{ mt: 1, maxHeight: 150, overflow: 'auto' }}>
            {ruleContent.pcre.map((pcre, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <Tooltip title="Delete PCRE">
                    <IconButton edge="end" onClick={() => handleDeletePcre(index)} size="small">
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
                  primary={pcre.pattern}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      {/* Flowbits Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Flowbits
        </Typography>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Action</InputLabel>
              <Select
                value={currentFlowbit.action}
                label="Action"
                onChange={(e) => setCurrentFlowbit(prev => ({ ...prev, action: e.target.value }))}
              >
                {SNORT_CONSTANTS.FLOWBIT_ACTIONS.map((action) => (
                  <MenuItem key={action} value={action}>
                    {action}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={7}>
            <TextField
              fullWidth
              label="Flowbit Name"
              value={currentFlowbit.name}
              onChange={(e) => setCurrentFlowbit(prev => ({ ...prev, name: e.target.value }))}
              size="small"
              variant="outlined"
              placeholder="flowbit_name"
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              variant="contained"
              startIcon={<AddCircleIcon />}
              onClick={handleAddFlowbit}
              disabled={!currentFlowbit.name.trim()}
              size="small"
              fullWidth
            >
              Add
            </Button>
          </Grid>
        </Grid>

        {ruleContent.flowbits.length > 0 && (
          <List sx={{ mt: 1, maxHeight: 150, overflow: 'auto' }}>
            {ruleContent.flowbits.map((flowbit, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <Tooltip title="Delete Flowbit">
                    <IconButton edge="end" onClick={() => handleDeleteFlowbit(index)} size="small">
                      <DeleteIcon fontSize="small" color="error" />
                    </IconButton>
                  </Tooltip>
                }
                sx={{ py: 0.5 }}
              >
                <ListItemIcon sx={{ minWidth: 30 }}>
                  <FlowIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={`${flowbit.action},${flowbit.name}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      {/* Threshold and Detection Filter */}
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Rate Limiting
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Threshold"
              value={ruleContent.threshold}
              onChange={(e) => handleChange('threshold', e.target.value)}
              size="small"
              variant="outlined"
              placeholder="type limit, track by_src, count 5, seconds 60"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Detection Filter"
              value={ruleContent.detection_filter}
              onChange={(e) => handleChange('detection_filter', e.target.value)}
              size="small"
              variant="outlined"
              placeholder="track by_src, count 10, seconds 60"
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
