import React from "react";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Card from "@mui/material/Card";
import DescriptionIcon from "@mui/icons-material/Description";
import EventIcon from "@mui/icons-material/Event";
import Grid from "@mui/material/Grid";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import ModelTrainingIcon from "@mui/icons-material/ModelTraining";
import ReactMarkdown from "react-markdown";
import SourceIcon from "@mui/icons-material/Source";
import Typography from "@mui/material/Typography";

export default function Details(props) {
  return (
    <Card
      variant="outlined"
      key="details_card"
      sx={{ m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}
    >
      <Typography variant="h5" gutterBottom component="div">
        Details
      </Typography>
      {props.details ? (
        <>
          <List>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <ListItem>
                  <ListItemIcon>
                    <SourceIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Source identifier"
                    secondary={props.details.sourceIdentifier}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CalendarMonthIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Published"
                    secondary={props.details.published}
                  />
                </ListItem>
              </Grid>
              <Grid item xs={6}>
                <ListItem>
                  <ListItemIcon>
                    <EventIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Last modified"
                    secondary={props.details.lastModified}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <ModelTrainingIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Vulnerability status"
                    secondary={props.details.vulnStatus}
                  />
                </ListItem>
              </Grid>
            </Grid>
            <ListItem>
              <ListItemIcon>
                <DescriptionIcon />
              </ListItemIcon>
              <ListItemText
                primary="Description"
                secondary={
                    <ReactMarkdown>{props.details.descriptions[0].value}</ReactMarkdown>
                }
              />
            </ListItem>
          </List>
        </>
      ) : null}
    </Card>
  );
}
