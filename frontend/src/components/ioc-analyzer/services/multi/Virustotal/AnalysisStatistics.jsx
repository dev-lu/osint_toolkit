import React from "react";
import { PieChart, Pie, ResponsiveContainer } from "recharts";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import PeopleIcon from "@mui/icons-material/People";
import PollOutlinedIcon from "@mui/icons-material/PollOutlined";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";

export default function AnalysisStatistics(props) {
  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: "#6AAB8E",
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: "red",
    },
  }));

  return (
    <Card
      key={"statistics_card"}
      variant="outlined"
      sx={{
        mb: 1,
        p: 2,
        borderRadius: 5,
        boxShadow: 0,
        width: "calc(50% - 10px)",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={6}>
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
                  props.result["data"]["attributes"]["last_analysis_stats"][
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
                  props.result["data"]["attributes"]["last_analysis_stats"][
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
                  props.result["data"]["attributes"]["last_analysis_stats"][
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
                  props.result["data"]["attributes"]["last_analysis_stats"][
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
                  props.result["data"]["attributes"]["last_analysis_stats"][
                    "timeout"
                  ]
                }
              />
            </ListItem>
          </List>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{ display: "flex", alignItems: "center" }}
        >
          <ResponsiveContainer width="80%" height="80%">
            <PieChart width={250} height={250}>
              <Pie
                data={[
                  { name: "malcount", value: props.malCount },
                  {
                    name: "suspicious",
                    value:
                      props.result["data"]["attributes"]["last_analysis_stats"][
                        "suspicious"
                      ],
                    fill: "#F5BB00",
                  },
                  {
                    name: "harmless",
                    value:
                      props.result["data"]["attributes"]["last_analysis_stats"][
                        "harmless"
                      ],
                    fill: "#6AAB8E",
                  },
                  {
                    name: "undetected",
                    value:
                      props.result["data"]["attributes"]["last_analysis_stats"][
                        "undetected"
                      ],
                    fill: "grey",
                  },
                  {
                    name: "timeout",
                    value:
                      props.result["data"]["attributes"]["last_analysis_stats"][
                        "timeout"
                      ],
                    fill: "grey",
                  },
                  {
                    name: "Remaining",
                    value:
                      props.totalEngines -
                      (props.malCount +
                        props.result["data"]["attributes"][
                          "last_analysis_stats"
                        ]["harmless"] +
                        props.result["data"]["attributes"][
                          "last_analysis_stats"
                        ]["suspicious"] +
                        props.result["data"]["attributes"][
                          "last_analysis_stats"
                        ]["undetected"] +
                        props.result["data"]["attributes"][
                          "last_analysis_stats"
                        ]["timeout"]),
                    fill: "#d3d3d3",
                  },
                ]}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                innerRadius="80%"
                outerRadius="100%"
                minAngle={1}
                domain={[0, props.totalEngines]}
                stroke="none"
                strokeWidth={0}
                fill="red"
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
                    variant="h3"
                    color={
                      props.malCount > 0
                        ? "red"
                        : props.result["data"]["attributes"][
                            "last_analysis_stats"
                          ]["suspicious"] > 0
                        ? "#F5BB00"
                        : "#6AAB8E"
                    }
                    sx={{ textAlign: "center" }}
                    textAnchor="middle"
                  >
                    <text x="50%" y="50%">
                      {props.malCount}
                    </text>
                  </Typography>
                  <Typography
                    variant="h5"
                    color="textSecondary"
                    sx={{ textAlign: "center" }}
                    textAnchor="middle"
                  >
                    <text x="50%" y="50%">
                      / {props.totalEngines}
                    </text>
                  </Typography>
                </div>
              </foreignObject>
            </PieChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>

      <Divider>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <PeopleIcon />
          <Typography variant="body1" sx={{ ml: 1 }}>
            Community
          </Typography>
        </Box>
      </Divider>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <List>
            <ListItem alignItems="flex-start">
              <ListItemIcon>
                <ThumbUpOutlinedIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Voted harmless"
                secondary={
                  props.result["data"]["attributes"]["total_votes"]["harmless"]
                }
              />
            </ListItem>
            <ListItem alignItems="flex-start">
              <ListItemIcon>
                <ThumbDownOutlinedIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Voted malicious"
                secondary={
                  props.result["data"]["attributes"]["total_votes"]["malicious"]
                }
              />
            </ListItem>
          </List>
        </Grid>

        <Grid item xs={6}>
          <List>
            <ListItem alignItems="flex-start">
              <ListItemIcon>
                <PollOutlinedIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Reputation"
                secondary={props.result["data"]["attributes"]["reputation"]}
              />
            </ListItem>
            <ListItem alignItems="flex-start">
              <ListItemIcon>
                <CalendarMonthOutlinedIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Last modification"
                secondary={`${new Date(
                  props.result.data.attributes.last_modification_date * 1000
                ).toLocaleDateString()} ${new Date(
                  props.result["data"]["attributes"]["last_modification_date"] *
                    1000
                ).toLocaleTimeString()}`}
              />
            </ListItem>
          </List>
        </Grid>
      </Grid>
      {props.result["data"]["attributes"]["total_votes"]["malicious"] === 0 &&
      props.result["data"]["attributes"]["total_votes"]["harmless"] ===
        0 ? null : (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ width: "100%", m: 1 }}>
            <BorderLinearProgress
              variant="determinate"
              value={
                (props.result["data"]["attributes"]["total_votes"][
                  "malicious"
                ] /
                  (props.result["data"]["attributes"]["total_votes"][
                    "harmless"
                  ] +
                    props.result["data"]["attributes"]["total_votes"][
                      "malicious"
                    ])) *
                100
              }
            />
          </Box>
        </Box>
      )}
    </Card>
  );
}
