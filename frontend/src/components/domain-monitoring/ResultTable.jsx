import React from "react";
import axios from "axios";
import { format, parseISO } from "date-fns";
import ReactCountryFlag from "react-country-flag";

import Domain from "../ioc-analyzer/Domain";
import Ipv4 from "../ioc-analyzer/Ipv4";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CircleIcon from "@mui/icons-material/Circle";
import Collapse from "@mui/material/Collapse";
import Grow from "@mui/material/Grow";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Paper
} from "@mui/material";
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

  function ipAnalyse(props) {
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

  function domainAnalyse(props) {
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
    const [showIpAnalyse, setShowIpAnalyse] = React.useState(false);
    const [showDomainAnalyse, setShowDomainAnalyse] = React.useState(false);

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
        <TableRow key={section["task"]["uuid"]} sx={{bgcolor: theme.palette.background.tablecell}}>
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
                <br />
                <Card
                  variant="outlined"
                  sx={{
                    m: 1,
                    p: 2,
                    borderRadius: 5,
                    boxShadow: 0,
                    float: "right",
                  }}
                >
                  <Stack sx={{ float: "right" }}>
                    <h2 align="center">Screenshot</h2>
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
                          border: "1px solid #a5a4a4",
                          padding: "5px",
                        }}
                      />
                    </a>
                  </Stack>
                </Card>
                <Card
                  variant="outlined"
                  sx={{ m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}
                >
                  <p>
                    <b>IP: </b>
                    {section["page"]["ip"]}
                  </p>
                  <p>
                    <b>Country: </b> {section["page"]["country"]}
                  </p>
                </Card>
                <Card
                  variant="outlined"
                  sx={{ m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}
                >
                  <p>
                    <b>Status code: </b>
                    {section["page"]["status"]}
                  </p>
                  <p>
                    <b>Server: </b>
                    {section["page"]["server"]}
                  </p>
                  <p>
                    <b>MIME type: </b>
                    {section["page"]["mimeType"]}
                  </p>
                  <p>
                    <b>ASN Name: </b>
                    {section["page"]["asnname"]}
                  </p>
                </Card>
                <Card
                  variant="outlined"
                  sx={{ m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}
                >
                  <p>
                    <b>TLS valid days: </b>
                    {section["page"]["tlsValidDays"]}
                  </p>
                  <p>
                    <b>TLS age in days: </b>
                    {section["page"]["tlsAgeDays"]}
                  </p>
                  <p>
                    <b>TLS valid from: </b>
                    {section["page"]["tlsValidFrom"]}
                  </p>
                  <p>
                    <b>TLS issuer: </b>
                    {section["page"]["tlsIssuer"]}
                  </p>
                </Card>
                <Card
                  variant="outlined"
                  sx={{ m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}
                >
                  <p>
                    <b>URL: </b>
                    {section["page"]["url"]}
                  </p>
                  <br />
                  <p>
                    <b>Result: </b>{" "}
                    <a
                      href={section["result"]}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {" "}
                      {section["result"]}{" "}
                    </a>
                  </p>
                  <br />
                  <Button
                    variant="outlined"
                    disableElevation
                    size="small"
                    onClick={() => setShowIpAnalyse(!showIpAnalyse)}
                  >
                    Analyse IP
                  </Button>
                  &nbsp;&nbsp;
                  <Button
                    variant="outlined"
                    disableElevation
                    size="small"
                    onClick={() => setShowDomainAnalyse(!showDomainAnalyse)}
                  >
                    Analyse Domain
                  </Button>
                </Card>
                {showIpAnalyse ? ipAnalyse(section["page"]["ip"]) : <></>}
                {showDomainAnalyse ? (
                  domainAnalyse(section["task"]["domain"])
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
              <TableCell sx={{ bgcolor: theme.palette.background.tableheader }}/>
              <TableCell sx={{ bgcolor: theme.palette.background.tableheader, fontWeight: "bold" }}>Domain</TableCell>
              <TableCell sx={{ bgcolor: theme.palette.background.tableheader, fontWeight: "bold" }}>Status code</TableCell>
              <TableCell sx={{ bgcolor: theme.palette.background.tableheader, fontWeight: "bold", textAlign: "left" }}>
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
          <TablePagination
            rowsPerPageOptions={[15, 25, 50, 75, 100]}
            component="div"
            count={response.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Table>
      </TableContainer>
      </Grow>
    </>
  );
}
