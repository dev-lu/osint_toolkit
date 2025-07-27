import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  SwapHoriz as SwapIcon,
  HealthAndSafety as HealthAndSafetyIcon,
  GppMaybe as GppMaybeIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const OperationControls = ({ operation, onSwapOperation }) => {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, mb: 2 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        opacity: operation === 'defang' ? 1 : 0.5,
        transition: 'opacity 0.3s'
      }}>
        <HealthAndSafetyIcon color={operation === 'defang' ? 'success' : 'disabled'} />
        <Typography 
          variant="body1" 
          fontWeight={operation === 'defang' ? 'bold' : 'normal'}
          color={operation === 'defang' ? theme.palette.success.main : 'text.secondary'}
        >
          Defang IOCs (Make Safe)
        </Typography>
      </Box>
      
      <Tooltip title="Swap between defang and fang mode">
        <IconButton 
          onClick={onSwapOperation} 
          size="large"
          sx={{ 
            border: '2px solid',
            borderColor: 'primary.main',
            '&:hover': { backgroundColor: 'primary.light', color: 'white' }
          }}
        >
          <SwapIcon />
        </IconButton>
      </Tooltip>
      
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        opacity: operation === 'fang' ? 1 : 0.5,
        transition: 'opacity 0.3s'
      }}>
        <GppMaybeIcon color={operation === 'fang' ? 'warning' : 'disabled'} />
        <Typography 
          variant="body1" 
          fontWeight={operation === 'fang' ? 'bold' : 'normal'}
          color={operation === 'fang' ? theme.palette.warning.main : 'disabled'}
        >
          Fang IOCs (Restore Original)
        </Typography>
      </Box>
    </Box>
  );
};

export default OperationControls;
