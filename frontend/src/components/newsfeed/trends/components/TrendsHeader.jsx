import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

const TIME_RANGES = [
  { value: '8h', label: 'Last 8 Hours' },
  { value: '24h', label: 'Last 24 Hours' },
  { value: '2d', label: 'Last 2 Days' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '14d', label: 'Last 14 Days' },
  { value: '30d', label: 'Last 30 Days' }
];

const TrendsHeader = ({ timeRange, onTimeRangeChange, onRefresh }) => {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <Typography variant="h5" color="text.primary">
        Newsfeed Trends
      </Typography>

      <Box display="flex" alignItems="center" gap={2}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={onTimeRangeChange}
          >
            {TIME_RANGES.map(range => (
              <MenuItem key={range.value} value={range.value}>
                {range.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Tooltip title="Refresh data">
          <IconButton onClick={onRefresh} size="large">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default TrendsHeader;