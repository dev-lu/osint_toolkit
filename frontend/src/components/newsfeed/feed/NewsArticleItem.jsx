import React, { useState } from "react";
import {
  Avatar,
  Button,
  Box,
  Card,
  Grow,
  Stack,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  RateReview as RateReviewIcon,
  OpenInNew as OpenInNewIcon,
  Circle as CircleIcon,
  AutoAwesome as AutoAwesomeIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { format } from "date-fns";
import he from "he";
import AnalyzeSection from "./AnalyzeSection";
import NotesSection from "./NotesSection";
import IOCSection from "./IOCSection";
import KeywordsSection from "./KeywordsSection";

export default function NewsArticleItem(props) {
  const {
    item,
    updateArticle,
    updateArticleField,
    apiKeys,
    api,
    tlpColors,
  } = props;

  const theme = useTheme();

  const [tlpAnchorEl, setTlpAnchorEl] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [updatingTlp, setUpdatingTlp] = useState(false);

  const handleTlpClick = (event) => {
    setTlpAnchorEl(event.currentTarget);
  };

  const handleTlpSelect = async (tlp) => {
    setUpdatingTlp(true);
    try {
      await api.put(`/api/newsfeed/article/${item.id}`, {
        tlp: tlp,
        note: item.note || "", 
        read: item.read || false
      });
      
      updateArticleField(item.id, "tlp", tlp);
    } catch (error) {
      console.error(`Error updating TLP for article ${item.id}:`, error);
    } finally {
      setUpdatingTlp(false);
      setTlpAnchorEl(null);
    }
  };

  const handleAnalyzeArticle = async () => {
    setAnalyzing(true);
    try {
      const url = `/api/newsfeed/analyze/${item.id}?force=${!!item.analysis_result}`;
      const response = await api.post(url);
      
      // Get analysis result and ensure it's an object
      let analysisResult = response.data.analysis_result;
      
      // If it's a string, try to parse it
      if (typeof analysisResult === 'string') {
        try {
          analysisResult = JSON.parse(analysisResult);
        } catch (parseError) {
          console.error("Failed to parse analysis_result string:", parseError);
        }
      }
  
      const updatedArticle = { ...item, analysis_result: analysisResult };
      updateArticle(updatedArticle);
    } catch (error) {
      console.error(`Error analyzing article ${item.id}:`, error);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <Grow in={true} key={`grow-${item.id}`}>
      <Card
        sx={{
          mb: 2,
          p: 2,
          borderRadius: 1,
          boxShadow: 0,
        }}
      >
        {/* Header Section */}
        <Stack
          direction="row"
          spacing={1}
          sx={{ mb: 1 }}
          justifyContent="space-between"
          alignItems="center"
        >
          {/* Left side: Avatar and feedname/date */}
          <Stack direction="row" spacing={1} alignItems="center">
          <Avatar
            alt={`${item.title} icon`}
            src={`${api.defaults.baseURL}/api/feedicons/${item.icon}`}
            sx={{ width: 45, height: 45 }}
          />
            <Stack>
              <Typography variant="subtitle1">
                <b>{item.feedname}</b>
              </Typography>
              <Typography variant="body2">
                {format(new Date(item.date), "MMMM d, yyyy, h:mm a")}
              </Typography>
            </Stack>
          </Stack>
          {/* Right side: Action Buttons */}
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton
              onClick={handleTlpClick}
              sx={{ color: tlpColors[item.tlp || "CLEAR"] }}
              aria-label="Change TLP Level"
              disabled={updatingTlp}
            >
              {updatingTlp ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <CircleIcon />
              )}
            </IconButton>
            <Menu
              anchorEl={tlpAnchorEl}
              open={Boolean(tlpAnchorEl)}
              onClose={() => setTlpAnchorEl(null)}
            >
              {Object.entries(tlpColors).map(([tlp, color]) => (
                <MenuItem
                  key={tlp}
                  onClick={() => handleTlpSelect(tlp)}
                  sx={{ color }}
                >
                  {tlp}
                </MenuItem>
              ))}
            </Menu>

            {/* Note Button */}
            <NotesSection
              item={item}
              updateArticleField={updateArticleField}
              icon={<RateReviewIcon />}
              isButton
              api={api}
            />

            {/* Original Article Button */}
            <Button
              sx={{ borderRadius: 5 }}
              disableElevation
              startIcon={<OpenInNewIcon />}
              href={item.link}
              target="_blank"
              aria-label="Open Original Article"
            >
              Original
            </Button>

            {/* Analyze Button */}
            {apiKeys.openai && (
              <Button
                sx={{ borderRadius: 5 }}
                disableElevation
                startIcon={<AutoAwesomeIcon />}
                onClick={handleAnalyzeArticle}
                disabled={analyzing}
                aria-label="Analyze Article"
              >
                {analyzing ? (
                  <>
                    Analyzing...
                    <CircularProgress
                      size={20}
                      sx={{ ml: 1 }}
                      color="inherit"
                    />
                  </>
                ) : item.analysis_result ? (
                  "Re-analyze"
                ) : (
                  "Analyze"
                )}
              </Button>
            )}
          </Stack>
        </Stack>

        {/* Article Title and Summary */}
        <Typography variant="h6" sx={{ mb: 1 }}>
          {item.title}
        </Typography>
        <Typography sx={{mb: 2}}>
          {item.summary
            ? he.decode(item.summary)
            : "No summary available for this article."}
        </Typography>

        {/* Analysis Result */}
        {item.analysis_result && <AnalyzeSection item={item} />}

        {/* Notes Section */}
        {(item.note || item.editNote) && (
          <NotesSection
            item={item}
            updateArticleField={updateArticleField}
            api={api}
          />
        )}

        {/* IOC and Keywords Sections */}
        <Box >
          <IOCSection item={item} />
          <KeywordsSection item={item} />
        </Box>
        
      </Card>
    </Grow>
  );
}