import React from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import NoDetails from "../NoDetails"; 

const ThreatMatchItem = ({ match, index }) => (
  <Card variant="outlined" sx={{ mb: 2, p:1, borderColor: 'warning.main' }}>
    <Typography variant="subtitle1" gutterBottom color="warning.dark" fontWeight="bold">
      Match {index + 1}: {match.threatType}
    </Typography>
    <List dense disablePadding>
      <ListItem sx={{py:0.5}}>
        <ListItemText primary="Platform Type:" secondary={match.platformType || "N/A"} />
      </ListItem>
      <ListItem sx={{py:0.5}}>
        <ListItemText primary="Threat Entry Type:" secondary={match.threatEntryType || "N/A"} />
      </ListItem>
      {match.threat && match.threat.url && (
         <ListItem sx={{py:0.5}}>
            <ListItemText primary="Matched URL Pattern:" secondary={match.threat.url} sx={{wordBreak: 'break-all'}} />
        </ListItem>
      )}
       {match.cacheDuration && (
         <ListItem sx={{py:0.5}}>
            <ListItemText primary="Cache Duration:" secondary={match.cacheDuration} />
        </ListItem>
      )}
    </List>
  </Card>
);


export default function SafeBrowseDetails({ result, ioc }) { 

  if (!result) { 
    return (
      <Box sx={{ margin: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 100 }}>
        <NoDetails message="Loading Google Safe Browse details..." /> 
      </Box>
    );
  }

  if (result.error) {
    return (
      <Box sx={{ margin: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 100 }}>
        <NoDetails message={`Error fetching Google Safe Browse details: ${result.message || result.error}`} />
      </Box>
    );
  }
  
  const hasMatches = result.matches && Array.isArray(result.matches) && result.matches.length > 0;

  return (
    <Box sx={{ margin: 1, mt:0 }}> 
      <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <CardContent>
          <Grid container spacing={1} alignItems="center" mb={2}>
             {hasMatches ? <ReportProblemIcon color="warning" /> : <CheckCircleOutlineIcon color="success" />}
            <Typography variant="h6" component="div" sx={{ ml: 1 }}>
              Google Safe Browse Analysis for: <Typography component="span" sx={{wordBreak: 'break-all'}}>{ioc}</Typography>
            </Typography>
          </Grid>

          {hasMatches ? (
            <>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                The following threats were reported for the queried IOC:
              </Typography>
              {result.matches.map((match, index) => (
                <ThreatMatchItem key={index} match={match} index={index} />
              ))}
            </>
          ) : (
            <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" p={2}>
              <CheckCircleOutlineIcon sx={{ fontSize: 40, color: 'success.main', mb:1 }} />
              <Typography variant="subtitle1" color="text.secondary">
                No threats found by Google Safe Browse. The IOC appears to be safe according to this check.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}