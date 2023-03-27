import React from 'react'
import axios from "axios";
import { useEffect, useState } from "react";

import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Stack from '@mui/material/Stack';

import ResultRow from "../ResultRow";


export default function Reddit(props) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            const url = 'http://localhost:8000/api/socialmedia/reddit/' + props.ioc;
            const response = await axios.get(url);
            setResult(response.data);
        } catch (e) {
            setError(e);
        }
        setLoading(false);
    }
    fetchData();
}, []);

const details = (
  <>
    {result && result.length > 0 ? (
      <Box sx={{ margin: 1 }}>
        {result.map((post) => (
          <Card elevation={0} variant="outlined" sx={{ m: 1.5, p: 2, borderRadius: 5 }} key={post.id}>
            <Stack direction="row" spacing={2} width={'100%'} alignItems="flex-start">
              <Stack direction="column" width="100%">
                <p><b>Author: </b>{post.author}</p>
                <p><b>Score: </b>{post.score}</p>
                <p><b>Title: </b>{post.title}</p>
              </Stack>
              <Stack direction="column" sx={{ justifyContent: 'flex-end' }}>
                <p><b>Date: </b>{post.created_utc}</p>
                <p><b>URL: </b>{post.url}</p>
              </Stack>
            </Stack>
            <br />
            {post.message !== "" ? <p>{post.message}</p> : <p>No message text...</p>}
          </Card>
        ))}
      </Box>
    ) : (
      "No results"
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
          result && result.length > 0 ? "Show latest " + result.length + " posts" : "No posts found"
        }
        summary_color={{ color: null }}
        color={
          result && result.length > 0 ? "orange" : "green"
        }
        error={error}
        details={details}
      />
    </>
  )
}
