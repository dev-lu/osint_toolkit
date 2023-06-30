import React from "react";
import { useState } from "react";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import { Typography } from "@mui/material";

export default function Whois(props) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <Card
      key="whois_card"
      variant="outlined"
      sx={{ m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}
    >
      <Typography variant="h5" component="h2" gutterBottom>
        Whois
      </Typography>
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
