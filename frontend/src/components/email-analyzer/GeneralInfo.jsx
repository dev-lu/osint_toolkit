import React, { useState } from "react";

import CardHeader from "../styled/CardHeader";
import Email from "../ioc-analyzer/Email";
import Hash from "../ioc-analyzer/Hash";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Collapse,
  Grid,
  Grow,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  useTheme,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import DescriptionIcon from "@mui/icons-material/Description";
import GroupsIcon from "@mui/icons-material/Groups";
import InfoIcon from "@mui/icons-material/Info";
import PersonIcon from "@mui/icons-material/Person";
import ReplyIcon from "@mui/icons-material/Reply";
import SubjectIcon from "@mui/icons-material/Subject";
import ThreePIcon from "@mui/icons-material/ThreeP";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export default function GeneralInfo(props) {
  const theme = useTheme();
  const [open, setOpen] = useState(true);

  const card_style = {
    p: 1,
    mt: 2,
    backgroundColor: theme.palette.background.tablecell,
    boxShadow: 0,
    borderRadius: 5,
  };

  const [showHashAnalysisEml, setShowHashAnalysisEml] = React.useState(false);
  function hashAnalysisEml(props) {
    const ioc = props;
    return (
      <>
        <br />
        <br />
        <Hash ioc={ioc} />
        <br />
      </>
    );
  }

  const [showEmailAnalyse, setShowEmailAnalyse] = React.useState(false);
  function emailAnalyse(props) {
    const ioc = props;
    return (
      <>
        <br />
        <br />
        <Email ioc={ioc} />
        <br />
      </>
    );
  }

  const extractEmailAddress = (inputString) => {
    const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
    const matches = inputString.match(emailRegex);
    if (matches && matches.length > 0) {
      return matches[0];
    } else {
      return null;
    }
  };

  return (
    <>
      {/* General information card */}
      <Grow in={true}>
        <Card key={"ema_general_info_card"} sx={card_style}>
          <CardActionArea onClick={() => setOpen(!open)} sx={{ padding: '4px' }}>
            <CardContent sx={{ padding: '2px' }}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                width="100%"
              >
                <CardHeader text={"General information"} icon={<InfoIcon />} />
                <IconButton size="small">
                  {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              </Box>
            </CardContent>
          </CardActionArea>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      {" "}
                      <PersonIcon />{" "}
                    </ListItemIcon>
                    <ListItemText
                      primary={props.result["from"]}
                      secondary="From"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      {" "}
                      <ReplyIcon />{" "}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        props.result["return-path"]
                          ? props.result["return-path"]
                          : "N/A"
                      }
                      secondary="Reply To"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      {" "}
                      <ThreePIcon />{" "}
                    </ListItemIcon>
                    <ListItemText
                      primary={props.result["to"] ? props.result["to"] : "N/A"}
                      secondary="To"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      {" "}
                      <ContactMailIcon />{" "}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        props.result["delivered-to"] || props.result["rcpt-to"]
                          ? (props.result["delivered-to"] || "") +
                            (props.result["rcpt-to"] || "")
                          : "N/A"
                      }
                      secondary="Delivered to / RCPT To"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      {" "}
                      <GroupsIcon />{" "}
                    </ListItemIcon>
                    <ListItemText
                      primary={props.result["cc"] ? props.result["cc"] : "N/A"}
                      secondary="CC"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      {" "}
                      <CalendarMonthIcon />{" "}
                    </ListItemIcon>
                    <ListItemText
                      primary={props.result["date"]}
                      secondary="Date"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      {" "}
                      <SubjectIcon />{" "}
                    </ListItemIcon>
                    <ListItemText
                      primary={props.result["subject"]}
                      secondary="Subject"
                    />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" component="div">
                  <b>Hash values of the .eml file itself</b>
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      {" "}
                      <DescriptionIcon />{" "}
                    </ListItemIcon>
                    <ListItemText
                      primary={props.hashes["md5"]}
                      secondary="MD5"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      {" "}
                      <DescriptionIcon />{" "}
                    </ListItemIcon>
                    <ListItemText
                      primary={props.hashes["sha1"]}
                      secondary="SHA1"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      {" "}
                      <DescriptionIcon />{" "}
                    </ListItemIcon>
                    <ListItemText
                      primary={props.hashes["sha256"]}
                      secondary="SHA256"
                    />
                  </ListItem>
                </List>
                <Button
                  variant="outlined"
                  disableElevation
                  size="small"
                  onClick={() => setShowHashAnalysisEml(!showHashAnalysisEml)}
                  sx={{ float: "left" }}
                >
                  Analyze .eml hash
                </Button>
                <Button
                  variant="outlined"
                  disableElevation
                  size="small"
                  onClick={() => setShowEmailAnalyse(!showEmailAnalyse)}
                  sx={{ float: "left", ml: 2 }}
                >
                  Analyze sender address
                </Button>
              </Grid>
            </Grid>
            {showHashAnalysisEml ? hashAnalysisEml(props.hashes["md5"]) : null}
            {showEmailAnalyse &&
            emailAnalyse(extractEmailAddress(props.result["from"])) != null
              ? emailAnalyse(extractEmailAddress(props.result["from"]))
              : null}
          </Collapse>
        </Card>
      </Grow>
    </>
  );
}
