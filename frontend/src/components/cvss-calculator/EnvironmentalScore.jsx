import React from "react";
import { useRecoilState } from "recoil";

import Circle from "./Circle";
import { cvssScoresAtom } from "./CvssScoresAtom";

import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import ForestIcon from "@mui/icons-material/Forest";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";
import useTheme from "@mui/material/styles/useTheme";

export default function EnvironmentalScore() {
  const theme = useTheme();
  const [cvssScores, setCvssScores] = useRecoilState(cvssScoresAtom);

  return (
    <>
      <Grid item xs={12}>
        <br />
        <br />
        <Divider>
          <Chip
            icon={<ForestIcon />}
            label="Environmental Score Metrics"
            style={{ fontSize: "20px", padding: "10px", height: "40px" }}
          />
        </Divider>
        <br />
        <Grid
          direction="row"
          container
          spacing={2}
          sx={{ alignItems: "stretch" }}
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
            <p>
              These metrics enable the analyst to customize the CVSS score
              depending on the importance of the affected IT asset to a user's
              organization, measured in terms of complementary/alternative
              security controls in place, Confidentiality, Integrity, and
              Availability. The metrics are the modified equivalent of base
              metrics and are assigned metrics value based on the component
              placement in organization infrastructure.
            </p>
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
            }}
          >
            <div
              style={{
                width: "120px",
                height: "120px",
                alignItems: "center",
                backgroundColor: theme.palette.background.cvssCircle,
                borderRadius: "50%",
              }}
            >
              <Circle value={cvssScores.environmental.environmentalScore} />
            </div>
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
          <Grid item xs={true}>
            <Typography variant="h6" align="center">
              Exploitability Metrics
            </Typography>
            <TextField
              select
              fullWidth
              label="Attack Vector (MAV)"
              value={cvssScores.environmental.modifiedAttackVector}
              onChange={(e) =>
                setCvssScores((prevCvssScores) => ({
                  ...prevCvssScores,
                  environmental: {
                    ...prevCvssScores.environmental,
                    modifiedAttackVector: e.target.value,
                  },
                }))
              }
              sx={{ m: 1, backgroundColor: theme.palette.background.tablecell }}
            >
              <MenuItem value="X">Not defined</MenuItem>
              <MenuItem value="N">Network</MenuItem>
              <MenuItem value="A">Adjacent network</MenuItem>
              <MenuItem value="L">Local</MenuItem>
              <MenuItem value="P">Physical</MenuItem>
            </TextField>
            <TextField
              select
              fullWidth
              label="Attack Complexity (MAC)"
              value={cvssScores.environmental.modifiedAttackComplexity}
              onChange={(e) =>
                setCvssScores((prevCvssScores) => ({
                  ...prevCvssScores,
                  environmental: {
                    ...prevCvssScores.environmental,
                    modifiedAttackComplexity: e.target.value,
                  },
                }))
              }
              sx={{ m: 1, backgroundColor: theme.palette.background.tablecell }}
            >
              <MenuItem value="X">Not defined</MenuItem>
              <MenuItem value="L">Low</MenuItem>
              <MenuItem value="H">High</MenuItem>
            </TextField>
            <TextField
              select
              fullWidth
              label="Privileges Required (MPR)"
              value={cvssScores.environmental.modifiedPrivilegesRequired}
              onChange={(e) =>
                setCvssScores((prevCvssScores) => ({
                  ...prevCvssScores,
                  environmental: {
                    ...prevCvssScores.environmental,
                    modifiedPrivilegesRequired: e.target.value,
                  },
                }))
              }
              sx={{ m: 1, backgroundColor: theme.palette.background.tablecell }}
            >
              <MenuItem value="X">Not defined</MenuItem>
              <MenuItem value="N">None</MenuItem>
              <MenuItem value="L">Low</MenuItem>
              <MenuItem value="H">High</MenuItem>
            </TextField>
            <TextField
              select
              fullWidth
              label="User Interaction (MUI)"
              value={cvssScores.environmental.modifiedUserInteraction}
              onChange={(e) =>
                setCvssScores((prevCvssScores) => ({
                  ...prevCvssScores,
                  environmental: {
                    ...prevCvssScores.environmental,
                    modifiedUserInteraction: e.target.value,
                  },
                }))
              }
              sx={{ m: 1, backgroundColor: theme.palette.background.tablecell }}
            >
              <MenuItem value="X">Not defined</MenuItem>
              <MenuItem value="N">None</MenuItem>
              <MenuItem value="R">Required</MenuItem>
            </TextField>
            <TextField
              select
              fullWidth
              label="Scope (MS)"
              value={cvssScores.environmental.modifiedScope}
              onChange={(e) =>
                setCvssScores((prevCvssScores) => ({
                  ...prevCvssScores,
                  environmental: {
                    ...prevCvssScores.environmental,
                    modifiedScope: e.target.value,
                  },
                }))
              }
              sx={{ m: 1, backgroundColor: theme.palette.background.tablecell }}
            >
              <MenuItem value="X">Not defined</MenuItem>
              <MenuItem value="U">Unchanged</MenuItem>
              <MenuItem value="C">Changed</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={true}>
            <Typography variant="h6" align="center">
              Impact Metrics
            </Typography>
            <TextField
              select
              fullWidth
              label="Confidentiality Impact (MC)"
              value={cvssScores.environmental.modifiedConfidentialityImpact}
              onChange={(e) =>
                setCvssScores((prevCvssScores) => ({
                  ...prevCvssScores,
                  environmental: {
                    ...prevCvssScores.environmental,
                    modifiedConfidentialityImpact: e.target.value,
                  },
                }))
              }
              sx={{ m: 1, backgroundColor: theme.palette.background.tablecell }}
            >
              <MenuItem value="X">Not defined</MenuItem>
              <MenuItem value="N">None</MenuItem>
              <MenuItem value="L">Low</MenuItem>
              <MenuItem value="H">High</MenuItem>
            </TextField>
            <TextField
              select
              fullWidth
              label="Integrity Impact (MI)"
              value={cvssScores.environmental.modifiedIntegrityImpact}
              onChange={(e) =>
                setCvssScores((prevCvssScores) => ({
                  ...prevCvssScores,
                  environmental: {
                    ...prevCvssScores.environmental,
                    modifiedIntegrityImpact: e.target.value,
                  },
                }))
              }
              sx={{ m: 1, backgroundColor: theme.palette.background.tablecell }}
            >
              <MenuItem value="X">Not defined</MenuItem>
              <MenuItem value="N">None</MenuItem>
              <MenuItem value="L">Low</MenuItem>
              <MenuItem value="H">High</MenuItem>
            </TextField>
            <TextField
              select
              fullWidth
              label="Availability Impact (MA)"
              value={cvssScores.environmental.modifiedAvailabilityImpact}
              onChange={(e) =>
                setCvssScores((prevCvssScores) => ({
                  ...prevCvssScores,
                  environmental: {
                    ...prevCvssScores.environmental,
                    modifiedAvailabilityImpact: e.target.value,
                  },
                }))
              }
              sx={{ m: 1, backgroundColor: theme.palette.background.tablecell }}
            >
              <MenuItem value="X">Not defined</MenuItem>
              <MenuItem value="N">None</MenuItem>
              <MenuItem value="L">Low</MenuItem>
              <MenuItem value="H">High</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={true}>
            <Typography variant="h6" align="center">
              Impact Subscore Modifiers
            </Typography>
            <TextField
              select
              fullWidth
              label="Confidentiality Requirement (CR)"
              value={cvssScores.environmental.confidentialityRequirement}
              onChange={(e) =>
                setCvssScores((prevCvssScores) => ({
                  ...prevCvssScores,
                  environmental: {
                    ...prevCvssScores.environmental,
                    confidentialityRequirement: e.target.value,
                  },
                }))
              }
              sx={{ m: 1, backgroundColor: theme.palette.background.tablecell }}
            >
              <MenuItem value="X">Not defined</MenuItem>
              <MenuItem value="L">Low</MenuItem>
              <MenuItem value="M">Medium</MenuItem>
              <MenuItem value="H">High</MenuItem>
            </TextField>
            <TextField
              select
              fullWidth
              label="Integrity Requirement (IR)"
              value={cvssScores.environmental.integrityRequirement}
              onChange={(e) =>
                setCvssScores((prevCvssScores) => ({
                  ...prevCvssScores,
                  environmental: {
                    ...prevCvssScores.environmental,
                    integrityRequirement: e.target.value,
                  },
                }))
              }
              sx={{ m: 1, backgroundColor: theme.palette.background.tablecell }}
            >
              <MenuItem value="X">Not defined</MenuItem>
              <MenuItem value="L">Low</MenuItem>
              <MenuItem value="M">Medium</MenuItem>
              <MenuItem value="H">High</MenuItem>
            </TextField>
            <TextField
              select
              fullWidth
              label="Availability Requirement (AR)"
              value={cvssScores.environmental.availabilityRequirement}
              onChange={(e) =>
                setCvssScores((prevCvssScores) => ({
                  ...prevCvssScores,
                  environmental: {
                    ...prevCvssScores.environmental,
                    availabilityRequirement: e.target.value,
                  },
                }))
              }
              sx={{ m: 1, backgroundColor: theme.palette.background.tablecell }}
            >
              <MenuItem value="X">Not defined</MenuItem>
              <MenuItem value="L">Low</MenuItem>
              <MenuItem value="M">Medium</MenuItem>
              <MenuItem value="H">High</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Card>
    </>
  );
}
