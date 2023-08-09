import React from "react";
import api from "../../../../api";
import { useEffect, useState, useRef } from "react";

import Box from "@mui/material/Box";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import Card from "@mui/material/Card";
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
import Stack from "@mui/material/Stack";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import Typography from "@mui/material/Typography";

import ResultRow from "../../ResultRow";

export default function Checkphish(props) {
  const propsRef = useRef(props);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const url =
          "/api/" +
          propsRef.current.type +
          "/checkphish/" +
          encodeURIComponent(propsRef.current.ioc);
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
      {result && !result["error"] && (
        <>
          <Box sx={{ margin: 1 }}>
            <Card
              key="shodan_details"
              elevation={0}
              variant="outlined"
              sx={{ m: 1.5, p: 2, borderRadius: 5 }}
            >
              <Grid container alignItems="center">
                <Grid mr={1} item>
                  <InfoIcon />
                </Grid>
                <Grid item>
                  <Typography variant="h5" component="h2" gutterBottom>
                    Details
                  </Typography>
                </Grid>
              </Grid>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <NumbersIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Job ID" secondary={result["job_id"]} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CategoryIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="IOC" secondary={result["url"]} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <FingerprintIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="IOC SHA256"
                    secondary={result["url_sha256"]}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <HourglassBottomIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Status" secondary={result["status"]} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <PlayCircleFilledWhiteIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Scan start"
                    secondary={new Date(
                      result["scan_start_ts"] * 1000
                    ).toLocaleString("en-US", {
                      timeZone: "UTC",
                      dateStyle: "short",
                      timeStyle: "medium",
                    })}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <StopCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Scan end"
                    secondary={new Date(
                      result["scan_end_ts"] * 1000
                    ).toLocaleString("en-US", {
                      timeZone: "UTC",
                      dateStyle: "short",
                      timeStyle: "medium",
                    })}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <SecurityIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Disposition"
                    secondary={result["disposition"]}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <BrandingWatermarkIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Brand" secondary={result["brand"]} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <OpenInNewIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Insights"
                    secondary={result["insights"]}
                  />
                </ListItem>
              </List>
            </Card>

            {result["screenshot_path"] ? (
              <Card
                key="shodan_details"
                elevation={0}
                variant="outlined"
                sx={{ m: 1.5, p: 2, borderRadius: 5 }}
              >
                <Stack sx={{ float: "left" }}>
                  <Grid container alignItems="left">
                    <Grid mr={1} item>
                      <ScreenshotMonitorIcon />
                    </Grid>
                    <Grid item>
                      <Typography variant="h5" component="h2" gutterBottom>
                        Screenshot
                      </Typography>
                    </Grid>
                  </Grid>
                  <a
                    href={result["screenshot_path"]}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={result["screenshot_path"]}
                      alt="Website screenshot"
                      style={{
                        width: "350px",
                        borderRadius: "15px",
                      }}
                    />
                  </a>
                </Stack>
              </Card>
            ) : null}
          </Box>
        </>
      )}
    </>
  );

  return (
    <>
      <ResultRow
        name="Checkphish"
        id="checkphish"
        icon="checkphish_logo_small"
        loading={loading}
        result={result}
        summary={
          result && result["disposition"] ? result["disposition"] : "N/A"
        }
        summary_color={{ color: null }}
        color={result && result["disposition"] === "clean" ? "green" : "red"}
        error={error}
        details={details}
      />
    </>
  );
}
