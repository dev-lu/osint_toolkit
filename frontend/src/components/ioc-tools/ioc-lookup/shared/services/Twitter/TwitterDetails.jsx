import React from "react"; 

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link"; 
import { Chip, Stack } from "@mui/material";
import TwitterIcon from '@mui/icons-material/Twitter'; 
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

import NoDetails from "../NoDetails"; 

const formatTwitterDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleString();
  } catch (e) {
    return dateString; 
  }
};


export default function TwitterDetails({ result, ioc }) { 

  if (!result) { 
    return (
      <Box sx={{ margin: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 100 }}>
        <NoDetails message="Loading Twitter mentions..." />
      </Box>
    );
  }
  
  if (result.error) { 
    return (
      <Box sx={{ margin: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 100 }}>
        <NoDetails message={`Error fetching Twitter mentions: ${result.message || result.error}`} />
      </Box>
    );
  }

  const tweetCount = (Array.isArray(result) && result.length > 0 && typeof result[0]?.count === 'number') 
                     ? result[0].count 
                     : (result.meta?.result_count ?? 0); 

  const tweets = (Array.isArray(result) && result.length > 0 && typeof result[0]?.count === 'number')
                 ? result.slice(1)
                 : (Array.isArray(result.data) ? result.data : []); 

  if (tweetCount === 0 || tweets.length === 0) {
    return (
      <Box sx={{ margin: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 100 }}>
        <NoDetails message={`No recent tweets found mentioning "${ioc}".`} />
      </Box>
    );
  }

  return (
    <Box sx={{ margin: 1, mt:0 }}> 
        <Grid container spacing={1} alignItems="center" mb={1}>
            <TwitterIcon color="primary"/>
            <Typography variant="h6" component="div" sx={{ ml: 1 }}>
              Recent Tweets Mentioning: <Typography component="span" sx={{wordBreak: 'break-all'}}>{ioc}</Typography> ({tweetCount} total reported)
            </Typography>
        </Grid>
        {tweets.map((tweet, index) => (
        <Card
            key={tweet.id || index}
            variant="outlined"
            sx={{ mb: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}
        >
            <CardContent>
            <Stack direction="row" spacing={2} alignItems="flex-start">
                <Box flexGrow={1}>
                    <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                        <Typography variant="subtitle1" fontWeight="bold">
                            {tweet.author || tweet.user?.name || "Unknown Author"}
                        </Typography>
                        {tweet.user?.username && (
                            <Typography variant="caption" color="text.secondary">
                                @{tweet.user.username}
                            </Typography>
                        )}
                    </Stack>
                    <Typography 
                        variant="caption" 
                        color="text.secondary" 
                        display="flex" 
                        alignItems="center"
                        mb={1}
                    >
                        <CalendarTodayIcon sx={{ fontSize: 'inherit', mr: 0.5 }} /> 
                        {formatTwitterDate(tweet.created_at)}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', mb:1 }}>
                        {tweet.text}
                    </Typography>

                    {tweet.id && tweet.author_id && ( 
                         <Link 
                            href={`https://twitter.com/${tweet.user?.username || tweet.author_id}/status/${tweet.id}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            variant="caption"
                        >
                            View on Twitter
                        </Link>
                    )}
                     {tweet.entities?.hashtags && tweet.entities.hashtags.length > 0 && (
                        <Box mt={1}>
                            {tweet.entities.hashtags.map(ht => (
                                <Chip key={ht.tag} label={`#${ht.tag}`} size="small" sx={{mr:0.5, mb:0.5}} component="a" href={`https://twitter.com/hashtag/${ht.tag}`} target="_blank" clickable/>
                            ))}
                        </Box>
                     )}
                </Box>
            </Stack>
            </CardContent>
        </Card>
        ))}
    </Box>
  );
}