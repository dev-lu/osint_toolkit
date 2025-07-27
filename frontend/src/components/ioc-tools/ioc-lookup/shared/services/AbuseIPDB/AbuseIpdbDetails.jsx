import React from 'react';
import {
  Card,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Grid, 
} from '@mui/material';
import {
  FileCopyOutlined as FileCopyIcon,
  PeopleOutlined as PeopleIcon,
  ScheduleOutlined as ScheduleIcon,
  VerifiedUserOutlined as VerifiedUserIcon,
} from '@mui/icons-material';
import { PieChart, Pie, ResponsiveContainer } from 'recharts';
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
  if (score >= 1 && score <= 59) return COLORS_CHART.orange;
  return COLORS_CHART.red;
};

export default function AbuseIpdbDetails({ result, ioc }) {
  if (!result || !result.data) {
    const message = result && result.error 
        ? `Error fetching AbuseIPDB details: ${result.message || result.error}` 
        : "AbuseIPDB details are unavailable or still loading.";
    return <NoDetails message={message} />;
  }

  const { data } = result;
  const score = data.abuseConfidenceScore ?? null; 

  const transformedData = {
    ip: data.ipAddress,
    usageType: data.usageType,
    domain: data.domain,
    hostnames: data.hostnames || [],
    country: data.countryName,
    countryCode: data.countryCode,
    isp: data.isp,
  };

  const pieData = [
    { name: "Score", value: score ?? 0 },
    { name: "Remaining", value: 100 - (score ?? 0), fill: COLORS_CHART.grey }
  ];
  
  const lastReportedDate = data.lastReportedAt ? new Date(data.lastReportedAt).toLocaleDateString() : "N/A";


  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: { xs: 'column', md: 'row' },
      gap: 2,
      p: 1 
    }}>
      <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 50%' } }}> 
        <GeneralInfo
          data={transformedData}
        />
      </Box>
      
      <Card  sx={{ 
        flex: { xs: '1 1 100%', md: '1 1 50%' }, 
        p: 2, 
        borderRadius: 2
      }}>
        <Typography variant="h6" gutterBottom component="div">
          Confidence Score & Stats
        </Typography>
        <Box sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          alignItems: 'center',
          mt: 1
        }}>
          <Box sx={{ width: { xs: '100%', md: 'auto' }, display: 'flex', justifyContent: 'center' }}> 
            <ResponsiveContainer width={250} height={250}>
              <PieChart width={250} height={250}>
                <Pie
                  data={pieData}
                  dataKey="value"
                  startAngle={180}
                  endAngle={0}
                  innerRadius="60%"
                  outerRadius="90%"
                  minAngle={1}
                  domain={[0, 100]}
                  stroke="none"
                  strokeWidth={0}
                  fill={getCircleFillColor(score)}
                />
                <foreignObject
                  width="100%"
                  height="100%"
                  style={{ textAlign: "center" }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      height: "75%",
                      width: "100%",
                      paddingBottom: "20px",
                    }}
                  >
                    <Typography variant="h3" color={getCircleFillColor(score)} align="center">
                      {score ?? 'N/A'}
                    </Typography>
                    <Typography variant="h5" color="textSecondary" align="center">
                      % malicious
                    </Typography>
                  </div>
                </foreignObject>
              </PieChart>
            </ResponsiveContainer>
          </Box>

          <Box sx={{ width: { xs: '100%', md: 'auto' }, flexGrow: 1 }}> 
            <List disablePadding dense>
              <ListItem>
                <ListItemIcon sx={{minWidth: 36}}> 
                  <FileCopyIcon color="action" />
                </ListItemIcon>
                <ListItemText 
                  primary="Total Reports" 
                  secondary={data.totalReports ?? 'N/A'}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon sx={{minWidth: 36}}>
                  <PeopleIcon color="action" />
                </ListItemIcon>
                <ListItemText 
                  primary="Distinct Users" 
                  secondary={data.numDistinctUsers ?? 'N/A'} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon sx={{minWidth: 36}}>
                  <ScheduleIcon color="action" />
                </ListItemIcon>
                <ListItemText 
                  primary="Last Reported" 
                  secondary={lastReportedDate} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon sx={{minWidth: 36}}>
                  <VerifiedUserIcon 
                    color={data.isWhitelisted ? "success" : "action"} 
                  />
                </ListItemIcon>
                <ListItemText 
                  primary="Whitelisted" 
                  secondary={data.isWhitelisted ? "Yes" : "No"} 
                />
              </ListItem>
            </List>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
