import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { cvssScoresAtom } from "./CvssScoresAtom";
import Circle from "./Circle";
import {
  BarChart as BarChartIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import {
  Box,
  Card,
  Chip,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import InfoModal from "./InfoModal";

const MetricSelect = ({ label, value, options, onChange, onInfoClick }) => (
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
    <IconButton onClick={onInfoClick}>
      <InfoIcon />
    </IconButton>
  </Box>
);

export default function BaseScore() {
  const theme = useTheme();
  const [cvssScores, setCvssScores] = useRecoilState(cvssScoresAtom);
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", text: "" });

  const handleOpenModal = (title, text) => {
    setModalContent({ title, text });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSelectChange = (key) => (e) => {
    setCvssScores((prev) => ({
      ...prev,
      base: {
        ...prev.base,
        [key]: e.target.value,
      },
    }));
  };

  const renderCard = (title, score, metrics) => (
    <Grid item xs={6}>
      <Typography variant="h6" align="center">
        {title} (Score: {Math.round(score * 10) / 10})
      </Typography>
      {metrics.map((metric) => (
        <MetricSelect
          key={metric.key}
          label={metric.label}
          value={cvssScores.base[metric.key]}
          options={metric.options}
          onChange={handleSelectChange(metric.key)}
          onInfoClick={() => handleOpenModal(metric.label, metric.info)}
        />
      ))}
    </Grid>
  );

  const exploitabilityMetrics = [
    {
      key: "attackVector",
      label: "Attack Vector (AV)",
      options: [
        { value: "N", label: "Network" },
        { value: "A", label: "Adjacent Network" },
        { value: "L", label: "Local" },
        { value: "P", label: "Physical" },
      ],
      info: "The Attack Vector (AV) metric measures the context by which a vulnerability is exploited. The more remote the attack, the higher the value of AV. The AV metric is based on the assumption that an attacker who can exploit the vulnerability must be able to reach the vulnerable component.",
    },
    {
      key: "attackComplexity",
      label: "Attack Complexity (AC)",
      options: [
        { value: "L", label: "Low" },
        { value: "H", label: "High" },
      ],
      info: "This metric describes the conditions beyond the attacker’s control that must exist in order to exploit the vulnerability. The Base Score is greatest for the least complex attacks.",
    },
    {
      key: "privilegesRequired",
      label: "Privileges Required (PR)",
      options: [
        { value: "N", label: "None" },
        { value: "L", label: "Low" },
        { value: "H", label: "High" },
      ],
      info: "This metric describes the level of privileges an attacker must possess before successfully exploiting the vulnerability. The Base Score is greatest if no privileges are required.",
    },
    {
      key: "userInteraction",
      label: "User Interaction (UI)",
      options: [
        { value: "N", label: "None" },
        { value: "R", label: "Required" },
      ],
      info: "This metric captures the requirement for a human user, other than the attacker, to participate in the successful compromise of the vulnerable component. The Base Score is greatest when no user interaction is required.",
    },
  ];

  const impactMetrics = [
    {
      key: "confidentialityImpact",
      label: "Confidentiality Impact (C)",
      options: [
        { value: "N", label: "None" },
        { value: "L", label: "Low" },
        { value: "H", label: "High" },
      ],
      info: "This metric measures the impact to the confidentiality of the information resources managed by a software component due to a successfully exploited vulnerability. The Base Score is greatest when the loss to the impacted component is highest.",
    },
    {
      key: "integrityImpact",
      label: "Integrity Impact (I)",
      options: [
        { value: "N", label: "None" },
        { value: "L", label: "Low" },
        { value: "H", label: "High" },
      ],
      info: "This metric measures the impact to integrity of a successfully exploited vulnerability. The Base Score is greatest when the consequence to the impacted component is highest.",
    },
    {
      key: "availabilityImpact",
      label: "Availability Impact (A)",
      options: [
        { value: "N", label: "None" },
        { value: "L", label: "Low" },
        { value: "H", label: "High" },
      ],
      info: "This metric measures the impact to the availability of the impacted component resulting from a successfully exploited vulnerability. The Base Score is greatest when the consequence to the impacted component is highest.",
    },
  ];

  const renderScoreCard = (title, score, label) => (
    <Card
      elevation={0}
      sx={{
        mb: 2,
        mt: 2,
        p: 2,
        borderRadius: 5,
        minWidth: 0,
        backgroundColor: theme.palette.background.cvssCard,
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
          mx: "auto",
        }}
      >
        <Circle value={score} />
      </Box>
      <Typography
        variant="h6"
        fontWeight={score >= 9.0 ? "bold" : "normal"}
        color={
          score >= 7.0
            ? "red"
            : score >= 4.0
            ? "orange"
            : score === 0
            ? "green"
            : "low"
        }
        align="center"
        gutterBottom
        sx={{ display: "block", marginBottom: 1 }}
      >
        {label}
      </Typography>
    </Card>
  );

  return (
    <>
      <Divider sx={{ mt: 1, mb: 4 }}>
        <Chip
          icon={<BarChartIcon />}
          label="Base Score Metrics (required)"
          style={{
            fontSize: "20px",
            padding: "10px",
            height: "40px",
            backgroundColor: theme.palette.background.cvssCard,
          }}
        />
      </Divider>

      <Grid container spacing={2} sx={{ alignItems: "stretch" }}>
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
          <Typography variant="body1">
            The Base metric group represents the intrinsic characteristics of a
            vulnerability that are constant over time and across user
            environments. It is composed of two sets of metrics: the
            Exploitability metrics and the Impact metrics. The Exploitability
            metrics reflect the ease and technical means by which the
            vulnerability can be exploited. That is, they represent
            characteristics of the thing that is vulnerable, which we refer to
            formally as the vulnerable component. On the other hand, the Impact
            metrics reflect the direct consequence of a successful exploit, and
            represent the consequence to the thing that suffers the impact,
            which we refer to formally as the impacted component.
          </Typography>
        </Card>
        {renderScoreCard(
          "Base Score",
          cvssScores.base.baseScore,
          cvssScores.base.baseScore >= 9.0
            ? "Critical"
            : cvssScores.base.baseScore >= 7.0
            ? "High"
            : cvssScores.base.baseScore >= 4.0
            ? "Medium"
            : cvssScores.base.baseScore === 0
            ? "None"
            : "Low"
        )}
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
        <Grid container spacing={2}>
          {renderCard(
            "Exploitability Metrics",
            cvssScores.base.exploitabilityScore,
            exploitabilityMetrics
          )}
          {renderCard(
            "Impact Metrics",
            cvssScores.base.impactScore,
            impactMetrics
          )}
          <Box sx={{ mx: "auto", width: "40%" }}>
            <MetricSelect
              label="Scope (S)"
              value={cvssScores.base.scope}
              options={[
                { value: "U", label: "Unchanged" },
                { value: "C", label: "Changed" },
              ]}
              onChange={handleSelectChange("scope")}
              onInfoClick={() =>
                handleOpenModal(
                  "Scope (S)",
                  "The Scope metric captures whether a vulnerability in one vulnerable component impacts resources in components beyond its security scope. The Base Score is greatest when a scope change occurs."
                )
              }
            />
          </Box>
        </Grid>
      </Card>
      {openModal && (
        <InfoModal
          open={openModal}
          onClose={handleCloseModal}
          title={modalContent.title}
          text={modalContent.text}
        />
      )}
    </>
  );
}
