import React from "react";

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Typography } from "@mui/material";

import DescriptionIcon from "@mui/icons-material/Description";

export default function Filenames(props) {
  return (
    <Card
      key="last_analysis_results_card"
      variant="outlined"
      sx={{ m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}
    >
      <Grid container alignItems="center">
        <Grid mr={1} item>
          <DescriptionIcon />
        </Grid>
        <Grid item>
          <Typography variant="h5" component="h2" gutterBottom>
            Filenames
          </Typography>
        </Grid>
      </Grid>
      <List>
        {props.result["data"]["attributes"]["names"].map((name, index) => (
          <ListItem>
            <ListItemText primary={name} />
          </ListItem>
        ))}
      </List>
    </Card>
  );
}
