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
import {
  FilterFieldAtom,
  FilterModifierAtom,
  FilterValueAtom,
  FilterStatementAtom,
} from "../SigmaAtom";
import GppGoodIcon from "@mui/icons-material/GppGood";
import FieldData from "../FieldData.json";

export default function Filter() {
  const setField = useSetRecoilState(FilterFieldAtom);
  const field = useRecoilValue(FilterFieldAtom);

  const setModifier = useSetRecoilState(FilterModifierAtom);
  const modifier = useRecoilValue(FilterModifierAtom);

  const [valueInput, setValueInput] = useState("");
  const setValue = useSetRecoilState(FilterValueAtom);
  const value = useRecoilValue(FilterValueAtom);

  const setFilterStatement = useSetRecoilState(FilterStatementAtom);
  const filterStatement = useRecoilValue(FilterStatementAtom);

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

  const handleSaveFilterStatement = () => {
    let statement = {};

    if (modifier !== null && modifier !== "equals") {
      const modifiedField = `${field}|${modifier}`;
      statement = { [modifiedField]: value };
    } else {
      statement = { [field]: value };
    }

    setFilterStatement((prevStatements) => [...prevStatements, statement]);
    setField("");
    setModifier("equals");
    setValue([]);
  };

  const handleDeleteFilterStatement = (statementToDelete) => {
    const updatedStatements = filterStatement.filter(
      (statement) => statement !== statementToDelete
    );
    setFilterStatement(updatedStatements);
  };

  return (
    <>
      <Divider textAlign="left">FILTER</Divider>
      <Box display="flex" alignItems="center" gap="1rem" marginBottom="1rem">
        <Autocomplete
          options={FieldData}
          getOptionLabel={(option) => option}
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
          onClick={handleSaveFilterStatement}
          startIcon={<SaveIcon />}
          sx={{ width: "30%" }}
        >
          Save filter
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
        {filterStatement.map((item, index) => {
          const [key, value] = Object.entries(item)[0];
          const valueText = value ? value.join(", ") : "null";

          return (
            <>
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => handleDeleteFilterStatement(item)}
                    aria-label="delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemIcon>
                  <GppGoodIcon />
                </ListItemIcon>
                <ListItemText primary={key} secondary={valueText} />
              </ListItem>
              <Divider light />
            </>
          );
        })}
      </List>
    </>
  );
}
