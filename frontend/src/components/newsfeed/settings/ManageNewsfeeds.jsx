import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Stack,
  Box,
  TextField,
  IconButton,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Switch,
  Alert,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useDropzone } from "react-dropzone";
import { useRecoilState } from "recoil";
import { newsfeedListState } from "../../../state";
import api from "../../../api";

const ManageNewsfeeds = () => {
  const [newFeed, setNewFeed] = useState({ name: "", url: "" });
  const [iconFile, setIconFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [feeds, setFeeds] = useState({});
  const [fetchingFeeds, setFetchingFeeds] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'info' });
  const [newsfeedList, setNewsfeedList] = useRecoilState(newsfeedListState);

  useEffect(() => {
    const fetchFeeds = async () => {
      setFetchingFeeds(true);
      try {
        const response = await api.get('/api/settings/modules/newsfeed/');
        const feedsObject = response.data.reduce((acc, feed) => {
          acc[feed.name] = feed;
          return acc;
        }, {});
        setFeeds(feedsObject);
        setNewsfeedList(feedsObject);
      } catch (error) {
        console.error('Error fetching newsfeeds:', error);
        setAlert({ 
          show: true, 
          message: 'Failed to fetch newsfeeds', 
          severity: 'error' 
        });
      } finally {
        setFetchingFeeds(false);
      }
    };

    fetchFeeds();
  }, [setNewsfeedList]);

  const handleEnableDisableNewsfeed = async (feedName) => {
    const currentFeed = feeds[feedName];
    if (!currentFeed) return;

    const isCurrentlyEnabled = currentFeed.enabled;
    
    const updatedFeeds = {
      ...feeds,
      [feedName]: {
        ...currentFeed,
        enabled: !isCurrentlyEnabled
      }
    };
    setFeeds(updatedFeeds);
    setNewsfeedList(updatedFeeds);

    try {
      const endpoint = isCurrentlyEnabled ? 'disable' : 'enable';
      await api.post(
        `/api/settings/modules/newsfeed/${endpoint}?feedName=${encodeURIComponent(feedName)}`,
        ''
      );

      setAlert({
        show: true,
        message: `Feed ${isCurrentlyEnabled ? 'disabled' : 'enabled'} successfully`,
        severity: 'success'
      });
    } catch (error) {
      const revertedFeeds = {
        ...feeds,
        [feedName]: {
          ...currentFeed,
          enabled: isCurrentlyEnabled
        }
      };
      setFeeds(revertedFeeds);
      setNewsfeedList(revertedFeeds);

      setAlert({
        show: true,
        message: `Failed to ${isCurrentlyEnabled ? 'disable' : 'enable'} feed`,
        severity: 'error'
      });
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => handleIconDrop(acceptedFiles),
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/gif": [".gif"],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const handleIconDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 150;
        canvas.height = 150;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, 150, 150);

        canvas.toBlob((blob) => {
          const resizedFile = new File([blob], file.name, {
            type: "image/png",
          });
          setIconFile(resizedFile);
        }, "image/png");
      };
    };
    reader.readAsDataURL(file);
  };

  const validateFeed = async (url) => {
    try {
      const response = await api.post(
        "/api/settings/modules/newsfeed/validate",
        {
          name: newFeed.name,
          url,
          enabled: true,
        }
      );
      return response.data.valid;
    } catch (error) {
      setAlert({ 
        show: true, 
        message: error.response?.data?.detail || "Failed to validate feed", 
        severity: 'error' 
      });
      return false;
    }
  };

  const safeEncodeFileName = (name) => {
    return btoa(unescape(encodeURIComponent(name)));
  };

  const handleFeedAdd = async () => {
    if (!newFeed.name || !newFeed.url) {
      setErrorMessage("Please provide both feed name and URL");
      return;
    }
  
    setLoading(true);
    try {
      const isValid = await validateFeed(newFeed.url);
      if (!isValid) {
        setLoading(false);
        return;
      }
  
      const response = await api.post(
        "/api/settings/modules/newsfeed/add",
        newFeed
      );
  
      let updatedFeed = response.data;
  
      if (iconFile) {
        const formData = new FormData();
        formData.append("file", iconFile);
        
        const encodedFeedName = safeEncodeFileName(newFeed.name);
        
        const iconResponse = await api.post(
          `/api/settings/modules/newsfeed/upload_icon/${encodedFeedName}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        
        updatedFeed = {
          ...updatedFeed,
          icon: iconResponse.data.icon_id,
          icon_id: iconResponse.data.icon_id
        };
      }
  
      const updatedFeeds = { ...feeds, [newFeed.name]: updatedFeed };
      setFeeds(updatedFeeds);
      setNewsfeedList(updatedFeeds);
      setNewFeed({ name: "", url: "" });
      setIconFile(null);
      setErrorMessage("");
      setAlert({ 
        show: true, 
        message: "Feed added successfully", 
        severity: 'success' 
      });
    } catch (error) {
      setErrorMessage(error.response?.data?.detail || "Error adding feed");
      setAlert({ 
        show: true, 
        message: error.response?.data?.detail || "Error adding feed", 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFeedDelete = async (name) => {
    try {
      await api.delete(
        `/api/settings/modules/newsfeed/?feedName=${encodeURIComponent(name)}`
      );
      const updatedFeeds = { ...feeds };
      delete updatedFeeds[name];
      setFeeds(updatedFeeds);
      setNewsfeedList(updatedFeeds);
      setAlert({ 
        show: true, 
        message: "Feed deleted successfully", 
        severity: 'success' 
      });
    } catch (error) {
      setAlert({ 
        show: true, 
        message: "Error deleting feed", 
        severity: 'error' 
      });
    }
  };

  useEffect(() => {
    setErrorMessage("");
  }, [newFeed.name, newFeed.url]);

  return (
    <Card sx={{ borderRadius: 1, boxShadow: 1, p: 2, maxWidth: "100%" }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Manage Newsfeeds
      </Typography>

      {alert.show && (
        <Alert 
          severity={alert.severity} 
          sx={{ mb: 2 }}
          onClose={() => setAlert({ show: false, message: '', severity: 'info' })}
        >
          {alert.message}
        </Alert>
      )}

      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
        <Box
          {...getRootProps()}
          sx={{
            width: 64,
            height: 64,
            border: "1px dashed",
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            backgroundColor: "background.paper",
            "&:hover": { backgroundColor: "action.hover" },
            overflow: "hidden",
          }}
        >
          <input {...getInputProps()} />
          {iconFile ? (
            <Box
              component="img"
              src={URL.createObjectURL(iconFile)}
              alt="Icon preview"
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <Typography variant="caption" color="text.secondary">
              Icon
            </Typography>
          )}
        </Box>

        <Stack spacing={0.5} sx={{ flexGrow: 1 }}>
          <TextField
            label="Feed Name"
            disabled={loading}
            value={newFeed.name}
            onChange={(e) => setNewFeed({ ...newFeed, name: e.target.value })}
            variant="outlined"
            size="small"
            fullWidth
          />
          <TextField
            label="Feed URL"
            disabled={loading}
            value={newFeed.url}
            onChange={(e) => setNewFeed({ ...newFeed, url: e.target.value })}
            variant="outlined"
            size="small"
            fullWidth
          />
        </Stack>

        <IconButton
          color="primary"
          onClick={handleFeedAdd}
          disabled={!newFeed.name || !newFeed.url || loading}
          sx={{
            ml: 1,
            width: 48,
            height: 48,
            border: "1px solid",
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {loading ? <CircularProgress size={24} /> : <Add />}
        </IconButton>
      </Stack>

      {errorMessage && (
        <Typography variant="caption" color="error" sx={{ mt: 1 }}>
          {errorMessage}
        </Typography>
      )}

      <List
        dense
        sx={{
          position: "relative",
          overflow: "auto",
          maxHeight: 500,
          "& ul": { padding: 0 },
          mt: 2,
        }}
      >
        {fetchingFeeds ? (
          <Box display="flex" justifyContent="center" p={2}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          Object.entries(feeds).map(([name, feed]) => (
            <ListItem
              key={name}
              sx={{ display: "flex", alignItems: "center", px: 1 }}
            >
              <ListItemAvatar>
                <Avatar
                  src={`${api.defaults.baseURL}/api/feedicons/${feed.icon.endsWith('.png') ? feed.icon : `${feed.icon}.png`}`}
                  alt={name}
                />
              </ListItemAvatar>
              <ListItemText
                primary={name}
                secondary={feed.url}
                primaryTypographyProps={{ variant: "body2" }}
              />
              <Switch
                checked={feed.enabled}
                onChange={() => handleEnableDisableNewsfeed(name)}
                size="small"
              />
              <IconButton
                color="error"
                onClick={() => handleFeedDelete(name)}
                size="small"
              >
                <Delete fontSize="small" />
              </IconButton>
            </ListItem>
          ))
        )}
      </List>
    </Card>
  );
};

export default ManageNewsfeeds;