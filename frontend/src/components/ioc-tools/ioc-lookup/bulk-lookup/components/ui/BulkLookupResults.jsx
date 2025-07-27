import React from 'react';
import {
  Box, Typography, LinearProgress, Paper, Tabs, Tab, Alert
} from '@mui/material';
import IocCard from './IocCard';
import WelcomeScreen from './WelcomeScreen';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`ioc-tabpanel-${index}`}
      aria-labelledby={`ioc-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `ioc-tab-${index}`,
    'aria-controls': `ioc-tabpanel-${index}`,
  };
}

export default function BulkLookupResults({
  categorizedIocs,
  orderedIocTypes,
  activeTab,
  onTabChange,
  loading,
  progress,
  error,
}) {

  if (error) {
    return <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>;
  }

  if (loading) {
    return (
      <Box sx={{ width: '100%', mb: 2 }}>
        <LinearProgress variant="determinate" value={progress} />
        <Typography variant="caption" display="block" textAlign="center">
          {Math.round(progress)}% Complete
        </Typography>
      </Box>
    );
  }

  const hasResults = !loading && !error && orderedIocTypes.length > 0 && Object.values(categorizedIocs).some(arr => arr.length > 0);

  if (!hasResults) {
    return <WelcomeScreen />;
  }
  
  return (
    <Paper sx={{ mt: 2 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={activeTab} 
          onChange={onTabChange} 
          aria-label="ioc type tabs" 
          variant="scrollable" 
          scrollButtons="auto"
        >
          {orderedIocTypes.map((typeKey, index) => (
            <Tab
              key={typeKey}
              label={`${typeKey.toUpperCase()} (${categorizedIocs[typeKey]?.length || 0})`}
              {...a11yProps(index)}
            />
          ))}
        </Tabs>
      </Box>
      {orderedIocTypes.map((typeKey, index) => (
        <TabPanel value={activeTab} index={index} key={typeKey}>
          {categorizedIocs[typeKey] && categorizedIocs[typeKey].length > 0 ? (
            categorizedIocs[typeKey].map((ioc) => (
              <IocCard key={ioc.id} ioc={ioc} />
            ))
          ) : (
            <Typography>No IOCs of type {typeKey.toUpperCase()} to display in this tab.</Typography>
          )}
        </TabPanel>
      ))}
    </Paper>
  );
}
