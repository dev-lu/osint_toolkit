import React, { useState } from 'react';
import {
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Typography,
  Box,
  Autocomplete,
  Chip,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { SNORT_CONSTANTS } from '../../constants/snortConstants';

export default function RuleMetadata({ ruleMetadata, handleRuleMetadataChange }) {
  const [currentTag, setCurrentTag] = useState('');
  const [currentMalwareFamily, setCurrentMalwareFamily] = useState('');

  const handleChange = (field, value) => {
    handleRuleMetadataChange(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayChange = (field, value) => {
    handleRuleMetadataChange(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddTag = () => {
    if (!currentTag.trim()) {
      alert('Tag is required.');
      return;
    }
    
    if (ruleMetadata.tag.includes(currentTag.trim())) {
      alert('Tag already exists.');
      return;
    }
    
    handleRuleMetadataChange(prev => ({
      ...prev,
      tag: [...prev.tag, currentTag.trim()],
    }));
    
    setCurrentTag('');
  };

  const handleDeleteTag = (tagToDelete) => {
    handleRuleMetadataChange(prev => ({
      ...prev,
      tag: prev.tag.filter(tag => tag !== tagToDelete),
    }));
  };

  const handleAddMalwareFamily = () => {
    if (!currentMalwareFamily.trim()) {
      alert('Malware family is required.');
      return;
    }
    
    if (ruleMetadata.malware_family.includes(currentMalwareFamily.trim())) {
      alert('Malware family already exists.');
      return;
    }
    
    handleRuleMetadataChange(prev => ({
      ...prev,
      malware_family: [...prev.malware_family, currentMalwareFamily.trim()],
    }));
    
    setCurrentMalwareFamily('');
  };

  const handleDeleteMalwareFamily = (familyToDelete) => {
    handleRuleMetadataChange(prev => ({
      ...prev,
      malware_family: prev.malware_family.filter(family => family !== familyToDelete),
    }));
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={6} sm={4}>
          <TextField
            fullWidth
            label="Created At"
            type="date"
            value={ruleMetadata.created_at}
            onChange={(e) => handleChange('created_at', e.target.value)}
            size="small"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        <Grid item xs={6} sm={4}>
          <TextField
            fullWidth
            label="Updated At"
            type="date"
            value={ruleMetadata.updated_at}
            onChange={(e) => handleChange('updated_at', e.target.value)}
            size="small"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth size="small">
            <InputLabel>Policy</InputLabel>
            <Select
              value={ruleMetadata.policy}
              label="Policy"
              onChange={(e) => handleChange('policy', e.target.value)}
            >
              <MenuItem value="">None</MenuItem>
              {['Balanced', 'Connectivity', 'Security', 'Max-Detect'].map((policy) => (
                <MenuItem key={policy} value={policy}>
                  {policy}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel>Former Category</InputLabel>
            <Select
              value={ruleMetadata.former_category}
              label="Former Category"
              onChange={(e) => handleChange('former_category', e.target.value)}
            >
              <MenuItem value="">None</MenuItem>
              {SNORT_CONSTANTS.CLASSTYPES.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel>Signature Severity</InputLabel>
            <Select
              value={ruleMetadata.signature_severity}
              label="Signature Severity"
              onChange={(e) => handleChange('signature_severity', e.target.value)}
            >
              <MenuItem value="">None</MenuItem>
              {SNORT_CONSTANTS.SIGNATURE_SEVERITIES.map((severity) => (
                <MenuItem key={severity} value={severity}>
                  {severity}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
            <Autocomplete
              multiple
              options={SNORT_CONSTANTS.ATTACK_TARGETS}
              value={ruleMetadata.attack_target}
              onChange={(_, newValue) => handleArrayChange('attack_target', newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Attack Target" placeholder="Select targets" size="small" />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant="outlined" label={option} size="small" {...getTagProps({ index })} />
                ))
              }
              size="small"
            />
        </Grid>

        <Grid item xs={12} sm={6}>
            <Autocomplete
              multiple
              options={SNORT_CONSTANTS.DEPLOYMENTS}
              value={ruleMetadata.deployment}
              onChange={(_, newValue) => handleArrayChange('deployment', newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Deployment" placeholder="Select deployments" size="small" />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant="outlined" label={option} size="small" {...getTagProps({ index })} />
                ))
              }
              size="small"
            />
        </Grid>
      </Grid>

      {/* Custom Tags Section */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Custom Tags
        </Typography>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={12} sm={10}>
            <TextField
              fullWidth
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
              placeholder="Enter custom tag"
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              variant="contained"
              startIcon={<AddCircleIcon />}
              onClick={handleAddTag}
              disabled={!currentTag.trim()}
              size="small"
              fullWidth
            >
              Add
            </Button>
          </Grid>
        </Grid>

        {ruleMetadata.tag.length > 0 && (
          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {ruleMetadata.tag.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                onDelete={() => handleDeleteTag(tag)}
                size="small"
                variant="outlined"
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Malware Family Section */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Malware Family
        </Typography>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={12} sm={10}>
            <TextField
              fullWidth
              label="Add Malware Family"
              value={currentMalwareFamily}
              onChange={(e) => setCurrentMalwareFamily(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddMalwareFamily();
                }
              }}
              size="small"
              variant="outlined"
              placeholder="Enter malware family name"
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              variant="contained"
              startIcon={<AddCircleIcon />}
              onClick={handleAddMalwareFamily}
              disabled={!currentMalwareFamily.trim()}
              size="small"
              fullWidth
            >
              Add
            </Button>
          </Grid>
        </Grid>

        {ruleMetadata.malware_family.length > 0 && (
          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {ruleMetadata.malware_family.map((family, index) => (
              <Chip
                key={index}
                label={family}
                onDelete={() => handleDeleteMalwareFamily(family)}
                size="small"
                variant="outlined"
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
