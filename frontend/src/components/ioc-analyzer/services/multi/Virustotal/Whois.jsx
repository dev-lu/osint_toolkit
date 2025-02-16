import React from "react";
import { useState } from "react";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";

import QuestionMarkIcon from "@mui/icons-material/QuestionMark";

export default function Whois(props) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <Card
      key="whois_card"
      sx={{ m: 1, p: 2, borderRadius: 1, boxShadow: 0 }}
    >
      <Grid container alignItems="center">
        <Grid mr={1} item>
          <QuestionMarkIcon />
        </Grid>
        <Grid item>
          <Typography variant="h5" component="h2" gutterBottom>
            Whois
          </Typography>
        </Grid>
      </Grid>
      <Typography component="p" sx={{ whiteSpace: "pre-wrap" }}>
        {expanded
          ? props.result["data"]["attributes"]["whois"]
          : props.result["data"]["attributes"]["whois"].slice(0, 200)}
      </Typography>
      {props.result["data"]["attributes"]["whois"].length > 250 && (
        <Button onClick={toggleExpanded}>
          {expanded ? "Read Less" : "Read More"}
        </Button>
      )}
    </Card>
  );
}
