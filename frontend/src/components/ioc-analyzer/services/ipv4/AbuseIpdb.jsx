import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import GaugeChart from "react-gauge-chart";

import Card from "@mui/material/Card";
import Box from "@mui/material/Box";

import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import RouterOutlinedIcon from "@mui/icons-material/RouterOutlined";
import DomainOutlinedIcon from "@mui/icons-material/DomainOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import DnsOutlinedIcon from "@mui/icons-material/DnsOutlined";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import { Typography } from "@mui/material";

import ResultRow from "../../ResultRow";

export default function AbuseIpdb(props) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const url = "http://localhost:8000/api/ip/abuseipdb/" + props.ioc;
        const response = await axios.get(url);
        setResult(response.data);
        setScore(response.data["data"]["abuseConfidenceScore"]);
      } catch (e) {
        setError(e);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const details = (
    <>
      {result && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <Box sx={{ width: "65%" }}>
            <Card
              variant="outlined"
              sx={{ p: 2, borderRadius: 5, boxShadow: 0 }}
            >
              <Typography variant="h5" component="h3" gutterBottom>
                Details
              </Typography>
              <List sx={{ mt: 1 }}>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleOutlineIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Score: ${result.data["abuseConfidenceScore"]}% malicious`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <FileCopyOutlinedIcon color="info" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Total reports: ${result.data["totalReports"]}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <PeopleOutlinedIcon color="info" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Number of reporting users: ${result.data["numDistinctUsers"]}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <ScheduleOutlinedIcon color="info" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Last report: ${result.data["lastReportedAt"]}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <VerifiedUserOutlinedIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Whitelisted: ${
                      result.data["isWhitelisted"] ? "Yes" : "No"
                    }`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LanguageOutlinedIcon color="info" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Country code: ${result.data["countryCode"]}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <RouterOutlinedIcon color="info" />
                  </ListItemIcon>
                  <ListItemText primary={`ISP: ${result.data["isp"]}`} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <DomainOutlinedIcon color="info" />
                  </ListItemIcon>
                  <ListItemText primary={`Domain: ${result.data["domain"]}`} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CategoryOutlinedIcon color="info" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Type: ${
                      result.data["usageType"]
                        ? result.data["usageType"]
                        : "Unknown"
                    }`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <DnsOutlinedIcon color="info" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Hostnames: ${
                      result.data["hostnames"].length > 0
                        ? result.data["hostnames"].join(", ")
                        : "None"
                    }`}
                  />
                </ListItem>
              </List>
            </Card>
          </Box>

          <Card variant="outlined" sx={{ p: 2, borderRadius: 5, boxShadow: 0 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="h5" component="h3" gutterBottom>
                Malicious
              </Typography>
              <GaugeChart
                id="gauge-chart5"
                style={{ width: "100%" }}
                animate={false}
                arcsLength={[0.2, 0.5, 0.3]}
                colors={["#5BE12C", "#F5CD19", "#EA4228"]}
                textColor="#5E5E5E"
                percent={result.data["abuseConfidenceScore"] / 100}
                arcPadding={0.02}
              />
            </Box>
          </Card>
        </Box>
      )}
    </>
  );

  return (
    <>
      <ResultRow
        name="AbuseIPDB"
        id="abuseipdb"
        icon="aipdb_logo_small"
        loading={loading}
        result={result}
        summary={score + "% malicious"}
        summary_color={{ color: null }}
        color={score === 0 ? "green" : score <= 60 ? "orange" : "red"}
        error={error}
        details={details}
      />
    </>
  );
}
