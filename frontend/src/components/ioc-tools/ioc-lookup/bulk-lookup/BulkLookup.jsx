import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Box, Typography, Alert, TextField, Button, CircularProgress, Paper, Grid, Divider } from '@mui/material';
import { TextFields } from '@mui/icons-material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import api from '../../../../api';
import { useServiceDefinitions } from '../shared/hooks/useServiceDefinitions';
import { useBulkLookupProcessor } from './hooks/useBulkLookupProcessor';
import BulkLookupResults from './components/ui/BulkLookupResults';
import BulkLookupSettings from './components/ui/BulkLookupSettings';

const BulkLookup = () => {
  const [iocsInput, setIocsInput] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [formError, setFormError] = useState('');
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [serviceSettings, setServiceSettings] = useState([]);
  
  const { serviceDefinitions, loading: serviceDefsLoading, getAvailableServices } = useServiceDefinitions();

  const {
    categorizedIocs,
    loading: processing,
    progress,
    processorError,
    setProcessorError,
    performLookup,
    orderedIocTypes,
  } = useBulkLookupProcessor();

  const fetchServiceStatuses = useCallback(async () => {
    if (serviceDefsLoading || Object.keys(serviceDefinitions).length === 0) {
      return;
    }
    
    setLoadingSettings(true);
    
    try {
      const response = await api.get('/api/apikeys/bulk_ioc_lookup');
      const dbKeyStatusMap = response.data || {};
      
      const availableServices = Object.entries(serviceDefinitions)
        .filter(([_, config]) => config.isAvailable)
        .reduce((acc, [key, config]) => {
          acc[key] = config;
          return acc;
        }, {});
      
      const settingsList = Object.keys(availableServices).map(serviceKey => {
        const serviceDef = availableServices[serviceKey];
        const requiredKeys = serviceDef.requiredKeys || [];
        
        let isEnabled;
        if (requiredKeys.length === 0) {
          isEnabled = dbKeyStatusMap[serviceKey] === true;
        } else {
          isEnabled = requiredKeys.every(keyName => dbKeyStatusMap[keyName] === true);
        }
        
        return { 
          name: serviceKey, 
          is_bulk_lookup_enabled: isEnabled 
        };
      });
      
      setServiceSettings(settingsList);
    } catch (error) {
      console.error("Failed to fetch bulk lookup service settings:", error);
      setFormError("Could not load settings for bulk lookup services.");
    } finally {
      setLoadingSettings(false);
    }
  }, [serviceDefinitions, serviceDefsLoading]);

  useEffect(() => {
    fetchServiceStatuses();
  }, [fetchServiceStatuses]);

  const handleTabChange = useCallback((event, newValue) => {
    setActiveTab(newValue);
  }, []);

  const handleIocsInputChange = useCallback((event) => {
    setIocsInput(event.target.value);
    if (processorError) setProcessorError('');
    if (formError) setFormError('');
  }, [processorError, setProcessorError, formError]);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    
    if (processing) return;
    
    const files = event.dataTransfer.files;
    if (files.length === 0) return;

    const file = files[0];
    const allowedMimeTypes = ['text/csv', 'text/markdown', 'text/plain'];
    const allowedExtensions = ['.csv', '.md', '.txt'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

    if (!allowedMimeTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      setFormError(`Invalid file type. Please drop a CSV, MD, or TXT file.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setIocsInput(e.target.result);
    reader.onerror = () => setFormError(`Error reading file: ${file.name}`);
    reader.readAsText(file);
  }, [processing]);

  const handleSubmit = useCallback(() => {
    if (formError) setFormError('');
    
    const enabledServicesForLookup = serviceSettings
      .filter(s => s.is_bulk_lookup_enabled)
      .map(s => s.name);
    
    performLookup(iocsInput, enabledServicesForLookup);
  }, [formError, serviceSettings, iocsInput, performLookup]);

  const hasEnabledServices = useMemo(() => {
    return serviceSettings.some(s => s.is_bulk_lookup_enabled);
  }, [serviceSettings]);

  const isSubmitDisabled = useMemo(() => {
    return processing || !iocsInput.trim() || !hasEnabledServices;
  }, [processing, iocsInput, hasEnabledServices]);

  if (loadingSettings) {
    return (
      <Box sx={{ mb: 2, p: 2 }}>
        <Typography variant="h5" gutterBottom>
          Bulk IOC Lookup
        </Typography>
        <Box display="flex" justifyContent="center" sx={{ my: 4 }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 2 }}>
      <BulkLookupSettings 
        services={serviceSettings}
        onSettingsChange={fetchServiceStatuses}
        serviceDefinitions={serviceDefinitions}
      />

        <Paper elevation={1} sx={{ p: 3, mb: 2 }}>
          <Grid container spacing={3}>
            {/* Text Input Section */}
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <TextFields sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 500 }}>
                    IOC Input
                  </Typography>
                </Box>
                <TextField
                  label="Enter IOCs (one per line)"
                  multiline
                  fullWidth
                  variant="outlined"
                  value={iocsInput}
                  onChange={handleIocsInputChange}
                  disabled={processing}
                  size="small"
                  sx={{
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      fontSize: '0.875rem',
                      height: '168px',
                      alignItems: 'flex-start'
                    },
                    '& .MuiOutlinedInput-input': {
                      height: '100% !important',
                      overflow: 'auto !important'
                    }
                  }}
                />
              </Box>
            </Grid>

            {/* File Drop Section */}
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <UploadFileIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 500 }}>
                    File Upload
                  </Typography>
                </Box>
                <Box
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  sx={{
                    border: '2px dashed', 
                    borderColor: 'grey.300', 
                    borderRadius: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '168px',
                    cursor: processing ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': { 
                      borderColor: processing ? 'grey.300' : 'primary.main',
                      backgroundColor: processing ? 'grey.50' : 'primary.50'
                    }
                  }}
                >
                  <UploadFileIcon 
                    sx={{ 
                      fontSize: 40, 
                      color: processing ? 'grey.400' : 'grey.500',
                      mb: 1
                    }} 
                  />
                  <Typography 
                    variant="body2" 
                    textAlign="center" 
                    sx={{ 
                      color: processing ? 'grey.400' : 'text.secondary',
                      px: 1,
                      lineHeight: 1.3
                    }}
                  >
                    Drop files here
                  </Typography>
                  <Typography 
                    variant="caption" 
                    textAlign="center" 
                    sx={{ 
                      color: processing ? 'grey.400' : 'text.secondary',
                      mt: 0.5
                    }}
                  >
                    (.txt, .csv, .md)
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Analyze Button Section */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  disabled={isSubmitDisabled}
                  size="medium"
                  sx={{ minWidth: 140 }}
                >
                  {processing ? 'Looking up...' : 'Analyze IOCs'}
                </Button>
                
                {!hasEnabledServices && (
                  <Typography variant="body2" color="warning.main" sx={{ fontStyle: 'italic', textAlign: 'center' }}>
                    Enable at least one service in settings above
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {formError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {formError}
          </Alert>
        )}

        <BulkLookupResults
          categorizedIocs={categorizedIocs}
          orderedIocTypes={orderedIocTypes}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          loading={processing}
          progress={progress}
          error={processorError}
        />
    </Box>
  );
};

export default BulkLookup;
