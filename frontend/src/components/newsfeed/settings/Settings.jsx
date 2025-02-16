import React, { useEffect, useState, useCallback } from "react";
import api from "../../../api";
import {
  Card,
  Typography,
  TextField,
  Box,
  Skeleton,
  Snackbar,
  Alert,
  Switch,
  InputAdornment,
  Divider,
  CircularProgress,
} from "@mui/material";

const MIN_FETCH_INTERVAL = 5;
const MIN_RETENTION_DAYS = 1;
const MAX_WIDTH = 400;

const SettingHeader = ({ title, description }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="h6" gutterBottom>
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {description}
    </Typography>
  </Box>
);

const ValidationTextField = ({
  label,
  value,
  onChange,
  onBlur,
  minValue,
  unit,
  helperText,
  disabled,
}) => (
  <TextField
    label={label}
    type="number"
    value={value}
    onChange={(e) => onChange(parseInt(e.target.value) || minValue)}
    onBlur={onBlur}
    variant="outlined"
    size="small"
    disabled={disabled}
    InputProps={{
      endAdornment: unit && (
        <InputAdornment position="end">{unit}</InputAdornment>
      ),
      inputProps: { min: minValue },
    }}
    fullWidth
    helperText={helperText}
  />
);

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState({
    retention_days: MIN_RETENTION_DAYS,
    background_fetch_enabled: false,
    fetch_interval_minutes: MIN_FETCH_INTERVAL,
  });
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showNotification = (message, severity = "success") => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  const handleError = (error) => {
    console.error("Settings error:", error);
    showNotification(
      error.response?.data?.message || "An error occurred",
      "error"
    );
  };

  const fetchConfig = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/settings/newsfeed/config");
      setConfig(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const updateConfig = async (updates) => {
    if (saving) return;

    try {
      setSaving(true);
      const newConfig = { ...config, ...updates };
      
      if (newConfig.fetch_interval_minutes < MIN_FETCH_INTERVAL) {
        throw new Error(`Fetch interval must be at least ${MIN_FETCH_INTERVAL} minutes`);
      }
      if (newConfig.retention_days < MIN_RETENTION_DAYS) {
        throw new Error(`Retention period must be at least ${MIN_RETENTION_DAYS} day`);
      }

      const response = await api.put("/api/settings/newsfeed/config", newConfig);
      setConfig(response.data);
      showNotification("Settings updated successfully");
    } catch (error) {
      handleError(error);
      setConfig((prev) => ({ ...prev }));
    } finally {
      setSaving(false);
    }
  };

  const handleRetentionChange = (days) => {
    setConfig((prev) => ({ ...prev, retention_days: days }));
  };

  const handleFetchIntervalChange = (minutes) => {
    setConfig((prev) => ({ ...prev, fetch_interval_minutes: minutes }));
  };

  const handleBackgroundFetchToggle = async (enabled) => {
    await updateConfig({ background_fetch_enabled: enabled });
  };

  if (loading) {
    return (
      <Card sx={{ p: 3 }}>
        <Skeleton variant="rectangular" height={200} />
      </Card>
    );
  }

  return (
    <>
      <Card sx={{ p: 3 }}>
        <SettingHeader
          title="General Newsfeed Settings"
          description="Configure how your newsfeed behaves and manages content"
        />

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            Content Retention
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Define how long articles should be kept in your feed before being
            automatically archived
          </Typography>
          
          <Box sx={{ maxWidth: MAX_WIDTH }}>
            <ValidationTextField
              label="Retention Period"
              value={config.retention_days}
              onChange={handleRetentionChange}
              onBlur={() => updateConfig({
                retention_days: config.retention_days,
              })}
              minValue={MIN_RETENTION_DAYS}
              unit="days"
              helperText={`Minimum retention period is ${MIN_RETENTION_DAYS} day`}
              disabled={saving}
            />
          </Box>
        </Box>

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Background Fetch
          </Typography>
          
          <Box sx={{ maxWidth: MAX_WIDTH }}>
            <Box 
              sx={{ 
                display: "flex",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ flex: 1, mr: 2 }}>
                Enable automatic fetching of new content at regular intervals
              </Typography>
              <Switch
                checked={config.background_fetch_enabled}
                onChange={(e) => handleBackgroundFetchToggle(e.target.checked)}
                disabled={saving}
                color="primary"
              />
            </Box>

            {config.background_fetch_enabled && (
              <ValidationTextField
                label="Fetch Interval"
                value={config.fetch_interval_minutes}
                onChange={handleFetchIntervalChange}
                onBlur={() => updateConfig({
                  fetch_interval_minutes: config.fetch_interval_minutes,
                })}
                minValue={MIN_FETCH_INTERVAL}
                unit="minutes"
                helperText={`Minimum interval is ${MIN_FETCH_INTERVAL} minutes`}
                disabled={saving}
              />
            )}
          </Box>
        </Box>
      </Card>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      {saving && (
        <Box
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            zIndex: 2000,
          }}
        >
          <CircularProgress size={24} />
        </Box>
      )}
    </>
  );
}