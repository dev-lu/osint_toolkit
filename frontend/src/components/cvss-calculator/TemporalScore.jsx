import React from "react";
import { useRecoilState } from "recoil";

import Circle from "./Circle";
import { cvssScoresAtom } from "./CvssScoresAtom";

import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import TimerIcon from "@mui/icons-material/Timer";
import { Typography } from "@mui/material";
import useTheme from "@mui/material/styles/useTheme";


export default function TemporalScore() {
  const theme = useTheme();
  const [cvssScores, setCvssScores] = useRecoilState(cvssScoresAtom);

  return (
    <>
      <br />
      <br />
      <Divider>
        <Chip 
            icon={<TimerIcon />} 
            label="Temporal Score Metrics"
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
            The Temporal metrics measure the current state of exploit techniques
            or code availability, the existence of any patches or workarounds,
            or the confidence that one has in the description of a
            vulnerability. Temporal metrics will almost certainly change over
            time.
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
            <Circle value={cvssScores.temporal.temporalScore} />
          </div>
          <Typography
            variant="h6"
            fontWeight={
              cvssScores.temporal.temporalScore >= 9.0 ? "bold" : "normal"
            }
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
        </Card>
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
            <TextField
              select
              fullWidth
              label="Exploit Code Maturity (E)"
              value={cvssScores.temporal.exploitCodeMaturity}
              onChange={(e) =>
                setCvssScores((prevCvssScores) => ({
                  ...prevCvssScores,
                  temporal: {
                    ...prevCvssScores.temporal,
                    exploitCodeMaturity: e.target.value,
                  },
                }))
              }
              sx={{ m: 1 }}
            >
              <MenuItem value="X">Not defined</MenuItem>
              <MenuItem value="U">Unproven that exploit exists</MenuItem>
              <MenuItem value="P">Proof of concept code</MenuItem>
              <MenuItem value="F">Functional exploit exists</MenuItem>
              <MenuItem value="H">High</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={true}>
            <TextField
              select
              fullWidth
              label="Remediation Level (RL)"
              value={cvssScores.temporal.remediationLevel}
              onChange={(e) =>
                setCvssScores((prevCvssScores) => ({
                  ...prevCvssScores,
                  temporal: {
                    ...prevCvssScores.temporal,
                    remediationLevel: e.target.value,
                  },
                }))
              }
              sx={{ m: 1 }}
            >
              <MenuItem value="X">Not defined</MenuItem>
              <MenuItem value="O">Official fix</MenuItem>
              <MenuItem value="T">Temporary fix</MenuItem>
              <MenuItem value="W">Workaround</MenuItem>
              <MenuItem value="U">Unavailable</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={true}>
            <TextField
              select
              fullWidth
              label="Report Confidence (RC)"
              value={cvssScores.temporal.reportConfidence}
              onChange={(e) =>
                setCvssScores((prevCvssScores) => ({
                  ...prevCvssScores,
                  temporal: {
                    ...prevCvssScores.temporal,
                    reportConfidence: e.target.value,
                  },
                }))
              }
              sx={{ m: 1 }}
            >
              <MenuItem value="X">Not defined</MenuItem>
              <MenuItem value="U">Unknown</MenuItem>
              <MenuItem value="R">Reasonable</MenuItem>
              <MenuItem value="C">Confirmed</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Card>
    </>
  );
}
