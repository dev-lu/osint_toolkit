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
  Link,
  Card,
  CardMedia,
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import PublicIcon from '@mui/icons-material/Public';
import NumbersIcon from '@mui/icons-material/Numbers';
import LinkIcon from '@mui/icons-material/Link';
import HttpIcon from '@mui/icons-material/Http';
import TagIcon from '@mui/icons-material/Tag';

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
    <ListItem disableGutters dense>
      <ListItemText
        primary={
          <Typography variant="body2" component="span" fontWeight="bold">
            {label}:
          </Typography>
        }
        secondary={
          <Typography variant="body2" component="span" color="text.secondary" sx={{ ml: 1, wordBreak: 'break-all' }}>
            {value || defaultVal}
          </Typography>
        }
      />
    </ListItem>
  );
}


export default function UrlScanDetails({ result }) {
  // --- Hooks ---
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const scans = result?.results || [];

  const paginatedScans = useMemo(() => {
    return scans.slice(
      (page - 1) * rowsPerPage,
      page * rowsPerPage
    );
  }, [scans, page, rowsPerPage]);

  const uniqueDomains = useMemo(() => {
    const domains = new Set(scans.map(s => s.task.apexDomain).filter(Boolean));
    return domains.size;
  }, [scans]);

  const uniqueIPs = useMemo(() => {
    const ips = new Set(scans.map(s => s.page.ip).filter(Boolean));
    return ips.size;
  }, [scans]);

  // --- Early Return ---
  if (!result || !scans.length) {
    return <NoDetails message="No urlscan.io information was found for this indicator." />;
  }

  // --- Event Handlers ---
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  }

  // --- Render ---
  return (
    <Box sx={{ margin: 1 }}>
      {/* Summary Statistics Cards */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box display="flex" alignItems="center">
              <NumbersIcon fontSize="large" sx={{ mr: 1, color: 'primary.main' }} />
              <Box>
                <Typography variant="h6">Total Scans</Typography>
                <Typography variant="h4">{result.total}</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box display="flex" alignItems="center">
              <PublicIcon fontSize="large" sx={{ mr: 1, color: 'success.main' }} />
              <Box>
                <Typography variant="h6">Unique Apex Domains</Typography>
                <Typography variant="h4">{uniqueDomains}</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box display="flex" alignItems="center">
              <HttpIcon fontSize="large" sx={{ mr: 1, color: 'warning.main' }} />
              <Box>
                <Typography variant="h6">Unique IPs</Typography>
                <Typography variant="h4">{uniqueIPs}</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Accordion for Scan Results */}
      <Accordion defaultExpanded sx={{ "&::before": { display: "none" } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box display="flex" alignItems="center">
            <TravelExploreIcon sx={{ mr: 1 }} />
            <Typography variant="h6">Scan Results ({scans.length})</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {paginatedScans.map((scan) => (
            <Card key={scan._id} sx={{ display: 'flex', mb: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                <CardMedia
                    component="img"
                    sx={{ width: { xs: '100%', md: 300 }, height: 225, objectFit: 'cover', borderRight: { md: '1px solid #ddd' } }}
                    image={scan.screenshot}
                    alt={`Screenshot of ${scan.task.url}`}
                    onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/300x225/EEE/31343C?text=No+Screenshot'; }}
                />
              <Grid container spacing={2} sx={{ p: 2 }}>
                <Grid item xs={12} md={6}>
                   <Typography variant="h6" component="div" sx={{ wordBreak: 'break-all' }}>
                      {scan.task.domain || 'N/A'}
                    </Typography>
                  <Link href={scan.result} target="_blank" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                     <LinkIcon fontSize="small" sx={{ mr: 0.5 }} /> View Full Report
                  </Link>

                  <Box display="flex" flexWrap="wrap" gap={1} mb={1}>
                    {(scan.task.tags || []).map(tag => (
                        <Chip icon={<TagIcon />} key={tag} label={tag} size="small" color="secondary" />
                    ))}
                  </Box>

                  <List dense>
                     <DetailItem label="Scan Time" value={formatDate(scan.task.time)} />
                     <DetailItem label="Scanned URL" value={scan.task.url} />
                     <DetailItem label="Visibility" value={scan.task.visibility} />
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" fontWeight="bold">Page Details</Typography>
                  <List dense>
                    <DetailItem label="Final URL" value={scan.page.url} />
                    <DetailItem label="Title" value={scan.page.title} />
                    <DetailItem label="IP Address" value={scan.page.ip} />
                    <DetailItem label="Country" value={scan.page.country} />
                    <DetailItem label="ASN" value={`${scan.page.asn} (${scan.page.asnname})`} />
                    <DetailItem label="Server" value={scan.page.server} />
                    <DetailItem label="Status" value={scan.page.status} />
                    <DetailItem label="MIME Type" value={scan.page.mimeType} />
                  </List>
                </Grid>
              </Grid>
            </Card>
          ))}
          {scans.length > rowsPerPage && (
            <Box display="flex" justifyContent="center" mt={2}>
              <Pagination
                count={Math.ceil(scans.length / rowsPerPage)}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
