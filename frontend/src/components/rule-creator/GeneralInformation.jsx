import React, { useState, useEffect } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import {
  Card,
  Autocomplete,
  CardContent,
  Box,
  Button,
  Grid,
  TextField,
  Divider,
  Chip,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import InfoIcon from "@mui/icons-material/Info";
import licensesData from "./licenses.json";
import { GeneralInfoAtom } from "./SigmaAtom";
import { AuthorAtom } from "./SigmaAtom";

export default function GeneralInformation() {
  const theme = useTheme();
  const STATUSES = [
    "None",
    "Experimental",
    "Test",
    "Stable",
    "Deprecated",
    "Unsupported",
  ];
  const LEVELS = ["None", "Informational", "Low", "Medium", "High", "Critical"];
  const ruleCreationDate = new Date()
    .toLocaleDateString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/-/g, "/");
  const [licenses, setLicenses] = useState([]);
  const setGeneralInfo = useSetRecoilState(GeneralInfoAtom);
  const generalInfo = useRecoilValue(GeneralInfoAtom);
  const setAuthor = useSetRecoilState(AuthorAtom);
  const author = useRecoilValue(AuthorAtom);
  const [authorInput, setAuthorInput] = useState("");
  const handleAuthorInput = (event) => {
    setAuthorInput(event.target.value);
  };

  const handleAddAuthor = () => {
    if (authorInput.trim() !== "") {
      setAuthor([...author, authorInput]);
      setAuthorInput("");
    }
  };

  const handleDeleteAuthor = (authorToDelete) => {
    const updatedAuthor = author.filter((author) => author !== authorToDelete);
    setAuthor(updatedAuthor);
  };

  const updateGeneralInfo = (key, newValue) => {
    setGeneralInfo((prev) => ({
      ...prev,
      [key]: newValue,
    }));
  };

  useEffect(() => {
    const licenseIds = licensesData.licenses.map(
      (license) => license.licenseId
    );
    setLicenses(licenseIds);

    if (generalInfo.date === "") {
      updateGeneralInfo("date", ruleCreationDate);
    }
  }, []);

  return (
    <>
      <Divider>
        <Chip
          icon={<InfoIcon />}
          label="General information"
          style={{
            fontSize: "20px",
            padding: "10px",
            height: "40px",
            backgroundColor: theme.palette.background.cvssCard,
          }}
        />
      </Divider>

      <Card
        key={"sigma_rule_card"}
        elevation={0}
        sx={{
          m: 1,
          mb: 3,
          p: 2,
          borderRadius: 5,
          height: "100%",
          backgroundColor: theme.palette.background.cvssCard,
        }}
      >
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Box width="100%">
                {/* Title */}
                <TextField
                  label="Title"
                  variant="outlined"
                  margin="normal"
                  value={generalInfo.title}
                  onChange={(e) => updateGeneralInfo("title", e.target.value)}
                  inputProps={{
                    maxLength: 50,
                  }}
                  fullWidth
                  sx={{
                    borderRadius: "10px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                    },
                  }}
                />

                {/* Description */}
                <TextField
                  label="Description (optional)"
                  variant="outlined"
                  margin="normal"
                  value={generalInfo.description}
                  onChange={(e) =>
                    updateGeneralInfo("description", e.target.value)
                  }
                  fullWidth
                  sx={{
                    borderRadius: "10px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                    },
                  }}
                />

                {/* Author */}
                <TextField
                  label="Author (optional)"
                  variant="outlined"
                  margin="normal"
                  value={authorInput}
                  onChange={handleAuthorInput}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddAuthor();
                    }
                  }}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <Button
                        variant="text"
                        disableElevation
                        size="medium"
                        sx={{ width: "20%" }}
                        onClick={handleAddAuthor}
                        startIcon={<AddCircleIcon />}
                      >
                        Add
                      </Button>
                    ),
                    sx: {
                      borderRadius: "10px",
                    },
                  }}
                />
                {author.map((author, index) => (
                  <Chip
                    key={index}
                    label={author}
                    onDelete={() => handleDeleteAuthor(author)}
                    style={{ marginBottom: "5px" }}
                    deleteIcon={<DeleteIcon />}
                    sx={{
                      margin: "5px",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: theme.palette.background.tablecell,
                    }}
                  />
                ))}

                {/* License */}
                <Autocomplete
                  options={licenses}
                  getOptionLabel={(option) => option}
                  freeSolo
                  value={generalInfo.license}
                  onChange={(event, newValue) =>
                    updateGeneralInfo("license", newValue)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="License (optional)"
                      margin="normal"
                      sx={{
                        borderRadius: "10px",
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "10px",
                        },
                      }}
                    />
                  )}
                />
              </Box>
            </Grid>

            <Grid item xs={4}>
              <Box width="100%">
                {/* Status */}
                <FormControl
                  fullWidth
                  margin="normal"
                  sx={{ borderRadius: "10px" }}
                >
                  <InputLabel id="rule-status-select-input-label">
                    Status (optional)
                  </InputLabel>
                  <Select
                    labelId="rule-status-select-label"
                    id="rule-status-select"
                    value={generalInfo.status}
                    label="Status (optional)"
                    onChange={(event) =>
                      updateGeneralInfo("status", event.target.value)
                    }
                    sx={{
                      borderRadius: "10px",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                      },
                    }}
                  >
                    {STATUSES.map((status) => (
                      <MenuItem
                        key={status.toLowerCase()}
                        value={status.toLowerCase()}
                      >
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Level */}
                <FormControl
                  fullWidth
                  margin="normal"
                  sx={{ borderRadius: "10px" }}
                >
                  <InputLabel id="rule-level-select-input-label">
                    Level (optional)
                  </InputLabel>
                  <Select
                    labelId="rule-level-select-label"
                    id="rule-level-select"
                    value={generalInfo.level}
                    label="Level (optional)"
                    onChange={(event) =>
                      updateGeneralInfo("level", event.target.value)
                    }
                    sx={{
                      borderRadius: "10px",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                      },
                    }}
                  >
                    {LEVELS.map((level) => (
                      <MenuItem
                        key={level.toLowerCase()}
                        value={level.toLowerCase()}
                      >
                        {level}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Date */}
                <TextField
                  label="Date (optional)"
                  variant="outlined"
                  margin="normal"
                  value={generalInfo.date}
                  onChange={(event) =>
                    updateGeneralInfo("date", event.target.value)
                  }
                  fullWidth
                  sx={{
                    borderRadius: "10px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                    },
                  }}
                />

                {/* Modified */}
                <TextField
                  label="Modified date (optional)"
                  variant="outlined"
                  margin="normal"
                  value={generalInfo.modifiedDate}
                  onChange={(event) =>
                    updateGeneralInfo("modifiedDate", event.target.value)
                  }
                  fullWidth
                  sx={{
                    borderRadius: "10px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                    },
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
}
