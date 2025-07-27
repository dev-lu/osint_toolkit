import React from "react";
import Box from "@mui/material/Box";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent"; 
import CategoryIcon from "@mui/icons-material/Category";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import Grid from "@mui/material/Grid";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import InfoIcon from "@mui/icons-material/Info";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import NumbersIcon from "@mui/icons-material/Numbers";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import ScreenshotMonitorIcon from "@mui/icons-material/ScreenshotMonitor";
import SecurityIcon from "@mui/icons-material/Security";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import Typography from "@mui/material/Typography";
import Link from '@mui/material/Link'; 
import NoDetails from "../NoDetails";

const formatTimestamp = (timestamp) => {
  if (!timestamp) return "N/A";
  return new Date(timestamp * 1000).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "medium",
  });
};

export default function CheckphishDetails({ result, ioc }) { 
  if (!result || result.error || result.status !== 'DONE') {
    let message = "Checkphish details are unavailable or the scan is not complete.";
    if (result && result.error) {
        message = `Error fetching Checkphish details: ${result.message || result.error}`;
    } else if (result && result.status && result.status !== 'DONE') {
        message = `Checkphish scan status: ${result.status}. Please wait for completion.`;
    }
    return <NoDetails message={message} />;
  }
  
  return (
    <Box sx={{ margin: 1, mt:0 }}> 
      <Grid container spacing={2}>
        <Grid item xs={12} md={result.screenshot_path ? 7 : 12}> 
          <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
              <Grid container alignItems="center" spacing={1} mb={1}>
                <Grid item>
                  <InfoIcon color="action" />
                </Grid>
                <Grid item>
                  <Typography variant="h6">
                    Scan Details
                  </Typography>
                </Grid>
              </Grid>
              <List dense>
                <ListItem>
                  <ListItemIcon sx={{minWidth: 36}}>
                    <NumbersIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Job ID" secondary={result.job_id || "N/A"} />
                </ListItem>
                <ListItem>
                  <ListItemIcon sx={{minWidth: 36}}>
                    <CategoryIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Scanned URL" secondary={result.url || "N/A"} sx={{wordBreak: 'break-all'}}/>
                </ListItem>
                <ListItem>
                  <ListItemIcon sx={{minWidth: 36}}>
                    <FingerprintIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="URL SHA256"
                    secondary={result.url_sha256 || "N/A"}
                    sx={{wordBreak: 'break-all'}}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon sx={{minWidth: 36}}>
                    <HourglassBottomIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Job Status" secondary={result.status || "N/A"} />
                </ListItem>
                <ListItem>
                  <ListItemIcon sx={{minWidth: 36}}>
                    <PlayCircleFilledWhiteIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Scan Start"
                    secondary={formatTimestamp(result.scan_start_ts)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon sx={{minWidth: 36}}>
                    <StopCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Scan End"
                    secondary={formatTimestamp(result.scan_end_ts)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon sx={{minWidth: 36}}>
                    <SecurityIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Disposition"
                    secondary={result.disposition || "N/A"}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon sx={{minWidth: 36}}>
                    <BrandingWatermarkIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Detected Brand" secondary={result.brand || "N/A"} />
                </ListItem>
                {result.insights && (
                    <ListItem>
                        <ListItemIcon sx={{minWidth: 36}}>
                            <OpenInNewIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Insights"
                            secondary={result.insights}
                        />
                    </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {result.screenshot_path && (
          <Grid item xs={12} md={5}>
            <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <CardContent>
                <Grid container alignItems="center" spacing={1} mb={1}>
                  <Grid item>
                    <ScreenshotMonitorIcon color="action" />
                  </Grid>
                  <Grid item>
                    <Typography variant="h6">
                      Screenshot
                    </Typography>
                  </Grid>
                </Grid>
                <Link
                  href={result.screenshot_path}
                  target="_blank"
                  rel="noopener noreferrer"
                  display="block"
                  sx={{mt:1}}
                >
                  <Box
                    component="img"
                    src={result.screenshot_path}
                    alt="Website screenshot"
                    sx={{
                      maxWidth: "100%",
                      height: "auto",
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'divider'
                    }}
                  />
                </Link>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}