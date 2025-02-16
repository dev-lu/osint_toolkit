import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Chip,
  TextField,
  IconButton,
  Tooltip,
  Stack
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import LaunchIcon from '@mui/icons-material/Launch';
import api from '../../../api';

function Headlines() {
  const [headlines, setHeadlines] = useState([]);
  const [timeFilter, setTimeFilter] = useState('2d');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [orderBy, setOrderBy] = useState('date');
  const [order, setOrder] = useState('desc');
  const [sourceFilter, setSourceFilter] = useState('');
  const [titleFilter, setTitleFilter] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchHeadlines();
  }, [timeFilter, refreshKey]);

  const fetchHeadlines = async () => {
    try {
      const response = await api.get(`/recent_articles?time_filter=${timeFilter}`);
      setHeadlines(response.data);
    } catch (error) {
      console.error('Error fetching headlines:', error);
    }
  };
  

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const sortData = (data) => {
    return data.sort((a, b) => {
      if (orderBy === 'date') {
        return order === 'asc' 
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      }
      if (order === 'asc') {
        return a[orderBy] > b[orderBy] ? 1 : -1;
      }
      return a[orderBy] < b[orderBy] ? 1 : -1;
    });
  };

  const filterData = (data) => {
    return data.filter(item => {
      const matchesSource = item.feedname.toLowerCase().includes(sourceFilter.toLowerCase());
      const matchesTitle = item.title.toLowerCase().includes(titleFilter.toLowerCase());
      return matchesSource && matchesTitle;
    });
  };

  const displayData = () => {
    const filteredData = filterData(headlines);
    const sortedData = sortData(filteredData);
    return sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <TextField
          label="Filter Source"
          size="small"
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
        />
        <TextField
          label="Filter Title"
          size="small"
          value={titleFilter}
          onChange={(e) => setTitleFilter(e.target.value)}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeFilter}
            label="Time Range"
            onChange={(e) => setTimeFilter(e.target.value)}
          >
            <MenuItem value="8h">Last 8 Hours</MenuItem>
            <MenuItem value="24h">Last 24 Hours</MenuItem>
            <MenuItem value="2d">Last 2 Days</MenuItem>
            <MenuItem value="7d">Last 7 Days</MenuItem>
            <MenuItem value="30d">Last 30 Days</MenuItem>
            <MenuItem value="alltime">All Time</MenuItem>
          </Select>
        </FormControl>
        <Tooltip title="Refresh">
          <IconButton onClick={handleRefresh}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'feedname'}
                  direction={orderBy === 'feedname' ? order : 'asc'}
                  onClick={() => handleSort('feedname')}
                >
                  Source
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'title'}
                  direction={orderBy === 'title' ? order : 'asc'}
                  onClick={() => handleSort('title')}
                >
                  Title
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === 'date'}
                  direction={orderBy === 'date' ? order : 'asc'}
                  onClick={() => handleSort('date')}
                >
                  Time
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayData().map((headline) => (
              <TableRow key={headline.id} hover>
                <TableCell>
                  <Chip 
                    label={headline.feedname} 
                    size="small"
                    sx={{ 
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText'
                    }}
                  />
                </TableCell>
                <TableCell>{headline.title}</TableCell>
                <TableCell align="right">{formatDate(headline.date)}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Open source">
                    <IconButton 
                      size="small"
                      onClick={() => window.open(headline.url, '_blank')}
                    >
                      <LaunchIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={filterData(headlines).length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}

export default Headlines;