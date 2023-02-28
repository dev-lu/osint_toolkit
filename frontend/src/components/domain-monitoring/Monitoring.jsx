import React from "react";
import { useState } from "react";

import Introduction from "../Introduction";
import ResultTable from "./ResultTable";

import Button from "@mui/material/Button";
import FormGroup from "@mui/material/FormGroup";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";


export default function Monitoring() {
  const [domain, setDomain] = useState(" ");
  const handleInput = (event) => {
    setDomain(event.target.value);
  };

  const [key, setKey] = useState(" ");

  // show or hide result table
  const [showTable, setshowTable] = useState(false);
  const handleShowTable = (event) => {
    setKey(domain);
    setshowTable(true);
  };

  const handleKeypress = (event) => {
    if (event.key === "Enter") {
      handleShowTable();
    }
  };

  return (
    <div>
      <br />
      <FormGroup row>
        <TextField
          id="domain-input-textfield"
          label="Please enter a domain pattern..."
          onChange={handleInput}
          onKeyPress={handleKeypress}
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
          onClick={() => handleShowTable()}
        >
          Search
        </Button>
      </FormGroup>
      <br />
      <br />
      {showTable ? (
        <ResultTable key={key} domain={domain} />
      ) : (
        <Introduction moduleName="Domain Monitoring" />
      )}
    </div>
  );
}
