import React, { useEffect, useState } from 'react';
import {
  Card,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import {
  FileCopyOutlined as FileCopyIcon,
  PeopleOutlined as PeopleIcon,
  ScheduleOutlined as ScheduleIcon,
  VerifiedUserOutlined as VerifiedUserIcon,
} from '@mui/icons-material';
import { PieChart, Pie } from 'recharts';
import api from '../../../../api';
import GeneralInfo from './common/GeneralInfo';
import ResultRow from '../../ResultRow';

export default function AbuseIpdb({ ioc }) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(null);

  const colors = {
    green: "#00C49F",
    orange: "#FFA500",
    red: "#FF0000",
  };

  const getCircleFillColor = (score) => {
    if (score === 0) return colors.green;
    if (score >= 1 && score <= 59) return colors.orange;
    return colors.red;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/api/ip/abuseipdb/${ioc}`);
        setResult(response.data);
        setScore(response.data.data.abuseConfidenceScore);
      } catch (e) {
        setError(e);
      }
      setLoading(false);
    };
    fetchData();
  }, [ioc]);

  const transformedData = result?.data ? {
    ip: result.data.ipAddress,
    ipType: result.data.usageType,
    domain: result.data.domain,
    hostnames: result.data.hostnames || [],
    country: result.data.countryName,
    countryCode: result.data.countryCode,
    isp: result.data.isp,
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
      
      <Card  sx={{ 
        flex: { xs: '1', md: '1' },
        p: 1, 
        borderRadius: 1
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
                  <FileCopyIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Total Reports" 
                  secondary={result.data.totalReports} 
                />
              </ListItem>
              <ListItem dense>
                <ListItemIcon>
                  <PeopleIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Distinct Users" 
                  secondary={result.data.numDistinctUsers} 
                />
              </ListItem>
              <ListItem dense>
                <ListItemIcon>
                  <ScheduleIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Last Report" 
                  secondary={result.data.lastReportedAt} 
                />
              </ListItem>
              <ListItem dense>
                <ListItemIcon>
                  <VerifiedUserIcon 
                    color={result.data.isWhitelisted ? "success" : "primary"} 
                  />
                </ListItemIcon>
                <ListItemText 
                  primary="Whitelisted" 
                  secondary={result.data.isWhitelisted ? "Yes" : "No"} 
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
      name="AbuseIPDB"
      id="abuseipdb"
      icon="aipdb_logo_small"
      loading={loading}
      result={result}
      summary={`${score}% malicious`}
      color={score === 0 ? "green" : score <= 60 ? "orange" : "red"}
      error={error}
      details={details}
    />
  );
}