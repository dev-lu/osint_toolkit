import React from "react";
import { useEffect, useState } from "react";

import { AccessTime, Person, Score } from "@mui/icons-material";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { Typography } from "@mui/material";

import NoDetails from "./NoDetails";
import ResultRow from "../ResultRow";
import api from "../../../api";

export default function Reddit(props) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedStates, setExpandedStates] = useState([]);

  const toggleExpanded = (index) => {
    const newExpandedStates = [...expandedStates];
    newExpandedStates[index] = !newExpandedStates[index];
    setExpandedStates(newExpandedStates);
  };

  useEffect(() => {
    if (result) {
      setExpandedStates(new Array(result.length).fill(false));
    }
  }, [result]);

  const getTruncatedMessage = (message, maxLength) => {
    if (message.length > maxLength) {
      return message.slice(0, maxLength) + "...";
    }
    return message;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const url = "/api/socialmedia/reddit/" + props.ioc;
        const response = await api.get(url);
        setResult(response.data);
      } catch (e) {
        setError(e);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const details = (
    <>
      {result && result.length > 0 ? (
        <Box sx={{ margin: 1 }}>
          {result.map((post, index) => (
            <Card
              key={post.id}
              variant="outlined"
              sx={{ m: 1.5, p: 2, borderRadius: 5 }}
            >
              <Stack direction="row" alignItems="flex-start">
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h2">
                    {post.title}
                  </Typography>
                  <Stack direction="row">
                    <Typography
                      variant="subtitle1"
                      component="div"
                      color="textSecondary"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <Person fontSize="small" sx={{ mr: 1 }} /> {post.author}
                      <Divider
                        orientation="vertical"
                        flexItem
                        variant="middle"
                        style={{ marginLeft: 8, marginRight: 8 }}
                      />{" "}
                      <Score fontSize="small" sx={{ mr: 1 }} /> {post.score}{" "}
                      points
                      <Divider
                        orientation="vertical"
                        flexItem
                        variant="middle"
                        style={{ marginLeft: 8, marginRight: 8 }}
                      />{" "}
                      <AccessTime fontSize="small" sx={{ mr: 1 }} />{" "}
                      {post.created_utc}
                    </Typography>
                  </Stack>
                  <Typography variant="body1" component="p" sx={{ my: 2 }}>
                    {expandedStates[index]
                      ? post.message
                      : getTruncatedMessage(post.message, 200)}
                    {post.message && post.message.length > 200 && (
                      <Button
                        onClick={() => toggleExpanded(index)}
                        sx={{ mt: 1 }}
                      >
                        {expandedStates[index] ? "Read less" : "Read more"}
                      </Button>
                    )}
                  </Typography>
                  <Button
                    variant="outlined"
                    href={post.url}
                    target="_blank"
                    rel="noopener"
                  >
                    Go to post
                  </Button>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    ml: 2,
                  }}
                >
                  <Typography
                    variant="caption"
                    component="p"
                    color="textSecondary"
                  >
                    ID: {post.id}
                  </Typography>
                </Box>
              </Stack>
            </Card>
          ))}
        </Box>
      ) : (
        <Box sx={{ margin: 1 }}>
          <Grid
            xs
            item={true}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <NoDetails />
          </Grid>
        </Box>
      )}
    </>
  );

  return (
    <>
      <ResultRow
        name="Reddit"
        id="reddit"
        icon="reddit_logo_small"
        loading={loading}
        result={result}
        summary={
          result && result.length > 0
            ? "Show latest " + result.length + " posts"
            : "No posts found"
        }
        summary_color={{ color: null }}
        color={result && result.length > 0 ? "orange" : "green"}
        error={error}
        details={details}
      />
    </>
  );
}
