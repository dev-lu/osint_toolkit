import React from "react";
import api from "../../../../api";
import { useEffect, useState } from "react";
import { PieChart, Pie } from "recharts";

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
import { Typography } from "@mui/material";

import ResultRow from "../../ResultRow";

export default function AbuseIpdb(props) {
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
    } else if (score >= 1 && score <= 59) {
      return colors.orange;
    } else if (score >= 60 && score <= 100) {
      return colors.red;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const url = "/api/ip/abuseipdb/" + props.ioc;
        const response = await api.get(url);
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
                    <CheckCircleOutlineIcon
                      sx={{ color: getCircleFillColor(score) }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Score: ${result.data["abuseConfidenceScore"]}% malicious`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <FileCopyOutlinedIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Total reports: ${result.data["totalReports"]}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <PeopleOutlinedIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Number of reporting users: ${result.data["numDistinctUsers"]}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <ScheduleOutlinedIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Last report: ${result.data["lastReportedAt"]}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <VerifiedUserOutlinedIcon
                      color={
                        result.data["isWhitelisted"] ? "success" : "primary"
                      }
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Whitelisted: ${
                      result.data["isWhitelisted"] ? "Yes" : "No"
                    }`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LanguageOutlinedIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Country code: ${result.data["countryCode"]}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <RouterOutlinedIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={`ISP: ${result.data["isp"]}`} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <DomainOutlinedIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={`Domain: ${result.data["domain"]}`} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CategoryOutlinedIcon color="primary" />
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
                    <DnsOutlinedIcon color="primary" />
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
