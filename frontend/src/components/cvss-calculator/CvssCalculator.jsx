import React, { useEffect } from "react";
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
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import { DataUsage as DataUsageIcon, ExpandMore as ExpandMoreIcon } from "@mui/icons-material";

export default function CvssCalculator() {
  const theme = useTheme();
  const [cvssScores, setCvssScores] = useRecoilState(cvssScoresAtom);
  const [vectorString, setVectorString] = React.useState("");

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
    setCvssScores(prev => ({
      ...prev,
      base: {
        ...prev.base,
        baseScore: parseFloat(scores.baseMetricScore),
        exploitabilityScore: scores.baseExploitability,
        impactScore: scores.baseImpact,
        baseSeverity: scores.baseSeverity,
      },
      temporal: {
        ...prev.temporal,
        temporalScore: parseFloat(scores.temporalMetricScore),
        temporalSeverity: scores.temporalSeverity,
      },
      environmental: {
        ...prev.environmental,
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
      subject: `Overall: ${Math.round(cvssScores.environmental.environmentalScore * 10) / 10}`,
      score: cvssScores.environmental.environmentalScore,
    },
    {
      subject: `Base: ${Math.round(cvssScores.base.baseScore * 10) / 10}`,
      score: cvssScores.base.baseScore,
    },
    {
      subject: `Base Exploitability: ${Math.round(cvssScores.base.exploitabilityScore * 10) / 10}`,
      score: cvssScores.base.exploitabilityScore,
    },
    {
      subject: `Base Impact: ${Math.round(cvssScores.base.impactScore * 10) / 10}`,
      score: cvssScores.base.impactScore,
    },
    {
      subject: `Temporal: ${Math.round(cvssScores.temporal.temporalScore * 10) / 10}`,
      score: cvssScores.temporal.temporalScore,
    },
    {
      subject: `Environmental: ${Math.round(cvssScores.environmental.environmentalScore * 10) / 10}`,
      score: cvssScores.environmental.environmentalScore,
    },
    {
      subject: `Modified Exploitability: ${Math.round(cvssScores.environmental.modifiedExploitabilityScore * 10) / 10}`,
      score: cvssScores.environmental.modifiedExploitabilityScore,
    },
    {
      subject: `Modified Impact: ${Math.round(cvssScores.environmental.modifiedImpactScore * 10) / 10}`,
      score: cvssScores.environmental.modifiedImpactScore,
    },
    {
      subject: `Modified Impact Subscore: ${Math.round(cvssScores.environmental.modifiedImpactSubScore * 10) / 10}`,
      score: cvssScores.environmental.modifiedImpactSubScore,
    },
  ];

  return (
    <>
      <Box >
        <BaseScore />
        <TemporalScore />
        <EnvironmentalScore />
      </Box>
      
      <Accordion 
        defaultExpanded
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
            <DataUsageIcon />
            <Typography variant="h6" sx={{ fontSize: 20 }}>
              Overall CVSS 3.1 Score
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <Box>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Typography variant="h5" gutterBottom>Overall Score</Typography>
                <Box sx={{
                  width: 160,
                  height: 160,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: theme.palette.background.cvssCircle,
                  borderRadius: "50%",
                }}>
                  <Circle value={cvssScores.environmental.environmentalScore} />
                </Box>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ 
                    mt: 2,
                    fontWeight: cvssScores.environmental.environmentalScore >= 9.0 ? "bold" : "normal",
                    color: cvssScores.environmental.environmentalScore >= 7.0
                      ? "red"
                      : cvssScores.environmental.environmentalScore >= 4.0
                      ? "orange"
                      : "green"
                  }}
                >
                  {cvssScores.environmental.environmentalSeverity}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6} sx={{ height: 300 }}>
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
          </Box>
        </AccordionDetails>
      </Accordion>
    </>
  );
}