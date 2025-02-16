import React from "react";
import { useState, useRef } from "react";

import Alert from "@mui/material/Alert";
import { AlertTitle, Box, Paper, Grid, Typography } from "@mui/material";
import Grow from "@mui/material/Grow";

import ResultTable from "./ResultTable";
import SearchBar from "../styled/SearchBar";

export default function Monitoring() {
  const inputRef = useRef(null);
  const [invalidInput, setInvalidInput] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [showTable, setshowTable] = useState(false);

  const handleShowTable = () => {
    const inputValue = inputRef.current?.value.trim() || "";
    if (!inputValue) {
      setInvalidInput(true);
      setshowTable(false);
      return;
    }
    setInvalidInput(false);
    setSearchKey(inputValue);
    setshowTable(true);
  };

  const handleKeypress = (event) => {
    if (event.key === "Enter") {
      handleShowTable();
    }
  };

  return (
    <>
      <SearchBar
        ref={inputRef}
        placeholder="Please enter a domain pattern to search for..."
        buttonLabel="Search"
        onKeyDown={handleKeypress}
        onSearchClick={handleShowTable}
      />
      <br />
      <br />
      {invalidInput && (
        <Grow in={true}>
          <Alert
            severity="error"
            variant="filled"
            onClose={() => setInvalidInput(false)}
            sx={{ borderRadius: 5 }}
          >
            <AlertTitle>
              <b>Error</b>
            </AlertTitle>
            Please enter a domain pattern to search for
          </Alert>
        </Grow>
      )}
      {showTable ? (
        <ResultTable key={searchKey} domain={searchKey} />
      ) : (
        <Paper sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography paragraph>
          Domain Monitoring is a module that helps you protect your organization from phishing attacks 
          by allowing you to search for recently registered domains that match a specific pattern. 
          This can help you identify potential threats before they occur.
        </Typography>
        <Typography paragraph>
          Using the URLScan.io API, the module allows you to view screenshots of websites to see what 
          is behind a domain without the need to visit the site and potentially expose yourself to danger. 
          Additionally, with just a single click, you can check each domain and the IP it resolves to 
          against multiple threat intelligence services to further protect your organization.
        </Typography>
        <Typography variant="body2" sx={{ 
          p: 2, 
          borderRadius: 1,
          fontFamily: 'monospace'
        }}>
          For example, you can use the module to search for domains that start with "google-" by using 
          the search pattern "google-*".
        </Typography>
      </Box>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Features
      </Typography>

      <Grid container spacing={1}>
        <Grid item xs={12} sm={6}>
          <Paper elevation={0} sx={{ p: 1 }}>
            <Typography color="primary" fontWeight="medium">Pattern Matching</Typography>
            <Typography variant="body2" color="text.secondary">
              Search for recently registered domains using specific patterns
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper elevation={0} sx={{ p: 1 }}>
            <Typography color="primary" fontWeight="medium">Safe Preview</Typography>
            <Typography variant="body2" color="text.secondary">
              View website screenshots via URLScan.io integration
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper elevation={0} sx={{ p: 1 }}>
            <Typography color="primary" fontWeight="medium">Threat Intelligence</Typography>
            <Typography variant="body2" color="text.secondary">
              Check domains and IPs against multiple security services
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper elevation={0} sx={{ p: 1 }}>
            <Typography color="primary" fontWeight="medium">Proactive Defense</Typography>
            <Typography variant="body2" color="text.secondary">
              Identify potential phishing threats before they become active
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Paper>
      )}
    </>
  );
}
