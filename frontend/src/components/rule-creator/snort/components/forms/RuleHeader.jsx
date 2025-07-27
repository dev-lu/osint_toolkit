import React from 'react';
import { Grid, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { SNORT_CONSTANTS } from '../../constants/snortConstants';

export default function RuleHeader({ ruleHeader, handleRuleHeaderChange }) {
  const handleChange = (field, value) => {
    handleRuleHeaderChange(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={2}>
        <FormControl fullWidth size="small">
          <InputLabel>Action</InputLabel>
          <Select
            value={ruleHeader.action}
            label="Action"
            onChange={(e) => handleChange('action', e.target.value)}
          >
            {Object.values(SNORT_CONSTANTS.ACTIONS).map((action) => (
              <MenuItem key={action} value={action}>
                {action.toUpperCase()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      
      <Grid item xs={12} sm={6} md={2}>
        <FormControl fullWidth size="small">
          <InputLabel>Protocol</InputLabel>
          <Select
            value={ruleHeader.protocol}
            label="Protocol"
            onChange={(e) => handleChange('protocol', e.target.value)}
          >
            {Object.values(SNORT_CONSTANTS.PROTOCOLS).map((protocol) => (
              <MenuItem key={protocol} value={protocol}>
                {protocol.toUpperCase()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={6} sm={3} md={2}>
        <TextField
          fullWidth
          label="Source IP"
          value={ruleHeader.sourceIP}
          onChange={(e) => handleChange('sourceIP', e.target.value)}
          size="small"
          variant="outlined"
          placeholder="any, !192.168.1.0/24"
        />
      </Grid>

      <Grid item xs={6} sm={3} md={1}>
        <TextField
          fullWidth
          label="Source Port"
          value={ruleHeader.sourcePort}
          onChange={(e) => handleChange('sourcePort', e.target.value)}
          size="small"
          variant="outlined"
          placeholder="any, 80, !80"
        />
      </Grid>

      <Grid item xs={6} sm={3} md={1}>
        <FormControl fullWidth size="small">
          <InputLabel>Direction</InputLabel>
          <Select
            value={ruleHeader.direction}
            label="Direction"
            onChange={(e) => handleChange('direction', e.target.value)}
          >
            {Object.values(SNORT_CONSTANTS.DIRECTIONS).map((direction) => (
              <MenuItem key={direction} value={direction}>
                {direction}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={6} sm={3} md={2}>
        <TextField
          fullWidth
          label="Dest IP"
          value={ruleHeader.destIP}
          onChange={(e) => handleChange('destIP', e.target.value)}
          size="small"
          variant="outlined"
          placeholder="any, $HOME_NET"
        />
      </Grid>

      <Grid item xs={6} sm={3} md={2}>
        <TextField
          fullWidth
          label="Dest Port"
          value={ruleHeader.destPort}
          onChange={(e) => handleChange('destPort', e.target.value)}
          size="small"
          variant="outlined"
          placeholder="any, 80, [80,443]"
        />
      </Grid>
    </Grid>
  );
}
