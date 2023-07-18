import React from "react";
import api from "../../../../api";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import BusinessIcon from "@mui/icons-material/Business";
import DnsIcon from "@mui/icons-material/Dns";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import LanIcon from "@mui/icons-material/Lan";
import LanguageIcon from "@mui/icons-material/Language";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
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

  const scoreData = [
    {
      name: "Overall",
      aggressiveness: result.scores?.overall?.aggressiveness || 0,
      threat: result.scores?.overall?.threat || 0,
      trust: result.scores?.overall?.trust || 0,
      anomaly: result.scores?.overall?.anomaly || 0,
      total: result.scores?.overall?.total || 0,
    },
    {
      name: "Last Day",
      aggressiveness: result.scores?.last_day?.aggressiveness || 0,
      threat: result.scores?.last_day?.threat || 0,
      trust: result.scores?.last_day?.trust || 0,
      anomaly: result.scores?.last_day?.anomaly || 0,
      total: result.scores?.last_day?.total || 0,
    },
    {
      name: "Last Week",
      aggressiveness: result.scores?.last_week?.aggressiveness || 0,
      threat: result.scores?.last_week?.threat || 0,
      trust: result.scores?.last_week?.trust || 0,
      anomaly: result.scores?.last_week?.anomaly || 0,
      total: result.scores?.last_week?.total || 0,
    },
    {
      name: "Last Month",
      aggressiveness: result.scores?.last_month?.aggressiveness || 0,
      threat: result.scores?.last_month?.threat || 0,
      trust: result.scores?.last_month?.trust || 0,
      anomaly: result.scores?.last_month?.anomaly || 0,
      total: result.scores?.last_month?.total || 0,
    },
  ];

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
                    <ListItemIcon>
                      <LanIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="IP range"
                      secondary={`Score: ${result["ip_range"]}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <BusinessIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="AS name"
                      secondary={`Score: ${result["as_name"]}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LanguageIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Country"
                      secondary={`Score: ${result["location"]["country"]}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LocationCityIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="City"
                      secondary={`Score: ${result["location"]["city"]}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <DnsIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Reverse DNS"
                      secondary={`Score: ${result["location"]["reverse_dns"]}`}
                    />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={6} style={{ height: "400px" }}>
                <ResponsiveContainer width="90%" height={400}>
                  <BarChart data={scoreData}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis scale="auto" domain={[0, 5]} />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="aggressiveness"
                      fill="#8884d8"
                      name="Aggressiveness"
                    />
                    <Bar dataKey="threat" fill="#82ca9d" name="Threat" />
                    <Bar dataKey="trust" fill="#ffc658" name="Trust" />
                    <Bar dataKey="anomaly" fill="#ff7300" name="Anomaly" />
                    <Bar dataKey="total" fill="#ff6347" name="Total" />
                  </BarChart>
                </ResponsiveContainer>
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
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h5" component="h3" gutterBottom>
                Target Countries
              </Typography>
              <ResponsiveContainer width="90%" height={400}>
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
              </ResponsiveContainer>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h5" component="h3" gutterBottom>
                Scores
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
            </Grid>
          </Grid>
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

      {result &&
        result["attack_details"] &&
        result["attack_details"].length > 0 && (
          <Card
            variant="outlined"
            sx={{ mt: 2, p: 2, borderRadius: 5, boxShadow: 0 }}
          >
            <Typography variant="h5" component="h3" gutterBottom>
              Attack details
            </Typography>
            <List>
              {result["attack_details"].map((behaviour, index) => (
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

      {result && result["references"] && result["references"].length > 0 && (
        <Card
          variant="outlined"
          sx={{ mt: 2, p: 2, borderRadius: 5, boxShadow: 0 }}
        >
          <Typography variant="h5" component="h3" gutterBottom>
            References
          </Typography>
          <List>
            {result["references"].map((behaviour, index) => (
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
