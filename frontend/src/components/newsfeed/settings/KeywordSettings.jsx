import React, { useEffect, useState } from "react";
import api from "../../../api";
import {
  Card,
  Typography,
  TextField,
  Box,
  Chip,
  Snackbar,
  Alert,
  Switch,
  FormControlLabel,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";

export default function KeywordSettings() {
  const theme = useTheme();
  const [keywordMatchingEnabled, setKeywordMatchingEnabled] = useState(false);
  const [keywords, setKeywords] = useState([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [newsfeedConfig, setNewsfeedConfig] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const cardStyle = {
    p: 2,
    boxShadow: theme.shadows[1],
    backgroundColor: theme.palette.background.paper,
    borderRadius: 1,
  };

  useEffect(() => {
    setLoading(true);
    api
      .get("/api/settings/newsfeed/config")
      .then((response) => {
        setKeywordMatchingEnabled(response.data.keyword_matching_enabled);
        setNewsfeedConfig(response.data);
      })
      .catch((error) => {
        console.error(error);
        setSnackbarMessage("Failed to load settings.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      })
      .finally(() => setLoading(false));

    api
      .get("/api/settings/keywords/")
      .then((response) => {
        setKeywords(response.data || []);
      })
      .catch((error) => {
        console.error(error);
        setSnackbarMessage("Failed to load keywords.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
  }, []);

  const handleKeywordMatchingToggle = (event) => {
    const enabled = event.target.checked;
    setKeywordMatchingEnabled(enabled);
    api
      .put("/api/settings/newsfeed/config", {
        ...newsfeedConfig,
        keyword_matching_enabled: enabled,
      })
      .then((response) => {
        setNewsfeedConfig(response.data);
        setSnackbarMessage("Keyword matching setting updated.");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      })
      .catch((error) => {
        console.error(error);
        setSnackbarMessage("Failed to update keyword matching setting.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim() === "") return;

    if (keywords.some((k) => k.keyword.toLowerCase() === newKeyword.toLowerCase())) {
      setSnackbarMessage("Keyword already exists.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    api
      .post("/api/settings/keywords/", { keyword: newKeyword })
      .then((response) => {
        setKeywords([...keywords, response.data]);
        setNewKeyword("");
        setSnackbarMessage("Keyword added successfully.");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      })
      .catch((error) => {
        console.error(error);
        setSnackbarMessage("Failed to add keyword.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
  };

  const handleDeleteKeyword = (keywordId) => {
    api
      .delete(`/api/settings/keywords/${keywordId}`)
      .then(() => {
        setKeywords(keywords.filter((k) => k.id !== keywordId));
        setSnackbarMessage("Keyword deleted successfully.");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      })
      .catch((error) => {
        console.error(error);
        setSnackbarMessage("Failed to delete keyword.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
  };

  return (
    <>
      <Card sx={cardStyle}>
        <Box>
          <Typography variant="h6" gutterBottom>
            Keyword Matching Settings
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Enable keyword matching to highlight news articles containing
            specific keywords of interest.
          </Typography>
        </Box>

        <FormControlLabel
          control={
            <Switch
              checked={keywordMatchingEnabled}
              onChange={handleKeywordMatchingToggle}
              color="primary"
            />
          }
          label="Enable Keyword Matching"
          sx={{ mb: 2 }}
        />

        {keywordMatchingEnabled && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Manage Keywords</Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mt: 2,
                flexWrap: "wrap",
              }}
            >
              <TextField
                label="Add New Keyword"
                value={newKeyword}
                size="small"
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleAddKeyword();
                    e.preventDefault();
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleAddKeyword}
                        edge="end"
                        color="primary"
                        sx={{
                          mr: "-8px",
                          "&:hover": {
                            backgroundColor: "transparent",
                            color: "primary.dark",
                          },
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    "& .MuiInputAdornment-root": {
                      height: "100%",
                    },
                  },
                }}
                fullWidth
              />
            </Box>

            <Box sx={{ mt: 2 }}>
              {loading ? (
                <CircularProgress />
              ) : (
                <>
                  {keywords.length > 0 ? (
                    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                      {keywords.map((keyword) => (
                        <Chip
                          key={keyword.id}
                          label={keyword.keyword}
                          onDelete={() => handleDeleteKeyword(keyword.id)}
                          sx={{ m: 0.5 }}
                        />
                      ))}
                    </Box>
                  ) : (
                    <Typography>No keywords added yet.</Typography>
                  )}
                </>
              )}
            </Box>
          </Box>
        )}
      </Card>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}