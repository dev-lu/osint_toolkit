import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Pagination,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IpIcon from '@mui/icons-material/Computer'; 
import DnsIcon from '@mui/icons-material/Dns';
import PublicIcon from '@mui/icons-material/Public';
import RouteIcon from '@mui/icons-material/Route';
import LanguageIcon from '@mui/icons-material/Language';
import GavelIcon from '@mui/icons-material/Gavel';
import LocationOnIcon from '@mui/icons-material/LocationOn';

function NoDetails({ message }) {
  return (
    <Paper sx={{ p: 3, textAlign: 'center', margin: 1 }}>
      <Typography variant="h6">{message}</Typography>
    </Paper>
  );
}

function DetailItem({ label, value, defaultVal = "N/A" }) {
  if (value === null || value === undefined || value === '') {
    return null; 
  }
  return (
    <>
      <ListItem disableGutters>
        <ListItemText
          primary={
            <Typography variant="body2" component="span" fontWeight="bold">
              {label}:
            </Typography>
          }
          secondary={
             <Typography variant="body2" component="span" color="text.secondary" sx={{ ml: 1 }}>
              {value || defaultVal}
            </Typography>
          }
        />
      </ListItem>
      <Divider component="li" />
    </>
  );
}

export default function BGPViewDetails({ result }) {
  const [page, setPage] = useState(1);
  const rowsPerPage = 3;

  const prefixes = result?.data?.prefixes || [];

  const paginatedPrefixes = useMemo(() => {
    return prefixes.slice(
      (page - 1) * rowsPerPage,
      page * rowsPerPage
    );
  }, [prefixes, page, rowsPerPage]);

  if (!result || !result.data || result.status !== 'ok') {
    return <NoDetails message="No BGP information was found for this indicator." />;
  }

  const {
    ip,
    ptr_record,
    rir_allocation,
    iana_assignment,
    maxmind
  } = result.data;

  const primaryPrefix = prefixes.length > 0 ? prefixes[0] : null;
  const primaryAsn = primaryPrefix ? primaryPrefix.asn : null;

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Box sx={{ margin: 1 }}>
      {/* Summary Statistics Cards */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box display="flex" alignItems="center">
              <IpIcon fontSize="large" sx={{ mr: 1, color: 'primary.main' }} />
              <Box>
                <Typography variant="h6">IP Address</Typography>
                <Typography variant="h5">{ip}</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box display="flex" alignItems="center">
              <PublicIcon fontSize="large" sx={{ mr: 1, color: 'success.main' }} />
              <Box>
                <Typography variant="h6">Primary ASN</Typography>
                <Typography variant="h5" component="div">
                  {primaryAsn ? `AS${primaryAsn.asn}` : 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {primaryAsn ? primaryAsn.name : 'No ASN found'}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box display="flex" alignItems="center">
              <DnsIcon fontSize="large" sx={{ mr: 1, color: 'warning.main' }} />
              <Box>
                <Typography variant="h6">PTR Record</Typography>
                <Typography variant="h5" sx={{ wordBreak: 'break-all' }}>
                  {ptr_record || 'N/A'}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Accordion for IP Prefixes */}
      {prefixes.length > 0 && (
        <Accordion defaultExpanded sx={{ mb: 1, "&::before": { display: "none" } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box display="flex" alignItems="center">
              <RouteIcon sx={{ mr: 1 }} />
              <Typography variant="h6">IP Prefixes ({prefixes.length})</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {paginatedPrefixes.map((p, index) => (
              <Paper key={index} sx={{ p: 2, mb: 2, border: '1px solid #ddd' }}>
                <Typography variant="h6" gutterBottom>{p.prefix}</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" fontWeight="bold">Details</Typography>
                    <List dense>
                       <DetailItem label="Name" value={p.name} />
                       <DetailItem label="Description" value={p.description} />
                       <DetailItem label="Country" value={p.country_code} />
                    </List>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" fontWeight="bold">ASN Info</Typography>
                     <List dense>
                       <DetailItem label="ASN" value={`AS${p.asn.asn}`} />
                       <DetailItem label="Name" value={p.asn.name} />
                       <DetailItem label="Description" value={p.asn.description} />
                       <DetailItem label="Country" value={p.asn.country_code} />
                    </List>
                  </Grid>
                </Grid>
              </Paper>
            ))}
            {prefixes.length > rowsPerPage && (
              <Box display="flex" justifyContent="center" mt={2}>
                <Pagination
                  count={Math.ceil(prefixes.length / rowsPerPage)}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            )}
          </AccordionDetails>
        </Accordion>
      )}

      {/* Accordions for other details */}
       <Grid container spacing={2}>
        {rir_allocation && Object.values(rir_allocation).some(v => v !== null) && (
          <Grid item xs={12} md={6}>
             <Accordion sx={{ "&::before": { display: "none" } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box display="flex" alignItems="center">
                  <LanguageIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">RIR Allocation</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  <DetailItem label="RIR Name" value={rir_allocation.rir_name} />
                  <DetailItem label="Country" value={rir_allocation.country_code} />
                  <DetailItem label="Prefix" value={rir_allocation.prefix} />
                  <DetailItem label="Status" value={rir_allocation.allocation_status} />
                  <DetailItem label="Date Allocated" value={rir_allocation.date_allocated ? new Date(rir_allocation.date_allocated).toLocaleDateString() : 'N/A'} />
                </List>
              </AccordionDetails>
            </Accordion>
          </Grid>
        )}

        {iana_assignment && Object.values(iana_assignment).some(v => v !== null) && (
          <Grid item xs={12} md={6}>
            <Accordion sx={{ "&::before": { display: "none" } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                 <Box display="flex" alignItems="center">
                  <GavelIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">IANA Assignment</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  <DetailItem label="Assignment Status" value={iana_assignment.assignment_status} />
                  <DetailItem label="Description" value={iana_assignment.description} />
                  <DetailItem label="WHOIS Server" value={iana_assignment.whois_server} />
                  <DetailItem label="Date Assigned" value={iana_assignment.date_assigned ? new Date(iana_assignment.date_assigned).toLocaleDateString() : 'N/A'} />
                </List>
              </AccordionDetails>
            </Accordion>
          </Grid>
        )}

         {maxmind && Object.values(maxmind).some(v => v !== null) && (
          <Grid item xs={12} md={6}>
            <Accordion sx={{ "&::before": { display: "none" } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                 <Box display="flex" alignItems="center">
                  <LocationOnIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">MaxMind Geolocation</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  <DetailItem label="Country" value={maxmind.country_code} />
                  <DetailItem label="City" value={maxmind.city} />
                </List>
              </AccordionDetails>
            </Accordion>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
