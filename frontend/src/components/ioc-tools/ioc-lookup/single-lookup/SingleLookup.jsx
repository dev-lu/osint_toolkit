import React, { useState, useRef, useCallback } from "react";
import { Alert, AlertTitle, Box, Grow } from "@mui/material";
import ResultTable from "./components/ui/ResultTable";
import SearchBar from "../../../styled/SearchBar";
import WelcomeScreen from "./components/ui/WelcomeScreen";
import { determineIocType } from "../shared/utils/iocDefinitions";

const Analyzer = () => {
  const [searchValue, setSearchValue] = useState("");
  const [currentIocType, setCurrentIocType] = useState("");
  const [isInputInvalid, setIsInputInvalid] = useState(false);
  const [shouldShowTable, setShouldShowTable] = useState(false);
  const inputRef = useRef(null);

  const handleValidation = useCallback((iocInput) => {
    const trimmedIoc = iocInput.trim();
    
    if (!trimmedIoc) {
      setShouldShowTable(false);
      setIsInputInvalid(false);
      setSearchValue("");
      setCurrentIocType("");
      return false;
    }

    const type = determineIocType(trimmedIoc);

    if (type !== 'unknown') {
      setIsInputInvalid(false);
      setSearchValue(trimmedIoc);
      setCurrentIocType(type);
      setShouldShowTable(true);
      return true;
    } else {
      setShouldShowTable(false);
      setIsInputInvalid(true);
      return false;
    }
  }, []);

  const handleSubmitSearch = useCallback(() => {
    const inputValue = inputRef.current?.value || "";
    handleValidation(inputValue);
  }, [handleValidation]);

  const handleKeyPress = useCallback((event) => {
    if (event.key === "Enter") {
      handleSubmitSearch();
    }
  }, [handleSubmitSearch]);

  const handleCloseError = useCallback(() => {
    setIsInputInvalid(false);
  }, []);

  return (
    <>
      <SearchBar
        ref={inputRef}
        placeholder="Enter an IOC to analyze (IP, Domain, URL, Email, Hash, CVE)..."
        buttonLabel="Analyze"
        onKeyDown={handleKeyPress}
        onSearchClick={handleSubmitSearch}
        size="medium"
        fullWidth
      />
      
      <Box sx={{ my: 1 }}>
        {isInputInvalid && (
          <Grow in={true}>
            <Alert
              severity="error"
              variant="filled"
              onClose={handleCloseError}
              sx={{ borderRadius: 1 }}
            >
              <AlertTitle>
                <b>Invalid Input</b>
              </AlertTitle>
              Please enter a supported IOC type. The entered value does not match
              known formats for IP, Domain, URL, Email, Hash, or CVE.
            </Alert>
          </Grow>
        )}
      </Box>
      
      {shouldShowTable && searchValue && currentIocType ? (
        <ResultTable
          ioc={searchValue}
          iocType={currentIocType}
        />
      ) : (
        <WelcomeScreen />
      )}
    </>
  );
};

export default Analyzer;
