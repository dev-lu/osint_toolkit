import React, { useState } from "react";
import { useRecoilState } from "recoil";
import Circle from "./Circle";
import { cvssScoresAtom } from "./CvssScoresAtom";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  MenuItem,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import TimerIcon from "@mui/icons-material/Timer";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const MetricSelect = ({ label, value, options, onChange }) => (
  <Box display="flex" alignItems="center" sx={{ my: 2, mx: 4 }}>
    <TextField
      select
      fullWidth
      size="small"
      label={label}
      value={value}
      onChange={onChange}
      InputProps={{
        sx: {
          borderRadius: "1",
          backgroundColor: useTheme().palette.background.paper,
        },
      }}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  </Box>
);

export default function TemporalScore() {
  const theme = useTheme();
  const [cvssScores, setCvssScores] = useRecoilState(cvssScoresAtom);
  const [expanded, setExpanded] = useState(true);

  const handleSelectChange = (key) => (e) => {
    setCvssScores((prev) => ({
      ...prev,
      temporal: {
        ...prev.temporal,
        [key]: e.target.value,
      },
    }));
  };

  const temporalMetrics = [
    {
      key: "exploitCodeMaturity",
      label: "Exploit Code Maturity (E)",
      options: [
        { value: "X", label: "Not defined" },
        { value: "U", label: "Unproven that exploit exists" },
        { value: "P", label: "Proof of concept code" },
        { value: "F", label: "Functional exploit exists" },
        { value: "H", label: "High" },
      ],
    },
    {
      key: "remediationLevel",
      label: "Remediation Level (RL)",
      options: [
        { value: "X", label: "Not defined" },
        { value: "O", label: "Official fix" },
        { value: "T", label: "Temporary fix" },
        { value: "W", label: "Workaround" },
        { value: "U", label: "Unavailable" },
      ],
    },
    {
      key: "reportConfidence",
      label: "Report Confidence (RC)",
      options: [
        { value: "X", label: "Not defined" },
        { value: "U", label: "Unknown" },
        { value: "R", label: "Reasonable" },
        { value: "C", label: "Confirmed" },
      ],
    },
  ];

  const renderMetricSelect = (metrics) => {
    return metrics.map((metric) => (
      <Grid item xs={12} md={4} key={metric.key}>
        <MetricSelect
          label={metric.label}
          value={cvssScores.temporal[metric.key]}
          options={metric.options}
          onChange={handleSelectChange(metric.key)}
        />
      </Grid>
    ));
  };

  return (
    <Accordion 
      sx={{ 
        borderRadius: 1,
        backgroundColor: 'transparent',
        '&:before': {
          display: 'none',
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          backgroundColor: theme.palette.background.cvssCard,
          borderRadius: 1,
          minHeight: 64,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TimerIcon />
          <Typography variant="h6" sx={{ fontSize: 20 }}>
            Temporal Score Metrics
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>
        <Grid container spacing={2} sx={{ alignItems: "stretch", mt: 1 }}>
          <Box sx={{ m: 2, p: 2, flex: 1, minWidth: 0 }}>
            <Typography variant="body1" paragraph>
              The Temporal metrics measure the current state of exploit techniques
              or code availability, the existence of any patches or workarounds,
              or the confidence that one has in the description of a
              vulnerability. Temporal metrics will almost certainly change over
              time.
            </Typography>
          </Box>
          
          <Box sx={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            justifyContent: "center",
            m: 2
          }}>
            <Box sx={{
              width: 120,
              height: 120,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: theme.palette.background.cvssCircle,
              borderRadius: "50%",
            }}>
              <Circle value={cvssScores.temporal.temporalScore} />
            </Box>
            <Typography
              variant="h6"
              fontWeight={cvssScores.temporal.temporalScore >= 9.0 ? "bold" : "normal"}
              color={
                cvssScores.temporal.temporalScore >= 7.0
                  ? "red"
                  : cvssScores.temporal.temporalScore >= 4.0
                  ? "orange"
                  : "green"
              }
              align="center"
              gutterBottom
              sx={{ display: "block", marginBottom: 1 }}
            >
              {cvssScores.temporal.temporalScore >= 9.0
                ? "Critical"
                : cvssScores.temporal.temporalScore >= 7.0
                ? "High"
                : cvssScores.temporal.temporalScore >= 4.0
                ? "Medium"
                : cvssScores.temporal.temporalScore === 0
                ? "None"
                : "Low"}
            </Typography>
          </Box>
        </Grid>

        <Box sx={{ p: 2, minWidth: 0 }}>
          <Grid container spacing={2} sx={{ alignItems: "stretch" }}>
            {renderMetricSelect(temporalMetrics)}
          </Grid>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}