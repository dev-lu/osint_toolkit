import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";

import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
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
        const url = "http://localhost:8000/api/ip/maltiverse/" + props.ioc;
        const response = await axios.get(url);
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
                <Typography variant="h5" gutterBottom component="div">
                    Threat information
                </Typography>
              <p>Classification: {result["classification"]} </p>
              <p>IP: {result["ip_addr"]} </p>
              <p>
                Is content delivery network: {result["is_cdn"] ? "Yes" : "No"}{" "}
              </p>
              <p>
                Is command and control server: {result["is_cnc"] ? "Yes" : "No"}{" "}
              </p>
              <p>
                Is distributing malware:{" "}
                {result["is_distributing_malware"] ? "Yes" : "No"}{" "}
              </p>
              <p>Is hoster: {result["is_hosting"] ? "Yes" : "No"} </p>
              <p>Is IOT threat: {result["is_iot_threat"] ? "Yes" : "No"} </p>
              <p>
                Is known attacker: {result["is_known_attacker"] ? "Yes" : "No"}{" "}
              </p>
              <p>
                Is known scanner: {result["is_known_scanner"] ? "Yes" : "No"}{" "}
              </p>
              <p>Is mining pool: {result["is_mining_pool"] ? "Yes" : "No"} </p>
              <p>Is open proxy: {result["is_open_proxy"] ? "Yes" : "No"} </p>
              <p>Is Sinkhole: {result["is_sinkhole"] ? "Yes" : "No"} </p>
              <p>Is Tor node: {result["is_tor_node"] ? "Yes" : "No"} </p>
              <p>Is VPN node: {result["is_vpn_node"] ? "Yes" : "No"} </p>
              <p>Modification time: {result["modification_time"]} </p>
              <p>
                Number of blacklisted domains resolving:{" "}
                {result["number_of_blacklisted_domains_resolving"]}{" "}
              </p>
              <p>
                Number of domains resolving:{" "}
                {result["number_of_domains_resolving"]}{" "}
              </p>
              <p>
                Number of malicious URLs allocated:{" "}
                {result["number_of_offline_malicious_urls_allocated"]}{" "}
              </p>
              <p>
                Number of online milicious URLs allocated:{" "}
                {result["number_of_online_malicious_urls_allocated"]}{" "}
              </p>
              <p>
                Number of whitelisted domains resolving:{" "}
                {result["number_of_whitelisted_domains_resolving"]}{" "}
              </p>
            </Card>
            <Stack spacing={1} width={"50%"} alignItems="stretch">
              <Card
                key={"maltiverse_general_info_card"}
                variant="outlined"
                sx={{ p: 2, borderRadius: 5, boxShadow: 0 }}
              >
                <Typography variant="h5" gutterBottom component="div">
                    General information
                </Typography>
                <p>Address: {result["address"]} </p>
                <p>City: {result["city"]} </p>
                <p>Country code: {result["country_code"]} </p>
                <p>Registrant name: {result["registrant_name"]} </p>
                <p>Type: {result["type"]} </p>
              </Card>
              <Card
                key={"maltiverse_asn_card"}
                variant="outlined"
                sx={{ p: 2, borderRadius: 5, boxShadow: 0 }}
              >
                <Typography variant="h5" gutterBottom component="div">
                    ASN information
                </Typography>
                <p>ASN: {result["as_name"]} </p>
                <p>ASN CIDR: {result["asn_cidr"]} </p>
                <p>ASN country code: {result["asn_country_code"]} </p>
                <p>ASN date: {result["asn_date"]} </p>
                <p>ASN registry: {result["asn_registry"]} </p>
              </Card>
            </Stack>
          </Stack>

          <Card
            key={"maltiverse_blacklists"}
            variant="outlined"
            sx={{ m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}
          >
            <Typography variant="h5" gutterBottom component="div">
              Blacklists
            </Typography>
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
