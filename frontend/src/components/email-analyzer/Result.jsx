import React from "react";
import dompurify from "dompurify";

import Email from "../ioc-analyzer/Email.jsx";
import Hash from "../ioc-analyzer/Hash.jsx";
import OpenAi from "./ShowOpenAiAnswer.jsx";
import Url from "../ioc-analyzer/Url.jsx";

import Alert from "@mui/material/Alert";
import { AlertTitle } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ChatIcon from "@mui/icons-material/Chat";
import DescriptionIcon from "@mui/icons-material/Description";
import Grid from "@mui/material/Grid";
import Grow from "@mui/material/Grow";
import HorizontalSplitIcon from "@mui/icons-material/HorizontalSplit";
import InfoIcon from "@mui/icons-material/Info";
import LinkIcon from "@mui/icons-material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Paper from "@mui/material/Paper";
import PersonIcon from "@mui/icons-material/Person";
import ReplyIcon from "@mui/icons-material/Reply";
import RouteIcon from "@mui/icons-material/Route";
import SubjectIcon from "@mui/icons-material/Subject";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import ThreePIcon from "@mui/icons-material/ThreeP";
import Typography from "@mui/material/Typography";
import useTheme from "@mui/material/styles/useTheme";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

export default function Result(props) {
  const theme = useTheme();
  const card_style = {
    p: 2,
    mt: 2,
    backgroundColor: theme.palette.background.card,
    boxShadow: 0,
    borderRadius: 5,
  };

  const tableCellStyle = {
    backgroundColor: theme.palette.background.tablecell,
  };

  const tableContainerStyle = {
    borderRadius: 5,
    maxWidth: "95%",
    boxShadow: 0,
    border: 0,
    borderColor: "lightgrey",
    m: 2,
  };

  const result = props.result;

  const [showHashAnalysisAttachements, setShowHashAnalysisAttachements] =
    React.useState(false);
  function hashAnalysis(props) {
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

  const [url, setUrl] = React.useState(null);
  const [showUrlAnalyse, setShowUrlAnalyse] = React.useState(false);
  function urlAnalyse(props) {
    return (
      <>
        <br />
        <br />
        <Url ioc={url} />
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

  function showAttachements() {
    if (result["attachments"].length > 0) {
      return result["attachments"].map((row, index) => (
        <React.Fragment key={index}>
          <TableContainer sx={tableContainerStyle}>
            <Table aria-label="simple table" sx={tableCellStyle}>
              <TableHead>
                <TableRow>
                  <TableCell
                    colSpan={3}
                    sx={{ backgroundColor: theme.palette.background.tablecell }}
                  >
                    <Typography
                      sx={{ flex: "1 1 100%" }}
                      variant="h6"
                      id={row.md5}
                      component="div"
                    >
                      <b>
                        {row.filename != null
                          ? row.filename
                          : "Unknown filename"}
                      </b>
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell align="left" sx={{ overflowWrap: "anywhere" }}>
                    {" "}
                    <b> MD5 </b>{" "}
                  </TableCell>
                  <TableCell align="left" sx={{ overflowWrap: "anywhere" }}>
                    {" "}
                    {row.md5}{" "}
                  </TableCell>
                  <TableCell align="left" sx={{ overflowWrap: "anywhere" }}>
                    <Button
                      variant="outlined"
                      disableElevation
                      size="small"
                      onClick={() =>
                        setShowHashAnalysisAttachements(
                          !showHashAnalysisAttachements
                        )
                      }
                      sx={{ float: "right" }}
                    >
                      Analyze
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left" sx={{ overflowWrap: "anywhere" }}>
                    {" "}
                    <b> SHA1 </b>{" "}
                  </TableCell>
                  <TableCell align="left" sx={{ overflowWrap: "anywhere" }}>
                    {" "}
                    {row.sha1}{" "}
                  </TableCell>
                  <TableCell align="left" sx={{ overflowWrap: "anywhere" }}>
                    <Button
                      variant="outlined"
                      disableElevation
                      size="small"
                      onClick={() =>
                        setShowHashAnalysisAttachements(
                          !showHashAnalysisAttachements
                        )
                      }
                      sx={{ float: "right" }}
                    >
                      Analyze
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left" sx={{ overflowWrap: "anywhere" }}>
                    {" "}
                    <b> SHA256 </b>{" "}
                  </TableCell>
                  <TableCell align="left" sx={{ overflowWrap: "anywhere" }}>
                    {" "}
                    {row.sha256}{" "}
                  </TableCell>
                  <TableCell align="left" sx={{ overflowWrap: "anywhere" }}>
                    <Button
                      variant="outlined"
                      disableElevation
                      size="small"
                      onClick={() =>
                        setShowHashAnalysisAttachements(
                          !showHashAnalysisAttachements
                        )
                      }
                      sx={{ float: "right" }}
                    >
                      Analyze
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          {showHashAnalysisAttachements ? hashAnalysis(row.md5) : <></>}
        </React.Fragment>
      ));
    } else {
      return <p>No attachments found</p>;
    }
  }

  function showWarnings() {
    if (result["warnings"].length > 0) {
      return (
        <>
          {result["warnings"].map((row, index) => (
            <Alert
              key={"ema_warnings_alert_" + index}
              severity={
                row["warning_tlp"] === "red"
                  ? "error"
                  : row["warning_tlp"] === "orange"
                  ? "warning"
                  : row["warning_tlp"] === "green"
                  ? "success"
                  : "info"
              }
              variant="filled"
              sx={{ mt: 1, borderRadius: 5 }}
            >
              <AlertTitle>
                <b>{row["warning_title"]}</b>
              </AlertTitle>
              {row["warning_message"]}
            </Alert>
          ))}
        </>
      );
    } else {
      return <></>;
    }
  }

  function showHops() {
    if (result["hops"] != null) {
      return (
        <>
          <TableContainer component={Paper} sx={tableContainerStyle}>
            <Table aria-label="simple table" sx={tableCellStyle}>
              <TableHead>
                <TableRow>
                  <TableCell align="left" sx={tableCellStyle}>
                    {" "}
                    <b> Hop </b>{" "}
                  </TableCell>
                  <TableCell align="left" sx={tableCellStyle}>
                    {" "}
                    <b> From </b>{" "}
                  </TableCell>
                  <TableCell align="left" sx={tableCellStyle}>
                    {" "}
                    <b> By </b>{" "}
                  </TableCell>
                  <TableCell align="left" sx={tableCellStyle}>
                    {" "}
                    <b> With </b>{" "}
                  </TableCell>
                  <TableCell align="left" sx={tableCellStyle}>
                    {" "}
                    <b> Date / Time </b>{" "}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {result["hops"].map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="left" sx={{ overflowWrap: "anywhere" }}>
                      {row["number"]}
                    </TableCell>
                    <TableCell align="left" sx={{ overflowWrap: "anywhere" }}>
                      {row["from"]}
                    </TableCell>
                    <TableCell align="left" sx={{ overflowWrap: "anywhere" }}>
                      {row["by"]}
                    </TableCell>
                    <TableCell align="left" sx={{ overflowWrap: "anywhere" }}>
                      {row["with"]}
                    </TableCell>
                    <TableCell align="left" sx={{ overflowWrap: "anywhere" }}>
                      {row["date"]}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      );
    } else {
      return (
        <>
          <p>Could not parse hops...</p>
        </>
      );
    }
  }

  function showHeaderFields() {
    if (result["headers"] != null) {
      return (
        <>
          <TableContainer component={Paper} sx={tableContainerStyle}>
            <Table aria-label="simple table" sx={tableCellStyle}>
              <TableHead>
                <TableRow>
                  <TableCell align="left" sx={tableCellStyle}>
                    {" "}
                    <b> Keys </b>{" "}
                  </TableCell>
                  <TableCell align="left" sx={tableCellStyle}>
                    {" "}
                    <b> Value </b>{" "}
                  </TableCell>
                </TableRow>
              </TableHead>
              {Object.entries(result["headers"]).map((key, index) => (
                <React.Fragment key={index}>
                  <TableBody>
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell align="left">{Object.keys(key[1])}</TableCell>
                      <TableCell align="left" sx={{ overflowWrap: "anywhere" }}>
                        {Object.values(key[1])}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </React.Fragment>
              ))}
            </Table>
          </TableContainer>
        </>
      );
    }
  }

  function showUrls() {
    if (result["urls"].length > 0) {
      return (
        <React.Fragment key="urls_fragment">
          <TableContainer component={Paper} sx={tableContainerStyle}>
            <Table aria-label="simple table" sx={tableCellStyle}>
              <TableBody>
                {result["urls"].map((row, index) => (
                  <TableRow key={index}>
                    <TableCell align="left" sx={{ overflowWrap: "anywhere" }}>
                      {row}
                    </TableCell>
                    <TableCell sx={{ overflowWrap: "anywhere" }}>
                      <Button
                        variant="outlined"
                        disableElevation
                        size="small"
                        onClick={() => {
                          setShowUrlAnalyse(!showUrlAnalyse);
                          setUrl(row);
                        }}
                        sx={{ float: "right", whiteSpace: "nowrap" }}
                      >
                        Analyze
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {showUrlAnalyse ? urlAnalyse(url) : <></>}
        </React.Fragment>
      );
    } else {
      return <p>No URLs found...</p>;
    }
  }

  return (
    <>
      {/* General information card */}
      <Grow in={true}>
        <Card key={"ema_general_info_card"} sx={card_style}>
          <h2>
            <InfoIcon /> General information
          </h2>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    {" "}
                    <PersonIcon />{" "}
                  </ListItemIcon>
                  <ListItemText
                    primary={result["basic_info"]["from"]}
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
                      result["basic_info"]["return-path"]
                        ? result["basic_info"]["return-path"]
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
                    primary={result["basic_info"]["to"]}
                    secondary="To"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    {" "}
                    <CalendarMonthIcon />{" "}
                  </ListItemIcon>
                  <ListItemText
                    primary={result["basic_info"]["date"]}
                    secondary="Date"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    {" "}
                    <SubjectIcon />{" "}
                  </ListItemIcon>
                  <ListItemText
                    primary={result["basic_info"]["subject"]}
                    secondary="Subject"
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6" component="div">
                <b>Hash vaules of the .eml file itself</b>
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    {" "}
                    <DescriptionIcon />{" "}
                  </ListItemIcon>
                  <ListItemText
                    primary={result["eml_hashes"]["md5"]}
                    secondary="MD5"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    {" "}
                    <DescriptionIcon />{" "}
                  </ListItemIcon>
                  <ListItemText
                    primary={result["eml_hashes"]["sha1"]}
                    secondary="SHA1"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    {" "}
                    <DescriptionIcon />{" "}
                  </ListItemIcon>
                  <ListItemText
                    primary={result["eml_hashes"]["sha256"]}
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
          {showHashAnalysisEml
            ? hashAnalysisEml(result["eml_hashes"]["md5"])
            : null}
          {showEmailAnalyse &&
          emailAnalyse(extractEmailAddress(result["basic_info"]["from"])) !=
            null
            ? emailAnalyse(extractEmailAddress(result["basic_info"]["from"]))
            : null}
        </Card>
      </Grow>

      {/* Basic security checks card */}
      <Grow in={true}>
        <Card key={"ema_basic_checks_card"} sx={card_style}>
          <h2>
            <VerifiedUserIcon /> Basic security checks
          </h2>
          {showWarnings()}
        </Card>
      </Grow>

      {/* Attachements card */}
      <Grow in={true}>
        <Card key={"ema_attachements_card"} sx={card_style}>
          <h2>
            <AttachFileIcon /> Attachments ({result["attachments"].length})
          </h2>
          {showAttachements()}
        </Card>
      </Grow>

      {/* URLs card */}
      <Grow in={true}>
        <Card key={"ema_urls_card"} sx={card_style}>
          <h2>
            <LinkIcon /> URLs in body ({result["urls"].length})
          </h2>
          {showUrls()}
        </Card>
      </Grow>

      {/* Hops card */}
      <Grow in={true}>
        <Card key={"ema_hops_card"} sx={card_style}>
          <h2>
            <RouteIcon /> Hops ({result["hops"].length})
          </h2>
          {showHops()}
        </Card>
      </Grow>

      {/* Full header card */}
      <Grow in={true}>
        <Card key={"ema_file_header_card"} sx={card_style}>
          <h2>
            <HorizontalSplitIcon /> Complete Header ({result["headers"].length}{" "}
            fields)
          </h2>
          {showHeaderFields()}
        </Card>
      </Grow>

      {/* Message text card */}
      <Grow in={true}>
        <Card key={"ema_message_text_card"} sx={card_style}>
          <h2>
            <ChatIcon /> Message body (HTML sanitized)
          </h2>
          {dompurify.sanitize(result["message_text"], {
            USE_PROFILES: { html: false, svg: false, svgFilters: false },
          })}
        </Card>
      </Grow>
      <br />
      <div align="center">
        <OpenAi
          input={dompurify.sanitize(result["message_text"], {
            USE_PROFILES: { html: false, svg: false, svgFilters: false },
          })}
        />
      </div>
    </>
  );
}
