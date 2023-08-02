import React from "react";

import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import ClassIcon from "@mui/icons-material/Class";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Typography } from "@mui/material";

export default function ThreatClassification(props) {
  return (
    <Card
      variant="outlined"
      key="threat_classification_card"
      sx={{ m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}
    >
      <Grid container alignItems="center">
        <Grid mr={1} item>
          <ClassIcon />
        </Grid>
        <Grid item>
          <Typography variant="h5" component="h2" gutterBottom>
            Popular threat classification
          </Typography>
        </Grid>
      </Grid>
      <Typography variant="body1" component="h2" gutterBottom>
        Human readable names extracted from the AV verdicts and clustering
        hashes
      </Typography>
      <List>
        <ListItem>
          <ListItemText
            primary="Suggested threat label"
            secondary={
              props.result["data"]["attributes"][
                "popular_threat_classification"
              ]["suggested_threat_label"]
            }
          />
        </ListItem>
      </List>
      <Divider textAlign="left" sx={{ m: 2 }}>
        {" "}
        Popular threat category{" "}
      </Divider>
      {props.result["data"]["attributes"]["popular_threat_classification"][
        "popular_threat_category"
      ].map((category, index) => (
        <Chip
          key={index}
          mr={1}
          label={category.value}
          avatar={<Avatar>{category.count}</Avatar>}
        />
      ))}
      <Divider textAlign="left" sx={{ m: 2 }}>
        {" "}
        Popular threat name{" "}
      </Divider>
      {props.result["data"]["attributes"]["popular_threat_classification"][
        "popular_threat_name"
      ].map((name, index) => (
        <Chip
          key={index}
          size="medium"
          label={name.value}
          avatar={<Avatar>{name.count}</Avatar>}
          sx={{ mr: 1 }}
        />
      ))}
    </Card>
  );
}
