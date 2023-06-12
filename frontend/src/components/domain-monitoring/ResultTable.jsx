import React from "react";
import axios from "axios";
import { format, parseISO } from "date-fns";
import ReactCountryFlag from "react-country-flag";

import Domain from "../ioc-analyzer/Domain";
import Ipv4 from "../ioc-analyzer/Ipv4";

import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import Box from "@mui/material/Box";
import BusinessIcon from "@mui/icons-material/Business";
import Button from "@mui/material/Button";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CategoryIcon from "@mui/icons-material/Category";
import CircleIcon from "@mui/icons-material/Circle";
import Collapse from "@mui/material/Collapse";
import DateRangeIcon from "@mui/icons-material/DateRange";
import DomainVerificationIcon from "@mui/icons-material/DomainVerification";
import Grid from "@mui/material/Grid";
import Grow from "@mui/material/Grow";
import HttpIcon from "@mui/icons-material/Http";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import LanIcon from "@mui/icons-material/Lan";
import LinearProgress from "@mui/material/LinearProgress";
import LanguageIcon from "@mui/icons-material/Language";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Stack from "@mui/material/Stack";
import StorageIcon from "@mui/icons-material/Storage";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Paper,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import useTheme from "@mui/material/styles/useTheme";

export default function ResultTable(props) {
  const theme = useTheme();
  const [response, setResponse] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(15);

  React.useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8000/api/url/urlscanio/" + props.domain)
      .then((response) => {
        setResponse(response.data);
        setLoading(false);
      });
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading)
    return (
      <>
        <br />
        <LinearProgress />
        <br />
        <br />
      </>
    );
  if (!response) return null;

  function ipAnalysis(props) {
    const ioc = props;
    return (
      <>
        <br />
        <br />
        <Paper sx={{ MdRoundedCorner: true, borderRadius: 5 }}>
          <Table sx={{ size: "small" }}>
            <TableBody sx={{ width: "100%" }}>
              <Ipv4 ioc={ioc} />
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
              <Domain ioc={ioc} />
            </TableBody>
          </Table>
        </Paper>
        <br />
      </>
    );
  }

  function Row(props) {
    const section = props.row;
    const [open, setOpen] = React.useState(false);
    const [showIpAnalysis, setShowIpAnalysis] = React.useState(false);
    const [showDomainAnalysis, setShowDomainAnalysis] = React.useState(false);

    function Status(props) {
      const status = props;
      if (String(status).startsWith(2)) {
        return <CircleIcon sx={{ color: "green", fontSize: "small" }} />;
      } else if (String(status).startsWith(4)) {
        return <CircleIcon sx={{ color: "orange", fontSize: "small" }} />;
      } else if (String(status).startsWith(5)) {
        return <CircleIcon sx={{ color: "red", fontSize: "small" }} />;
      } else if (status === null) {
        return <></>;
      } else {
        return <CircleIcon sx={{ color: "darkgrey", fontSize: "small" }} />;
      }
    }

    return (
      <>
        <TableRow
          key={section["task"]["uuid"]}
          sx={{ bgcolor: theme.palette.background.tablecell }}
        >
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell>
            <ReactCountryFlag countryCode={section["page"]["country"]} />
            &nbsp;&nbsp;
            {section["task"]["domain"]}
          </TableCell>
          <TableCell>
            {Status(section["page"]["status"])}
            &nbsp;{section["page"]["status"]}
          </TableCell>
          <TableCell>
            {format(parseISO(section["task"]["time"]), "dd.MM.yyyy - hh:mm")}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell
            style={{
              paddingBottom: 0,
              paddingTop: 0,
              backgroundColor: theme.palette.background.card,
              overflowWrap: "anywhere",
            }}
            colSpan={6}
          >
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Card
                  variant="outlined"
                  key={"screenshot_card_" + section["task"]["uuid"]}
                  sx={{
                    m: 1,
                    p: 2,
                    borderRadius: 5,
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
                      href={section["screenshot"]}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={section["screenshot"]}
                        alt="Website screenshot"
                        style={{
                          width: "250px",
                          float: "right",
                          borderRadius: "15px",
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
                    borderRadius: 5,
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
                              secondary={section["page"]["ip"]}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <LanguageIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary="Country"
                              secondary={section["page"]["country"]}
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
                              secondary={section["page"]["url"]}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <OpenInNewIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary="Result"
                              secondary={section["result"]}
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
                  sx={{ m: 1, p: 1, borderRadius: 5, boxShadow: 0 }}
                >
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <List>
                          <ListItem>
                            <ListItemIcon>
                              {String(section["page"]["status"]).startsWith(
                                2
                              ) ? (
                                <CircleIcon sx={{ color: "green" }} />
                              ) : String(section["page"]["status"]).startsWith(
                                  4
                                ) ? (
                                <CircleIcon sx={{ color: "orange" }} />
                              ) : String(section["page"]["status"]).startsWith(
                                  5
                                ) ? (
                                <CircleIcon sx={{ color: "red" }} />
                              ) : (
                                <CircleIcon sx={{ color: "darkgrey" }} />
                              )}
                            </ListItemIcon>
                            <ListItemText
                              primary="Status code"
                              secondary={section["page"]["status"]}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <StorageIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary="Server"
                              secondary={section["page"]["server"]}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <CategoryIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary="MIME type"
                              secondary={section["page"]["mimeType"]}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <BusinessIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary="ASN Name"
                              secondary={section["page"]["asnname"]}
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
                              secondary={section["page"]["tlsValidDays"]}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <DateRangeIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary="TLS age in days"
                              secondary={section["page"]["tlsAgeDays"]}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <CalendarMonthIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary="TLS valid from"
                              secondary={section["page"]["tlsValidFrom"]}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <AdminPanelSettingsIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary="TLS issuer"
                              secondary={section["page"]["tlsIssuer"]}
                            />
                          </ListItem>
                        </List>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {showIpAnalysis ? ipAnalysis(section["page"]["ip"]) : <></>}
                {showDomainAnalysis ? (
                  domainAnalysis(section["task"]["domain"])
                ) : (
                  <></>
                )}
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  }

  return (
    <>
      <Grow in={true}>
        <TableContainer
          component={Paper}
          sx={{
            boxShadow: 0,
            borderRadius: 5,
            border: 1,
            borderColor: theme.palette.background.tableborder,
          }}
        >
          <Table aria-label="result_table">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ bgcolor: theme.palette.background.tableheader }}
                />
                <TableCell
                  sx={{
                    bgcolor: theme.palette.background.tableheader,
                    fontWeight: "bold",
                  }}
                >
                  Domain
                </TableCell>
                <TableCell
                  sx={{
                    bgcolor: theme.palette.background.tableheader,
                    fontWeight: "bold",
                  }}
                >
                  Status code
                </TableCell>
                <TableCell
                  sx={{
                    bgcolor: theme.palette.background.tableheader,
                    fontWeight: "bold",
                    textAlign: "left",
                  }}
                >
                  Found
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {response ? (
                response
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((section) => {
                    return <Row key={section["task"]["uuid"]} row={section} />;
                  })
              ) : (
                <TableRow>
                  <TableCell>No Data</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[15, 25, 50, 75, 100]}
            component="div"
            count={response.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Grow>
    </>
  );
}
