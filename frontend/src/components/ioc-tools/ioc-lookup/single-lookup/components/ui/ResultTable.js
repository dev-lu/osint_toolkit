import React from 'react';
import { Grow, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Typography, Box } from '@mui/material';
import useTheme from '@mui/material/styles/useTheme';
import { useServiceFilter } from '../../../shared/hooks/useServiceFilter';
import NoApiKeysAlert from './NoApiKeysAlert';
import ServiceFetcherRow from './ServiceFetcherRow';

function ResultTable({ ioc, iocType, filteredServices: externallyFilteredServices }) {
  const theme = useTheme();

  const servicesToRender = useServiceFilter(iocType, externallyFilteredServices);

  if (servicesToRender.length === 0) {
    return <NoApiKeysAlert />;
  }

  return (
    <Grow in={true}>
      <Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Analysis Results for {iocType}: <strong>{ioc}</strong>
          </Typography>
        </Box>
        
        <TableContainer component={Paper} sx={{ boxShadow: 0, borderRadius: 1 }}>
          <Table aria-label="result_table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ bgcolor: theme.palette.background.tablecell, width: '5%' }} />
                <TableCell sx={{ bgcolor: theme.palette.background.tablecell, fontWeight: "bold", width: '25%' }}>
                  Service
                </TableCell>
                <TableCell sx={{ bgcolor: theme.palette.background.tablecell, fontWeight: "bold" }}>
                  Result
                </TableCell>
                <TableCell sx={{ bgcolor: theme.palette.background.tablecell, width: '5%' }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {servicesToRender.map((serviceDefinition) => (
                <ServiceFetcherRow
                  key={serviceDefinition.key}
                  ioc={ioc}
                  iocType={iocType}
                  serviceConfigEntry={serviceDefinition}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Grow>
  );
}

export default ResultTable;
