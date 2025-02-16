import React, { useState, useRef } from "react";
import Alert from "@mui/material/Alert";
import { AlertTitle, Box, Paper, Typography, Grid } from "@mui/material";
import Grow from "@mui/material/Grow";
import ResultTable from "./ResultTable";
import SearchBar from "../styled/SearchBar";

export default function Analyzer() {
  const [searchKey, setSearchKey] = useState("");
  const [iocType, setIocType] = useState(" ");
  const [invalidInput, setInvalidInput] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const inputRef = useRef(null);

  const regexMap = [
    {
      type: "IPv4",
      regex:
        /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    },
    {
      type: "IPv6",
      regex:
        /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/,
    },
    { type: "MD5", regex: /^[a-f0-9]{32}$/ },
    { type: "SHA1", regex: /^[a-f0-9]{40}$/ },
    { type: "SHA256", regex: /^[a-f0-9]{64}$/ },
    {
      type: "Domain",
      regex:
        /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/,
    },
    {
      type: "URL",
      regex:
        /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/,
    },
    {
      type: "Email",
      regex:
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    },
    { type: "CVE", regex: /^CVE-[0-9]{4}-[0-9]{4,}$/ },
  ];

  const validateIoc = (ioc) => {
    const trimmedIoc = ioc.trim();
    for (const { type, regex } of regexMap) {
      if (regex.test(trimmedIoc)) {
        setInvalidInput(false);
        setSearchKey(trimmedIoc);
        setIocType(type);
        setShowTable(true);
        return true;
      }
    }
    setShowTable(false);
    setInvalidInput(true);
    return false;
  };

  const validateIocFromInput = () => {
    const inputValue = inputRef.current?.value.trim() || "";
    if (!validateIoc(inputValue)) {
      inputRef.current.value = "";
    }
  };

  const handleKeypress = (event) => {
    if (event.key === "Enter") {
      validateIocFromInput();
    }
  };

  return (
    <>
      <SearchBar
        ref={inputRef}
        placeholder="Please enter an IOC..."
        buttonLabel="Find"
        onKeyDown={handleKeypress}
        onSearchClick={validateIocFromInput}
        sx={{ fontSize: "8px" }}
        size="small"
      />
      <br />
      <br />
      {invalidInput && (
        <Grow in={true}>
          <Alert
            severity="error"
            variant="filled"
            onClose={() => setInvalidInput(false)}
            sx={{ borderRadius: 1 }}
          >
            <AlertTitle>
              <b>Error</b>
            </AlertTitle>
            Please enter a supported IOC (IP, Domain, URL, Email, MD5, SHA1,
            SHA256)
          </Alert>
        </Grow>
      )}
      {showTable ? (
        <ResultTable
          searchKey={searchKey}
          ioc={inputRef.current?.value || ""}
          iocType={iocType}
        />
      ) : (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ mb: 4 }}>
            <Typography paragraph>
              IOC Lookup is an analysis tool for investigating various
              Indicators of Compromise (IOCs). By leveraging multiple threat
              intelligence sources including VirusTotal, AlienVault, AbuseIPDB,
              and more, it provides detailed insights into potential security
              threats.
            </Typography>
            <Typography>
              The tool automatically identifies the IOC type and correlates data
              from relevant sources, enabling rapid threat assessment and
              informed security decision-making.
            </Typography>
          </Box>

          <Typography variant="h6" sx={{ mb: 2 }}>
            Supported IOC Types
          </Typography>

          <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
              <Paper elevation={0} sx={{ p: 1 }}>
                <Typography color="primary" fontWeight="medium">
                  IP Addresses
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  IPv4 and IPv6 addresses for threat analysis
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper elevation={0} sx={{ p: 1 }}>
                <Typography color="primary" fontWeight="medium">
                  Domains
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Domain names and subdomains
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper elevation={0} sx={{ p: 1 }}>
                <Typography color="primary" fontWeight="medium">
                  URLs
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Web addresses and endpoints
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper elevation={0} sx={{ p: 1 }}>
                <Typography color="primary" fontWeight="medium">
                  Email Addresses
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Known malicious or suspicious email addresses
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper elevation={0} sx={{ p: 1 }}>
                <Typography color="primary" fontWeight="medium">
                  Hashes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  MD5, SHA1, and SHA256 file hashes
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper elevation={0} sx={{ p: 1 }}>
                <Typography color="primary" fontWeight="medium">
                  CVEs
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Common Vulnerabilities and Exposures identifiers
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      )}
    </>
  );
}
