import React from "react";

import ResultTable from "../ioc-tools/ioc-lookup/single-lookup/components/ui/ResultTable";

import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import Box from "@mui/material/Box";
import BusinessIcon from "@mui/icons-material/Business";
import Button from "@mui/material/Button";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CategoryIcon from "@mui/icons-material/Category";
import CircleIcon from "@mui/icons-material/Circle";
import DateRangeIcon from "@mui/icons-material/DateRange";
import DomainVerificationIcon from "@mui/icons-material/DomainVerification";
import Grid from "@mui/material/Grid";
import HttpIcon from "@mui/icons-material/Http";
import LanIcon from "@mui/icons-material/Lan";
import LanguageIcon from "@mui/icons-material/Language";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Stack from "@mui/material/Stack";
import StorageIcon from "@mui/icons-material/Storage";
import { Table, TableBody, Paper } from "@mui/material";
import Typography from "@mui/material/Typography";

export default function Details(props) {
  const [showIpAnalysis, setShowIpAnalysis] = React.useState(false);
  const [showDomainAnalysis, setShowDomainAnalysis] = React.useState(false);

  function ipAnalysis(props) {
    const ioc = props;
    return (
      <>
        <br />
        <br />
        <Paper sx={{ MdRoundedCorner: true, borderRadius: 5 }}>
          <Table sx={{ size: "small" }}>
            <TableBody sx={{ width: "100%" }}>
              <ResultTable ioc={ioc} iocType="IPv4" />
            </TableBody>
          </Table>
        </Paper>
        <br />
      </>
    );
  }

  function domainAnalysis(props) {
    const ioc = props;
    return (
      <>
        <br />
        <br />
        <Paper sx={{ MdRoundedCorner: true, borderRadius: 5 }}>
          <Table sx={{ size: "small" }}>
            <TableBody sx={{ width: "100%" }}>
              <ResultTable ioc={ioc} iocType="Domain" />
            </TableBody>
          </Table>
        </Paper>
        <br />
      </>
    );
  }

  return (
    <Box sx={{ margin: 1 }}>
      <Card
        variant="outlined"
        key={"screenshot_card_" + props.section["task"]["uuid"]}
        sx={{
          m: 1,
          p: 2,
          borderRadius: 1,
          boxShadow: 0,
          float: "right",
          height: "100%",
        }}
      >
        <Stack sx={{ float: "right" }}>
          <Typography variant="h6" align="center">
            Screenshot
          </Typography>
          <a
            href={props.section["screenshot"]}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={props.section["screenshot"]}
              alt="Website screenshot"
              style={{
                width: "250px",
                float: "right",
                borderRadius: "1",
              }}
            />
          </a>
        </Stack>
      </Card>

      <Card
        variant="outlined"
        sx={{
          m: 1,
          p: 1,
          borderRadius: 1,
          boxShadow: 0,
          height: "100%",
        }}
      >
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <LanIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="IP"
                    secondary={
                      props.section["page"]["ip"]
                        ? props.section["page"]["ip"]
                        : "N/A"
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LanguageIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Country"
                    secondary={
                      props.section["page"]["country"]
                        ? props.section["page"]["country"]
                        : "N/A"
                    }
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={6}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <HttpIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="URL"
                    secondary={
                      props.section["page"]["url"]
                        ? props.section["page"]["url"]
                        : "N/A"
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <OpenInNewIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Result"
                    secondary={
                      props.section["result"] ? props.section["result"] : "N/A"
                    }
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
          <Button
            variant="outlined"
            disableElevation
            size="small"
            onClick={() => setShowIpAnalysis(!showIpAnalysis)}
          >
            Analyze IP
          </Button>
          &nbsp;&nbsp;
          <Button
            variant="outlined"
            disableElevation
            size="small"
            onClick={() => setShowDomainAnalysis(!showDomainAnalysis)}
          >
            Analyze Domain
          </Button>
        </CardContent>
      </Card>

      <Card
        variant="outlined"
        sx={{ m: 1, p: 1, borderRadius: 1, boxShadow: 0 }}
      >
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    {String(props.section["page"]["status"]).startsWith(2) ? (
                      <CircleIcon sx={{ color: "green" }} />
                    ) : String(props.section["page"]["status"]).startsWith(
                        4
                      ) ? (
                      <CircleIcon sx={{ color: "orange" }} />
                    ) : String(props.section["page"]["status"]).startsWith(
                        5
                      ) ? (
                      <CircleIcon sx={{ color: "red" }} />
                    ) : (
                      <CircleIcon sx={{ color: "darkgrey" }} />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary="Status code"
                    secondary={
                      props.section["page"]["status"]
                        ? props.section["page"]["status"]
                        : "N/A"
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <StorageIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Server"
                    secondary={
                      props.section["page"]["server"]
                        ? props.section["page"]["server"]
                        : "N/A"
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CategoryIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="MIME type"
                    secondary={
                      props.section["page"]["mimeType"]
                        ? props.section["page"]["mimeType"]
                        : "N/A"
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <BusinessIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="ASN Name"
                    secondary={
                      props.section["page"]["asnname"]
                        ? props.section["page"]["asnname"]
                        : "N/A"
                    }
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={6}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <DomainVerificationIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="TLS valid days"
                    secondary={
                      props.section["page"]["tlsValidDays"]
                        ? props.section["page"]["tlsValidDays"]
                        : "N/A"
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <DateRangeIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="TLS age in days"
                    secondary={
                      props.section["page"]["tlsAgeDays"]
                        ? props.section["page"]["tlsAgeDays"]
                        : "N/A"
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CalendarMonthIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="TLS valid from"
                    secondary={
                      props.section["page"]["tlsValidFrom"]
                        ? props.section["page"]["tlsValidFrom"]
                        : "N/A"
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AdminPanelSettingsIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="TLS issuer"
                    secondary={
                      props.section["page"]["tlsIssuer"]
                        ? props.section["page"]["tlsIssuer"]
                        : "N/A"
                    }
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {showIpAnalysis ? ipAnalysis(props.section["page"]["ip"]) : <></>}
      {showDomainAnalysis ? (
        domainAnalysis(props.section["task"]["domain"])
      ) : (
        <></>
      )}
    </Box>
  );
}
