import React, { useState, useEffect } from "react";
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon,
  Box,
  Divider,
  Typography,
  Button,
  Collapse,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  fetchAlerts,
  markAlertAsRead,
  markAllAlertsAsRead,
  deleteAllAlerts,
} from "./services/alertsService";

const MAX_BODY_PREVIEW_LENGTH = 100;

const Notifications = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [expandedAlerts, setExpandedAlerts] = useState({});

  useEffect(() => {
    const getAlerts = async () => {
      const data = await fetchAlerts();
      if (Array.isArray(data)) {
        setAlerts(data);
      } else {
        console.error("Expected an array of alerts but received:", data);
      }
    };
    getAlerts();
  
    const ws = new WebSocket("ws://localhost:8000/ws/alerts");
  
    ws.onmessage = (event) => {
      try {
        const newAlert = JSON.parse(event.data);
        setAlerts(prevAlerts => [newAlert, ...prevAlerts]);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };
  
    ws.onclose = () => {
      console.warn("WebSocket connection closed");
      // TBD: Reconnect logic
    };
  
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  
    return () => ws.close();
  }, []);

  const open = Boolean(anchorEl);
  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleMarkAsRead = async (alertId, isCurrentlyRead) => {
    await markAlertAsRead(alertId);
    setAlerts(alerts.map(alert =>
      alert.id === alertId ? { ...alert, read: !isCurrentlyRead } : alert
    ));
  };
  

  const handleMarkAllAsRead = async () => {
    await markAllAlertsAsRead();
    setAlerts(alerts.map(alert => ({ ...alert, read: true })));
  };

  const handleDeleteAllAlerts = async () => {
    await deleteAllAlerts();
    setAlerts([]);
  };

  const toggleExpandAlert = (alertId) => {
    setExpandedAlerts(prev => ({
      ...prev,
      [alertId]: !prev[alertId]
    }));
  };

  const unreadCount = Array.isArray(alerts) ? alerts.filter((alert) => !alert.read).length : 0;

  return (
    <Box>
      <IconButton color="inherit" onClick={handleOpen}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            width: 500,
            maxHeight: 600,
            borderRadius: "12px",
            overflowY: "auto",
            transformOrigin: "top right",
          },
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box p={1}>
          <Typography variant="h6">Notifications</Typography>
        </Box>
        <Divider />
        
        <Box display="flex" justifyContent="space-around" p={1}>
          <Button size="small" startIcon={<VisibilityIcon />} onClick={handleMarkAllAsRead}>
            Read all
          </Button>
          <Button size="small" startIcon={<VisibilityOffIcon />} onClick={() => setAlerts(alerts.map(alert => ({ ...alert, read: false })))}>
            Unread all
          </Button>
          <Button size="small" startIcon={<DeleteIcon />} onClick={handleDeleteAllAlerts}>
            Delete all
          </Button>
        </Box>
        <Divider />

        <Box>
          {Array.isArray(alerts) && alerts.length > 0 ? (
            alerts.map((alert) => (
                <MenuItem
                key={alert.id}
                onClick={() => handleMarkAsRead(alert.id, alert.read)}
                sx={{ flexDirection: "column", alignItems: "flex-start", bgcolor: alert.read ? "transparent" : "action.selected" }}
              >
                <Box display="flex" alignItems="center" width="100%">
                  <ListItemIcon>
                    {alert.module === "Newsfeed" ? <NewspaperIcon /> : <NotificationsIcon />}
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>{alert.title}</Typography>}
                    secondary={<Typography variant="caption" color="text.secondary">{new Date(alert.timestamp).toLocaleString()}</Typography>}
                  />
                </Box>
                <Typography
                  variant="body2"
                  sx={{ whiteSpace: "pre-line", wordBreak: "break-word", mt: 1 }}
                >
                  {expandedAlerts[alert.id] || alert.message.length <= MAX_BODY_PREVIEW_LENGTH
                    ? alert.message
                    : `${alert.message.slice(0, MAX_BODY_PREVIEW_LENGTH)}...`}
                </Typography>
                {alert.message.length > MAX_BODY_PREVIEW_LENGTH && (
                  <Button
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpandAlert(alert.id);
                    }}
                    sx={{ mt: 1 }}
                  >
                    {expandedAlerts[alert.id] ? "Show less" : "Read more"}
                  </Button>
                )}
              </MenuItem>              
            ))
          ) : (
            <Box p={2}>
              <Typography variant="body2" color="text.secondary">
                No new notifications
              </Typography>
            </Box>
          )}
        </Box>
      </Menu>
    </Box>
  );
};

export default Notifications;
