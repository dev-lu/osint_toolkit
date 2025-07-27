import React from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Paper,
  Typography,
  LinearProgress,
  Button,
  CircularProgress
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

export default function FileUploadZone({ 
  onFileUpload, 
  isLoading, 
  uploadProgress 
}) {
  const {
    getRootProps,
    getInputProps,
    acceptedFiles,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: {
      "text/csv": [".csv"],
      "text/plain": [".txt"],
    },
  });

  const acceptedFileItems = acceptedFiles.map((file) => (
    <b key={file.path}>
      {file.path} - {file.size} bytes
    </b>
  ));

  const handleUpload = () => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  };

  return (
    <Paper elevation={1} sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
        <UploadFileIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 500 }}>
          File Upload
        </Typography>
      </Box>
      
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed', 
          borderColor: isFocused || isDragAccept ? 'primary.main' : 'grey.300', 
          borderRadius: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 140,
          cursor: isLoading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          backgroundColor: isFocused || isDragAccept ? 'primary.50' : 'transparent',
          '&:hover': { 
            borderColor: isLoading ? 'grey.300' : 'primary.main',
            backgroundColor: isLoading ? 'grey.50' : 'primary.50'
          }
        }}
      >
        <input {...getInputProps()} />
        <UploadFileIcon
          sx={{ 
            fontSize: 40, 
            color: isLoading ? 'grey.400' : 'grey.500',
            mb: 1
          }} 
        />
        <Typography 
          variant="body2" 
          textAlign="center" 
          sx={{ 
            color: isLoading ? 'grey.400' : 'text.secondary',
            px: 1,
            lineHeight: 1.3
          }}
        >
          Drag 'n' drop a file here, or click to select a file
        </Typography>
        <Typography 
          variant="caption" 
          textAlign="center" 
          sx={{ 
            color: isLoading ? 'grey.400' : 'text.secondary',
            mt: 0.5
          }}
        >
          (Only .txt and .csv files will be accepted)
        </Typography>
      </Box>
      
      {uploadProgress > 0 && (
        <LinearProgress
          sx={{ mt: 2 }}
          variant="determinate"
          value={uploadProgress}
        />
      )}
      
      {acceptedFileItems.length > 0 && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {acceptedFileItems}
          </Typography>
        </Box>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={isLoading || acceptedFiles.length === 0}
          size="medium"
          sx={{ minWidth: 140 }}
        >
          {isLoading ? <CircularProgress size={24} /> : "Extract"}
        </Button>
      </Box>
    </Paper>
  );
}
