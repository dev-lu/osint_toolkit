import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';

const SUPPORTED_DEFANGING_TECHNIQUES = [
  { title: "Dots", description: "[.] (.) {.} [dot] (dot) {dot} \\. \" . \"" },
  { title: "Protocols", description: " hxxp hxxps fxp" },
  { title: "Seperators", description: "[:] [://] [/] [@] [at]" },
  { title: "IOCs", description: "Domains, IPs, URLs, Emails, Hashes" },
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
    <Paper>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom mb={2}>
          IOC Defang/Fang Tool
        </Typography>
        <Typography variant="h6" component="h1" gutterBottom>
          Supported Defanging Techniques
        </Typography>
        <Typography paragraph>
          Safely defang IOCs for sharing or restore fanged IOCs for analysis. This tool automatically detects IOC types and applies fanging or defanging techniques.
        </Typography>
      </Box>
      <Grid container spacing={1}>
        {SUPPORTED_DEFANGING_TECHNIQUES.map(item => (
          <FeatureCard key={item.title} title={item.title} description={item.description} />
        ))}
      </Grid>
    </Paper>
  );
}