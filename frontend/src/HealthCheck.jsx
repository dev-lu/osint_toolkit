import React, { useEffect, useState } from "react";
import { Box, Typography, Button, CircularProgress, Alert } from "@mui/material";
import api from "./api";

// HealthCheck component that can be used to wrap your application
const HealthCheck = ({ children }) => {
  const [status, setStatus] = useState("loading"); // loading, healthy, error
  const [retryCount, setRetryCount] = useState(0);

  const checkBackendHealth = async () => {
    try {
      setStatus("loading");
      const response = await api.get("/api/healthcheck");
      
      if (response.status === 200 && response.data.status === "ok") {
        setStatus("healthy");
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Backend health check failed:", error);
      setStatus("error");
    }
  };

  useEffect(() => {
    checkBackendHealth();
    
    // Set up a periodic health check
    const healthCheckInterval = setInterval(() => {
      checkBackendHealth();
    }, 3000000); // Check every 300 seconds
    
    return () => clearInterval(healthCheckInterval);
  }, [retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  if (status === "loading") {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100vh' 
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Connecting to backend...
        </Typography>
      </Box>
    );
  }

  if (status === "error") {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100vh', 
          p: 3 
        }}
      >
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3, 
            width: '100%', 
            maxWidth: 500 
          }}
        >
          Unable to connect to the backend service
        </Alert>
        <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
          The application requires a connection to the backend API to function properly.
          Please ensure the service is running and try again.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleRetry}
        >
          Retry Connection
        </Button>
      </Box>
    );
  }

  // If we're healthy, render the application
  return children;
};

export default HealthCheck;