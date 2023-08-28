import React from "react";
import Alert from "@mui/material/Alert";
import { AlertTitle } from "@mui/material";
import Grow from "@mui/material/Grow";
import ResultTable from "./ResultTable";
import Introduction from "../Introduction";
import FormGroup from "@mui/material/FormGroup";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";

export default function Analyzer() {
  const [ioc, setIoc] = useState(" ");
  const handleInput = (event) => {
    setIoc(event.target.value);
  };

  const [key, setKey] = useState(" ");
  const [iocType, setIocType] = useState(" ");
  const [invalidInput, setInvalidInput] = useState(false);

  const ipv4Regex =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex =
    /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/;
  const md5Regex = /^[a-f0-9]{32}$/;
  const sha1Regex = /^[a-f0-9]{40}$/;
  const sha256Regex = /^[a-f0-9]{64}$/;
  const urlRegex =
    /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;
  const domainRegex =
    /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/;
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  const cveRegex = /^CVE-[0-9]{4}-[0-9]{4,}$/;

  function validateIoc(ioc) {
    setIoc(ioc.trim());
    if (ipv4Regex.test(ioc)) {
      setInvalidInput(false);
      setKey(ioc);
      setIocType("IPv4");
      handleShowTable();
      return true;
    } else if (ipv6Regex.test(ioc)) {
      setInvalidInput(false);
      setKey(ioc);
      setIocType("IPv6");
      handleShowTable();
      return true;
    } else if (md5Regex.test(ioc)) {
      setInvalidInput(false);
      setKey(ioc);
      setIocType("MD5");
      handleShowTable();
      return true;
    } else if (sha1Regex.test(ioc)) {
      setInvalidInput(false);
      setKey(ioc);
      setIocType("SHA1");
      handleShowTable();
      return true;
    } else if (sha256Regex.test(ioc)) {
      setInvalidInput(false);
      setKey(ioc);
      setIocType("SHA256");
      handleShowTable();
      return true;
    } else if (domainRegex.test(ioc)) {
      setInvalidInput(false);
      setKey(ioc);
      setIocType("Domain");
      handleShowTable();
      return true;
    } else if (urlRegex.test(ioc)) {
      setInvalidInput(false);
      setKey(ioc);
      setIocType("URL");
      handleShowTable();
      return true;
    } else if (emailRegex.test(ioc)) {
      setInvalidInput(false);
      setKey(ioc);
      setIocType("Email");
      handleShowTable();
      return true;
    } else if (cveRegex.test(ioc)) {
      setInvalidInput(false);
      setKey(ioc);
      setIocType("CVE");
      handleShowTable();
      return true;
    } else {
      handleHideTable();
      setInvalidInput(true);
      return false;
    }
  }

  const [showTable, setshowTable] = useState(false);
  const handleShowTable = (event) => {
    setshowTable(true);
  };
  const handleHideTable = (event) => {
    setshowTable(false);
  };

  const handleKeypress = (event) => {
    if (event.key === "Enter") {
      validateIoc(ioc.trim());
    }
  };

  return (
    <>
      <br />
      <FormGroup row>
        <TextField
          id="ioc-input-textfield"
          label="Please enter an IOC..."
          onChange={handleInput}
          onKeyDown={handleKeypress}
          variant="filled"
          size="small"
          sx={{ width: "80%" }}
        />
        <Button
          variant="contained"
          sx={{ width: "20%" }}
          disableElevation
          size="large"
          startIcon={<SearchIcon />}
          onClick={() => validateIoc(ioc.trim())}
        >
          Analyze
        </Button>
      </FormGroup>
      <br />
      <br />
      {invalidInput ? (
        <>
          <Grow in={true}>
            <Alert
              severity="error"
              onClose={() => setInvalidInput(false)}
              sx={{ borderRadius: 5 }}
            >
              <AlertTitle>
                <b>Error</b>
              </AlertTitle>
              Please enter a supported IOC (IP, Domain, URL, Email, MD5, SHA1,
              SHA256)
            </Alert>
          </Grow>
          <br />
        </>
      ) : null}
      {showTable ? (
        <ResultTable key={key} ioc={ioc} iocType={iocType} />
      ) : (
        <Introduction moduleName="IOC Analyzer" />
      )}
    </>
  );
}
