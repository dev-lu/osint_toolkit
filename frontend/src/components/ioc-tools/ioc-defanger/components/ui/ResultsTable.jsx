import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Info as InfoIcon
} from '@mui/icons-material';

const ResultsTable = ({ 
  results, 
  operation, 
  showOnlyChanged, 
  onToggleShowOnlyChanged, 
  onCopy 
}) => {
  const filteredResults = showOnlyChanged ? results.filter(r => r.changed) : results;
  const changedCount = results.filter(r => r.changed).length;

  const getTypeColor = (type) => {
    const colors = {
      'IP Address': 'primary',
      'Domain': 'secondary',
      'URL': 'success',
      'Email': 'warning',
      'MD5 Hash': 'info',
      'SHA1 Hash': 'info',
      'SHA256 Hash': 'info',
      'CVE': 'error',
      'Unknown': 'default'
    };
    return colors[type] || 'default';
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Results ({filteredResults.length} of {results.length} IOCs)
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={showOnlyChanged}
              onChange={(e) => onToggleShowOnlyChanged(e.target.checked)}
              sx={{mr: 1}}
            />
          }
          label={`Show only changed (${changedCount})`}
        />
      </Box>

      {changedCount === 0 && operation === 'defang' && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InfoIcon />
            No IOCs were modified. They may already be defanged or not recognized as IOCs.
          </Box>
        </Alert>
      )}

      {changedCount === 0 && operation === 'fang' && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InfoIcon />
            No IOCs were modified. They may already be fanged or not contain defanged patterns.
          </Box>
        </Alert>
      )}

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Original</TableCell>
              <TableCell>{operation === 'defang' ? 'Defanged' : 'Fanged'}</TableCell>
              <TableCell>Type(s)</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredResults.map((result, index) => (
              <TableRow key={index} sx={{ 
                backgroundColor: result.changed ? 'action.hover' : 'inherit',
                '&:hover': { backgroundColor: 'action.selected' }
              }}>
                <TableCell>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                    {result.original}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: 'monospace', 
                      wordBreak: 'break-all',
                      fontWeight: result.changed ? 'bold' : 'normal',
                      color: result.changed ? 'primary.main' : 'inherit'
                    }}
                  >
                    {result.processed}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {result.types.map((type, typeIndex) => (
                      <Chip
                        key={typeIndex}
                        label={type}
                        size="small"
                        color={getTypeColor(type)}
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={result.changed ? 'Modified' : 'Unchanged'}
                    size="small"
                    color={result.changed ? 'success' : 'default'}
                    variant={result.changed ? 'filled' : 'outlined'}
                  />
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Copy result">
                    <IconButton
                      size="small"
                      onClick={() => onCopy(result.processed, 'Result')}
                    >
                      <CopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ResultsTable;
