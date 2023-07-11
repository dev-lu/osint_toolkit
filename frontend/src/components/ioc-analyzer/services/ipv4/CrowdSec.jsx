import React from "react";
import api from "../../../../api";
import { useEffect, useState } from "react";

import Card from "@mui/material/Card";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Typography } from "@mui/material";

import ResultRow from "../../ResultRow";

export default function CrowdSec(props) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const url = "/api/ip/crowdsec/" + props.ioc;
        const response = await api.get(url);
        setResult(response.data);
        setScore(response.data["ip_range_score"]);
      } catch (e) {
        setError(e);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const details = (
    <>
      {result && (
        <Card variant="outlined" sx={{ p: 2, borderRadius: 5, boxShadow: 0 }}>
          <Typography variant="h5" component="h3" gutterBottom>
            Details
          </Typography>
          <List sx={{ mt: 1 }}>
            <ListItem>
              <ListItemText
                primary="Aggressiveness"
                secondary={`Score: ${result["scores"]["overall"]["aggressiveness"]}`}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Threat"
                secondary={`Score: ${result["scores"]["overall"]["threat"]}`}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Trust"
                secondary={`Score: ${result["scores"]["overall"]["trust"]}`}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Anomaly"
                secondary={`Score: ${result["scores"]["overall"]["anomaly"]}`}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Total"
                secondary={`Score: ${result["scores"]["overall"]["total"]}`}
              />
            </ListItem>
          </List>
        </Card>
      )}
    </>
  );

  return (
    <>
      <ResultRow
        name="CrowdSec"
        id="crowdsec"
        icon="crowdsec_logo_small"
        loading={loading}
        result={result}
        summary={
          "Malevolence: " +
          score +
          " (from 0 - no reports to 5 - high malevolence)"
        }
        summary_color={{ color: null }}
        color={score === 0 ? "green" : score <= 2 ? "orange" : "red"}
        error={error}
        details={details}
      />
    </>
  );
}
