import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';

const SUPPORTED_IOC_TYPES_INFO = [
  { title: "IP Addresses", description: "IPv4 and IPv6 addresses for threat analysis" },
  { title: "Domains", description: "Domain names and subdomains" },
  { title: "URLs", description: "Web addresses and endpoints" },
  { title: "Email Addresses", description: "Known malicious or suspicious email addresses" },
  { title: "Hashes", description: "MD5, SHA1, and SHA256 file hashes" },
  { title: "CVEs", description: "Common Vulnerabilities and Exposures identifiers" },
];

const FeatureCard = ({ title, description }) => (
  <Grid item xs={12} sm={6} key={title}>
    <Paper elevation={0} sx={{ p: 1 }}>
      <Typography color="primary" fontWeight="medium">
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Paper>
  </Grid>
);

export default function WelcomeScreen() {
  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Single IOC Lookup
        </Typography>
        <Typography paragraph>
          Investigate various Indicators of Compromise (IOCs) using multiple threat
          intelligence sources like VirusTotal, AlienVault, AbuseIPDB, and more,
          to gain detailed insights into potential security threats.
        </Typography>
        <Typography>
          The tool automatically identifies the IOC type and correlates data
          from relevant sources, enabling rapid threat assessment and
          informed security decision-making.
        </Typography>
      </Box>

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