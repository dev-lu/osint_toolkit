import React, { useState } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import {
  Autocomplete,
  Card,
  CardContent,
  Typography,
  TextField,
  Divider,
  Button,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ViewListIcon from "@mui/icons-material/ViewList";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { FieldsAtom } from "./SigmaAtom";
import FieldData from "./FieldData.json";

export default function Fields() {
  const [fieldInput, setFieldInput] = useState("");
  const setFields = useSetRecoilState(FieldsAtom);
  const fields = useRecoilValue(FieldsAtom);

  const handleFieldInput = (event) => {
    setFieldInput(event.target.value);
  };

  const handleAddField = () => {
    if (fieldInput.trim() !== "") {
      setFields([...fields, fieldInput]);
      setFieldInput("");
    }
  };

  const handleDeleteField = (fieldToDelete) => {
    const updatedFields = fields.filter((field) => field !== fieldToDelete);
    setFields(updatedFields);
  };

  return (
    <>
      <Divider>
        <Chip
          icon={<ViewListIcon />}
          label="Fields (optional)"
          style={{ fontSize: "20px", padding: "10px", height: "40px" }}
        />
      </Divider>

      <Card
        variant="outlined"
        key={"sigma_rule_card"}
        sx={{
          m: 1,
          mb: 3,
          p: 2,
          borderRadius: 5,
          boxShadow: 0,
          height: "100%",
        }}
      >
        <CardContent sx={{ "& > *": { my: 2 } }}>
          <Typography>
            These are the fields that are very helpful in the evaluation of a
            certain event. For example, it is helpful to know the parent process
            of a process that contains suspicious strings in its command line
            parameters. These fields could be extracted automatically and
            presented to the analyst in order to speed up the analysis.
          </Typography>
        </CardContent>
        <div>
          <Autocomplete
            value={fieldInput}
            onChange={(_, newValue) => setFieldInput(newValue)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddField();
              }
            }}
            freeSolo
            options={FieldData}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Enter field"
                size="medium"
                sx={{ width: "100%", mt: 2 }}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {params.InputProps.endAdornment}
                      <Button
                        variant="text"
                        disableElevation
                        size="medium"
                        sx={{ width: "20%" }}
                        onClick={handleAddField}
                        startIcon={<AddCircleIcon />}
                      >
                        Add field
                      </Button>
                    </>
                  ),
                }}
              />
            )}
          />

          {fields.map((field, index) => (
            <Chip
              key={index}
              label={field}
              onDelete={() => handleDeleteField(field)}
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
      </Card>
    </>
  );
}
