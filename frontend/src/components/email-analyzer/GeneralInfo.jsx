import React, { useState } from "react";
import ResultTable from "../ioc-tools/ioc-lookup/single-lookup/components/ui/ResultTable";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function GeneralInfo(props) {
  const [showHashAnalysisEml, setShowHashAnalysisEml] = useState(false);
  const [showEmailAnalyse, setShowEmailAnalyse] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const handleAccordionChange = () => {
    setExpanded(!expanded);
  };

  function hashAnalysisEml(props) {
    const ioc = props;
    const getHashType = (ioc) => {
      if (!ioc) return "MD5";
      
      const hashLength = ioc.length;
      if (hashLength === 32) return "MD5";
      if (hashLength === 40) return "SHA1";
      if (hashLength === 64) return "SHA256";
      return "MD5"; // Default
    };
    return (
      <Box mt={2}>
        <ResultTable ioc={ioc} iocType={getHashType(ioc)} />
      </Box>
    );
  }

  function emailAnalyse(props) {
    const ioc = props;
    return (
      <Box mt={2}>
        <ResultTable ioc={ioc} iocType="Email" />
      </Box>
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
    <Accordion 
      expanded={expanded} 
      onChange={handleAccordionChange}
      sx={{ mt: 2, borderRadius: 2, '&.MuiPaper-root': { boxShadow: 0, border: '1px solid rgba(0, 0, 0, 0.12)' } }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="general-info-content"
        id="general-info-header"
        sx={{ minHeight: '48px', padding: '0 16px' }}
      >
        <Box display="flex" alignItems="center">
          <InfoIcon sx={{ mr: 1 }} />
          <Typography variant="subtitle1" fontWeight="medium">General information</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 1 }}>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={props.result["from"]}
                  secondary="From"
                  primaryTypographyProps={{ variant: 'body2' }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ReplyIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    props.result["return-path"]
                      ? props.result["return-path"]
                      : "N/A"
                  }
                  secondary="Reply To"
                  primaryTypographyProps={{ variant: 'body2' }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ThreePIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={props.result["to"] ? props.result["to"] : "N/A"}
                  secondary="To"
                  primaryTypographyProps={{ variant: 'body2' }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ContactMailIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    props.result["delivered-to"] || props.result["rcpt-to"]
                      ? (props.result["delivered-to"] || "") +
                        (props.result["rcpt-to"] || "")
                      : "N/A"
                  }
                  secondary="Delivered to / RCPT To"
                  primaryTypographyProps={{ variant: 'body2' }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <GroupsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={props.result["cc"] ? props.result["cc"] : "N/A"}
                  secondary="CC"
                  primaryTypographyProps={{ variant: 'body2' }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CalendarMonthIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={props.result["date"]}
                  secondary="Date"
                  primaryTypographyProps={{ variant: 'body2' }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <SubjectIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={props.result["subject"]}
                  secondary="Subject"
                  primaryTypographyProps={{ variant: 'body2' }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Hash values of the .eml file itself
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <DescriptionIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={props.hashes["md5"]}
                  secondary="MD5"
                  primaryTypographyProps={{ variant: 'body2' }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <DescriptionIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={props.hashes["sha1"]}
                  secondary="SHA1"
                  primaryTypographyProps={{ variant: 'body2' }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <DescriptionIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={props.hashes["sha256"]}
                  secondary="SHA256"
                  primaryTypographyProps={{ variant: 'body2' }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
              </ListItem>
            </List>
            <Box mt={1}>
              <Button
                variant="outlined"
                disableElevation
                size="small"
                onClick={() => setShowHashAnalysisEml(!showHashAnalysisEml)}
                sx={{ mr: 1 }}
              >
                Analyze .eml hash
              </Button>
              <Button
                variant="outlined"
                disableElevation
                size="small"
                onClick={() => setShowEmailAnalyse(!showEmailAnalyse)}
              >
                Analyze sender address
              </Button>
            </Box>
          </Grid>
        </Grid>
        {showHashAnalysisEml ? hashAnalysisEml(props.hashes["md5"]) : null}
        {showEmailAnalyse &&
        emailAnalyse(extractEmailAddress(props.result["from"])) != null
          ? emailAnalyse(extractEmailAddress(props.result["from"]))
          : null}
      </AccordionDetails>
    </Accordion>
  );
}
