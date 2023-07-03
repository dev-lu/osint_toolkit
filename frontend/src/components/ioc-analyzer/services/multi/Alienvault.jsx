import React from "react";
import api from "../../../../api";
import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircleIcon from "@mui/icons-material/Circle";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

import ResultRow from "../../ResultRow";

export default function Alienvault(props) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pulses, setPulses] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const url =
          "/api/" +
          props.type +
          "/alienvault?ioc=" +
          props.ioc;
        const response = await api.get(url);
        setResult(response.data);
        setPulses(response.data.pulse_info.count);
      } catch (e) {
        setError(e);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const details = (
    <>
      {result ? (
        <Box sx={{ margin: 1 }}>
          <Card variant="outlined" sx={{ mb: 2, borderRadius: 5, boxShadow: 0 }}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                General Information
              </Typography>
              <List sx={{ mb: 2 }}>
                <ListItem disablePadding>
                  <ListItemText primary="Indicator" secondary={result.indicator || "N/A"} />
                </ListItem>
                {result.reputation ? <ListItem disablePadding>
                  <ListItemText primary="Reputation" secondary={result.reputation} />
                </ListItem> : null}
                {result.country_name ? <ListItem disablePadding>
                  <ListItemText primary="Country" secondary={result.country_name} />
                </ListItem> : null}
                {result.type ? <ListItem disablePadding>
                  <ListItemText primary="Type" secondary={result.type} />
                </ListItem> : null}
                {result.asn ? <ListItem disablePadding>
                  <ListItemText primary="ASN" secondary={result.asn} />
                </ListItem> : null}
              </List>
            </CardContent>
          </Card>
          <Card variant="outlined" sx={{ borderRadius: 5, boxShadow: 0 }}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Pulse Information
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography variant="h4" component="span" sx={{ mr: 1 }}>
                  {pulses}
                </Typography>
                <Typography variant="subtitle1" component="span">
                  {pulses === 1 ? "Pulse" : "Pulses"}
                </Typography>
              </Box>
              {pulses > 0 && (
                <>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="h6" component="h3" gutterBottom>
                    Pulses
                  </Typography>
                  {result.pulse_info.pulses?.map((pulse) => (
                    <Chip
                      key={pulse.id}
                      label={pulse.name}
                      icon={pulse.TLP ? <CircleIcon sx={{ "&&": { color: pulse.TLP }, fontSize: "small" }} /> : null}
                      sx={{ m: 0.5}}
                    />
                  ))}
                  {!result.pulse_info.pulses && (
                    <Typography variant="body2" color="text.secondary">
                      None
                    </Typography>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          <Card
            variant="outlined"
            key="sections_card"
            sx={{ mt: 1, p: 2, borderRadius: 5, boxShadow: 0 }}
          >
            <Typography variant="h5" component="h2" gutterBottom>
              Sections
            </Typography>
              <br />{" "}
              {result["sections"]
                ? result["sections"].map((section) => {
                    return <Chip key={section} label={section} sx={{ m: 0.5 }} />;
                  })
                : "None"}
          </Card>
        </Box>
      ) : null}
    </>
  );

  return (
    <>
      <ResultRow
        name="Alienvault OTX"
        id="alienvault"
        icon="avotx_logo_small"
        loading={loading}
        result={result}
        summary={pulses + " pulse(s) "}
        summary_color={{ color: null }}
        color={pulses > 0 ? "red" : "green"}
        error={error}
        details={details}
      />
    </>
  );
}
