import React, { useState } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import {
  Autocomplete,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  ListSubheader,
  TextField,
  Button,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RadarIcon from "@mui/icons-material/Radar";
import {
  SelectionFieldAtom,
  SelectionModifierAtom,
  SelectionValueAtom,
  SelectionStatementAtom,
  SelectionKeywordsAtom,
} from "../SigmaAtom";
import FieldData from "../FieldData.json";

export default function Selection() {
  const [keywordInput, setKeywordInput] = useState("");

  const setSelectionKeywords = useSetRecoilState(SelectionKeywordsAtom);
  const selectionKeywords = useRecoilValue(SelectionKeywordsAtom);

  const setField = useSetRecoilState(SelectionFieldAtom);
  const field = useRecoilValue(SelectionFieldAtom);

  const setModifier = useSetRecoilState(SelectionModifierAtom);
  const modifier = useRecoilValue(SelectionModifierAtom);

  const [valueInput, setValueInput] = useState("");
  const setValue = useSetRecoilState(SelectionValueAtom);
  const value = useRecoilValue(SelectionValueAtom);

  const setSelectionStatement = useSetRecoilState(SelectionStatementAtom);
  const selectionStatement = useRecoilValue(SelectionStatementAtom);

  const handleValueInput = (event) => {
    setValueInput(event.target.value);
  };

  const handleAddValue = () => {
    if (valueInput.trim() !== "") {
      setValue([...value, valueInput]);
      setValueInput("");
    }
  };

  const handleDeleteValue = (valueToDelete) => {
    const updatedValues = value.filter((value) => value !== valueToDelete);
    setValue(updatedValues);
  };

  const addKeyword = (keyword) => {
    setSelectionKeywords((prevKeywords) => [...prevKeywords, keyword]);
  };

  const handleKeywordInput = (event) => {
    setKeywordInput(event.target.value);
  };

  const handleAddKeyword = () => {
    if (keywordInput.trim() !== "") {
      addKeyword(keywordInput);
      setKeywordInput("");
    }
  };

  const handleDeleteKeyword = (keywordToDelete) => {
    const updatedKeywords = selectionKeywords.filter(
      (keyword) => keyword !== keywordToDelete
    );
    setSelectionKeywords(updatedKeywords);
  };

  const handleSaveSelectionStatement = () => {
    let statement = {};

    if (modifier !== null && modifier !== "equals") {
      const modifiedField = `${field}|${modifier}`;
      statement = { [modifiedField]: value };
    } else {
      statement = { [field]: value };
    }

    setSelectionStatement((prevStatements) => [...prevStatements, statement]);
    setField("");
    setModifier("equals");
    setValue([]);
  };

  const handleDeleteSelectionStatement = (statementToDelete) => {
    const updatedStatements = selectionStatement.filter(
      (statement) => statement !== statementToDelete
    );
    setSelectionStatement(updatedStatements);
  };

  return (
    <>
      <Divider textAlign="left">SELECTION</Divider>
      <Box display="flex" alignItems="center" gap="1rem" marginBottom="1rem">
        <Autocomplete
          options={FieldData}
          margin="normal"
          value={field}
          onChange={(event, newValue) => setField(newValue)}
          freeSolo
          renderInput={(params) => (
            <TextField
              {...params}
              margin="normal"
              label="Field"
              sx={{ minWidth: "25ch" }}
            />
          )}
        />
        <FormControl sx={{ minWidth: "10%" }} margin="normal">
          <InputLabel id="rule-modifier-select-input-label">
            Modifier
          </InputLabel>
          <Select
            labelId="modifier-select-label"
            id="modifier-select"
            autoWidth
            value={modifier}
            onChange={(event) => setModifier(event.target.value)}
            label="Modifier"
          >
            <ListSubheader>Wildcards</ListSubheader>
            <MenuItem value={"contains"}>contains</MenuItem>
            <MenuItem value={"startswith"}>startswith</MenuItem>
            <MenuItem value={"endswith"}>endswith</MenuItem>
            <ListSubheader>Encoding</ListSubheader>
            <MenuItem value={"base64"}>base64</MenuItem>
            <MenuItem value={"base64offset"}>base64offset</MenuItem>
            <MenuItem value={"utf16"}>utf16</MenuItem>
            <MenuItem value={"utf16le"}>utf16le</MenuItem>
            <MenuItem value={"utf16be"}>utf16be</MenuItem>
            <MenuItem value={"wide"}>wide</MenuItem>
            <ListSubheader>Regex</ListSubheader>
            <MenuItem value={"re"}>re</MenuItem>
            <ListSubheader>Other</ListSubheader>
            <MenuItem value={"all"}>all</MenuItem>
            <MenuItem value={"equals"}>equals</MenuItem>
            <MenuItem value={"windash"}>windash</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Value"
          sx={{ minWidth: "30%" }}
          fullWidth
          variant="outlined"
          margin="normal"
          value={valueInput}
          onChange={handleValueInput}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddValue();
            }
          }}
          InputProps={{
            endAdornment: (
              <Button
                variant="text"
                disableElevation
                size="medium"
                onClick={handleAddValue}
                startIcon={<AddCircleIcon />}
                sx={{ width: "50%" }}
              >
                Add value
              </Button>
            ),
          }}
        />

        <Button
          variant="contained"
          disableElevation
          size="medium"
          onClick={handleSaveSelectionStatement}
          startIcon={<SaveIcon />}
          sx={{ width: "30%" }}
        >
          Save selection
        </Button>
      </Box>
      {value.map((value, index) => (
        <Chip
          key={index}
          label={value}
          onDelete={() => handleDeleteValue(value)}
          style={{ marginBottom: "5px" }}
          deleteIcon={<DeleteIcon />}
          sx={{
            margin: "5px",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        />
      ))}
      <List dense>
        {selectionStatement.map((item, index) => {
          const [key, value] = Object.entries(item)[0];
          const valueText = value ? value.join(", ") : "null";

          return (
            <>
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => handleDeleteSelectionStatement(item)}
                    aria-label="delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemIcon>
                  <RadarIcon />
                </ListItemIcon>
                <ListItemText primary={key} secondary={valueText} />
              </ListItem>
              <Divider light />
            </>
          );
        })}
      </List>
      <div>
        <TextField
          label="Enter keywords"
          value={keywordInput}
          onChange={handleKeywordInput}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddKeyword();
            }
          }}
          size="medium"
          sx={{ width: "100%", mt: 2 }}
          InputProps={{
            endAdornment: (
              <Button
                variant="text"
                disableElevation
                size="medium"
                onClick={handleAddKeyword}
                startIcon={<AddCircleIcon />}
                sx={{ width: "20%" }}
              >
                Add keyword
              </Button>
            ),
          }}
        />

        {selectionKeywords.map((keyword, index) => (
          <Chip
            key={index}
            label={keyword}
            onDelete={() => handleDeleteKeyword(keyword)}
            style={{ marginBottom: "5px" }}
            deleteIcon={<DeleteIcon />}
            sx={{
              margin: "5px",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          />
        ))}
      </div>
    </>
  );
}
