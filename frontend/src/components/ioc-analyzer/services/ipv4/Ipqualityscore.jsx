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
  Language as LanguageIcon,
  LocationCity as LocationCityIcon,
  Business as BusinessIcon,
  DataUsageOutlined as DataUsageIcon,
  TravelExplore as TravelExploreIcon,
  VpnKey as VpnIcon,
  SignalWifi4Bar as ProxyIcon,
  Security as SecurityIcon,
  Warning as AbuseIcon,
  SmartToy as BotIcon,
} from '@mui/icons-material';
import { PieChart, Pie } from 'recharts';
import api from '../../../../api';
import GeneralInfo from './common/GeneralInfo';
import ResultRow from '../../ResultRow';

export default function IpQualityscore({ ioc }) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(null);

  const getCircleFillColor = (score) => {
    if (score === 0) return "#00C49F";
    if (score >= 1 && score <= 50) return "#FFA500";
    return "#FF0000";
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/api/ip/ipqualityscore/${ioc}`);
        setResult(response.data);
        setScore(response.data.fraud_score);
      } catch (e) {
        setError(e);
      }
      setLoading(false);
    };
    fetchData();
  }, [ioc]);

  const transformedData = result ? {
    ip: ioc,
    country: result.country,
    countryCode: result.country_code,
    region: result.region,
    city: result.city,
    organisation: result.organization,
  } : {};

  const details = result && (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: { xs: 'column', md: 'row' },
      gap: 1 
    }}>
      <Box sx={{ flex: { xs: '1', md: '1' } }}>
        <GeneralInfo
          data={transformedData}
          loading={loading}
          error={error}
        />
      </Box>
      
      <Card sx={{ 
        flex: { xs: '1', md: '1' },
        p: 1, 
        borderRadius: 1,
      }}>
        <Box sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          alignItems: 'center'
        }}>
          <Box sx={{ width: { xs: '100%', md: '50%' } }}>
            <PieChart width={200} height={200}>
              <Pie
                data={[
                  { name: "Score", value: score },
                  { name: "Remaining", value: 100 - score, fill: "#d3d3d3" }
                ]}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                innerRadius="80%"
                outerRadius="100%"
                stroke="none"
                fill={getCircleFillColor(score)}
              />
              <foreignObject width="100%" height="100%">
                <Box sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Typography 
                    variant="h4" 
                    sx={{ color: getCircleFillColor(score) }}
                  >
                    {score}%
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="textSecondary"
                  >
                    malicious
                  </Typography>
                </Box>
              </foreignObject>
            </PieChart>
          </Box>

          <Box sx={{ width: { xs: '100%', md: '50%' } }}>
            <List disablePadding>
              <ListItem dense>
                <ListItemIcon>
                  <ProxyIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Proxy" 
                  secondary={result.proxy ? "Yes" : "No"} 
                />
              </ListItem>
              <ListItem dense>
                <ListItemIcon>
                  <VpnIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="VPN" 
                  secondary={`${result.vpn ? "Yes" : "No"} (Active: ${result.active_vpn ? "Yes" : "No"})`} 
                />
              </ListItem>
              <ListItem dense>
                <ListItemIcon>
                  <SecurityIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Tor" 
                  secondary={`${result.tor ? "Yes" : "No"} (Active: ${result.active_tor ? "Yes" : "No"})`} 
                />
              </ListItem>
              <ListItem dense>
                <ListItemIcon>
                  <AbuseIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Recent Abuse" 
                  secondary={result.recent_abuse ? "Yes" : "No"} 
                />
              </ListItem>
              <ListItem dense>
                <ListItemIcon>
                  <BotIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Bot Status" 
                  secondary={result.bot_status ? "Yes" : "No"} 
                />
              </ListItem>
            </List>
          </Box>
        </Box>
      </Card>
    </Box>
  );

  return (
    <ResultRow
      name="IPQualityScore"
      id="ipqualityscore"
      icon="ipqualityscore_logo_small"
      loading={loading}
      result={result}
      summary={`${score}% malicious`}
      color={score === 0 ? "green" : score <= 50 ? "orange" : "red"}
      error={error}
      details={details}
    />
  );
}