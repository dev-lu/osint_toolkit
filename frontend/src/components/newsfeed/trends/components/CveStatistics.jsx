import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  CircularProgress,
  useTheme
} from '@mui/material';
import { ResponsiveBar } from '@nivo/bar';
import { red } from '@mui/material/colors';
import apiService from '../services/api';

const CveStatistics = ({ timeRange, refreshKey, onSelectArticleIds }) => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCveData();
  }, [refreshKey, timeRange]);

  const fetchCveData = async () => {
    try {
      setLoading(true);
      const responseData = await apiService.getTopCves(10, timeRange);
      setData(responseData);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching top CVE data:', err);
    } finally {
      setLoading(false);
    }
  };

  const chartTheme = {
    axis: {
      ticks: {
        text: {
          fill: theme.palette.text.primary,
          fontSize: 14,
          fontWeight: 500
        },
        line: {
          stroke: theme.palette.divider
        }
      },
      legend: {
        text: {
          fill: theme.palette.text.primary,
          fontSize: 16,
          fontWeight: 600
        }
      }
    },
    grid: {
      line: {
        stroke: theme.palette.divider,
        strokeOpacity: 0.2
      }
    },
    tooltip: {
      container: {
        background: theme.palette.background.paper,
        color: theme.palette.text.primary,
        fontSize: '14px',
        borderRadius: theme.shape.borderRadius,
        boxShadow: theme.shadows[1],
        border: `1px solid ${theme.palette.divider}`
      }
    }
  };

  const barChartData = Array.isArray(data) ? data.map((item, index) => ({
    value: item.value,
    count: item.count,
    color: theme.palette.mode === 'dark' ? red[300] : red[700],
    article_ids: item.article_ids || []
  })) : [];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="250px">
        <CircularProgress sx={{ color: theme.palette.primary.main }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Error loading CVE data: {error}
      </Alert>
    );
  }

  return (
    <Card sx={{ minHeight: '450px', alignItems: 'center', justifyContent: 'center' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" color="text.primary">
            Top Common Vulnerabilities and Exposures (CVEs)
          </Typography>
        </Box>

        <Box height="400px">
          {barChartData.length > 0 ? (
            <ResponsiveBar
              data={barChartData}
              keys={['count']}
              indexBy="value"
              margin={{ top: 20, right: 30, bottom: 100, left: 80 }}
              padding={0.3}
              valueScale={{ type: 'linear' }}
              colors={({ data }) => data.color}
              borderColor={{ from: 'color', modifiers: [['darker', theme.palette.mode === 'dark' ? 0.6 : 1.6]] }}
              axisTop={null}
              axisRight={null}
              theme={chartTheme}
              axisBottom={{
                tickSize: 5,
                tickPadding: 12,
                tickRotation: -45,
                legendPosition: 'middle',
                legendOffset: 90
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 8,
                tickRotation: 0,
                legendPosition: 'middle',
                legendOffset: -60
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              onClick={(node) => {
                const articleIds = node.data.article_ids || [];
                onSelectArticleIds(articleIds, `CVE: ${node.data.value}`);
              }}
              borderRadius={4}
              tooltip={({ value, indexValue }) => (
                <Box
                  bgcolor="background.paper"
                  p={1.5}
                  border={1}
                  borderColor="divider"
                  borderRadius={1}
                >
                  <Typography variant="body2" color="text.primary" fontWeight="medium">
                    {indexValue}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {value} occurrences
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Click to view articles
                  </Typography>
                </Box>
              )}
              role="application"
              ariaLabel="Top CVEs bar chart"
            />
          ) : (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <Typography variant="body1" color="text.secondary">
                No CVE data available for the selected time range.
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default CveStatistics;