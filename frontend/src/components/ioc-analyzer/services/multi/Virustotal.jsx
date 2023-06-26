import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";

import StarIcon from "@mui/icons-material/Star";

import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { styled } from "@mui/material/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";
import { Typography } from "@mui/material";
import useTheme from "@mui/material/styles/useTheme";

import NoDetails from "../NoDetails";
import ResultRow from "../../ResultRow";
import Details from "./Virustotal/Details";
import AnalysisStatistics from "./Virustotal/AnalysisStatistics";
import Tags from "./Virustotal/Tags";

export default function Virustotal(props) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [malCount, setMalCount] = useState(null);
  const [totalEngines, setTotalEngines] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const theme = useTheme();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url =
          "http://localhost:8000/api/" +
          props.type +
          "/virustotal?ioc=" +
          encodeURIComponent(props.ioc);
        const response = await axios.get(url);
        setResult(response.data);
        setMalCount(
          response.data.data.attributes.last_analysis_stats.malicious
        );
        setTotalEngines(
          response.data.data.attributes.last_analysis_stats.harmless +
            response.data.data.attributes.last_analysis_stats.malicious +
            response.data.data.attributes.last_analysis_stats.suspicious +
            response.data.data.attributes.last_analysis_stats.timeout +
            response.data.data.attributes.last_analysis_stats.undetected
        );
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
        result.data ? (
          <Box sx={{ margin: 1 }}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "stretch",
                height: "100%",
              }}
            >
              <Details malCount={malCount} result={result} />
              <AnalysisStatistics
                malCount={malCount}
                totalEngines={totalEngines}
                result={result}
              />
            </div>

            {result["data"]["attributes"]["tags"] &&
            result["data"]["attributes"]["tags"].length > 0 ? (
              <Tags result={result} />
            ) : null}

            {result["data"]["attributes"]["type_tags"] &&
            result["data"]["attributes"]["type_tags"].length > 0 ? (
              <Card
                variant="outlined"
                key="tags_card"
                sx={{ m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}
              >
                <Typography variant="h5" component="h2" gutterBottom>
                  Type tags
                </Typography>
                {result["data"]["attributes"]["type_tags"].length > 0 ? (
                  <>
                    {result["data"]["attributes"]["type_tags"].map(
                      (tag, index) => (
                        <React.Fragment key={index}>
                          <Chip label={tag} sx={{ m: 0.5 }} />
                          {index !==
                            result["data"]["attributes"]["type_tags"].length -
                              1}
                        </React.Fragment>
                      )
                    )}
                  </>
                ) : (
                  <p>None</p>
                )}
              </Card>
            ) : null}

            {result["data"]["attributes"]["crowdsourced_context"] &&
            result["data"]["attributes"]["crowdsourced_context"].length > 0 ? (
              <Card
                key="crowdsourced_context_card"
                variant="outlined"
                sx={{ m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}
              >
                <Typography variant="h5" component="h2" gutterBottom>
                  Crowdsourced context
                </Typography>
                {result["data"]["attributes"]["crowdsourced_context"].length >
                0 ? (
                  result["data"]["attributes"]["crowdsourced_context"].map(
                    (cc, index) => {
                      return (
                        <div key={index + "_div"}>
                          <b>Title: </b>
                          {cc.title}
                          <br />
                          <b>Source: </b>
                          {cc.source}
                          <br />
                          <b>Timestamp: </b>
                          {cc.timestamp}
                          <br />
                          <b>Detail: </b>
                          {cc.detail}
                          <br />
                          <b>Severity: </b>
                          {cc.severity}
                          <br />
                        </div>
                      );
                    }
                  )
                ) : (
                  <p>None</p>
                )}
              </Card>
            ) : null}

            {result["data"]["attributes"]["popularity_ranks"] &&
            Object.keys(result["data"]["attributes"]["popularity_ranks"])
              .length > 0 ? (
              <Card
                key="popularity_card"
                variant="outlined"
                sx={{ m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}
              >
                <Typography variant="h5" component="h2" gutterBottom>
                  Popularity ranks
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  Domain's position in popularity ranks such as Alexa,
                  Quantcast, Statvoo, etc.
                </Typography>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                  {Object.entries(
                    result["data"]["attributes"]["popularity_ranks"]
                  ).map(([name, data]) => (
                    <div
                      key={name + "_div"}
                      style={{ flexBasis: "15%", marginBottom: "5px" }}
                    >
                      <Card
                        variant="outlined"
                        key={name + "_popularity_card"}
                        sx={{ m: 1, p: 1.5, borderRadius: 5, boxShadow: 0 }}
                      >
                        <Typography variant="h6" component="h2" gutterBottom>
                          {name}
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Grid container spacing={1} alignItems="center">
                          <Grid item>
                            <StarIcon color="primary" />
                          </Grid>
                          <Grid item>
                            <Typography variant="subtitle1" component="span">
                              {data.rank}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Card>
                    </div>
                  ))}
                </div>
              </Card>
            ) : null}

            {result["data"]["attributes"]["names"] &&
              result["data"]["attributes"]["names"].length > 0 && (
                <>
                  <Card
                    key="last_analysis_results_card"
                    variant="outlined"
                    sx={{ m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}
                  >
                    <Typography variant="h5" component="h2" gutterBottom>
                      Filenames
                    </Typography>
                    <List>
                      {result["data"]["attributes"]["names"].map(
                        (name, index) => (
                          <ListItem>
                            <ListItemText primary={name} />
                          </ListItem>
                        )
                      )}
                    </List>
                  </Card>
                </>
              )}

            {result["data"]["attributes"]["elf_info"] &&
            result["data"]["attributes"]["elf_info"]["section_list"].length >
              0 ? (
              <Card
                variant="outlined"
                key="tags_card"
                sx={{ m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}
              >
                <Typography variant="h5" component="h2" gutterBottom>
                  ELF information (Executable and Linkable Format)
                </Typography>
                <List>
                  <Grid container spacing={2}>
                    {Object.entries(
                      result["data"]["attributes"]["elf_info"]["header"]
                    ).map(([key, value]) => (
                      <Grid item xs={4} key={key}>
                        <ListItemText primary={key} secondary={value} />
                      </Grid>
                    ))}
                  </Grid>
                </List>
                <Typography variant="h5" component="h2" gutterBottom mt={2}>
                  Section List
                </Typography>
                <TableContainer
                  component={Paper}
                  sx={{
                    boxShadow: 0,
                    borderRadius: 5,
                    border: 1,
                    borderColor: theme.palette.background.tableborder,
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{
                            bgcolor: theme.palette.background.tablecell,
                            fontWeight: "bold",
                          }}
                        >
                          Name
                        </TableCell>
                        <TableCell
                          sx={{
                            bgcolor: theme.palette.background.tablecell,
                            fontWeight: "bold",
                          }}
                        >
                          Section type
                        </TableCell>
                        <TableCell
                          sx={{
                            bgcolor: theme.palette.background.tablecell,
                            fontWeight: "bold",
                          }}
                        >
                          Virtual address
                        </TableCell>
                        <TableCell
                          sx={{
                            bgcolor: theme.palette.background.tablecell,
                            fontWeight: "bold",
                          }}
                        >
                          Physical offset
                        </TableCell>
                        <TableCell
                          sx={{
                            bgcolor: theme.palette.background.tablecell,
                            fontWeight: "bold",
                          }}
                        >
                          Flags
                        </TableCell>
                        <TableCell
                          sx={{
                            bgcolor: theme.palette.background.tablecell,
                            fontWeight: "bold",
                          }}
                        >
                          Size
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {result["data"]["attributes"]["elf_info"][
                        "section_list"
                      ].map((section, index) => (
                        <TableRow key={index}>
                          <TableCell>{section["name"]}</TableCell>
                          <TableCell>{section.section_type}</TableCell>
                          <TableCell>{section.virtual_address}</TableCell>
                          <TableCell>{section.physical_offset}</TableCell>
                          <TableCell>{section.flags}</TableCell>
                          <TableCell>{section.size}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            ) : null}

            {result["data"]["attributes"]["crowdsourced_ids_results"] &&
            result["data"]["attributes"]["crowdsourced_ids_results"].length >
              0 ? (
              <Card
                variant="outlined"
                key="tags_card"
                sx={{ m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}
              >
                <Typography variant="h5" component="h2" gutterBottom>
                  Crowdsourced IDS rules
                </Typography>
                <TableContainer
                  component={Paper}
                  sx={{
                    boxShadow: 0,
                    borderRadius: 5,
                    border: 1,
                    borderColor: theme.palette.background.tableborder,
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{
                            bgcolor: theme.palette.background.tablecell,
                            fontWeight: "bold",
                          }}
                        >
                          Rule category
                        </TableCell>
                        <TableCell
                          sx={{
                            bgcolor: theme.palette.background.tablecell,
                            fontWeight: "bold",
                          }}
                        >
                          Alert severity
                        </TableCell>
                        <TableCell
                          sx={{
                            bgcolor: theme.palette.background.tablecell,
                            fontWeight: "bold",
                          }}
                        >
                          Rule message
                        </TableCell>
                        <TableCell
                          sx={{
                            bgcolor: theme.palette.background.tablecell,
                            fontWeight: "bold",
                          }}
                        >
                          Rule raw
                        </TableCell>
                        <TableCell
                          sx={{
                            bgcolor: theme.palette.background.tablecell,
                            fontWeight: "bold",
                          }}
                        >
                          Rule url
                        </TableCell>
                        <TableCell
                          sx={{
                            bgcolor: theme.palette.background.tablecell,
                            fontWeight: "bold",
                          }}
                        >
                          Rule source
                        </TableCell>
                        <TableCell
                          sx={{
                            bgcolor: theme.palette.background.tablecell,
                            fontWeight: "bold",
                          }}
                        >
                          Rule ID
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {result["data"]["attributes"][
                        "crowdsourced_ids_results"
                      ].map((result, index) => (
                        <TableRow key={index}>
                          <TableCell>{result.rule_category}</TableCell>
                          <TableCell>{result.alert_severity}</TableCell>
                          <TableCell>{result.rule_msg}</TableCell>
                          <TableCell>{result.rule_raw}</TableCell>
                          <TableCell>{result.rule_url}</TableCell>
                          <TableCell>{result.rule_source}</TableCell>
                          <TableCell>{result.rule_id}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            ) : null}

            {result["data"]["attributes"]["last_analysis_results"] &&
            Object.keys(result["data"]["attributes"]["last_analysis_results"])
              .length > 0 ? (
              <Card
                key="last_analysis_results_card"
                variant="outlined"
                sx={{ m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}
              >
                <Typography variant="h5" component="h2" gutterBottom>
                  Last analysis results
                </Typography>
                <TableContainer
                  component={Paper}
                  sx={{
                    boxShadow: 0,
                    borderRadius: 5,
                    border: 1,
                    borderColor: theme.palette.background.tableborder,
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{
                            bgcolor: theme.palette.background.tablecell,
                            fontWeight: "bold",
                          }}
                        >
                          Engine
                        </TableCell>
                        <TableCell
                          sx={{
                            bgcolor: theme.palette.background.tablecell,
                            fontWeight: "bold",
                          }}
                        >
                          Category
                        </TableCell>
                        <TableCell
                          sx={{
                            bgcolor: theme.palette.background.tablecell,
                            fontWeight: "bold",
                          }}
                        >
                          Result
                        </TableCell>
                        <TableCell
                          sx={{
                            bgcolor: theme.palette.background.tablecell,
                            fontWeight: "bold",
                          }}
                        >
                          Method
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(
                        result["data"]["attributes"]["last_analysis_results"]
                      )
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map(([name, analysis], index) => (
                          <TableRow key={index}>
                            <TableCell>{name}</TableCell>
                            <TableCell
                              sx={{
                                bgcolor:
                                  analysis.category === "malicious"
                                    ? "red"
                                    : "#6AAB8E",
                              }}
                            >
                              {analysis.category}
                            </TableCell>
                            <TableCell>{analysis.result}</TableCell>
                            <TableCell>{analysis.method}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                    component="div"
                    count={
                      Object.entries(
                        result["data"]["attributes"]["last_analysis_results"]
                      ).length
                    }
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </TableContainer>
              </Card>
            ) : null}

            {result["data"]["attributes"]["whois"] && (
              <Card
                key="whois_card"
                variant="outlined"
                sx={{ m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}
              >
                <Typography variant="h5" component="h2" gutterBottom>
                  Whois
                </Typography>
                <Typography component="p" sx={{ whiteSpace: "pre-wrap" }}>
                  {expanded
                    ? result["data"]["attributes"]["whois"]
                    : result["data"]["attributes"]["whois"].slice(0, 200)}
                </Typography>
                {result["data"]["attributes"]["whois"].length > 250 && (
                  <Button onClick={toggleExpanded}>
                    {expanded ? "Read Less" : "Read More"}
                  </Button>
                )}
              </Card>
            )}
          </Box>
        ) : (
          <Box sx={{ margin: 1 }}>
            <Grid
              xs
              item={true}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <NoDetails />
            </Grid>
          </Box>
        )
      ) : null}
    </>
  );

  return (
    <>
      <ResultRow
        name="Virustotal"
        id="virustotal"
        icon="vt_logo_small"
        loading={loading}
        result={result}
        summary={
          malCount === null
            ? "No matches found"
            : "Detected as malicious by " + malCount + " engine(s)"
        }
        summary_color={{ color: null }}
        color={malCount > 0 ? "red" : "green"}
        error={error}
        details={details}
      />
    </>
  );
}
