import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { PieChart, Pie } from "recharts";

import Box from "@mui/material/Box";
import BusinessIcon from "@mui/icons-material/Business";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import DataUsageOutlinedIcon from "@mui/icons-material/DataUsageOutlined";
import Grid from "@mui/material/Grid";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import Stack from "@mui/material/Stack";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import Typography from "@mui/material/Typography";

import ResultRow from "../../ResultRow";

export default function IpQualityscore(props) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(null);

  const colors = {
    green: "#00C49F",
    orange: "#FFA500",
    red: "#FF0000",
  };

  const getCircleFillColor = (score) => {
    if (score === 0) {
      return colors.green;
    } else if (score >= 1 && score <= 50) {
      return colors.orange;
    } else if (score >= 51 && score <= 100) {
      return colors.red;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const url = "http://localhost:8000/api/ip/ipqualityscore/" + props.ioc;
        const response = await axios.get(url);
        setResult(response.data);
        setScore(response.data["fraud_score"]);
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ margin: 1, width: "65%" }}>
            <Card variant="outlined" sx={{ borderRadius: 5, boxShadow: 0 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="h5" component="h2">
                      Details
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          {" "}
                          <DataUsageOutlinedIcon
                            color={
                              score >= 51
                                ? "error"
                                : score >= 1
                                ? "warning"
                                : "primary"
                            }
                          />{" "}
                        </ListItemIcon>
                        <ListItemText
                          primary="Score"
                          secondary={`${result["fraud_score"]}% malicious`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          {" "}
                          <LanguageOutlinedIcon color="primary" />{" "}
                        </ListItemIcon>
                        <ListItemText
                          primary="Country code"
                          secondary={`${result["country_code"]}`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          {" "}
                          <TravelExploreIcon color="primary" />{" "}
                        </ListItemIcon>
                        <ListItemText
                          primary="Region"
                          secondary={`${result["region"]}`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          {" "}
                          <LocationCityIcon color="primary" />{" "}
                        </ListItemIcon>
                        <ListItemText
                          primary="City"
                          secondary={`City: ${result["city"]}`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          {" "}
                          <BusinessIcon color="primary" />{" "}
                        </ListItemIcon>
                        <ListItemText
                          primary="Organisation"
                          secondary={`${result["organization"]}`}
                        />
                      </ListItem>
                    </List>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h5" component="h2">
                      Additional Details
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Is crawler?"
                          secondary={result["is_crawler"] ? "Yes" : "No"}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Timezone"
                          secondary={result["timezone"]}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Mobile?"
                          secondary={result["mobile"] ? "Yes" : "No"}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Is proxy?"
                          secondary={result["proxy"] ? "Yes" : "No"}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Is VPN?"
                          secondary={result["vpn"] ? "Yes" : "No"}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Is Tor?"
                          secondary={result["tor"] ? "Yes" : "No"}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Is active VPN?"
                          secondary={result["active_vpn"] ? "Yes" : "No"}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Is active Tor?"
                          secondary={result["active_tor"] ? "Yes" : "No"}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Recent abuse?"
                          secondary={result["recent_abuse"] ? "Yes" : "No"}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Bot?"
                          secondary={result["bot_status"] ? "Yes" : "No"}
                        />
                      </ListItem>
                    </List>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
          <Stack sx={{ width: "30%", align: "right" }}>
            <Card
              variant="outlined"
              sx={{ p: 2, borderRadius: 5, boxShadow: 0, margin: "0 auto" }}
            >
              <PieChart width={200} height={200}>
                <Pie
                  data={[
                    { name: "Score", value: score },
                    { name: "Remaining", value: 100 - score, fill: "#d3d3d3" },
                  ]}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                  innerRadius="80%"
                  outerRadius="100%"
                  minAngle={1}
                  domain={[0, 100]}
                  stroke="none"
                  strokeWidth={0}
                  fill={getCircleFillColor(score)}
                />
                <foreignObject
                  width="100%"
                  height="100%"
                  style={{ textAlign: "center" }}
                >
                  <div
                    style={{
                      display: "inline-block",
                      position: "relative",
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <Typography
                      variant="h4"
                      color={getCircleFillColor(score)}
                      sx={{ textAlign: "center" }}
                      textAnchor="middle"
                    >
                      <text x="50%" y="50%">
                        {score}%
                      </text>
                    </Typography>
                    <Typography
                      variant="h5"
                      color="textSecondary"
                      sx={{ textAlign: "center" }}
                      textAnchor="middle"
                    >
                      <text x="50%" y="50%">
                        malicious
                      </text>
                    </Typography>
                  </div>
                </foreignObject>
              </PieChart>
            </Card>
          </Stack>
        </div>
      ) : null}
    </>
  );

  return (
    <>
      <ResultRow
        name="IPQualityScore"
        id="ipqualityscore"
        icon="ipqualityscore_logo_small"
        loading={loading}
        result={result}
        summary={score + "% malicious"}
        summary_color={{ color: null }}
        color={score === 0 ? "green" : score <= 50 ? "orange" : "red"}
        error={error}
        details={details}
      />
    </>
  );
}
