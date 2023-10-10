import React from "react";
import { useState, useRef } from "react";

import Alert from "@mui/material/Alert";
import { AlertTitle } from "@mui/material";
import Grow from "@mui/material/Grow";

import Introduction from "../Introduction";
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
      <br />
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
        <Introduction moduleName="Domain Monitoring" />
      )}
    </>
  );
}
