import React from "react";

import Card from "@mui/material/Card";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Typography } from "@mui/material";

export default function Filenames(props) {
  return (
    <Card
      key="last_analysis_results_card"
      variant="outlined"
      sx={{ m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}
    >
      <Typography variant="h5" component="h2" gutterBottom>
        Filenames
      </Typography>
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
