import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Select,
  Stack,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TuneIcon from '@mui/icons-material/Tune';
import RefreshIcon from "@mui/icons-material/Refresh";
import { grey } from "@mui/material/colors";

export default function Filters({ filters, setFilters, applyFilters, resetFilters, refreshData }) {
  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    setFilters({
      ...filters,
      [name]: type === "checkbox" ? (checked ? checked : null) : value,
    });
  };

  const handleSubmit = () => {
    applyFilters(filters); 
  };

  const handleReset = () => {
    resetFilters();
  };

  const handleRefresh = (event) => {
    // Prevent the accordion from toggling when clicking the refresh button
    event.stopPropagation();
    refreshData();
  };

  return (
    <Accordion
      variant="secondary"
      sx={{borderRadius: 1}}
    >
      <AccordionSummary 
        expandIcon={<ExpandMoreIcon />}
        sx={{
          '& .MuiAccordionSummary-content': {
            justifyContent: 'space-between',
            width: '100%',
          }
        }}
      >
        <Stack 
          direction="row" 
          alignItems="center" 
          spacing={1}
          sx={{ flexGrow: 1 }}
        >
          <TuneIcon />
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Advanced Options
          </Typography>
        </Stack>
        <Tooltip title="Refresh Feed">
          <IconButton 
            size="small" 
            onClick={handleRefresh}
            sx={{ 
              ml: 1,
              mr: 1,
              '&:hover': {
                backgroundColor: grey[200],
              }
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          {/* Date Filters */}
          <Grid item xs={12} md={4}>
            <TextField
              label="Start Date"
              type="date"
              name="start_date"
              value={filters.start_date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="End Date"
              type="date"
              name="end_date"
              value={filters.end_date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="tlp-label">TLP</InputLabel>
              <Select
                labelId="tlp-label"
                id="tlp"
                name="tlp"
                value={filters.tlp}
                label="TLP"
                onChange={handleChange}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="TLP:CLEAR">TLP:CLEAR</MenuItem>
                <MenuItem value="TLP:GREEN">TLP:GREEN</MenuItem>
                <MenuItem value="TLP:AMBER">TLP:AMBER</MenuItem>
                <MenuItem value="TLP:RED">TLP:RED</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Checkbox Filters - Column 1 */}
          <Grid item xs={12} md={6}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.has_matches === true}
                    onChange={handleChange}
                    name="has_matches"
                  />
                }
                label="Has Keyword Matches"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.has_iocs === true}
                    onChange={handleChange}
                    name="has_iocs"
                  />
                }
                label="Has IOCs"
              />
              {/*
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.has_relevant_iocs === true}
                    onChange={handleChange}
                    name="has_relevant_iocs"
                  />
                }
                label="Has Relevant IOCs"
              />
              */}
            </FormGroup>
          </Grid>

          {/* Checkbox Filters - Column 2 */}
          <Grid item xs={12} md={6}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.has_analysis === true}
                    onChange={handleChange}
                    name="has_analysis"
                  />
                }
                label="Has Analysis"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.has_note === true}
                    onChange={handleChange}
                    name="has_note"
                  />
                }
                label="Has Note"
              />
              {/*
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.read === true}
                    onChange={handleChange}
                    name="read"
                  />
                }
                label="Has Groups"
              />
              */}
            </FormGroup>
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                variant="contained"
                onClick={handleReset}
                sx={{ mt: 2 }}
              >
                Reset Filters
              </Button>
            </Box>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}