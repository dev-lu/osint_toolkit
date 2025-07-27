import React from 'react'; 
import {
  Box,
  Card,
  CardContent, 
  Grid, 
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import {
  LocationCity as LocationCityIcon,
  VpnKey as VpnIcon,
  SignalWifi4Bar as ProxyIcon,
  Security as TorIcon,
  Warning as AbuseIcon,
  SmartToy as BotIcon,

} from '@mui/icons-material';
import { PieChart, Pie, Cell, Text } from 'recharts';
import GeneralInfo from '../../components/GeneralInfo';
import NoDetails from '../NoDetails';

const COLORS_CHART = {
  green: "#00C49F",
  orange: "#FFA500",
  red: "#FF0000",
  grey: "#d3d3d3",
};

const getCircleFillColor = (score) => {
  if (score === null || typeof score === 'undefined') return COLORS_CHART.grey;
  if (score === 0) return COLORS_CHART.green;
  if (score >= 1 && score <= 50) return COLORS_CHART.orange;
  return COLORS_CHART.red;
};

export default function IpQualityscoreDetails({ result, ioc }) {

  if (!result || result.error) {
    const message = result && result.error 
        ? `Error fetching IPQualityScore details: ${result.message || result.error}` 
        : "IPQualityScore details are unavailable or data is incomplete.";
    return (
      <Box sx={{ margin: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 100 }}>
        <NoDetails message={message} />
      </Box>
    );
  }

  const score = result.fraud_score ?? null;

  const transformedData = {
    ip: ioc, 
    country: result.country_code, 
    city: result.city,
    isp: result.ISP, 
    organization: result.organization,
  };

  const pieData = [
    { name: "Score", value: score ?? 0 },
    { name: "Remaining", value: 100 - (score ?? 0), fill: COLORS_CHART.grey }
  ];

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: { xs: 'column', md: 'row' },
      gap: 2, 
      p:1 
    }}>
      <Grid item xs={12} md={5} sx={{ display: 'flex' }}> 
        <Card sx={{ flex: 1, p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" gutterBottom component="div">
            General IP Information
          </Typography>
          <GeneralInfo
            data={transformedData}
          />
        </Card>
      </Grid>
      
      <Grid item xs={12} md={7} sx={{ display: 'flex' }}> 
        <Card sx={{ 
          flex: 1, 
          p: 2, 
          borderRadius: 2, 
          border: '1px solid', 
          borderColor: 'divider' 
        }}>
          <Typography variant="h6" gutterBottom component="div">
            Fraud Score & Indicators
          </Typography>
          <Box sx={{ 
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' }, 
            gap: 2,
            alignItems: 'center', 
            mt: 1
          }}>
            <Box sx={{ width: { xs: '100%', sm: 'auto' }, display: 'flex', justifyContent: 'center', mb: {xs: 2, sm: 0} }}>
              <PieChart width={180} height={180}> 
                <Pie
                  data={pieData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  startAngle={90}
                  endAngle={-270}
                  innerRadius="70%"
                  outerRadius="100%"
                  paddingAngle={score === 0 || score === 100 ? 0 : 2}
                  stroke="none"
                >
                    <Cell fill={getCircleFillColor(score)} />
                    <Cell fill={COLORS_CHART.grey} />
                </Pie>
                <Text
                    x="50%"
                    y="46%"
                    textAnchor="middle"
                    dominantBaseline="central"
                    style={{ fill: getCircleFillColor(score), fontSize: '2rem', fontWeight: 'bold' }}
                >
                    {`${score ?? 'N/A'}`}%
                </Text>
                <Text
                    x="50%"
                    y="62%"
                    textAnchor="middle"
                    dominantBaseline="central"
                    style={{ fill: 'text.secondary', fontSize: '0.8rem' }}
                >
                    fraud risk
                </Text>
              </PieChart>
            </Box>

            <Box sx={{ width: { xs: '100%', sm: 'auto' }, flexGrow: 1 }}>
              <List disablePadding dense>
                <ListItem>
                  <ListItemIcon sx={{minWidth: 36}}><ProxyIcon color="action" /></ListItemIcon>
                  <ListItemText 
                    primary="Proxy" 
                    secondary={result.proxy ? "Yes" : "No"} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon sx={{minWidth: 36}}><VpnIcon color="action" /></ListItemIcon>
                  <ListItemText 
                    primary="VPN" 
                    secondary={`${result.VPN ? "Yes" : "No"} ${result.active_VPN ? "(Active)" : ""}`} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon sx={{minWidth: 36}}><TorIcon color="action" /></ListItemIcon>
                  <ListItemText 
                    primary="Tor" 
                    secondary={`${result.tor ? "Yes" : "No"} ${result.active_tor ? "(Active)" : ""}`} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon sx={{minWidth: 36}}><AbuseIcon color="action" /></ListItemIcon>
                  <ListItemText 
                    primary="Recent Abuse" 
                    secondary={result.recent_abuse ? "Yes" : "No"} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon sx={{minWidth: 36}}><BotIcon color="action" /></ListItemIcon>
                  <ListItemText 
                    primary="Bot Status" 
                    secondary={result.bot_status ? "Yes" : "No"} 
                  />
                </ListItem>
                 <ListItem>
                  <ListItemIcon sx={{minWidth: 36}}><LocationCityIcon color="action" /></ListItemIcon>
                  <ListItemText 
                    primary="Mobile Connection" 
                    secondary={result.mobile ? "Yes" : "No"} 
                  />
                </ListItem>
              </List>
            </Box>
          </Box>
        </Card>
      </Grid>
    </Box>
  );
}
