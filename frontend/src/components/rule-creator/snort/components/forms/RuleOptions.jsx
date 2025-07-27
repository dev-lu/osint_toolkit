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
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import LinkIcon from '@mui/icons-material/Link';
import InfoIcon from '@mui/icons-material/Info';
import { SNORT_CONSTANTS } from '../../constants/snortConstants';

export default function RuleOptions({ ruleOptions, handleRuleOptionsChange }) {
  const [currentReference, setCurrentReference] = useState({ type: 'url', value: '' });
  const [currentMetadata, setCurrentMetadata] = useState({ key: '', value: '' });

  const handleChange = (field, value) => {
    handleRuleOptionsChange(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddReference = () => {
    if (!currentReference.value.trim()) {
      alert('Reference value is required.');
      return;
    }
    
    handleRuleOptionsChange(prev => ({
      ...prev,
      reference: [...prev.reference, { ...currentReference, value: currentReference.value.trim() }],
    }));
    
    setCurrentReference({ type: 'url', value: '' });
  };

  const handleDeleteReference = (index) => {
    handleRuleOptionsChange(prev => ({
      ...prev,
      reference: prev.reference.filter((_, i) => i !== index),
    }));
  };

  const handleAddMetadata = () => {
    if (!currentMetadata.key.trim() || !currentMetadata.value.trim()) {
      alert('Both metadata key and value are required.');
      return;
    }
    
    handleRuleOptionsChange(prev => ({
      ...prev,
      metadata: [...prev.metadata, { 
        key: currentMetadata.key.trim(), 
        value: currentMetadata.value.trim() 
      }],
    }));
    
    setCurrentMetadata({ key: '', value: '' });
  };

  const handleDeleteMetadata = (index) => {
    handleRuleOptionsChange(prev => ({
      ...prev,
      metadata: prev.metadata.filter((_, i) => i !== index),
    }));
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Message"
            value={ruleOptions.msg}
            onChange={(e) => handleChange('msg', e.target.value)}
            required
            size="small"
            variant="outlined"
            placeholder="Brief description of what this rule detects"
          />
        </Grid>

        <Grid item xs={6} sm={4}>
          <TextField
            fullWidth
            label="SID"
            value={ruleOptions.sid}
            onChange={(e) => handleChange('sid', e.target.value)}
            required
            size="small"
            variant="outlined"
            type="number"
            placeholder="Unique rule identifier"
          />
        </Grid>

        <Grid item xs={6} sm={4}>
          <TextField
            fullWidth
            label="Revision"
            value={ruleOptions.rev}
            onChange={(e) => handleChange('rev', e.target.value)}
            size="small"
            variant="outlined"
            type="number"
            placeholder="Rule revision number"
          />
        </Grid>

        <Grid item xs={6} sm={4}>
          <TextField
            fullWidth
            label="Priority"
            value={ruleOptions.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
            size="small"
            variant="outlined"
            type="number"
            placeholder="1-4 (1=highest)"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel>Class Type</InputLabel>
            <Select
              value={ruleOptions.classtype}
              label="Class Type"
              onChange={(e) => handleChange('classtype', e.target.value)}
            >
              <MenuItem value="">None</MenuItem>
              {SNORT_CONSTANTS.CLASSTYPES.map((classtype) => (
                <MenuItem key={classtype} value={classtype}>
                  {classtype}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* References Section */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          References
        </Typography>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Type</InputLabel>
              <Select
                value={currentReference.type}
                label="Type"
                onChange={(e) => setCurrentReference(prev => ({ ...prev, type: e.target.value }))}
              >
                {SNORT_CONSTANTS.REFERENCE_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type.toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={7}>
            <TextField
              fullWidth
              label="Reference Value"
              value={currentReference.value}
              onChange={(e) => setCurrentReference(prev => ({ ...prev, value: e.target.value }))}
              size="small"
              variant="outlined"
              placeholder="URL, CVE ID, etc."
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              variant="contained"
              startIcon={<AddCircleIcon />}
              onClick={handleAddReference}
              disabled={!currentReference.value.trim()}
              size="small"
              fullWidth
            >
              Add
            </Button>
          </Grid>
        </Grid>

        {ruleOptions.reference.length > 0 && (
          <List sx={{ mt: 1, maxHeight: 150, overflow: 'auto' }}>
            {ruleOptions.reference.map((ref, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <Tooltip title="Delete Reference">
                    <IconButton edge="end" onClick={() => handleDeleteReference(index)} size="small">
                      <DeleteIcon fontSize="small" color="error" />
                    </IconButton>
                  </Tooltip>
                }
                sx={{ py: 0.5 }}
              >
                <ListItemIcon sx={{ minWidth: 30 }}>
                  <LinkIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={`${ref.type.toUpperCase()}: ${ref.value}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      {/* Metadata Section */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Basic Metadata
        </Typography>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Key"
              value={currentMetadata.key}
              onChange={(e) => setCurrentMetadata(prev => ({ ...prev, key: e.target.value }))}
              size="small"
              variant="outlined"
              placeholder="policy, created_at, etc."
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Value"
              value={currentMetadata.value}
              onChange={(e) => setCurrentMetadata(prev => ({ ...prev, value: e.target.value }))}
              size="small"
              variant="outlined"
              placeholder="Metadata value"
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              variant="contained"
              startIcon={<AddCircleIcon />}
              onClick={handleAddMetadata}
              disabled={!currentMetadata.key.trim() || !currentMetadata.value.trim()}
              size="small"
              fullWidth
            >
              Add
            </Button>
          </Grid>
        </Grid>

        {ruleOptions.metadata.length > 0 && (
          <List sx={{ mt: 1, maxHeight: 150, overflow: 'auto' }}>
            {ruleOptions.metadata.map((meta, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <Tooltip title="Delete Metadata">
                    <IconButton edge="end" onClick={() => handleDeleteMetadata(index)} size="small">
                      <DeleteIcon fontSize="small" color="error" />
                    </IconButton>
                  </Tooltip>
                }
                sx={{ py: 0.5 }}
              >
                <ListItemIcon sx={{ minWidth: 30 }}>
                  <InfoIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={`${meta.key}: ${meta.value}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
}
