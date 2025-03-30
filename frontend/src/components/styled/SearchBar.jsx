import React, { forwardRef } from "react";

import { TextField, Button, InputAdornment } from "@mui/material";
import { styled } from "@mui/system";
import SearchIcon from "@mui/icons-material/Search";
import useTheme from "@mui/material/styles/useTheme";

const SearchBar = forwardRef(
  (
    {
      value,
      placeholder = "Enter something...",
      onChange,
      onKeyDown,
      onSearchClick,
      buttonLabel = "Search",
    },
    ref
  ) => {
    const theme = useTheme();

    const CustomTextField = styled(TextField)({
      "& .MuiOutlinedInput-root": {
        borderRadius: 1,
        border: "none",
        "& fieldset": {
          border: "none",
        },
        "&:hover fieldset": {
          border: "none",
        },
        "&.Mui-focused fieldset": {
          border: "none",
        },
      },
    });

    const SearchButton = styled(Button)({
      marginLeft: "10px",
      borderRadius: 2,
      boxShadow: "none",
      "&:hover": {
        boxShadow: "none",
      },
    });

    return (
      <>
        <CustomTextField
          fullWidth
          variant="outlined"
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onKeyDown={onKeyDown}
          inputRef={ref}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchButton
                  variant="contained"
                  color="primary"
                  startIcon={<SearchIcon />}
                  onClick={onSearchClick}
                >
                  {buttonLabel}
                </SearchButton>
              </InputAdornment>
            ),
          }}
        />
      </>
    );
  }
);

export default SearchBar;
