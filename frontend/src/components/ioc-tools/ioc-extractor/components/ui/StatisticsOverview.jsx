import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  IconButton,
  Tooltip
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import LanIcon from '@mui/icons-material/Lan';
import LinkIcon from '@mui/icons-material/Link';
import PublicIcon from '@mui/icons-material/Public';

export default function StatisticsOverview({ 
  statistics, 
  onCopyAll, 
  onExportAll 
}) {
  const duplicateStats = [
    { 
      label: 'Domains', 
      value: statistics?.domains_removed_duplicates || 0, 
      icon: <PublicIcon /> 
    },
    { 
      label: 'IP Addresses', 
      value: statistics?.ips_removed_duplicates || 0, 
      icon: <LanIcon /> 
    },
    { 
      label: 'URLs', 
      value: statistics?.urls_removed_duplicates || 0, 
      icon: <LinkIcon /> 
    },
    { 
      label: 'Email Addresses', 
      value: statistics?.emails_removed_duplicates || 0, 
      icon: <AlternateEmailIcon /> 
    },
    { 
      label: 'MD5 Hashes', 
      value: statistics?.md5_removed_duplicates || 0, 
      icon: <InsertDriveFileIcon /> 
    },
    { 
      label: 'SHA1 Hashes', 
      value: statistics?.sha1_removed_duplicates || 0, 
      icon: <InsertDriveFileIcon /> 
    },
    { 
      label: 'SHA256 Hashes', 
      value: statistics?.sha256_removed_duplicates || 0, 
      icon: <InsertDriveFileIcon /> 
    }
  ];

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Paper
            elevation={0}
            sx={{
              width: 60,
              height: 40,
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
              bgcolor: 'primary.50'
            }}
          >
            <Typography variant="body1" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
              {statistics?.total_unique_iocs || 0}
            </Typography>
          </Paper>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              Extraction Complete
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {statistics?.total_unique_iocs || 0} unique IOCs found and organized
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Copy all IOCs">
            <IconButton onClick={onCopyAll}>
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export all IOCs">
            <IconButton onClick={onExportAll}>
              <FileDownloadIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 500 }}>
        Duplicates Removed
      </Typography>
      <Grid container spacing={1}>
        {duplicateStats.map((item, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Paper elevation={0} sx={{ p: 1 }}>
              <Typography color="primary" fontWeight="medium">
                {item.label}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
