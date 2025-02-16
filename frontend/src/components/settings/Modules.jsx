import React, { useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { modulesState } from '../../state';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Switch from '@mui/material/Switch';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import api from '../../api';

export default function ModuleSettings() {
  const modules = useRecoilValue(modulesState);
  const setModules = useSetRecoilState(modulesState);

  useEffect(() => {
    console.log('Current modules state:', modules);
  }, [modules]);

  const handleModuleChange = async (moduleName) => {
    try {
      const currentEnabled = modules[moduleName].enabled;
      const endpoint = currentEnabled ? 'disable' : 'enable';
      
      const response = await api.post(`/api/settings/modules/${endpoint}/?module_name=${moduleName}`);
      console.log('API response:', response);
      
      const newState = { ...modules };
      newState[moduleName] = { ...newState[moduleName], enabled: !currentEnabled };
      setModules(newState);
    } catch (error) {
      console.error('Failed to update module status:', error);
    }
  };

  if (!modules || Object.keys(modules).length === 0) {
    return (
      <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
        <Alert severity="info">Loading modules...</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Modules
          </Typography>
          <Typography>
            Enable or disable modules based on your needs.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {Object.entries(modules).map(([name, module]) => (
              <Box
                key={name}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 1,
                  borderRadius: 1,
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <Typography variant="h6">{name}</Typography>
                <Switch
                  checked={!!module.enabled}
                  onChange={() => handleModuleChange(name)}
                />
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}