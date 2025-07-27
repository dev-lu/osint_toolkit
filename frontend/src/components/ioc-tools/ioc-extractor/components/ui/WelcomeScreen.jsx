import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid
} from '@mui/material';

export default function ExtractorWelcomeScreen() {
  const features = [
    {
      title: 'Automated Extraction',
      description: 'Extracts IOCs from unstructured files using regular expressions'
    },
    {
      title: 'Duplicate Removal',
      description: 'Automatically removes duplicate IOCs from the results'
    },
    {
      title: 'Simple Interface',
      description: 'Drop files and get results with no configuration needed'
    },
    {
      title: 'One-Click Analysis',
      description: 'Analyze each detected IOC with a single click'
    }
  ];

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        IOC Extractor
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Typography paragraph>
          IOC Extractor is a module that allows you to extract and organize indicators of compromise (IOCs)
          from unstructured files using regular expressions (Regex). The module automatically removes any duplicates,
          so you don't have to worry about sorting through the same IOCs multiple times.
        </Typography>
        <Typography>
          Just drop your file containing the IOCs into the tool and let it do the work for you. 
          With a single click, you can analyze every detected IOC,
          saving you the time and effort of building Excel sheets to extract IOCs from files manually.
        </Typography>
      </Box>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Key Features
      </Typography>

      <Grid container spacing={1}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Paper elevation={0} sx={{ p: 1 }}>
              <Typography color="primary" fontWeight="medium">
                {feature.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {feature.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
