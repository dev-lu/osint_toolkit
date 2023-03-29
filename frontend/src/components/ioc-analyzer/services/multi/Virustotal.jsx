import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import StarIcon from "@mui/icons-material/Star";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import { Typography } from "@mui/material";

import NoDetails from "../NoDetails";
import ResultRow from "../../ResultRow";

export default function Virustotal(props) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [malCount, setMalCount] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url =
          "http://localhost:8000/api/" +
          props.type +
          "/virustotal?ioc=" +
          encodeURIComponent(props.ioc);
        const response = await axios.get(url);
        setResult(response.data);
        setMalCount(
          response.data.data.attributes.last_analysis_stats.malicious
        );
      } catch (e) {
        setError(e);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const details = (
    <>
      {result ? (
        result.data ? (
          <Box sx={{ margin: 1 }}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Card
                key="details_card"
                variant="outlined"
                sx={{
                  m: 1,
                  p: 2,
                  borderRadius: 5,
                  boxShadow: 0,
                  width: "100%",
                  maxWidth: "600px",
                }}
              >
                <Typography variant="h5" component="h2" gutterBottom>
                  Details
                </Typography>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <Typography variant="body1">
                    Detected as malicious by {malCount} engine(s)
                  </Typography>
                  {result["data"]["attributes"][
                    "regional_internet_registry"
                  ] && (
                    <Typography variant="body1">
                      Internet registry:{" "}
                      {
                        result["data"]["attributes"][
                          "regional_internet_registry"
                        ]
                      }
                    </Typography>
                  )}
                  {result["data"]["attributes"]["network"] && (
                    <Typography variant="body1">
                      Network: {result["data"]["attributes"]["network"]}
                    </Typography>
                  )}
                  {result["data"]["attributes"]["country"] && (
                    <Typography variant="body1">
                      Country: {result["data"]["attributes"]["country"]}
                    </Typography>
                  )}
                  {result["data"]["attributes"]["as_owner"] && (
                    <Typography variant="body1">
                      AS owner: {result["data"]["attributes"]["as_owner"]}
                    </Typography>
                  )}
                </div>
              </Card>

              <Card
                key={"statistics_card"}
                variant="outlined"
                sx={{
                  m: 1,
                  p: 2,
                  borderRadius: 5,
                  boxShadow: 0,
                  flexBasis: "48%",
                }}
              >
                <Typography variant="h5" component="h2" gutterBottom>
                  Analysis statistics
                </Typography>
                <List>
                  <ListItem disablePadding>
                    <ListItemAvatar>
                      <Avatar sx={{ backgroundColor: "#6AAB8E" }}>
                        <CheckCircleOutlineIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Harmless"
                      secondary={
                        result["data"]["attributes"]["last_analysis_stats"][
                          "harmless"
                        ]
                      }
                    />
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemAvatar>
                      <Avatar sx={{ backgroundColor: "red" }}>
                        <HighlightOffIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Malicious"
                      secondary={
                        result["data"]["attributes"]["last_analysis_stats"][
                          "malicious"
                        ]
                      }
                    />
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemAvatar>
                      <Avatar sx={{ backgroundColor: "#F5BB00" }}>
                        <ReportProblemIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Suspicious"
                      secondary={
                        result["data"]["attributes"]["last_analysis_stats"][
                          "suspicious"
                        ]
                      }
                    />
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemAvatar>
                      <Avatar>
                        <QuestionMarkIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Undetected"
                      secondary={
                        result["data"]["attributes"]["last_analysis_stats"][
                          "undetected"
                        ]
                      }
                    />
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemAvatar>
                      <Avatar>
                        <AccessTimeIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Timeout"
                      secondary={
                        result["data"]["attributes"]["last_analysis_stats"][
                          "timeout"
                        ]
                      }
                    />
                  </ListItem>
                </List>
              </Card>
            </div>

            {result["data"]["attributes"]["tags"] &&
            result["data"]["attributes"]["tags"].length > 0 ? (
              <Card
                variant="outlined"
                key="tags_card"
                sx={{ m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}
              >
                <Typography variant="h5" component="h2" gutterBottom>
                  Tags
                </Typography>
                {result["data"]["attributes"]["tags"] > 0 ? (
                  result["data"]["attributes"]["tags"].map((tag, index) => {
                    return <Chip key={index}> {tag} </Chip>;
                  })
                ) : (
                  <p>None</p>
                )}
              </Card>
            ) : null}

            {result["data"]["attributes"]["crowdsourced_context"] &&
            result["data"]["attributes"]["crowdsourced_context"].length > 0 ? (
              <Card
                key="crowdsourced_context_card"
                variant="outlined"
                sx={{ m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}
              >
                <Typography variant="h5" component="h2" gutterBottom>
                  Crowdsourced context
                </Typography>
                {result["data"]["attributes"]["crowdsourced_context"].length >
                0 ? (
                  result["data"]["attributes"]["crowdsourced_context"].map(
                    (cc, index) => {
                      return (
                        <div key={index + "_div"}>
                          <b>Title: </b>
                          {cc.title}
                          <br />
                          <b>Source: </b>
                          {cc.source}
                          <br />
                          <b>Timestamp: </b>
                          {cc.timestamp}
                          <br />
                          <b>Detail: </b>
                          {cc.detail}
                          <br />
                          <b>Severity: </b>
                          {cc.severity}
                          <br />
                        </div>
                      );
                    }
                  )
                ) : (
                  <p>None</p>
                )}
              </Card>
            ) : null}

            {result["data"]["attributes"]["popularity_ranks"] &&
            Object.keys(result["data"]["attributes"]["popularity_ranks"])
              .length > 0 ? (
              <Card
                key="popularity_card"
                variant="outlined"
                sx={{ m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}
              >
                <Typography variant="h5" component="h2" gutterBottom>
                  Popularity ranks
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  Domain's position in popularity ranks such as Alexa,
                  Quantcast, Statvoo, etc.
                </Typography>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                  {Object.entries(
                    result["data"]["attributes"]["popularity_ranks"]
                  ).map(([name, data]) => (
                    <div
                      key={name + "_div"}
                      style={{ flexBasis: "15%", marginBottom: "5px" }}
                    >
                      <Card
                        variant="outlined"
                        key={name + "_popularity_card"}
                        sx={{ m: 1, p: 1.5, borderRadius: 5, boxShadow: 0 }}
                      >
                        <Typography variant="h6" component="h2" gutterBottom>
                          {name}
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Grid container spacing={1} alignItems="center">
                          <Grid item>
                            <StarIcon color="primary" />
                          </Grid>
                          <Grid item>
                            <Typography variant="subtitle1" component="span">
                              {data.rank}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Card>
                    </div>
                  ))}
                </div>
              </Card>
            ) : null}

            {result["data"]["attributes"]["last_analysis_results"] &&
            Object.keys(result["data"]["attributes"]["last_analysis_results"])
              .length > 0 ? (
              <Card
                key="last_analysis_results_card"
                variant="outlined"
                sx={{ m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}
              >
                <Typography variant="h5" component="h2" gutterBottom>
                  Last analysis results
                </Typography>
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {Object.entries(
                    result["data"]["attributes"]["last_analysis_results"]
                  ).map(([name, data], index) => (
                    <div
                      key={index}
                      style={{ flexBasis: "20%", marginBottom: "20px" }}
                    >
                      <Card
                        variant="outlined"
                        key={name + "_analysis_results_card"}
                        sx={{
                          m: 2,
                          p: 2,
                          borderRadius: 5,
                          boxShadow: 0,
                          color: "white",
                          backgroundColor:
                            data.category === "malicious" ? "red" : "#6AAB8E",
                          height: "100%",
                        }}
                      >
                        <h4>{name}</h4>
                        <Divider variant="middle" sx={{ m: 1 }} />
                        <p>
                          <b>Category: </b> {data.category}
                        </p>
                        <p>
                          <b>Result: </b> {data.result}
                        </p>
                        <p>
                          <b>Method: </b> {data.method}
                        </p>
                      </Card>
                    </div>
                  ))}
                </div>
              </Card>
            ) : null}

            {result["data"]["attributes"]["whois"] && (
              <Card
                key="whois_card"
                variant="outlined"
                sx={{ m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}
              >
                <Typography variant="h5" component="h2" gutterBottom>
                  Whois
                </Typography>
                <Typography component="p" sx={{ whiteSpace: "pre-wrap" }}>
                  {result["data"]["attributes"]["whois"]}
                </Typography>
              </Card>
            )}
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
        )
      ) : null}
    </>
  );

  return (
    <>
      <ResultRow
        name="Virustotal"
        id="virustotal"
        icon="vt_logo_small"
        loading={loading}
        result={result}
        summary={
          malCount === null
            ? "No matches found"
            : "Detected as malicious by " + malCount + " engine(s)"
        }
        summary_color={{ color: null }}
        color={malCount > 0 ? "red" : "green"}
        error={error}
        details={details}
      />
    </>
  );
}
