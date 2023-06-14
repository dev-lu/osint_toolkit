import React from "react";

import BarChartIcon from "@mui/icons-material/BarChart";
import Card from "@mui/material/Card";
import CategoryIcon from "@mui/icons-material/Category";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import { List, ListItem, ListItemIcon, ListItemText, Tab } from "@mui/material";
import PolylineIcon from "@mui/icons-material/Polyline";
import SourceIcon from "@mui/icons-material/Source";
import Typography from "@mui/material/Typography";

import Circle from "./Circle";

export default function CvssMetrics(props) {
  return (
    <Card
      variant="outlined"
      key="cvssMetrics_card"
      sx={{ m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}
    >
      <Typography variant="h5" gutterBottom component="div">
        CVSS 3.1 metrics
      </Typography>
      <>
        <List>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <ListItem>
                <ListItemIcon>
                  <PolylineIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Vector string"
                  secondary={props.metrics.cvssData.vectorString}
                />
              </ListItem>
            </Grid>
            <Grid item xs={4}>
              <ListItem>
                <ListItemIcon>
                  <SourceIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Source"
                  secondary={props.metrics.source}
                />
              </ListItem>
            </Grid>
            <Grid item xs={4}>
              <ListItem>
                <ListItemIcon>
                  <CategoryIcon />
                </ListItemIcon>
                <ListItemText primary="Type" secondary={props.metrics.type} />
              </ListItem>
            </Grid>
          </Grid>
        </List>
        <Divider>
          <Chip
            icon={<BarChartIcon />}
            label="Base Score"
            style={{
              fontSize: "20px",
              padding: "10px",
              height: "40px",
            }}
          />
        </Divider>
        <Grid container spacing={2} mt={2} p={1}>
          <Grid item xs={4}>
            <Typography variant="h6" gutterBottom component="div">
              Exploitability (Score: {props.metrics.exploitabilityScore})
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Attack vector (AV)"
                  secondary={props.metrics.cvssData.attackVector}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Attack complexity (AC)"
                  secondary={props.metrics.cvssData.attackComplexity}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Privileges required (PR)"
                  secondary={props.metrics.cvssData.privilegesRequired}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="User interaction (UI)"
                  secondary={props.metrics.cvssData.userInteraction}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Scope (S)"
                  secondary={props.metrics.cvssData.scope}
                />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6" gutterBottom component="div">
              Impact (Score: {props.metrics.impactScore})
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Confidentiality impact (CI)"
                  secondary={props.metrics.cvssData.confidentialityImpact}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Integrity impact (II)"
                  secondary={props.metrics.cvssData.integrityImpact}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Availability impact (AI)"
                  secondary={props.metrics.cvssData.availabilityImpact}
                />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={4}>
            <Circle value={props.metrics.cvssData.baseScore} />
          </Grid>
        </Grid>
      </>
    </Card>
  );
}
