import React, { useEffect, useState } from "react"; 

import { AccessTime, Person, Score } from "@mui/icons-material";
import RedditIcon from '@mui/icons-material/Reddit';

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent"; 
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { Typography, Link } from "@mui/material";

import NoDetails from "../NoDetails";

export default function RedditDetails({ result, ioc }) {

  const [expandedStates, setExpandedStates] = useState([]);

  useEffect(() => {
    if (result && Array.isArray(result)) {
      setExpandedStates(new Array(result.length).fill(false));
    } else {
      setExpandedStates([]);
    }
  }, [result]); 

  const toggleExpanded = (index) => {
    const newExpandedStates = [...expandedStates];
    newExpandedStates[index] = !newExpandedStates[index];
    setExpandedStates(newExpandedStates);
  };

  const getTruncatedMessage = (message, maxLength = 200) => {
    if (!message) return "";
    if (message.length > maxLength) {
      return message.slice(0, maxLength) + "...";
    }
    return message;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp * 1000).toLocaleDateString(); 
  };


  if (!result) { 
     return (
      <Box sx={{ margin: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 100 }}>
        <NoDetails message="Loading Reddit mentions..." />
      </Box>
    );
  }
  
  if (result.error) {
    return (
      <Box sx={{ margin: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 100 }}>
        <NoDetails message={`Error fetching Reddit mentions: ${result.message || result.error}`} />
      </Box>
    );
  }
  
  if (!Array.isArray(result) || result.length === 0) {
    return (
      <Box sx={{ margin: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 100 }}>
        <NoDetails message={`No Reddit mentions found for "${ioc}".`} />
      </Box>
    );
  }

  return (
    <Box sx={{ margin: 1, mt:0 }}> 
        <Grid container spacing={1} alignItems="center" mb={2}>
            <RedditIcon color="action"/>
            <Typography variant="h6" component="div" sx={{ ml: 1 }}>
              Reddit Mentions ({result.length})
            </Typography>
        </Grid>
        {result.map((post, index) => (
        <Card
            key={post.id || index} 
            variant="outlined"
            sx={{ mb: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}
        >
            <CardContent>
            <Stack direction="row" alignItems="flex-start" spacing={2}>
                <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h2" gutterBottom sx={{wordBreak:'break-word'}}>
                    {post.title || "No Title"}
                </Typography>
                <Stack 
                    direction={{xs: 'column', sm: 'row'}} 
                    alignItems={{xs: 'flex-start', sm: 'center'}}
                    spacing={{xs: 0.5, sm: 1}}
                    divider={<Divider orientation="vertical" flexItem sx={{display: {xs: 'none', sm: 'block'}}} />}
                    color="text.secondary"
                    flexWrap="wrap" 
                    mb={1}
                >
                    <Typography variant="caption" style={{ display: "flex", alignItems: "center" }}>
                        <Person fontSize="inherit" sx={{ mr: 0.5 }} /> {post.author || "N/A"}
                    </Typography>
                    <Typography variant="caption" style={{ display: "flex", alignItems: "center" }}>
                        <Score fontSize="inherit" sx={{ mr: 0.5 }} /> {post.score ?? 0} points
                    </Typography>
                    <Typography variant="caption" style={{ display: "flex", alignItems: "center" }}>
                        <AccessTime fontSize="inherit" sx={{ mr: 0.5 }} /> {formatDate(post.created_utc)}
                    </Typography>
                </Stack>

                {post.message && (
                    <Typography variant="body2" component="p" sx={{ my: 1, whiteSpace: 'pre-wrap', wordBreak:'break-word' }}>
                    {expandedStates[index]
                        ? post.message
                        : getTruncatedMessage(post.message, 200)}
                    {post.message.length > 200 && (
                        <Button
                        onClick={() => toggleExpanded(index)}
                        size="small"
                        sx={{ display: 'block', mt: 0.5, p:0, textTransform: 'none' }} 
                        >
                        {expandedStates[index] ? "Read less" : "Read more"}
                        </Button>
                    )}
                    </Typography>
                )}
                 {!post.message && (
                     <Typography variant="body2" component="p" sx={{ my: 1, fontStyle: 'italic' }} color="text.disabled">
                        No message content (link post or media).
                    </Typography>
                 )}

                <Button
                    variant="outlined"
                    size="small"
                    href={post.url} 
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Go to Post
                </Button>
                </Box>
                {/* <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start", // Align to top
                    alignItems: "flex-end", // Align to right
                    flexShrink: 0
                }}
                >
                <Typography
                    variant="caption"
                    component="p"
                    color="text.disabled" // Lighter color
                >
                    ID: {post.id}
                </Typography>
                </Box> */}
            </Stack>
            </CardContent>
        </Card>
        ))}
    </Box>
  );
}