import React, { useState } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import FileUploadZone from './components/ui/FileUploadZone';
import StatisticsOverview from './components/ui/StatisticsOverview';
import WelcomeScreen from './components/ui/WelcomeScreen';
import ResultRows from './components/ui/ResultRows';
import { useExtractor } from './hooks/useExtractor';
import { logger } from '../shared/utils/logger';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import LanIcon from '@mui/icons-material/Lan';
import LinkIcon from '@mui/icons-material/Link';
import PublicIcon from '@mui/icons-material/Public';

export default function IocExtractor() {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const {
    extractedData,
    uploadProgress,
    isLoading,
    error,
    hasResults,
    extractFromFile,
    copyAllIOCs,
    exportAllIOCs,
    getStatistics
  } = useExtractor();

  const handleFileUpload = async (file) => {
    try {
      await extractFromFile(file);
      setSnackbar({ 
        open: true, 
        message: 'IOC extraction completed successfully', 
        severity: 'success' 
      });
    } catch (err) {
      logger.error('File upload failed', { error: err.message });
      setSnackbar({ 
        open: true, 
        message: err.message || 'Failed to extract IOCs from file', 
        severity: 'error' 
      });
    }
  };

  const handleCopyAll = async () => {
    try {
      const result = await copyAllIOCs();
      setSnackbar({ 
        open: true, 
        message: result.message, 
        severity: 'success' 
      });
    } catch (err) {
      setSnackbar({ 
        open: true, 
        message: err.message || 'Failed to copy IOCs', 
        severity: 'error' 
      });
    }
  };

  const handleExportAll = () => {
    try {
      const result = exportAllIOCs();
      setSnackbar({ 
        open: true, 
        message: result.message, 
        severity: 'success' 
      });
    } catch (err) {
      setSnackbar({ 
        open: true, 
        message: err.message || 'Failed to export IOCs', 
        severity: 'error' 
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const iocCategories = [
    {
      title: 'Domains',
      type: 'domain',
      list: extractedData?.domains || [],
      count: extractedData?.statistics?.domains || 0,
      icon: <PublicIcon />
    },
    {
      title: 'IP addresses',
      type: 'ipv4',
      list: extractedData?.ips || [],
      count: extractedData?.statistics?.ips || 0,
      icon: <LanIcon />
    },
    {
      title: 'URLs',
      type: 'url',
      list: extractedData?.urls || [],
      count: extractedData?.statistics?.urls || 0,
      icon: <LinkIcon />
    },
    {
      title: 'Email addresses',
      type: 'email',
      list: extractedData?.emails || [],
      count: extractedData?.statistics?.emails || 0,
      icon: <AlternateEmailIcon />
    },
    {
      title: 'MD5 hashes',
      type: 'md5',
      list: extractedData?.md5 || [],
      count: extractedData?.statistics?.md5 || 0,
      icon: <InsertDriveFileIcon />
    },
    {
      title: 'SHA1 hashes',
      type: 'sha1',
      list: extractedData?.sha1 || [],
      count: extractedData?.statistics?.sha1 || 0,
      icon: <InsertDriveFileIcon />
    },
    {
      title: 'SHA256 hashes',
      type: 'sha256',
      list: extractedData?.sha256 || [],
      count: extractedData?.statistics?.sha256 || 0,
      icon: <InsertDriveFileIcon />
    }
  ];

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <FileUploadZone
          onFileUpload={handleFileUpload}
          isLoading={isLoading}
          uploadProgress={uploadProgress}
        />
      </Box>

      {hasResults ? (
        <Box sx={{ mt: 2 }}>
          <StatisticsOverview
            statistics={getStatistics()}
            onCopyAll={handleCopyAll}
            onExportAll={handleExportAll}
          />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {iocCategories.map((category, index) => (
              <ResultRows
                key={index}
                title={category.title}
                type={category.type}
                list={category.list}
                count={category.count}
                icon={category.icon}
              />
            ))}
          </Box>
        </Box>
      ) : (
        <WelcomeScreen />
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
