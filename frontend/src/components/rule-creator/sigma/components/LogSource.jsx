import React, { useEffect, useState } from 'react';
import { Grid, TextField, Autocomplete, Typography, Box } from '@mui/material';

import logSourceData from '../data/LogsourceData.json';

export default function LogSource({ logSource, handleLogSourceChange }) {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    setCategories(logSourceData.category);
    setProducts(logSourceData.product);
    setServices(logSourceData.service);
  }, []);

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Application and the type that is required in the detection. It consists of three attributes
        that are evaluated automatically by the converters and an arbitrary number of optional
        elements. We recommend using a "definition" value in cases in which further explanation is
        necessary.
      </Typography>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}> 
          <Grid container spacing={2} direction="column">
            <Grid item xs={12}>
              <Autocomplete
                freeSolo
                options={products}
                value={logSource.product}
                onChange={(event, newValue) => {
                  handleLogSourceChange((prev) => ({ ...prev, product: newValue || '' }));
                }}
                onInputChange={(event, newInputValue) => {
                  handleLogSourceChange((prev) => ({ ...prev, product: newInputValue }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Product"
                    placeholder="Select or type to add"
                    size="small"
                    variant="outlined"
                    helperText="e.g. linux, windows, cisco"
                    fullWidth 
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                freeSolo
                options={categories}
                value={logSource.category}
                onChange={(event, newValue) => {
                  handleLogSourceChange((prev) => ({ ...prev, category: newValue || '' }));
                }}
                onInputChange={(event, newInputValue) => {
                  handleLogSourceChange((prev) => ({ ...prev, category: newInputValue }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Category"
                    placeholder="Select or type to add"
                    size="small"
                    variant="outlined"
                    helperText="e.g. process_creation"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                freeSolo
                options={services}
                value={logSource.service}
                onChange={(event, newValue) => {
                  handleLogSourceChange((prev) => ({ ...prev, service: newValue || '' }));
                }}
                onInputChange={(event, newInputValue) => {
                  handleLogSourceChange((prev) => ({ ...prev, service: newInputValue }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Service"
                    placeholder="Select or type to add"
                    size="small"
                    variant="outlined"
                    helperText="e.g. sysmon, ldapd, dhcp"
                    fullWidth
                  />
                )}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Definition"
            value={logSource.definition}
            onChange={(e) =>
              handleLogSourceChange((prev) => ({ ...prev, definition: e.target.value }))
            }
            size="small"
            variant="outlined"
            placeholder="Enter definition"
            multiline
            rows={7} 
            helperText="Describe the log source, including log verbosity level or configurations."
          />
        </Grid>
      </Grid>
    </Box>
  );
}