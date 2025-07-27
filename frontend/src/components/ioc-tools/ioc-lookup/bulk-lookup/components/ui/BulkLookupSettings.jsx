import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Switch,
  Alert,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SettingsIcon from '@mui/icons-material/Settings';
import api from '../../../../../../api';

export default function BulkLookupSettings({ services, onSettingsChange, serviceDefinitions }) {
  const [error, setError] = useState('');

  const handleToggle = (serviceName, currentValue) => {
    setError('');
    const newValue = !currentValue;
    const serviceDef = serviceDefinitions[serviceName];

    const keysToUpdate = (serviceDef?.requiredKeys && serviceDef.requiredKeys.length > 0)
      ? serviceDef.requiredKeys
      : [serviceName];

    const updatePromises = keysToUpdate.map(keyName =>
      api.put(`/api/apikeys/${keyName}/bulk_ioc_lookup?bulk_ioc_lookup=${newValue}`)
    );

    Promise.all(updatePromises)
      .then(() => {
        if (onSettingsChange) {
          onSettingsChange();
        }
      })
      .catch(err => {
        console.error(`Failed to update setting for ${serviceName}:`, err);
        setError(`Failed to update setting for ${serviceName}.`);
      });
  };

  return (
    <Accordion sx={{ mb: 2, boxShadow: 1, '&:before': { display: 'none' } }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="bulk-settings-content"
        id="bulk-settings-header"
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <SettingsIcon sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography>Bulk Lookup Service Settings</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        {error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert>}
        {services.length > 0 ? (
          <List dense>
            {services
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(({ name, is_bulk_lookup_enabled }) => (
                <ListItem key={name} secondaryAction={
                  <Switch
                    edge="end"
                    onChange={() => handleToggle(name, is_bulk_lookup_enabled)}
                    checked={is_bulk_lookup_enabled}
                    inputProps={{
                      'aria-labelledby': `switch-list-label-${name}`,
                    }}
                  />
                }>
                  <ListItemText
                    id={`switch-list-label-${name}`}
                    primary={serviceDefinitions[name]?.name || name}
                  />
                </ListItem>
              ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
            No services with API keys are configured. Please add keys in the main settings tab to enable them here.
          </Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );
}