import React from 'react';

import {
  Box,
  Card,
  CardContent, 
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Grid,
  Divider,
} from '@mui/material';
import {
  Schedule as TimeIcon,
  Public as GeoIcon,
  Language as WebIcon,
  Dns as DnsIcon,
  Security as RiskIcon,
  InfoOutlined as InfoIcon, 
} from '@mui/icons-material';

import NoDetails from '../NoDetails'; 

const DetailListItem = ({ icon, primary, secondary, secondaryIsBlock = false }) => (
  <ListItem dense disableGutters sx={{alignItems: secondaryIsBlock ? 'flex-start' : 'center'}}>
    <ListItemIcon sx={{minWidth: 36}}>{icon || <InfoIcon color="action" />}</ListItemIcon>
    <ListItemText 
      primary={primary} 
      secondary={secondary || "N/A"} 
      primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
      secondaryTypographyProps={{ variant: 'body2', color: 'text.secondary', component: secondaryIsBlock ? 'div' : 'span' }}
    />
  </ListItem>
);


export default function PulsediveDetails({ result, ioc }) { 

  if (!result) {
    return (
      <Box sx={{ margin: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 100 }}>
        <NoDetails message="Loading Pulsedive details..." />
      </Box>
    );
  }

  if (result.error) {
    return (
      <Box sx={{ margin: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 100 }}>
        <NoDetails message={`Error fetching Pulsedive details: ${result.message || result.error}`} />
      </Box>
    );
  }

  if (result.status === "Not found" || !result.results || result.results.length === 0) {
     return (
      <Box sx={{ margin: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 100 }}>
        <NoDetails message={`Indicator "${ioc}" not found or no details in Pulsedive.`} />
      </Box>
    );
  }

  const data = result.results[0];

  const getProperty = (path, defaultValue = "N/A") => {
    const value = path.split('.').reduce((obj, key) => (obj && obj[key] !== undefined) ? obj[key] : undefined, data.summary?.properties);
    return value ?? defaultValue;
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  }

  return (
    <Box sx={{ margin: 1, mt:0 }}> 
      <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <CardContent>
          <Grid container spacing={1} alignItems="center" mb={2}>
            <RiskIcon color="action" />
            <Typography variant="h6" component="div" sx={{ ml: 1 }}>
              Pulsedive Analysis for: <Typography component="span" sx={{wordBreak: 'break-all'}}>{data.indicator || ioc}</Typography>
            </Typography>
          </Grid>

          <List dense>
            <DetailListItem 
              icon={<RiskIcon />}
              primary="Risk Level" 
              secondary={data.risk ? data.risk.charAt(0).toUpperCase() + data.risk.slice(1) : "N/A"}
            />
            <DetailListItem 
              icon={<TimeIcon />}
              primary="Timestamps"
              secondaryIsBlock={true}
              secondary={
                <Box>
                  <Typography variant="caption" display="block">Added: {formatDate(data.stamp_added)}</Typography>
                  <Typography variant="caption" display="block">Updated: {formatDate(data.stamp_updated)}</Typography>
                  <Typography variant="caption" display="block">Last Seen: {formatDate(data.stamp_seen)}</Typography>
                </Box>
              }
            />
            
            <Divider sx={{my:1}}/>
            <Typography variant="subtitle1" sx={{mt:1, mb:0.5, fontWeight:'medium'}}>Properties:</Typography>

            {data.summary?.properties?.dns && (
              <DetailListItem 
                icon={<DnsIcon />}
                primary="DNS PTR" 
                secondary={getProperty('dns.ptr')} 
              />
            )}

            {data.summary?.properties?.geo && (
              <DetailListItem 
                icon={<GeoIcon />}
                primary="Geolocation" 
                secondaryIsBlock={true}
                secondary={
                  <Box>
                    <Typography variant="caption" display="block">Country: {getProperty('geo.country')} ({getProperty('geo.countrycode')})</Typography>
                    <Typography variant="caption" display="block">City: {getProperty('geo.city')}</Typography>
                    <Typography variant="caption" display="block">Organization: {getProperty('geo.org')}</Typography>
                  </Box>
                }
              />
            )}

            {data.summary?.properties?.http && (
              <DetailListItem 
                icon={<WebIcon />}
                primary="HTTP Properties" 
                secondaryIsBlock={true}
                secondary={
                  <Box>
                    <Typography variant="caption" display="block">Content Type: {getProperty('http.++content-type')}</Typography>
                    <Typography variant="caption" display="block">Status Code: {getProperty('http.++code')}</Typography>
                  </Box>
                }
              />
            )}
            
            {Object.keys(data.summary?.properties || {}).length === 0 && (
                <Typography variant="caption" color="text.secondary" sx={{pl:5.5}}>No specific properties found.</Typography>
            )}

          </List>
        </CardContent>
      </Card>
    </Box>
  );
}