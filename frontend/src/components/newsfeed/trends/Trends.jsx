import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  CircularProgress,
  Grid
} from '@mui/material';

import apiService from './services/api';

import TrendsHeader from './components/TrendsHeader';
import WordFrequencyChart from './components/WordFrequencyChart';
import IocStatistics from './components/IocStatistics';
import CveStatistics from './components/CveStatistics';
import IocDistributionChart from './components/IocDistributionChart';
import ArticleTable from './components/ArticleTable';

const Trends = () => {
  const [wordFrequencyData, setWordFrequencyData] = useState([]);
  const [loadingWordFrequency, setLoadingWordFrequency] = useState(true);
  const [errorWordFrequency, setErrorWordFrequency] = useState(null);

  const [selectedArticleIds, setSelectedArticleIds] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [articleDetails, setArticleDetails] = useState({});
  const [articleLoading, setArticleLoading] = useState({});

  const [timeRange, setTimeRange] = useState('7d');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchWordFrequency = async () => {
      try {
        setLoadingWordFrequency(true);
        setErrorWordFrequency(null);
        const responseData = await apiService.getTitleWordFrequency(10, timeRange);
        setWordFrequencyData(Array.isArray(responseData) ? responseData : []);
      } catch (err) {
        setErrorWordFrequency(err.message);
        console.error('Error fetching word frequency data:', err);
        setWordFrequencyData([]);
      } finally {
        setLoadingWordFrequency(false);
      }
    };
    fetchWordFrequency();
  }, [refreshKey, timeRange]);

  const fetchArticleDetails = useCallback(async (articleIds) => {
    const idsToFetch = articleIds.filter(id => !articleDetails[id]);
    if (idsToFetch.length === 0) return;

    try {
      setArticleLoading(prev => {
        const newLoadingState = { ...prev };
        idsToFetch.forEach(id => newLoadingState[id] = true);
        return newLoadingState;
      });

      const results = await apiService.getArticlesByIds(idsToFetch);
      const newDetails = Object.fromEntries(results.map(article => [article.id, article]));

      setArticleDetails(prev => ({ ...prev, ...newDetails }));
    } catch (err) {
      console.error(`Error fetching articles:`, err);
      const errorDetails = Object.fromEntries(
        idsToFetch.map(id => [id, { error: err.message }])
      );
      setArticleDetails(prev => ({ ...prev, ...errorDetails }));
    } finally {
      setArticleLoading(prev => {
        const newLoadingState = { ...prev };
        idsToFetch.forEach(id => newLoadingState[id] = false);
        return newLoadingState;
      });
    }
  }, [articleDetails]);

  const handleSelectArticleIds = useCallback((articleIds, title) => {
    setSelectedArticleIds(Array.isArray(articleIds) ? articleIds : []);
    setSelectedTitle(title);
    setArticleDetails({});
    setArticleLoading({});

    if (Array.isArray(articleIds) && articleIds.length > 0) {
      fetchArticleDetails(articleIds);
    }
  }, [fetchArticleDetails]);

  const handleRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
    setSelectedArticleIds([]);
    setSelectedTitle(null);
    setArticleDetails({});
    setArticleLoading({});
  }, []);

  const handleTimeRangeChange = useCallback((event) => {
    setTimeRange(event.target.value);
    setSelectedArticleIds([]);
    setSelectedTitle(null);
    setArticleDetails({});
    setArticleLoading({});
  }, []);


  if (loadingWordFrequency) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <TrendsHeader
        timeRange={timeRange}
        onTimeRangeChange={handleTimeRangeChange}
        onRefresh={handleRefresh}
      />

      <Grid container spacing={2} alignItems="stretch">
        {/* First Row: Word Frequency Chart (left) and Top CVEs (right) */}
        <Grid item xs={12} md={6}>
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <WordFrequencyChart
              data={wordFrequencyData}
              loading={loadingWordFrequency}
              error={errorWordFrequency}
              onSelectArticleIds={handleSelectArticleIds}
              onRefresh={handleRefresh}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CveStatistics
              timeRange={timeRange}
              refreshKey={refreshKey}
              onSelectArticleIds={handleSelectArticleIds}
            />
          </Box>
        </Grid>

        {/* Second Row: Top IOCs (left) and IOC Distribution Chart (right) */}
        <Grid item xs={12} md={6}>
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <IocStatistics
              timeRange={timeRange}
              refreshKey={refreshKey}
              onSelectArticleIds={handleSelectArticleIds}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <IocDistributionChart
              timeRange={timeRange}
              refreshKey={refreshKey}
            />
          </Box>
        </Grid>
      </Grid>

      <ArticleTable
        selectedArticleIds={selectedArticleIds}
        selectedTitle={selectedTitle}
        articleDetails={articleDetails}
        articleLoading={articleLoading}
      />
    </Box>
  );
};

export default Trends;