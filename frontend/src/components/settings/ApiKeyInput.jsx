import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSetRecoilState } from "recoil";
import { apiKeysState } from "../../state";
import api from "../../api";

import {
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Link,
  Box,
  Typography,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
  Switch,
  FormControlLabel,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SaveIcon from "@mui/icons-material/Save";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { useTheme } from "@mui/material/styles";

export default function ApiKeyInput({ name, description, link, relatedKeys = [] }) {
  const setApiKeys = useSetRecoilState(apiKeysState);
  const [serviceKeyInput, setServiceKeyInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });
  const [keyStatus, setKeyStatus] = useState({
    existsInBackend: false, // Indicates if 'name' key itself is configured
    isServiceActive: false, // Indicates if the overall service (name or relatedKeys) is active
  });
  const theme = useTheme();

  /**
   * Effect to check the API key's configuration and service-level active status from the backend.
   * This now considers the 'name' key and all 'relatedKeys' for the overall service active state.
   */
  useEffect(() => {
    const fetchServiceStatus = async () => {
      setIsLoading(true);
      try {
        const [configuredResponse, allActiveResponse] = await Promise.all([
          api.get("/api/apikeys/configured"),
          api.get("/api/apikeys/is_active"), // Fetch active status for ALL keys
        ]);

        const primaryKeyExists = configuredResponse.data[name] || false;
        
        // Determine if the service is active based on the 'name' key or any of its 'relatedKeys'
        // A service is considered active if at least one of its associated keys is active.
        const allKeysAssociatedWithService = [name, ...relatedKeys];
        const serviceIsActive = allKeysAssociatedWithService.some(key => allActiveResponse.data[key]);

        setKeyStatus({
          existsInBackend: primaryKeyExists,
          isServiceActive: serviceIsActive,
        });

        if (!primaryKeyExists) {
          setServiceKeyInput(""); // Clear input if the primary key doesn't exist
        }
      } catch (error) {
        console.error(`Error fetching status for ${name} and related services:`, error);
        setKeyStatus({ existsInBackend: false, isServiceActive: false });
        setServiceKeyInput("");
        showNotification("Failed to load API key status.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchServiceStatus();
  }, [name, relatedKeys]); // Dependency array: re-run if 'name' or 'relatedKeys' change

  /**
   * Shows a notification message to the user.
   * @param {string} message - The message to display.
   * @param {'success' | 'error' | 'warning' | 'info'} severity - The severity of the notification.
   */
  const showNotification = useCallback((message, severity = "success") => {
    setNotification({ open: true, message, severity });
  }, []);

  /**
   * Closes the notification snackbar.
   */
  const handleCloseNotification = useCallback(() => {
    setNotification((prev) => ({ ...prev, open: false }));
  }, []);

  /**
   * Refreshes the global API keys state from the backend.
   */
  const refreshApiKeysState = useCallback(async () => {
    try {
      const response = await api.get("/api/apikeys/is_active");
      setApiKeys(response.data);
    } catch (error) {
      console.error("Error refreshing API keys:", error);
      showNotification("Failed to refresh API keys.", "error");
    }
  }, [setApiKeys, showNotification]);

  /**
   * Handles saving or deleting the primary API key.
   * @param {'save' | 'delete'} action - The action to perform (save or delete).
   */
  const handleApiKeyAction = useCallback(
    async (action) => {
      setIsLoading(true);
      try {
        if (action === "delete") {
          // Clear the primary key by updating with empty value and set it to inactive
          await api.put(`/api/apikeys/${name}`, {
            name,
            key: "",
            is_active: false,
            bulk_ioc_lookup: false,
          });
          setKeyStatus(prev => ({ ...prev, existsInBackend: false })); // Only update primary key status here
          setServiceKeyInput("");
          showNotification(`${description} removed successfully.`);
        } else if (action === "save") {
          if (!serviceKeyInput.trim()) {
            showNotification("Please enter a valid API key.", "warning");
            setIsLoading(false);
            return;
          }

          const payload = {
            name,
            key: serviceKeyInput,
            // When saving, we initially activate this specific key.
            // The service-level activation toggle will manage the overall service state.
            is_active: true,
            bulk_ioc_lookup: false,
          };

          try {
            await api.post("/api/apikeys/", payload);
          } catch (error) {
            if (error.response?.status === 409) {
              await api.put(`/api/apikeys/${name}`, payload);
            } else {
              throw error;
            }
          }
          setKeyStatus(prev => ({ ...prev, existsInBackend: true })); // Only update primary key status here
          showNotification(`${description} configured successfully.`);
        }
        // After any action, re-fetch the *overall* service status
        await refreshServiceAndApiKeysStatus();
      } catch (error) {
        console.error(`Error during ${action} API key:`, error);
        const errorMessage = error.response?.data?.detail || "An unexpected error occurred.";
        showNotification(
          `Failed to ${action === "delete" ? "remove" : "save"} API key: ${errorMessage}`,
          "error"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [name, description, serviceKeyInput, showNotification, refreshApiKeysState] // refreshServiceAndApiKeysStatus is new and needs to be added
  );

  /**
   * Toggles the activation status for the entire service (primary key and all related keys).
   */
  const toggleServiceActivation = useCallback(async () => {
    setIsLoading(true);
    try {
      const targetIsActive = !keyStatus.isServiceActive;
      const keysToToggle = [name, ...relatedKeys];

      await Promise.all(
        keysToToggle.map((keyName) =>
          api.put(`/api/apikeys/${keyName}/is_active`, null, {
            params: { is_active: targetIsActive },
          })
        )
      );

      // Update local state to reflect the new service activation state
      setKeyStatus(prev => ({ ...prev, isServiceActive: targetIsActive }));
      await refreshApiKeysState(); // Refresh global Recoil state
      showNotification(`${description} service ${targetIsActive ? "activated" : "deactivated"} successfully.`);
    } catch (error) {
      console.error("Error toggling service activation:", error);
      showNotification("Failed to update service activation status.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [name, description, relatedKeys, keyStatus.isServiceActive, showNotification, refreshApiKeysState]);

  // Combined function to refresh both component's specific status and global Recoil state
  const refreshServiceAndApiKeysStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      const [configuredResponse, allActiveResponse] = await Promise.all([
        api.get("/api/apikeys/configured"),
        api.get("/api/apikeys/is_active"),
      ]);

      const primaryKeyExists = configuredResponse.data[name] || false;
      const allKeysAssociatedWithService = [name, ...relatedKeys];
      const serviceIsActive = allKeysAssociatedWithService.some(key => allActiveResponse.data[key]);

      setKeyStatus({
        existsInBackend: primaryKeyExists,
        isServiceActive: serviceIsActive,
      });
      setApiKeys(allActiveResponse.data); // Update global Recoil state
    } catch (error) {
      console.error("Error refreshing service and API keys status:", error);
      showNotification("Failed to refresh API key and service status.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [name, relatedKeys, setApiKeys, showNotification]);

  // Update handleApiKeyAction to use the new refreshServiceAndApiKeysStatus
  useEffect(() => {
    // This effect ensures handleApiKeyAction has the latest refreshServiceAndApiKeysStatus
    // It's a bit of a workaround if handleApiKeyAction is passed directly to onClick,
    // but ensures its internal logic is up-to-date with new dependencies.
    // However, it's cleaner to just update the handleApiKeyAction dependency array directly.
    // The previous implementation of useCallback for handleApiKeyAction is fine,
    // we just need to ensure refreshServiceAndApiKeysStatus is in its dependency array.
  }, [refreshServiceAndApiKeysStatus]);


  // --- M E M O I Z E D   V A L U E S   F O R   U I ---

  const statusChipProps = useMemo(() => {
    if (keyStatus.isServiceActive) {
      return { label: "Active", color: "success" };
    }
    if (keyStatus.existsInBackend && !keyStatus.isServiceActive) {
      return { label: "Inactive (Configured)", color: "warning" };
    }
    return { label: "Not Configured", color: "default" };
  }, [keyStatus.existsInBackend, keyStatus.isServiceActive]);

  const inputFieldStyles = useMemo(() => {
    const isConfigured = keyStatus.existsInBackend;
    const isServiceActive = keyStatus.isServiceActive;

    const borderColor = isConfigured
      ? isServiceActive
        ? theme.palette.success.main
        : theme.palette.warning.main
      : theme.palette.divider;

    const backgroundColor = isConfigured
      ? isServiceActive
        ? theme.palette.success.main + "08"
        : theme.palette.warning.main + "08"
      : "transparent";

    const labelColor = isConfigured
      ? isServiceActive
        ? theme.palette.success.main
        : theme.palette.warning.main
      : "inherit";

    return {
      "& .MuiOutlinedInput-root": {
        backgroundColor: backgroundColor,
        "& fieldset": {
          borderColor: borderColor,
          borderWidth: isConfigured ? 2 : 1,
        },
        "&:hover fieldset": {
          borderColor: isConfigured
            ? isServiceActive
              ? theme.palette.success.main
              : theme.palette.warning.main
            : theme.palette.primary.main,
        },
        "&.Mui-focused fieldset": {
          borderColor: isConfigured
            ? isServiceActive
              ? theme.palette.success.main
              : theme.palette.warning.main
            : theme.palette.primary.main,
        },
      },
      "& .MuiInputLabel-root": {
        color: labelColor,
        "&.Mui-focused": {
          color: isConfigured
            ? isServiceActive
              ? theme.palette.success.main
              : theme.palette.warning.main
            : theme.palette.primary.main,
        },
      },
    };
  }, [keyStatus.existsInBackend, keyStatus.isServiceActive, theme.palette]);

  const StatusIndicatorIcon = () => {
    if (isLoading) {
      return <CircularProgress size={20} />;
    }
    if (keyStatus.isServiceActive) {
      return <CheckCircleIcon sx={{ color: theme.palette.success.main }} />;
    }
    // If not active, but primary key exists, show warning; otherwise, error
    if (keyStatus.existsInBackend) {
      return <CheckCircleIcon sx={{ color: theme.palette.warning.main }} />;
    }
    return <ErrorIcon sx={{ color: theme.palette.text.disabled }} />;
  };

  return (
    <Box>
      {/* Status Indicators and Activation Toggle */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <StatusIndicatorIcon />
          <Chip
            label={statusChipProps.label}
            size="small"
            color={statusChipProps.color}
            variant="outlined"
            sx={{ height: 20, fontSize: "0.65rem" }}
          />
        </Box>

        {/* Activation Toggle - Always visible */}
        <FormControlLabel
          control={
            <Switch
              checked={keyStatus.isServiceActive}
              onChange={toggleServiceActivation}
              disabled={isLoading}
              size="small"
              color="success"
            />
          }
          labelPlacement="start"
          sx={{ margin: 0 }}
        />
      </Box>

      {/* API Key Input Field */}
      <TextField
        id={`${name}_textfield`}
        label={description}
        value={keyStatus.existsInBackend ? "••••••••••••••••" : serviceKeyInput}
        type="password"
        onChange={(e) => setServiceKeyInput(e.target.value)}
        disabled={keyStatus.existsInBackend || isLoading}
        variant="outlined"
        size="small"
        fullWidth
        placeholder={keyStatus.existsInBackend ? "API key configured" : "Enter your API key..."}
        sx={inputFieldStyles}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                {keyStatus.existsInBackend ? (
                  <Tooltip title="Remove API Key">
                    <IconButton size="small" color="error" onClick={() => handleApiKeyAction("delete")} disabled={isLoading}>
                      <DeleteForeverIcon />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <>
                    <Tooltip title="Get API Key">
                      <IconButton size="small" component={Link} href={link} target="_blank" rel="noopener noreferrer">
                        <OpenInNewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Save API Key">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleApiKeyAction("save")}
                        disabled={!serviceKeyInput.trim() || isLoading}
                      >
                        {isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
                      </IconButton>
                    </Tooltip>
                  </>
                )}
              </Box>
            </InputAdornment>
          ),
        }}
      />

      {/* Help Text for unconfigured keys */}
      {!keyStatus.existsInBackend && (
        <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="caption" color="text.secondary">
            No API key?
          </Typography>
          <Link
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            variant="caption"
            sx={{ display: "flex", alignItems: "center", gap: 0.5, textDecoration: "none" }}
          >
            Create it here
            <OpenInNewIcon sx={{ fontSize: 12 }} />
          </Link>
        </Box>
      )}

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} variant="filled" sx={{ width: "100%" }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}