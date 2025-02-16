import React, { useState } from "react";
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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TuneIcon from '@mui/icons-material/Tune';
import { grey } from "@mui/material/colors";
import RefreshIcon from "@mui/icons-material/Refresh";

export default function Filters({ fetchData }) {
  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    has_matches: null,
    has_iocs: null,
    has_relevant_iocs: null,
    has_analysis: null,
    has_note: null,
    tlp: "",
    read: null,
  });

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    setFilters({
      ...filters,
      [name]: type === "checkbox" ? (checked ? checked : null) : value,
    });
  };

  const handleSubmit = () => {
    fetchData(filters); 
  };

  const handleReset = () => {
    const resetFilters = {
      start_date: "",
      end_date: "",
      has_matches: null,
      has_iocs: null,
      has_relevant_iocs: null,
      has_analysis: null,
      has_note: null,
      tlp: "",
      read: null,
    };
    setFilters(resetFilters);
    fetchData(resetFilters); 
  };

  return (
    <Accordion
      variant="secondary"
      sx={{mb: 2, borderRadius: 1}}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <TuneIcon />
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Advanced Options
          </Typography>
        </Stack>
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
                    checked={filters.has_matches}
                    onChange={handleChange}
                    name="has_matches"
                  />
                }
                label="Has Keyword Matches"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.has_iocs}
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
                    checked={filters.has_relevant_iocs}
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
                    checked={filters.has_analysis}
                    onChange={handleChange}
                    name="has_analysis"
                  />
                }
                label="Has Analysis"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.has_note}
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
                    checked={filters.read}
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
                onClick={handleSubmit}
                sx={{ mt: 2 }}
              >
                Apply Filters
              </Button>
              <Button
                variant="contained"
                onClick={() => fetchData()} 
                startIcon={<RefreshIcon />}
                sx={{ mt: 2 }}
              >
                Update Feed
              </Button>
              {/* 
              <Button
                variant="contained"
                onClick={() => console.log("Recheck for IOCs triggered")}
                sx={{ mt: 2 }}
              >
                Recheck for IOCs
              </Button>
              */}
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
