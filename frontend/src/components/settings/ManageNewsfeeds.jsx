import React, { useState } from "react";
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
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useDropzone } from "react-dropzone";
import api from "../../api";

const ManageNewsfeeds = ({
  newsfeedList,
  setNewsfeedList,
  showAlert,
  handleEnableDisableNewsfeed,
}) => {
  const [newFeed, setNewFeed] = useState({ name: "", url: "" });
  const [iconFile, setIconFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

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
      showAlert(
        error.response?.data?.detail || "Failed to validate feed",
        "error"
      );
      return false;
    }
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

      if (iconFile) {
        const formData = new FormData();
        formData.append("file", iconFile);
        await api.post(
          `/api/settings/modules/newsfeed/upload_icon/${newFeed.name}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      setNewsfeedList({ ...newsfeedList, [newFeed.name]: response.data });
      setNewFeed({ name: "", url: "" });
      setIconFile(null);
      showAlert("Feed added successfully", "success");
    } catch (error) {
      setErrorMessage(error.response?.data?.detail || "Error adding feed");
    } finally {
      setLoading(false);
    }
  };

  const handleFeedDelete = async (name) => {
    try {
      await api.delete(
        `/api/settings/modules/newsfeed/?feedName=${encodeURIComponent(name)}`
      );
      const updatedFeeds = { ...newsfeedList };
      delete updatedFeeds[name];
      setNewsfeedList(updatedFeeds);
      showAlert("Feed deleted successfully", "success");
    } catch (error) {
      showAlert("Error deleting feed", "error");
    }
  };

  return (
    <Card sx={{ borderRadius: 2, boxShadow: 1, m: 2, p: 2, maxWidth: "100%" }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Manage Newsfeeds
      </Typography>

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
          disabled={!newFeed.name || !newFeed.url || !iconFile || loading}
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
          maxHeight: 300,
          "& ul": { padding: 0 },
          mt: 2,
        }}
      >
        {Object.entries(newsfeedList).map(([name, feed]) => (
          <ListItem
            key={name}
            sx={{ display: "flex", alignItems: "center", px: 1 }}
          >
            <ListItemAvatar>
              <Avatar
                src={`${api.defaults.baseURL}/api/feedicons/${name
                  .toLowerCase()
                  .replace(/\s+/g, "")}`}
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
        ))}
      </List>
    </Card>
  );
};

export default ManageNewsfeeds;
