import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card,
  CardContent,
  Typography,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import LaunchIcon from '@mui/icons-material/Launch';
import { ResponsiveBar } from '@nivo/bar';
import { indigo, teal } from '@mui/material/colors';
import api from '../../../api';

const TIME_RANGES = [
  { value: '8h', label: 'Last 8 Hours' },
  { value: '24h', label: 'Last 24 Hours' },
  { value: '2d', label: 'Last 2 Days' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '14d', label: 'Last 14 Days' },
  { value: '30d', label: 'Last 30 Days' }
];

const Trends = () => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWord, setSelectedWord] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [articleDetails, setArticleDetails] = useState({});
  const [articleLoading, setArticleLoading] = useState({});
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchTrendData();
  }, [refreshKey, timeRange]);

  const fetchTrendData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/title_word_frequency?limit=20&time_range=${timeRange}`);
      setData(response.data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching trend data:', err);
    } finally {
      setLoading(false);
    }
  };
  

  const fetchArticleDetails = async (articleIds) => {
    const idsToFetch = articleIds.filter(id => !articleDetails[id]);
    if (idsToFetch.length === 0) return;
  
    try {
      setArticleLoading(prev => Object.fromEntries(idsToFetch.map(id => [id, true])));
  
      const response = await api.post('/api/newsfeed/articles/bulk', idsToFetch);
      const results = response.data;
  
      const newDetails = Object.fromEntries(results.map(article => [article.id, article]));
  
      setArticleDetails(prev => ({ ...prev, ...newDetails }));
    } catch (err) {
      console.error(`Error fetching articles:`, err);
      const errorDetails = Object.fromEntries(
        idsToFetch.map(id => [id, { error: err.message }])
      );
      setArticleDetails(prev => ({ ...prev, ...errorDetails }));
    } finally {
      setArticleLoading(prev => Object.fromEntries(idsToFetch.map(id => [id, false])));
    }
  };
  

  useEffect(() => {
    if (selectedWord) {
      const selectedWordData = data.find(item => item.word === selectedWord);
      if (selectedWordData) {
        fetchArticleDetails(selectedWordData.article_ids);
      }
    }
  }, [selectedWord]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
    setSelectedWord(null);
    setArticleDetails({});
  };

  const chartTheme = {
    axis: {
      ticks: {
        text: {
          fill: theme.palette.text.primary,
          fontSize: 16,
          fontWeight: 500
        },
        line: {
          stroke: theme.palette.divider
        }
      },
      legend: {
        text: {
          fill: theme.palette.text.primary,
          fontSize: 18,
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

  const barChartData = data.map((item, index) => ({
    word: item.word,
    count: item.count,
    color: index < 5 
      ? theme.palette.mode === 'dark' ? indigo[300] : indigo[400]
      : theme.palette.mode === 'dark' ? teal[300] : teal[400]
  }));

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress sx={{ color: theme.palette.primary.main }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Alert 
          severity="error"
          action={
            <IconButton
              color="inherit"
              size="small"
              onClick={handleRefresh}
            >
              <RefreshIcon />
            </IconButton>
          }
        >
          Error loading trend data: {error}
        </Alert>
      </Box>
    );
  }

  const selectedWordData = data.find(item => item.word === selectedWord);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" color="text.primary">
          Headlnie Word Frequency Analysis
        </Typography>
        
        <Box display="flex" alignItems="center" gap={2}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={handleTimeRangeChange}
            >
              {TIME_RANGES.map(range => (
                <MenuItem key={range.value} value={range.value}>
                  {range.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Tooltip title="Refresh data">
            <IconButton onClick={handleRefresh} size="large">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      <Card>
        <CardContent>
          <Box height="400px">
            <ResponsiveBar
              data={barChartData}
              keys={['count']}
              indexBy="word"
              margin={{ top: 50, right: 60, bottom: 120, left: 80 }}
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
                legend: 'Words',
                legendPosition: 'middle',
                legendOffset: 90
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 8,
                tickRotation: 0,
                legend: 'Frequency',
                legendPosition: 'middle',
                legendOffset: -60
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              onClick={(node) => setSelectedWord(node.data.word)}
              tooltip={({ value, indexValue, color }) => (
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
              ariaLabel="Word frequency bar chart"
            />
          </Box>
        </CardContent>
      </Card>

      {selectedWord && selectedWordData && (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <Typography variant="h6" color="text.primary">
                Articles containing 
              </Typography>
              <Chip 
                label={selectedWord}
                sx={{ 
                  ml: 1, 
                  mr: 1,
                  bgcolor: theme.palette.mode === 'dark' ? indigo[900] : indigo[100],
                  color: theme.palette.mode === 'dark' ? indigo[100] : indigo[900],
                  fontWeight: 'medium'
                }}
              />
              <Typography variant="body1" color="text.secondary">
                ({selectedWordData.count} occurrences)
              </Typography>
            </Box>
            
            <TableContainer>
              <Table size="medium">
                <TableHead>
                  <TableRow>
                    <TableCell>Source</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedWordData.article_ids.map((articleId) => {
                    const article = articleDetails[articleId];
                    const isLoading = articleLoading[articleId];

                    if (isLoading) {
                      return (
                        <TableRow key={articleId}>
                          <TableCell colSpan={3}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <CircularProgress size={20} />
                              <Typography variant="body2">Loading article details...</Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    }

                    if (article?.error) {
                      return (
                        <TableRow key={articleId}>
                          <TableCell colSpan={3}>
                            <Alert severity="error" size="small">
                              Error loading article {articleId}: {article.error}
                            </Alert>
                          </TableCell>
                        </TableRow>
                      );
                    }

                    if (!article) {
                      return null;
                    }

                    return (
                      <TableRow key={articleId} hover>
                        <TableCell>
                          <Chip
                            label={article.feedname}
                            size="small"
                            sx={{
                              bgcolor: theme.palette.mode === 'dark' ? teal[900] : teal[50],
                              color: theme.palette.mode === 'dark' ? teal[100] : teal[700],
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography 
                            variant="body2" 
                            color="text.primary"
                            sx={{ 
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              lineHeight: '1.4em',
                              maxHeight: '2.8em'
                            }}
                          >
                            {article.title}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(article.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          {article.link && (
                            <Tooltip title="Open article">
                              <IconButton 
                                size="small"
                                href={article.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                  color: theme.palette.mode === 'dark' ? teal[300] : teal[700]
                                }}
                              >
                                <LaunchIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default Trends;