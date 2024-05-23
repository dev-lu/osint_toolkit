import React from "react";
import { useRecoilState } from "recoil";
import Circle from "./Circle";
import { cvssScoresAtom } from "./CvssScoresAtom";
import {
  Card,
  Chip,
  Divider,
  Grid,
  MenuItem,
  TextField,
  Typography,
  useTheme,
  Box,
} from "@mui/material";
import ForestIcon from "@mui/icons-material/Forest";

const MetricSelect = ({ label, value, options, onChange }) => (
  <Box display="flex" alignItems="center" sx={{ my: 2, mx: 4 }}>
    <TextField
      select
      fullWidth
      label={label}
      value={value}
      onChange={onChange}
      InputProps={{
        sx: {
          borderRadius: "10px",
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

export default function EnvironmentalScore() {
  const theme = useTheme();
  const [cvssScores, setCvssScores] = useRecoilState(cvssScoresAtom);

  const handleSelectChange = (key) => (e) => {
    setCvssScores((prev) => ({
      ...prev,
      environmental: {
        ...prev.environmental,
        [key]: e.target.value,
      },
    }));
  };

  const renderMetricSelect = (metrics) => {
    return metrics.map((metric) => (
      <MetricSelect
        key={metric.key}
        label={metric.label}
        value={cvssScores.environmental[metric.key]}
        options={metric.options}
        onChange={handleSelectChange(metric.key)}
      />
    ));
  };

  const exploitabilityMetrics = [
    {
      key: "modifiedAttackVector",
      label: "Attack Vector (MAV)",
      options: [
        { value: "X", label: "Not defined" },
        { value: "N", label: "Network" },
        { value: "A", label: "Adjacent Network" },
        { value: "L", label: "Local" },
        { value: "P", label: "Physical" },
      ],
    },
    {
      key: "modifiedAttackComplexity",
      label: "Attack Complexity (MAC)",
      options: [
        { value: "X", label: "Not defined" },
        { value: "L", label: "Low" },
        { value: "H", label: "High" },
      ],
    },
    {
      key: "modifiedPrivilegesRequired",
      label: "Privileges Required (MPR)",
      options: [
        { value: "X", label: "Not defined" },
        { value: "N", label: "None" },
        { value: "L", label: "Low" },
        { value: "H", label: "High" },
      ],
    },
    {
      key: "modifiedUserInteraction",
      label: "User Interaction (MUI)",
      options: [
        { value: "X", label: "Not defined" },
        { value: "N", label: "None" },
        { value: "R", label: "Required" },
      ],
    },
    {
      key: "modifiedScope",
      label: "Scope (MS)",
      options: [
        { value: "X", label: "Not defined" },
        { value: "U", label: "Unchanged" },
        { value: "C", label: "Changed" },
      ],
    },
  ];

  const impactMetrics = [
    {
      key: "modifiedConfidentialityImpact",
      label: "Confidentiality Impact (MC)",
      options: [
        { value: "X", label: "Not defined" },
        { value: "N", label: "None" },
        { value: "L", label: "Low" },
        { value: "H", label: "High" },
      ],
    },
    {
      key: "modifiedIntegrityImpact",
      label: "Integrity Impact (MI)",
      options: [
        { value: "X", label: "Not defined" },
        { value: "N", label: "None" },
        { value: "L", label: "Low" },
        { value: "H", label: "High" },
      ],
    },
    {
      key: "modifiedAvailabilityImpact",
      label: "Availability Impact (MA)",
      options: [
        { value: "X", label: "Not defined" },
        { value: "N", label: "None" },
        { value: "L", label: "Low" },
        { value: "H", label: "High" },
      ],
    },
  ];

  const impactSubscoreModifiers = [
    {
      key: "confidentialityRequirement",
      label: "Confidentiality Requirement (CR)",
      options: [
        { value: "X", label: "Not defined" },
        { value: "L", label: "Low" },
        { value: "M", label: "Medium" },
        { value: "H", label: "High" },
      ],
    },
    {
      key: "integrityRequirement",
      label: "Integrity Requirement (IR)",
      options: [
        { value: "X", label: "Not defined" },
        { value: "L", label: "Low" },
        { value: "M", label: "Medium" },
        { value: "H", label: "High" },
      ],
    },
    {
      key: "availabilityRequirement",
      label: "Availability Requirement (AR)",
      options: [
        { value: "X", label: "Not defined" },
        { value: "L", label: "Low" },
        { value: "M", label: "Medium" },
        { value: "H", label: "High" },
      ],
    },
  ];

  return (
    <>
      <Grid item xs={12}>
        <Divider sx={{ mt: 4 }}>
          <Chip
            icon={<ForestIcon />}
            label="Environmental Score Metrics"
            sx={{
              fontSize: "20px",
              padding: "10px",
              height: "40px",
              backgroundColor: theme.palette.background.cvssCard,
            }}
          />
        </Divider>
        <Grid
          container
          spacing={2}
          sx={{ alignItems: "stretch", marginTop: 2 }}
        >
          <Card
            elevation={0}
            sx={{
              m: 2,
              p: 2,
              borderRadius: 5,
              flex: 1,
              minWidth: 0,
              backgroundColor: theme.palette.background.cvssCard,
            }}
          >
            <Typography variant="body1" paragraph>
              These metrics enable the analyst to customize the CVSS score
              depending on the importance of the affected IT asset to a user's
              organization, measured in terms of complementary/alternative
              security controls in place, Confidentiality, Integrity, and
              Availability. The metrics are the modified equivalent of base
              metrics and are assigned metrics value based on the component
              placement in organization infrastructure.
            </Typography>
          </Card>
          <Card
            elevation={0}
            sx={{
              mb: 2,
              mt: 2,
              p: 2,
              borderRadius: 5,
              minWidth: 0,
              backgroundColor: theme.palette.background.cvssCard,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: 120,
                height: 120,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: theme.palette.background.cvssCircle,
                borderRadius: "50%",
              }}
            >
              <Circle value={cvssScores.environmental.environmentalScore} />
            </Box>
            <Typography
              variant="h6"
              fontWeight={
                cvssScores.environmental.environmentalScore >= 9.0
                  ? "bold"
                  : "normal"
              }
              color={
                cvssScores.environmental.environmentalScore >= 7.0
                  ? "red"
                  : cvssScores.environmental.environmentalScore >= 4.0
                  ? "orange"
                  : "green"
              }
              align="center"
              gutterBottom
              sx={{ display: "block", marginBottom: 1 }}
            >
              {cvssScores.environmental.environmentalScore >= 9.0
                ? "Critical"
                : cvssScores.environmental.environmentalScore >= 7.0
                ? "High"
                : cvssScores.environmental.environmentalScore >= 4.0
                ? "Medium"
                : cvssScores.environmental.environmentalScore === 0
                ? "None"
                : "Low"}
            </Typography>
          </Card>
        </Grid>
      </Grid>

      <Card
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 5,
          minWidth: 0,
          backgroundColor: theme.palette.background.cvssCard,
        }}
      >
        <Grid container spacing={2} sx={{ alignItems: "stretch" }}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" align="center" gutterBottom>
              Exploitability Metrics
            </Typography>
            {renderMetricSelect(exploitabilityMetrics)}
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" align="center" gutterBottom>
              Impact Metrics
            </Typography>
            {renderMetricSelect(impactMetrics)}
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" align="center" gutterBottom>
              Impact Subscore Modifiers
            </Typography>
            {renderMetricSelect(impactSubscoreModifiers)}
          </Grid>
        </Grid>
      </Card>
    </>
  );
}
