import React from "react";
import api from "../../../../api";
import { useEffect, useState } from "react";

import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import DnsIcon from "@mui/icons-material/Dns";
import GppBadIcon from "@mui/icons-material/GppBad";
import Grid from "@mui/material/Grid";
import InfoIcon from "@mui/icons-material/Info";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
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
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";

import ResultRow from "../../ResultRow";

export default function Maltiverse(props) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
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
      setLoading(true);
      try {
        const url = "/api/ip/maltiverse/" + props.ioc;
        const response = await api.get(url);
        setResult(response.data);
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
        <Box sx={{ margin: 1 }}>
          <Stack
            direction="row"
            spacing={1}
            width={"100%"}
            alignItems="stretch"
          >
            <Card
              key={"maltiverse_threat_info_card"}
              variant="outlined"
              sx={{ p: 2, borderRadius: 5, boxShadow: 0, width: "50%" }}
            >
              <Grid direction="row" container spacing={2} pt={2} pl={2}>
                <PrivacyTipIcon />
                <Typography variant="h5" gutterBottom component="div" pl={2}>
                  Threat information
                </Typography>
              </Grid>

              <List>
                <ListItem>
                  <ListItemText
                    primary="Classification"
                    secondary={result["classification"]}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary="IP" secondary={result["ip_addr"]} />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Is content delivery network"
                    secondary={result["is_cdn"] ? "Yes" : "No"}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Is command and control server"
                    secondary={result["is_cnc"] ? "Yes" : "No"}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Is distributing malware"
                    secondary={result["is_distributing_malware"] ? "Yes" : "No"}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Is hoster"
                    secondary={result["is_hosting"] ? "Yes" : "No"}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Is IOT threat"
                    secondary={result["is_iot_threat"] ? "Yes" : "No"}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Is known attacker"
                    secondary={result["is_known_attacker"] ? "Yes" : "No"}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Is known scanner"
                    secondary={result["is_known_scanner"] ? "Yes" : "No"}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Is mining pool"
                    secondary={result["is_mining_pool"] ? "Yes" : "No"}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Is open proxy"
                    secondary={result["is_open_proxy"] ? "Yes" : "No"}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Is Sinkhole"
                    secondary={result["is_sinkhole"] ? "Yes" : "No"}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Is Tor node"
                    secondary={result["is_tor_node"] ? "Yes" : "No"}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Is VPN node"
                    secondary={result["is_vpn_node"] ? "Yes" : "No"}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Is web hosting"
                    secondary={result["is_web_hosting"] ? "Yes" : "No"}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Is web server"
                    secondary={result["is_web_server"] ? "Yes" : "No"}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Is web spider"
                    secondary={result["is_web_spider"] ? "Yes" : "No"}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Number of blacklisted domains resolving"
                    secondary={
                      result["number_of_blacklisted_domains_resolving"]
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Number of offline malicious URLs allocated"
                    secondary={
                      result["number_of_offline_malicious_urls_allocated"]
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Number of online malicious URLs allocated"
                    secondary={
                      result["number_of_online_malicious_urls_allocated"]
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Number of whitelisted domains resolving"
                    secondary={
                      result["number_of_whitelisted_domains_resolving"]
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Modification time"
                    secondary={result["modification_time"]}
                  />
                </ListItem>
              </List>
            </Card>
            <Stack spacing={1} width={"50%"} alignItems="stretch">
              <Card
                key={"maltiverse_general_info_card"}
                variant="outlined"
                sx={{ p: 2, borderRadius: 5, boxShadow: 0 }}
              >
                <Grid direction="row" container spacing={2} pt={2} pl={2}>
                  <InfoIcon />
                  <Typography variant="h5" gutterBottom component="div" pl={2}>
                    General information
                  </Typography>
                </Grid>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Address"
                      secondary={result["address"]}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="City" secondary={result["city"]} />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Country code"
                      secondary={result["country_code"]}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Registrant name"
                      secondary={result["registrant_name"]}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Type" secondary={result["type"]} />
                  </ListItem>
                </List>
              </Card>
              <Card
                key={"maltiverse_asn_card"}
                variant="outlined"
                sx={{ p: 2, borderRadius: 5, boxShadow: 0 }}
              >
                <Grid direction="row" container spacing={2} pt={2} pl={2}>
                  <DnsIcon />
                  <Typography variant="h5" gutterBottom component="div" pl={2}>
                    ASN information
                  </Typography>
                </Grid>
                <List>
                  <ListItem>
                    <ListItemText primary="ASN" secondary={result["as_name"]} />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="ASN CIDR"
                      secondary={result["asn_cidr"]}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="ASN country code"
                      secondary={result["asn_country_code"]}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="ASN date"
                      secondary={result["asn_date"]}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="ASN registry"
                      secondary={result["asn_registry"]}
                    />
                  </ListItem>
                </List>
              </Card>
            </Stack>
          </Stack>

          <Card
            key={"maltiverse_blacklists"}
            variant="outlined"
            sx={{ m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}
          >
            <Grid direction="row" container spacing={2} pt={2} pl={2}>
              <GppBadIcon />
              <Typography variant="h5" gutterBottom component="div" pl={2}>
                Blacklists
              </Typography>
            </Grid>
            {result["blacklist"] && result["blacklist"].length > 0 ? (
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
                        Description
                      </TableCell>
                      <TableCell
                        sx={{
                          bgcolor: theme.palette.background.tablecell,
                          fontWeight: "bold",
                        }}
                      >
                        First seen
                      </TableCell>
                      <TableCell
                        sx={{
                          bgcolor: theme.palette.background.tablecell,
                          fontWeight: "bold",
                        }}
                      >
                        Last seen
                      </TableCell>
                      <TableCell
                        sx={{
                          bgcolor: theme.palette.background.tablecell,
                          fontWeight: "bold",
                        }}
                      >
                        Source
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {result["blacklist"]
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((blacklist, index) => (
                        <TableRow key={index}>
                          <TableCell>{blacklist["description"]}</TableCell>
                          <TableCell>{blacklist["first_seen"]}</TableCell>
                          <TableCell>{blacklist["last_seen"]}</TableCell>
                          <TableCell>{blacklist["source"]}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 50, 100]}
                  component="div"
                  count={Object.entries(result["blacklist"]).length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableContainer>
            ) : (
              "No blacklist entries found"
            )}
          </Card>
        </Box>
      ) : null}
    </>
  );

  return (
    <>
      <ResultRow
        name="Maltiverse"
        id="maltiverse"
        icon="maltiverse_logo_small"
        loading={loading}
        result={result}
        summary={
          result && result["classification"]
            ? result["classification"].charAt(0).toUpperCase() +
              result["classification"].slice(1)
            : null
        }
        summary_color={{ color: null }}
        color={
          result && result["classification"] === "malicious"
            ? "red"
            : result && result["classification"] === "suspicious"
            ? "orange"
            : "green"
        }
        error={error}
        details={details}
      />
    </>
  );
}
