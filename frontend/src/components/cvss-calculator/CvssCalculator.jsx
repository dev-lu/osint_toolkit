import React, { useState, useEffect } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import { useRecoilState } from "recoil";

import BaseScore from "./BaseScore";
import TemporalScore from "./TemporalScore";
import EnvironmentalScore from "./EnvironmentalScore";
import Circle from "./Circle";
import CVSS31 from "./cvsscalc31.js";
import { cvssScoresAtom } from "./CvssScoresAtom";

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Button from "@mui/material/Button";
import ButtonGroup from '@mui/material/ButtonGroup';
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import ClickAwayListener from '@mui/material/ClickAwayListener';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import Divider from "@mui/material/Divider";
import DownloadIcon from '@mui/icons-material/Download';
import Grid from "@mui/material/Grid";
import Grow from '@mui/material/Grow';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Paper from "@mui/material/Paper";
import Popper from '@mui/material/Popper';
import { Typography } from "@mui/material";
import useTheme from "@mui/material/styles/useTheme";


export default function CvssCalculator() {
  const theme = useTheme();
  const [cvssScores, setCvssScores] = useRecoilState(cvssScoresAtom);
  const [vectorString, setVectorString] = useState("");
  const options = ['Export as markdown', 'Export as JSON']
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  useEffect(() => {
    const scores = CVSS31.calculateCVSSFromMetrics(
      cvssScores.base.attackVector,
      cvssScores.base.attackComplexity,
      cvssScores.base.privilegesRequired,
      cvssScores.base.userInteraction,
      cvssScores.base.scope,
      cvssScores.base.confidentialityImpact,
      cvssScores.base.integrityImpact,
      cvssScores.base.availabilityImpact,
      cvssScores.temporal.exploitCodeMaturity,
      cvssScores.temporal.remediationLevel,
      cvssScores.temporal.reportConfidence,
      cvssScores.environmental.confidentialityRequirement,
      cvssScores.environmental.integrityRequirement,
      cvssScores.environmental.availabilityRequirement,
      cvssScores.environmental.modifiedAttackVector,
      cvssScores.environmental.modifiedAttackComplexity,
      cvssScores.environmental.modifiedPrivilegesRequired,
      cvssScores.environmental.modifiedUserInteraction,
      cvssScores.environmental.modifiedScope,
      cvssScores.environmental.modifiedConfidentialityImpact,
      cvssScores.environmental.modifiedIntegrityImpact,
      cvssScores.environmental.modifiedAvailabilityImpact
    );
    setVectorString(scores.vectorString);
    setCvssScores((prevCvssScores) => ({
      ...prevCvssScores,
      base: {
        ...prevCvssScores.base,
        baseScore: parseFloat(scores.baseMetricScore),
        exploitabilityScore: scores.baseExploitability,
        impactScore: scores.baseImpact,
        baseSeverity: scores.baseSeverity,
      },
      temporal: {
        ...prevCvssScores.temporal,
        temporalScore: parseFloat(scores.temporalMetricScore),
        temporalSeverity: scores.temporalSeverity,
      },
      environmental: {
        ...prevCvssScores.environmental,
        environmentalScore: parseFloat(scores.environmentalMetricScore),
        environmentalSeverity: scores.environmentalSeverity,
        modifiedImpactSubScore: scores.environmentalMISS,
        modifiedImpactScore: scores.environmentalModifiedImpact,
        modifiedExploitabilityScore: scores.environmentalModifiedExploitability,
      },
    }));
  }, [
    cvssScores.base.attackVector,
    cvssScores.base.attackComplexity,
    cvssScores.base.privilegesRequired,
    cvssScores.base.userInteraction,
    cvssScores.base.scope,
    cvssScores.base.confidentialityImpact,
    cvssScores.base.integrityImpact,
    cvssScores.base.availabilityImpact,
    cvssScores.temporal.exploitCodeMaturity,
    cvssScores.temporal.remediationLevel,
    cvssScores.temporal.reportConfidence,
    cvssScores.environmental.confidentialityRequirement,
    cvssScores.environmental.integrityRequirement,
    cvssScores.environmental.availabilityRequirement,
    cvssScores.environmental.modifiedAttackVector,
    cvssScores.environmental.modifiedAttackComplexity,
    cvssScores.environmental.modifiedPrivilegesRequired,
    cvssScores.environmental.modifiedUserInteraction,
    cvssScores.environmental.modifiedScope,
    cvssScores.environmental.modifiedConfidentialityImpact,
    cvssScores.environmental.modifiedIntegrityImpact,
    cvssScores.environmental.modifiedAvailabilityImpact,
  ]);

  const handleClick = () => {
    exportCalculationMarkdown();
  };

  const handleMenuItemClick = (event, index) => {
    if (index === 0) {
      exportCalculationMarkdown();
    } else if (index === 1) {
      exportCalculationJson();
    }
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const data = [
    {
      subject:
        "Overall: " +
        Math.round(cvssScores.environmental.environmentalScore * 10) / 10,
      score: cvssScores.environmental.environmentalScore,
    },
    {
      subject: "Base: " + Math.round(cvssScores.base.baseScore * 10) / 10,
      score: cvssScores.base.baseScore,
    },
    {
      subject:
        "Base Exploitability: " +
        Math.round(cvssScores.base.exploitabilityScore * 10) / 10,
      score: cvssScores.base.exploitabilityScore,
    },
    {
      subject:
        "Base Impact: " + Math.round(cvssScores.base.impactScore * 10) / 10,
      score: cvssScores.base.impactScore,
    },
    {
      subject:
        "Temporal: " + Math.round(cvssScores.temporal.temporalScore * 10) / 10,
      score: cvssScores.temporal.temporalScore,
    },
    {
      subject:
        "Environmental: " +
        Math.round(cvssScores.environmental.environmentalScore * 10) / 10,
      score: cvssScores.environmental.environmentalScore,
    },
    {
      subject:
        "Modified Exploitability: " +
        Math.round(cvssScores.environmental.modifiedExploitabilityScore * 10) /
          10,
      score: cvssScores.environmental.modifiedExploitabilityScore,
    },
    {
      subject:
        "Modified Impact: " +
        Math.round(cvssScores.environmental.modifiedImpactScore * 10) / 10,
      score: cvssScores.environmental.modifiedImpactScore,
    },
    {
      subject:
        "Modified Impact Subscore: " +
        Math.round(cvssScores.environmental.modifiedImpactSubScore * 10) / 10,
      score: cvssScores.environmental.modifiedImpactSubScore,
    },
  ];

  
  function exportCalculationJson() {
    const cvssJson = {
      vectorString: vectorString,
      overallScore: Math.round(cvssScores.environmental.environmentalScore * 10) / 10,
      base: {
        baseScore: cvssScores.base.baseScore,
        exploitabilityScore: Math.round(cvssScores.base.exploitabilityScore * 10) / 10,
        impactScore: Math.round(cvssScores.base.impactScore * 10) / 10,
        attackVector: cvssScores.base.attackVector === "N" ? "Network" : 
        cvssScores.base.attackVector === "A" ? "Adjacent Network" :
        cvssScores.base.attackVector === "L" ? "Local" :
        cvssScores.base.attackVector === "P" ? "Physical" : "Unknown",
        attackComplexity: cvssScores.base.attackComplexity === "L" ? "Low" :
        cvssScores.base.attackComplexity === "H" ? "High" : "Unknown",
        privilegesRequired: cvssScores.base.privilegesRequired === "N" ? "None" :
        cvssScores.base.privilegesRequired === "L" ? "Low" :
        cvssScores.base.privilegesRequired === "H" ? "High" : "Unknown",
        userInteraction: cvssScores.base.userInteraction === "N" ? "None" :
        cvssScores.base.userInteraction === "R" ? "Required" : "Unknown",
        scope: cvssScores.base.scope === "U" ? "Unchanged" :
        cvssScores.base.scope === "C" ? "Changed" : "Unknown"
      },
      temporal: {
        temporalScore: Math.round(cvssScores.temporal.temporalScore * 10) / 10,
        exploitCodeMaturity: cvssScores.temporal.exploitCodeMaturity === "X" ? "Not Defined" :
        cvssScores.temporal.exploitCodeMaturity === "H" ? "High" :
        cvssScores.temporal.exploitCodeMaturity === "F" ? "Functional" :
        cvssScores.temporal.exploitCodeMaturity === "P" ? "Proof-of-Concept" :
        cvssScores.temporal.exploitCodeMaturity === "U" ? "Unproven" : "Unknown",
        remediationLevel: cvssScores.temporal.remediationLevel === "X" ? "Not Defined" :
        cvssScores.temporal.remediationLevel === "O" ? "Official Fix" :
        cvssScores.temporal.remediationLevel === "T" ? "Temporary Fix" :
        cvssScores.temporal.remediationLevel === "W" ? "Workaround" :
        cvssScores.temporal.remediationLevel === "U" ? "Unavailable" : "Unknown",
        reportConfidence: cvssScores.temporal.reportConfidence === "X" ? "Not Defined" :
        cvssScores.temporal.reportConfidence === "C" ? "Confirmed" :
        cvssScores.temporal.reportConfidence === "R" ? "Reasonable" :
        cvssScores.temporal.reportConfidence === "U" ? "Unknown" : "Unknown"
      },
      environmental: {
        environmentalScore: Math.round(cvssScores.environmental.environmentalScore * 10) / 10,
        modifiedExploitabilityScore: Math.round(cvssScores.environmental.modifiedExploitabilityScore * 10) / 10,
        modifiedImpactScore: Math.round(cvssScores.environmental.modifiedImpactScore * 10) / 10,
        modifiedImpactSubScore: Math.round(cvssScores.environmental.modifiedImpactSubScore * 10) / 10,
        modifiedAttackVector: cvssScores.environmental.modifiedAttackVector === "X" ? "Not Defined" :
        cvssScores.environmental.modifiedAttackVector === "N" ? "Network" :
        cvssScores.environmental.modifiedAttackVector === "A" ? "Adjacent Network" :
        cvssScores.environmental.modifiedAttackVector === "L" ? "Local" :
        cvssScores.environmental.modifiedAttackVector === "P" ? "Physical" : "Unknown",
        modifiedAttackComplexity: cvssScores.environmental.modifiedAttackComplexity === "X" ? "Not Defined" :
        cvssScores.environmental.modifiedAttackComplexity === "L" ? "Low" :
        cvssScores.environmental.modifiedAttackComplexity === "H" ? "High" : "Unknown",
        modifiedPrivilegesRequired: cvssScores.environmental.modifiedPrivilegesRequired === "X" ? "Not Defined" :
        cvssScores.environmental.modifiedPrivilegesRequired === "N" ? "None" :
        cvssScores.environmental.modifiedPrivilegesRequired === "L" ? "Low" :
        cvssScores.environmental.modifiedPrivilegesRequired === "H" ? "High" : "Unknown",
        modifiedUserInteraction: cvssScores.environmental.modifiedUserInteraction === "X" ? "Not Defined" :
        cvssScores.environmental.modifiedUserInteraction === "N" ? "None" :
        cvssScores.environmental.modifiedUserInteraction === "R" ? "Required" : "Unknown",
        modifiedScope: cvssScores.environmental.modifiedScope === "X" ? "Not Defined" :
        cvssScores.environmental.modifiedScope === "U" ? "Unchanged" :
        cvssScores.environmental.modifiedScope === "C" ? "Changed" : "Unknown",
        modifiedConfidentialityImpact: cvssScores.environmental.modifiedConfidentialityImpact === "X" ? "Not Defined" :
        cvssScores.environmental.modifiedConfidentialityImpact === "H" ? "High" :
        cvssScores.environmental.modifiedConfidentialityImpact === "L" ? "Low" :
        cvssScores.environmental.modifiedConfidentialityImpact === "N" ? "None" : "Unknown",
        modifiedIntegrityImpact: cvssScores.environmental.modifiedIntegrityImpact === "X" ? "Not Defined" :
        cvssScores.environmental.modifiedIntegrityImpact === "H" ? "High" :
        cvssScores.environmental.modifiedIntegrityImpact === "L" ? "Low" :
        cvssScores.environmental.modifiedIntegrityImpact === "N" ? "None" : "Unknown",
        modifiedAvailabilityImpact: cvssScores.environmental.modifiedAvailabilityImpact === "X" ? "Not Defined" :
        cvssScores.environmental.modifiedAvailabilityImpact === "H" ? "High" :
        cvssScores.environmental.modifiedAvailabilityImpact === "L" ? "Low" :
        cvssScores.environmental.modifiedAvailabilityImpact === "N" ? "None" : "Unknown",
        confidentialityRequirement: cvssScores.environmental.confidentialityRequirement === "X" ? "Not Defined" :
        cvssScores.environmental.confidentialityRequirement === "L" ? "Low" :
        cvssScores.environmental.confidentialityRequirement === "M" ? "Medium" :
        cvssScores.environmental.confidentialityRequirement === "H" ? "High" : "Unknown",
        integrityRequirement: cvssScores.environmental.integrityRequirement === "X" ? "Not Defined" :
        cvssScores.environmental.integrityRequirement === "L" ? "Low" :
        cvssScores.environmental.integrityRequirement === "M" ? "Medium" :
        cvssScores.environmental.integrityRequirement === "H" ? "High" : "Unknown",
        availabilityRequirement: cvssScores.environmental.availabilityRequirement === "X" ? "Not Defined" :
        cvssScores.environmental.availabilityRequirement === "L" ? "Low" :
        cvssScores.environmental.availabilityRequirement === "M" ? "Medium" :
        cvssScores.environmental.availabilityRequirement === "H" ? "High" : "Unknown"


    }
  };

    const fileData = JSON.stringify(cvssJson);
    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "cvss_calculation.json";
    link.href = url;
    link.click();
  }

  function exportCalculationMarkdown() {
    const cvssMarkdown = `# CVSS 3.1 score
Vector String: ${vectorString}
__________
## Base Score Metrics (Score: ${cvssScores.base.baseScore})
The Base metric group represents the intrinsic characteristics of a vulnerability that are constant over time and across user environments. It is composed of two sets of metrics: the Exploitability metrics and the Impact metrics. The Exploitability metrics reflect the ease and technical means by which the vulnerability can be exploited. That is, they represent characteristics of the thing that is vulnerable, which we refer to formally as the vulnerable component. On the other hand, the Impact metrics reflect the direct consequence of a successful exploit, and represent the consequence to the thing that suffers the impact, which we refer to formally as the impacted component.

###  Exploitability Metrics (Score: ${Math.round(cvssScores.base.exploitabilityScore * 10) / 10})
- Attack Vector (AV): ${cvssScores.base.attackVector === "N" ? "Network" : 
cvssScores.base.attackVector === "A" ? "Adjacent Network" :
cvssScores.base.attackVector === "L" ? "Local" :
cvssScores.base.attackVector === "P" ? "Physical" : "Unknown"}
- Attack Complexity (AC): ${cvssScores.base.attackComplexity === "L" ? "Low" :
cvssScores.base.attackComplexity === "H" ? "High" : "Unknown"}
- Privileges Required (PR): ${cvssScores.base.privilegesRequired === "N" ? "None" :
cvssScores.base.privilegesRequired === "L" ? "Low" :
cvssScores.base.privilegesRequired === "H" ? "High" : "Unknown"}
- User Interaction (UI): ${cvssScores.base.userInteraction === "N" ? "None" :
cvssScores.base.userInteraction === "R" ? "Required" : "Unknown"}

### Impact Metrics (Score: ${Math.round(cvssScores.base.impactScore * 10) / 10})
- Confidentiality Impact (CI): ${cvssScores.base.confidentialityImpact === "N" ? "None" :
cvssScores.base.confidentialityImpact === "L" ? "Low" :
cvssScores.base.confidentialityImpact === "H" ? "High" : "Unknown"}
- Integrity Impact (I): ${cvssScores.base.integrityImpact === "N" ? "None" :
cvssScores.base.integrityImpact === "L" ? "Low" :
cvssScores.base.integrityImpact === "H" ? "High" : "Unknown"}
- Availability Impact (AI): ${cvssScores.base.availabilityImpact === "N" ? "None" :
cvssScores.base.availabilityImpact === "L" ? "Low" :
cvssScores.base.availabilityImpact === "H" ? "High" : "Unknown"}

#### Scope (S): ${cvssScores.base.scope === "U" ? "Unchanged" :
cvssScores.base.scope === "C" ? "Changed" : "Unknown"}
__________

## Temporal Score Metrics (Score: ${Math.round(cvssScores.temporal.temporalScore * 10) / 10})
The Temporal metrics measure the current state of exploit techniques or code availability, the existence of any patches or workarounds, or the confidence that one has in the description of a vulnerability. Temporal metrics will almost certainly change over time.

- Exploit Code Maturity (E): ${cvssScores.temporal.exploitCodeMaturity === "X" ? "Not Defined" :
cvssScores.temporal.exploitCodeMaturity === "H" ? "High" :
cvssScores.temporal.exploitCodeMaturity === "F" ? "Functional" :
cvssScores.temporal.exploitCodeMaturity === "P" ? "Proof-of-Concept" :
cvssScores.temporal.exploitCodeMaturity === "U" ? "Unproven" : "Unknown"}
- Remedation Level (RL): ${cvssScores.temporal.remediationLevel === "X" ? "Not Defined" :
cvssScores.temporal.remediationLevel === "O" ? "Official Fix" :
cvssScores.temporal.remediationLevel === "T" ? "Temporary Fix" :
cvssScores.temporal.remediationLevel === "W" ? "Workaround" :
cvssScores.temporal.remediationLevel === "U" ? "Unavailable" : "Unknown"}
- Report Confidence (RC): ${cvssScores.temporal.reportConfidence === "X" ? "Not Defined" :
cvssScores.temporal.reportConfidence === "C" ? "Confirmed" :
cvssScores.temporal.reportConfidence === "R" ? "Reasonable" :
cvssScores.temporal.reportConfidence === "U" ? "Unknown" : "Unknown"}
__________

## Environmental Score Metrics (Score: ${Math.round(cvssScores.environmental.environmentalScore * 10) / 10})
These metrics enable the analyst to customize the CVSS score depending on the importance of the affected IT asset to a user's organization, measured in terms of complementary/alternative security controls in place, Confidentiality, Integrity, and Availability. The metrics are the modified equivalent of base metrics and are assigned metrics value based on the component placement in organization infrastructure.

### Exploitability Metrics (Score: ${Math.round(cvssScores.environmental.modifiedExploitabilityScore * 10) / 10})
- Attack Vector (MAV): ${cvssScores.environmental.modifiedAttackVector === "X" ? "Not Defined" :
cvssScores.environmental.modifiedAttackVector === "N" ? "Network" :
cvssScores.environmental.modifiedAttackVector === "A" ? "Adjacent Network" :
cvssScores.environmental.modifiedAttackVector === "L" ? "Local" :
cvssScores.environmental.modifiedAttackVector === "P" ? "Physical" : "Unknown"}
- Attack Complexity (MAC): ${cvssScores.environmental.modifiedAttackComplexity === "X" ? "Not Defined" :
cvssScores.environmental.modifiedAttackComplexity === "L" ? "Low" :
cvssScores.environmental.modifiedAttackComplexity === "H" ? "High" : "Unknown"}
- Privileges Required (MPR): ${cvssScores.environmental.modifiedPrivilegesRequired === "X" ? "Not Defined" :
cvssScores.environmental.modifiedPrivilegesRequired === "N" ? "None" :
cvssScores.environmental.modifiedPrivilegesRequired === "L" ? "Low" :
cvssScores.environmental.modifiedPrivilegesRequired === "H" ? "High" : "Unknown"}
- User Interaction (MUI): ${cvssScores.environmental.modifiedUserInteraction === "X" ? "Not Defined" :
cvssScores.environmental.modifiedUserInteraction === "N" ? "None" :
cvssScores.environmental.modifiedUserInteraction === "R" ? "Required" : "Unknown"}
- Scope (MS): ${cvssScores.environmental.modifiedScope === "X" ? "Not Defined" :
cvssScores.environmental.modifiedScope === "U" ? "Unchanged" :
cvssScores.environmental.modifiedScope === "C" ? "Changed" : "Unknown"}

### Impact Metrics (Score: ${Math.round(cvssScores.environmental.modifiedImpactScore * 10) / 10})
- Confidentiality Impact (MC): ${cvssScores.environmental.modifiedConfidentialityImpact === "X" ? "Not Defined" :
cvssScores.environmental.modifiedConfidentialityImpact === "N" ? "None" :
cvssScores.environmental.modifiedConfidentialityImpact === "L" ? "Low" :
cvssScores.environmental.modifiedConfidentialityImpact === "H" ? "High" : "Unknown"}
- Integrity Impact (MI): ${cvssScores.environmental.modifiedIntegrityImpact === "X" ? "Not Defined" :
cvssScores.environmental.modifiedIntegrityImpact === "N" ? "None" :
cvssScores.environmental.modifiedIntegrityImpact === "L" ? "Low" :
cvssScores.environmental.modifiedIntegrityImpact === "H" ? "High" : "Unknown"}
- Availability Impact (MAI): ${cvssScores.environmental.modifiedAvailabilityImpact === "X" ? "Not Defined" :
cvssScores.environmental.modifiedAvailabilityImpact === "N" ? "None" :
cvssScores.environmental.modifiedAvailabilityImpact === "L" ? "Low" :
cvssScores.environmental.modifiedAvailabilityImpact === "H" ? "High" : "Unknown"}

### Impact Subscore Modifiers (Score: ${Math.round(cvssScores.environmental.modifiedImpactSubScore * 10) / 10})
- Confidentiality Requirement (CR): ${cvssScores.environmental.confidentialityRequirement === "X" ? "Not Defined" :
cvssScores.environmental.confidentialityRequirement === "L" ? "Low" :
cvssScores.environmental.confidentialityRequirement === "M" ? "Medium" :
cvssScores.environmental.confidentialityRequirement === "H" ? "High" : "Unknown"}
- Integritiy Requirement (IR): ${cvssScores.environmental.integrityRequirement === "X" ? "Not Defined" :
cvssScores.environmental.integrityRequirement === "L" ? "Low" :
cvssScores.environmental.integrityRequirement === "M" ? "Medium" :
cvssScores.environmental.integrityRequirement === "H" ? "High" : "Unknown"}
- Availability Requirement (AR): ${cvssScores.environmental.availabilityRequirement === "X" ? "Not Defined" :
cvssScores.environmental.availabilityRequirement === "L" ? "Low" :
cvssScores.environmental.availabilityRequirement === "M" ? "Medium" :
cvssScores.environmental.availabilityRequirement === "H" ? "High" : "Unknown"}
__________

# Overall Score: ${Math.round(cvssScores.environmental.environmentalScore * 10) / 10}
`;

    const blob = new Blob([cvssMarkdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "cvss_calculation.md";
    link.href = url;
    link.click();
  }

  return (
    <>
      <br />
      <BaseScore />
      <TemporalScore />
      <EnvironmentalScore />
      <br />
      <br />
      <Divider>
        <Chip 
          icon={<DataUsageIcon />} 
          label="Overall CVSS 3.1 Score"
          style={{ fontSize: "20px", padding: "10px", height: "40px" }}
        />
      </Divider>
      <br />
      <Card
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 5,
          minWidth: 0,
          backgroundColor: theme.palette.background.cvssCard,
        }}
      >
        <Grid container spacing={2} alignItems="center" sx={{ p: 2 }}>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" gutterBottom>
              Overall Score
            </Typography>
            <div
              style={{
                width: "160px",
                height: "160px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: theme.palette.background.cvssCircle,
                borderRadius: "50%",
              }}
            >
              <Circle value={cvssScores.environmental.environmentalScore} />
            </div>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ mt: 2 }}
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
            >
              {cvssScores.environmental.environmentalSeverity}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} style={{ width: "100%", height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={data} domain={[0, 10]}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <Radar
                  name="RadarChart"
                  dataKey="score"
                  stroke="grey"
                  fill={theme.palette.background.cvssCircle}
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" align="center" gutterBottom>
              Vector String: {vectorString}
            </Typography>
          </Grid>
        </Grid>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
          <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button">
            <Button onClick={handleClick} startIcon={<DownloadIcon />}>Export calculation</Button>
            <Button
              size="small"
              onClick={handleToggle}
            >
              <ArrowDropDownIcon />
            </Button>
          </ButtonGroup>
          <Popper
            sx={{
              zIndex: 1,
            }}
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === 'bottom' ? 'center top' : 'center bottom',
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList id="export-split-button-menu" autoFocusItem>
                      {options.map((option, index) => (
                        <MenuItem
                          key={option}
                          selected={index === selectedIndex}
                          onClick={(event) => handleMenuItemClick(event, index)}
                        >
                          {option}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
      </Card>
    </>
  );
}
