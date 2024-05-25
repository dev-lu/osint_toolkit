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
import ExportCalculation from "./ExportCalculation";

import DataUsageIcon from "@mui/icons-material/DataUsage";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import useTheme from "@mui/material/styles/useTheme";

export default function CvssCalculator() {
  const theme = useTheme();
  const [cvssScores, setCvssScores] = useRecoilState(cvssScoresAtom);
  const [vectorString, setVectorString] = useState("");

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
    setCvssScores,
  ]);

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

  return (
    <>
      <br />
      <BaseScore />
      <TemporalScore />
      <EnvironmentalScore />
      <br />
      <br />
      <Divider sx={{ mb: 2 }}>
        <Chip
          icon={<DataUsageIcon />}
          label="Overall CVSS 3.1 Score"
          style={{
            fontSize: "20px",
            padding: "10px",
            height: "40px",
            backgroundColor: theme.palette.background.cvssCard,
          }}
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
        <ExportCalculation cvssScores={cvssScores} vectorString={vectorString} />
      </Card>
    </>
  );
}
