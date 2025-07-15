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
import { ResponsivePie } from '@nivo/pie';
import { common } from '@mui/material/colors';

import apiService from '../services/api';

const IocDistributionChart = ({ timeRange, refreshKey }) => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIocDistributionData = async () => {
      try {
        setLoading(true);
        setError(null);
        const responseData = await apiService.getIocTypeDistribution(timeRange);
        setData(Array.isArray(responseData) ? responseData : []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching IOC type distribution data:', err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchIocDistributionData();
  }, [refreshKey, timeRange]);

  const chartTheme = {
    labels: {
      text: {
        fill: theme.palette.text.primary,
        fontSize: 12,
      },
    },
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
    },
    legends: {
      text: {
        fill: theme.palette.text.secondary,
      },
    },
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="350px">
        <CircularProgress sx={{ color: theme.palette.primary.main }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Error loading IOC distribution: {error}
      </Alert>
    );
  }

  return (
    <Card sx={{ minHeight: '450px',alignItems: 'center', justifyContent: 'center' }}>
      <CardContent>
        <Typography variant="h6" color="text.primary" mb={2}>
          IOC Type Distribution
        </Typography>
        <Box height="400px">
          {data.length > 0 ? (
            <ResponsivePie
              data={data}
              margin={{ top: 40, right: 80, bottom: 100, left: 80 }}
              innerRadius={0.5}
              padAngle={3}
              cornerRadius={5}
              activeOuterRadiusOffset={0}
              activeInnerRadiusOffset={0}
              arcLabelsRadiusOffset={0.5}
              arcLabelsTextColor={theme.palette.mode === 'dark' ? common.white : common.black}
              colors={{ scheme: 'paired' }}
              borderWidth={1}
              borderColor={{
                from: 'color',
                modifiers: [['darker', 0.2]]
              }}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor={theme.palette.text.secondary}
              arcLinkLabelsThickness={1}
              arcLinkLabelsColor={{ from: 'color' }}
              arcLabelsSkipAngle={10}
              defs={[
                { id: 'dots', type: 'patternDots', background: 'inherit', color: 'rgba(255, 255, 255, 0.3)', size: 4, padding: 1, stagger: 3 },
                { id: 'lines', type: 'patternLines', background: 'inherit', color: 'rgba(255, 255, 255, 0.3)', rotation: -45, lineWidth: 6, spacing: 10 }
              ]}
              legends={[
                {
                  anchor: 'bottom',
                  direction: 'row',
                  justify: false,
                  translateX: 0,
                  translateY: 56,
                  itemsSpacing: 0,
                  itemWidth: 100,
                  itemHeight: 18,
                  itemTextColor: theme.palette.text.secondary,
                  itemDirection: 'left-to-right',
                  itemOpacity: 1,
                  symbolSize: 18,
                  symbolShape: 'circle',
                }
              ]}
              tooltip={({ datum: { id, value, label } }) => (
                <Box
                  bgcolor="background.paper"
                  p={1.5}
                  border={1}
                  borderColor="divider"
                  borderRadius={1}
                >
                  <Typography variant="body2" color="text.primary" fontWeight="medium">
                    {label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {value} total occurrences
                  </Typography>
                </Box>
              )}
              role="application"
              ariaLabel="IOC type distribution pie chart"
              theme={chartTheme}
            />
          ) : (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <Typography variant="body1" color="text.secondary">
                No IOC type distribution data available for the selected time range.
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default IocDistributionChart;