import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import {
  Schedule as TimeIcon,
  Public as GeoIcon,
  Language as WebIcon,
  Dns as DnsIcon,
  Security as RiskIcon,
} from '@mui/icons-material';
import api from '../../../../api';
import ResultRow from '../../ResultRow';
import NoDetails from '../NoDetails';

export default function Pulsedive({ type, ioc }) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const url = `/api/${type}/pulsedive?ioc=${encodeURIComponent(ioc)}`;
        const response = await api.get(url);
        setResult(response.data);
      } catch (e) {
        setError(e);
      }
      setLoading(false);
    };
    fetchData();
  }, [type, ioc]);

  const details = result?.results?.[0] && (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Card sx={{ borderRadius: 1 }}>
        <List sx={{ p: 1 }} disablePadding>
          <ListItem dense>
            <ListItemIcon>
              <RiskIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Risk Level" 
              secondary={result.results[0].risk.charAt(0).toUpperCase() + result.results[0].risk.slice(1)}
            />
          </ListItem>
          <ListItem dense>
            <ListItemIcon>
              <TimeIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Timestamps"
              secondary={
                <Box>
                  <Typography variant="body2">Added: {result.results[0].stamp_added}</Typography>
                  <Typography variant="body2">Updated: {result.results[0].stamp_updated}</Typography>
                  <Typography variant="body2">Last seen: {result.results[0].stamp_seen}</Typography>
                </Box>
              }
            />
          </ListItem>
          
          {result.results[0].summary?.properties?.dns?.ptr && (
            <ListItem dense>
              <ListItemIcon>
                <DnsIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="DNS PTR" 
                secondary={result.results[0].summary.properties.dns.ptr} 
              />
            </ListItem>
          )}

          {result.results[0].summary?.properties?.geo && (
            <ListItem dense>
              <ListItemIcon>
                <GeoIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Geolocation" 
                secondary={
                  <Box>
                    <Typography variant="body2">Country: {result.results[0].summary.properties.geo.country}</Typography>
                    <Typography variant="body2">Code: {result.results[0].summary.properties.geo.countrycode}</Typography>
                    <Typography variant="body2">Organization: {result.results[0].summary.properties.geo.org}</Typography>
                  </Box>
                }
              />
            </ListItem>
          )}

          {result.results[0].summary?.properties?.http && (
            <ListItem dense>
              <ListItemIcon>
                <WebIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="HTTP Properties" 
                secondary={
                  <Box>
                    <Typography variant="body2">Content Type: {result.results[0].summary.properties.http['++content-type']}</Typography>
                    <Typography variant="body2">Status Code: {result.results[0].summary.properties.http['++code']}</Typography>
                  </Box>
                }
              />
            </ListItem>
          )}
        </List>
      </Card>
    </Box>
  );

  const getRisk = () => {
    const firstResult = result?.results?.[0];
    if (!firstResult) return { summary: "Not found", color: "lightgrey" };
    
    const risk = firstResult.risk;
    if (risk === "none") return { summary: "Risk: None", color: "green" };
    if (["low", "medium"].includes(risk)) return { 
      summary: `Risk: ${risk.charAt(0).toUpperCase() + risk.slice(1)}`,
      color: "orange"
    };
    return { 
      summary: `Risk: ${risk.charAt(0).toUpperCase() + risk.slice(1)}`,
      color: "red"
    };
  };

  const risk = getRisk();

  return (
    <ResultRow
      name="Pulsedive"
      id="pulsedive"
      icon="pulsedive_logo_small"
      loading={loading}
      result={result}
      summary={risk.summary}
      color={risk.color}
      error={error}
      details={details || <NoDetails />}
    />
  );
}