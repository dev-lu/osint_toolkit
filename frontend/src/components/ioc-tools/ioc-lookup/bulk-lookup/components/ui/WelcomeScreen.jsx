import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import { CloudUpload, TextFields, Speed, Security } from '@mui/icons-material';

const SUPPORTED_IOC_TYPES_INFO = [
  { title: "IP Addresses", description: "IPv4 and IPv6 addresses for threat analysis" },
  { title: "Domains", description: "Domain names and subdomains" },
  { title: "URLs", description: "Web addresses and endpoints" },
  { title: "Email Addresses", description: "Known malicious or suspicious email addresses" },
  { title: "Hashes", description: "MD5, SHA1, and SHA256 file hashes" },
  { title: "CVEs", description: "Common Vulnerabilities and Exposures identifiers" },
];

const BULK_FEATURES = [
  { 
    icon: <Speed sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: "Batch Processing", 
    description: "Analyze hundreds of IOCs simultaneously" 
  },
  { 
    icon: <CloudUpload sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: "File Upload Support", 
    description: "Upload CSV, TXT, or MD files containing IOCs" 
  },
  { 
    icon: <Security sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: "Multiple Sources", 
    description: "Query multiple threat intelligence sources in parallel" 
  },
  { 
    icon: <TextFields sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: "Flexible Input", 
    description: "Enter IOCs manually or paste from clipboard - one IOC per line" 
  },
];

const FeatureCard = ({ title, description }) => (
  <Grid item xs={12} sm={6} key={title}>
    <Paper elevation={0} sx={{ p: 1.5 }}>
      <Typography color="primary" fontWeight="medium" sx={{ fontSize: '0.9rem' }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
        {description}
      </Typography>
    </Paper>
  </Grid>
);

const BulkFeatureCard = ({ icon, title, description }) => (
  <Grid item xs={12} sm={6} md={3}>
    <Paper elevation={0} sx={{ p: 2, textAlign: 'center', height: '100%' }}>
      <Box sx={{ mb: 1 }}>
        {icon}
      </Box>
      <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
        {description}
      </Typography>
    </Paper>
  </Grid>
);

export default function WelcomeScreen() {
  return (
    <Paper sx={{ p: { xs: 2, sm: 3 }, mt: 2 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Bulk IOC Lookup
        </Typography>
        <Typography paragraph>
          This tool processes IOCs in batches, automatically categorizes them by type,
          and provides threat intelligence data from various security services.
        </Typography>
        <Typography>
          Paste your IOCs (one per line) or upload a file to get started. The system will
          automatically detect IOC types and query relevant threat intelligence sources in parallel
          for fast analysis.
        </Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        {BULK_FEATURES.map(item => (
          <BulkFeatureCard key={item.title} icon={item.icon} title={item.title} description={item.description} />
        ))}
      </Grid>

      <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
        Supported IOC Types
      </Typography>
      <Grid container spacing={1}>
        {SUPPORTED_IOC_TYPES_INFO.map(item => (
          <FeatureCard key={item.title} title={item.title} description={item.description} />
        ))}
      </Grid>
    </Paper>
  );
}
