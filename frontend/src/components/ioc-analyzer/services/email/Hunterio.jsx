import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import InfoIcon from "@mui/icons-material/Info";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SourceIcon from "@mui/icons-material/Source";
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

export default function Hunterio(props) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mailStatus, setMailStatus] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const theme = useTheme();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 5));
    setPage(0);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url =
          "http://localhost:8000/api/" +
          props.type +
          "/hunterio/" +
          encodeURIComponent(props.email);
        const response = await axios.get(url);
        setResult(response.data);
        setMailStatus(response.data.data.status);
      } catch (e) {
        setError(e);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const details = (
    <>
      {result && !result.error && result.data ? (
        <Box sx={{ margin: 1 }}>
          <Card
            variant="outlined"
            sx={{ m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}
          >
            <Grid direction="row" container spacing={2} pt={2} pl={2}>
              <InfoIcon />
              <Typography variant="h5" gutterBottom component="div" pl={2}>
                Details
              </Typography>
            </Grid>
            <List>
              <ListItem>
                <ListItemText primary="Status" secondary={result.data.status} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Result" secondary={result.data.result} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Score" secondary={result.data.score} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Email" secondary={result.data.email} />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Passes regular expression"
                  secondary={result.data.regexp ? "Yes" : "No"}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Is an automatically generated email address"
                  secondary={result.data.gibberish ? "Yes" : "No"}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Is an email address from a disposable email service"
                  secondary={result.data.disposable ? "Yes" : "No"}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Is an email from a webmail (for example Gmail)"
                  secondary={result.data.webmail ? "Yes" : "No"}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="MX records exist on the domain of the given email address"
                  secondary={result.data.mx_records ? "Yes" : "No"}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Connected to the SMTP server successfully"
                  secondary={result.data.smtp_server ? "Yes" : "No"}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Email address doesn't bounce"
                  secondary={result.data.smtp_check ? "Yes" : "No"}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="SMTP server accepts all the email addresses? It means you can have have false positives on SMTP checks"
                  secondary={result.data.accept_all ? "Yes" : "No"}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="SMTP server prevented to perform the SMTP check"
                  secondary={result.data.block ? "Yes" : "No"}
                />
              </ListItem>
            </List>
          </Card>

          <Card
            variant="outlined"
            key="sources"
            sx={{ m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}
          >
            <Grid direction="row" container spacing={2} pt={2} pl={2}>
              <SourceIcon />
              <Typography variant="h5" gutterBottom component="div" pl={2}>
                Sources
              </Typography>
            </Grid>
            <Typography variant="body2">
              If we have found the given email address somewhere on the web, we
              display the sources here. The number of sources is limited to 20.
              The extracted_on attribute contains the date it was found for the
              first time, whereas the last_seen_on attribute contains the date
              it was found for the last time.
            </Typography>
            {result.data.sources.length > 0 ? (
              <TableContainer
                component={Paper}
                sx={{
                  mt: 2,
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
                        Domain
                      </TableCell>
                      <TableCell
                        sx={{
                          bgcolor: theme.palette.background.tablecell,
                          fontWeight: "bold",
                        }}
                      >
                        URI
                      </TableCell>
                      <TableCell
                        sx={{
                          bgcolor: theme.palette.background.tablecell,
                          fontWeight: "bold",
                        }}
                      >
                        Extracted on
                      </TableCell>
                      <TableCell
                        sx={{
                          bgcolor: theme.palette.background.tablecell,
                          fontWeight: "bold",
                        }}
                      >
                        Last seen on
                      </TableCell>
                      <TableCell
                        sx={{
                          bgcolor: theme.palette.background.tablecell,
                          fontWeight: "bold",
                        }}
                      >
                        Still on page
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {result.data.sources
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((source) => (
                        <TableRow key={source.uri}>
                          <TableCell>{source.domain}</TableCell>
                          <TableCell>{source.uri}</TableCell>
                          <TableCell>{source.extracted_on}</TableCell>
                          <TableCell>{source.last_seen_on}</TableCell>
                          <TableCell>{source.still_on_page ? "Yes" : "No"}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={result.data.sources.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableContainer>
            ) : (
              "No sources found"
            )}
          </Card>
        </Box>
      ) : (
        <Box sx={{ margin: 1 }}>
          <Grid display="flex" justifyContent="center" alignItems="center">
            <NoDetails />
          </Grid>
        </Box>
      )}
    </>
  );

  function renderMailStatus() {
    if (mailStatus === "valid") {
      return <>Email address is valid</>;
    } else if (mailStatus === "invalid") {
      return <>Email address is not valid</>;
    } else if (mailStatus === "accept_all") {
      return (
        <>
          Email address is valid but any email address is accepted by the server
        </>
      );
    } else if (mailStatus === "webmail") {
      return (
        <>
          Email address comes from an email service provider such as Gmail or
          Outlook
        </>
      );
    } else if (mailStatus === "disposable") {
      return <>Email address comes from a disposable email service provider</>;
    } else if (mailStatus === "unknown") {
      return <>Failed to verify the email address</>;
    }
  }

  return (
    <>
      <ResultRow
        name="Hunter.io"
        id="hunterio"
        icon="hunterio_logo_small"
        loading={loading}
        result={result}
        summary={mailStatus === null ? "No info available" : renderMailStatus()}
        summary_color={{ color: null }}
        color={
          mailStatus === "invalid"
            ? "red"
            : mailStatus === "disposable"
            ? "orange"
            : "green"
        }
        error={error}
        details={details}
      />
    </>
  );
}
