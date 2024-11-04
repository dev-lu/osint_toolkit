import React, { useEffect, useState } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import api from "../../api";
import he from "he";

import { newsfeedState, apiKeysState } from "../../App";

import {
  Avatar,
  Button,
  Card,
  Grow,
  Pagination,
  Stack,
  Skeleton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Typography,
  CircularProgress,
  Paper,
  IconButton,
  TextField,
  Menu,
  MenuItem,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import NotesIcon from "@mui/icons-material/Notes";
import RateReviewIcon from "@mui/icons-material/RateReview";
import CircleIcon from "@mui/icons-material/Circle";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import { useTheme } from "@mui/material/styles";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";

export default function Newsfeed() {
  const theme = useTheme();
  const newsfeed = useRecoilValue(newsfeedState);
  const setNewsfeed = useSetRecoilState(newsfeedState);
  const apiKeys = useRecoilValue(apiKeysState);

  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzingArticles, setAnalyzingArticles] = useState({});
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [noteContent, setNoteContent] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [tlpAnchorEl, setTlpAnchorEl] = useState(null);
  const [currentTlpArticleId, setCurrentTlpArticleId] = useState(null);

  const tlpColors = {
    "TLP:RED": "#FF0000",
    "TLP:AMBER": "#FFBF00",
    "TLP:GREEN": "#00FF00",
    "TLP:CLEAR": "#CCCCCC",
  };

  const MarkdownComponents = {
    p: ({ node, ...props }) => (
      <Typography variant="body1" paragraph {...props} />
    ),
    strong: ({ node, ...props }) => (
      <Typography component="span" sx={{ fontWeight: "bold" }} {...props} />
    ),
    em: ({ node, ...props }) => (
      <Typography component="span" sx={{ fontStyle: "italic" }} {...props} />
    ),
    hr: () => <hr style={{ margin: "16px 0" }} />,
    ul: ({ node, ...props }) => (
      <ul {...props} style={{ paddingLeft: theme.spacing(2), margin: 0 }} />
    ),
    ol: ({ node, ...props }) => (
      <ol {...props} style={{ paddingLeft: theme.spacing(2), margin: 0 }} />
    ),
    li: ({ node, ordered, ...props }) => (
      <li {...props} style={{ marginBottom: theme.spacing(1) }}>
        <Typography variant="body1" component="span">
          {props.children}
        </Typography>
      </li>
    ),
  };

  const handlePageChange = (event, value) => {
    scrollToTop();
    setPage(value);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 120,
      behavior: "smooth",
    });
  };

  const showSkeletons = () => {
    return [...Array(pageSize)].map((e, i) => (
      <span key={i}>
        <Grow in={true} key={"grow-loading-" + i}>
          <Card
            sx={{
              m: 2,
              p: 2,
              borderRadius: 5,
              backgroundColor: theme.palette.background.card,
              boxShadow: 0,
            }}
            key={"card-loading-" + i}
          >
            <Stack spacing={1}>
              <Stack direction="row" spacing={1}>
                <Skeleton
                  variant="circular"
                  animation="wave"
                  width={50}
                  height={50}
                />
                <Stack spacing={0} width={"30%"}>
                  <Skeleton
                    variant="text"
                    animation="wave"
                    width={"60%"}
                    sx={{ fontSize: "1rem" }}
                  />
                  <Skeleton
                    variant="text"
                    animation="wave"
                    width={"100%"}
                    sx={{ fontSize: "1rem" }}
                  />
                </Stack>
              </Stack>
              <Skeleton
                variant="text"
                animation="wave"
                width={"60%"}
                sx={{ fontSize: "3rem" }}
              />
              <Skeleton
                variant="rounded"
                animation="wave"
                width={"100%"}
                height={120}
              />
            </Stack>
          </Card>
        </Grow>
      </span>
    ));
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setNewsfeed([]);
      setPage(1);

      const url = "/api/newsfeed/fetch_and_get";
      const response = await api.post(url);
      const result = response.data;
      setResult(result);
      setNewsfeed(result);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const getNewsFromDb = async () => {
    try {
      setLoading(true);
      setNewsfeed([]);
      setPage(1);

      const url = "/api/newsfeed";
      const response = await api.get(url);
      const result = response.data;
      setResult(result);
      setNewsfeed(result);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (newsfeed.length === 0) {
      getNewsFromDb();
    } else {
      setResult(newsfeed);
      setLoading(false);
    }
  }, []);

  const handleAnalyzeArticle = async (articleId, force = false) => {
    setAnalyzingArticles((prevState) => ({
      ...prevState,
      [articleId]: { loading: true },
    }));

    try {
      const url = `/api/newsfeed/analyze/${articleId}?force=${force}`;
      const response = await api.post(url);
      const analysisResult = response.data.analysis_result;

      setNewsfeed((prevNewsfeed) =>
        prevNewsfeed.map((item) => {
          if (item.id === articleId) {
            return { ...item, analysis_result: analysisResult };
          }
          return item;
        })
      );

      setResult((prevResult) =>
        prevResult.map((item) => {
          if (item.id === articleId) {
            return { ...item, analysis_result: analysisResult };
          }
          return item;
        })
      );

      setAnalyzingArticles((prevState) => ({
        ...prevState,
        [articleId]: { loading: false, success: true },
      }));
    } catch (error) {
      console.error(`Error analyzing article ${articleId}:`, error);
      setAnalyzingArticles((prevState) => ({
        ...prevState,
        [articleId]: { loading: false, error: true },
      }));
    }
  };

  const handleNoteEdit = (articleId, currentNote) => {
    setEditingNoteId(editingNoteId === articleId ? null : articleId);
    setNoteContent(currentNote || "");
  };

  const handleNoteSave = (articleId) => {
    updateArticleField(articleId, "note", noteContent);
    setEditingNoteId(null);
  };

  const handleTlpClick = (event, articleId) => {
    setTlpAnchorEl(event.currentTarget);
    setCurrentTlpArticleId(articleId);
  };

  const handleTlpSelect = (tlp) => {
    if (currentTlpArticleId) {
      updateArticleField(currentTlpArticleId, "tlp", tlp);
    }
    setTlpAnchorEl(null);
  };

  const updateArticleField = async (articleId, field, value) => {
    try {
      const response = await api.put(`/api/newsfeed/article/${articleId}`, {
        [field]: value,
      });
      const updatedArticle = response.data;

      setNewsfeed((prevNewsfeed) =>
        prevNewsfeed.map((item) =>
          item.id === articleId ? updatedArticle : item
        )
      );

      setResult((prevResult) =>
        prevResult.map((item) =>
          item.id === articleId ? updatedArticle : item
        )
      );
    } catch (error) {
      console.error(`Error updating article ${articleId}:`, error);
    }
  };

  return (
    <>
      <br />
      <Button onClick={() => fetchData()} sx={{ float: "right", mr: 2 }}>
        <RefreshIcon /> Update feed
      </Button>
      <br />
      {loading ? (
        <>{showSkeletons()}</>
      ) : result.length > 0 ? (
        result
          .slice((page - 1) * pageSize, page * pageSize)
          .map((item, index) => {
            const isEditing = editingNoteId === item.id;
            return (
              <Grow in={true} key={"grow-" + index}>
                <Card
                  sx={{
                    m: 2,
                    p: 2,
                    borderRadius: 5,
                    backgroundColor: theme.palette.background.card,
                    boxShadow: 0,
                    position: "relative",
                  }}
                  key={"card-" + index}
                >
                  <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                    <Avatar
                      alt={`${item.title} icon`}
                      src={`${
                        api.defaults.baseURL
                      }/api/feedicons/${item.feedname
                        .toLowerCase()
                        .replace(/\s+/g, "")}`}
                      sx={{ width: 45, height: 45 }}
                    />
                    <Stack>
                      <b>{item.feedname}</b>
                      {format(new Date(item.date), "MMMM d, yyyy, h:mm a")}
                    </Stack>
                  </Stack>

                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ position: "absolute", top: 8, right: 8 }}
                  >
                    <IconButton
                      onClick={(e) => handleTlpClick(e, item.id)}
                      sx={{ color: tlpColors[item.tlp || "TLP:CLEAR"] }}
                    >
                      <CircleIcon />
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

                    <IconButton
                      onClick={() => handleNoteEdit(item.id, item.note)}
                      color="primary"
                    >
                      <RateReviewIcon />
                    </IconButton>

                    <Button
                      sx={{ borderRadius: 5 }}
                      disableElevation
                      startIcon={<OpenInNewIcon />}
                      href={item.link}
                      target="_blank"
                    >
                      Original
                    </Button>

                    {apiKeys.openai && (
                      <Button
                        sx={{ borderRadius: 5 }}
                        disableElevation
                        startIcon={<AutoAwesomeIcon />}
                        onClick={() =>
                          handleAnalyzeArticle(item.id, !!item.analysis_result)
                        }
                        disabled={analyzingArticles[item.id]?.loading}
                      >
                        {analyzingArticles[item.id]?.loading ? (
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

                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {item.title}
                  </Typography>
                  <Typography>
                    {item.summary
                      ? he.decode(item.summary)
                      : "No summary available for this article."}
                  </Typography>

                  {item.note && (
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      sx={{ mt: 2 }}
                    >
                      <NotesIcon />
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        Note:
                      </Typography>
                    </Stack>
                  )}

                  {isEditing ? (
                    <Stack direction="column" spacing={1} sx={{ mt: 1 }}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        multiline
                        minRows={3}
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                      />
                      <Button
                        variant="contained"
                        disableElevation
                        onClick={() => handleNoteSave(item.id)}
                      >
                        Save Note
                      </Button>
                    </Stack>
                  ) : (
                    item.note && (
                      <Typography sx={{ mt: 1 }}>
                        <ReactMarkdown components={MarkdownComponents}>
                          {item.note}
                        </ReactMarkdown>
                      </Typography>
                    )
                  )}

                  {item.analysis_result && (
                    <Accordion
                      elevation={0}
                      sx={{
                        mt: 2,
                        backgroundColor: "transparent",
                        boxShadow: "none",
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                          p: 0,
                          "& .MuiAccordionSummary-content": { margin: 0 },
                        }}
                      >
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1}
                          sx={{ mt: 2 }}
                        >
                          <AutoAwesomeIcon />
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "bold" }}
                          >
                            CTI Profile Analysis
                          </Typography>
                        </Stack>
                      </AccordionSummary>
                      <AccordionDetails sx={{ p: 0 }}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: theme.palette.background.paper,
                          }}
                        >
                          <ReactMarkdown components={MarkdownComponents}>
                            {item.analysis_result}
                          </ReactMarkdown>
                        </Paper>
                      </AccordionDetails>
                    </Accordion>
                  )}

                  {item.matches && item.matches.length > 0 && (
                    <>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ mt: 2 }}
                      >
                        <FindInPageIcon />
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: "bold", mt: 2 }}
                        >
                          {item.matches.length} Keyword Match
                          {item.matches.length > 1 ? "es" : ""}
                        </Typography>
                      </Stack>

                      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        {item.matches.map((keyword, idx) => (
                          <Chip
                            key={idx}
                            label={keyword}
                            sx={{
                              "& .MuiChip-label": {
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                              },
                            }}
                          />
                        ))}
                      </Stack>
                    </>
                  )}
                </Card>
              </Grow>
            );
          })
      ) : null}
      <Pagination
        count={Math.ceil(newsfeed.length / pageSize)}
        page={page}
        color="primary"
        shape="rounded"
        size="large"
        showFirstButton
        showLastButton
        onChange={handlePageChange}
        sx={{ display: "flex", justifyContent: "center" }}
      />
    </>
  );
}
