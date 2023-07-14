import React from "react";
import api from "../../../../api";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

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

  const transformData = (targetCountries) => {
    return Object.keys(targetCountries).map((country) => ({
      country: country,
      count: targetCountries[country],
    }));
  };

  const details = (
    <>
      {result && (
        <>
          <Card variant="outlined" sx={{ p: 2, borderRadius: 5, boxShadow: 0 }}>
            <Typography variant="h5" component="h3" gutterBottom>
              Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
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
              </Grid>
              <Grid item xs={6}>
                <List sx={{ mt: 1 }}>
                  <ListItem>
                    <ListItemText
                      primary="IP range"
                      secondary={`Score: ${result["ip_range"]}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="AS name"
                      secondary={`Score: ${result["as_name"]}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Country"
                      secondary={`Score: ${result["location"]["country"]}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="City"
                      secondary={`Score: ${result["location"]["city"]}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Reverse DNS"
                      secondary={`Score: ${result["location"]["reverse_dns"]}`}
                    />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </Card>
        </>
      )}

      {result && result["target_countries"] && (
        <Card
          variant="outlined"
          sx={{ mt: 2, p: 2, borderRadius: 5, boxShadow: 0 }}
        >
          <Typography variant="h5" component="h3" gutterBottom>
            Target Countries
          </Typography>
          <BarChart
            width={700}
            height={400}
            data={transformData(result["target_countries"])}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="country" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#88CCF6" />
          </BarChart>
        </Card>
      )}

      {result && result["behaviors"] && result["behaviors"].length > 0 && (
        <Card
          variant="outlined"
          sx={{ mt: 2, p: 2, borderRadius: 5, boxShadow: 0 }}
        >
          <Typography variant="h5" component="h3" gutterBottom>
            Behaviours
          </Typography>
          <List>
            {result["behaviors"].map((behaviour, index) => (
              <ListItem>
                <ListItemText
                  primary={behaviour.label}
                  secondary={behaviour.description}
                />
              </ListItem>
            ))}
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
