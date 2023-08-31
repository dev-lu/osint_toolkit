import React, { useState } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import {
  Alert,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  Divider,
  Button,
  Chip,
  FormGroup,
  Stack,
  useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import LinkIcon from "@mui/icons-material/Link";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { ReferencesAtom } from "./SigmaAtom";

export default function References() {
  const theme = useTheme();
  const [referenceInput, setReferenceInput] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const setReferences = useSetRecoilState(ReferencesAtom);
  const references = useRecoilValue(ReferencesAtom);

  const listStyle = {
    marginLeft: "20px",
  };

  const handleReferenceInput = (event) => {
    setReferenceInput(event.target.value);
  };

  const handleAddReference = () => {
    if (referenceInput.trim() !== "") {
      if (isValidUrl(referenceInput.trim())) {
        setReferences([...references, referenceInput]);
        setReferenceInput("");
        setShowAlert(false);
      } else {
        setShowAlert(true);
      }
    }
  };

  const handleDeleteReference = (referenceToDelete) => {
    const updatedReferences = references.filter(
      (reference) => reference !== referenceToDelete
    );
    setReferences(updatedReferences);
  };

  const isValidUrl = (url) => {
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return urlPattern.test(url);
  };

  return (
    <>
      <Divider>
        <Chip
          icon={<LinkIcon />}
          label="References (optional)"
          style={{ fontSize: "20px", padding: "10px", height: "40px" }}
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
        <CardContent sx={{ "& > *": { my: 2 } }}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Typography>Use links to web pages or documents only.</Typography>
              <ul style={listStyle}>
                <li>don't link to EVTX files, PCAPs or other raw content </li>
                <li>
                  don't include links to MITRE ATT&CK techniques (we use the
                  tags for that){" "}
                </li>
              </ul>
            </Grid>

            <Grid item xs={6}>
              <Typography>The links used in the list can be, i.e.:</Typography>
              <ul style={listStyle}>
                <li>links to a blog post or tweet </li>
                <li>links to a project page of a certain hack tool </li>
                <li>links to the manual page of a builtin Windows tool </li>
                <li>
                  links to advisories links to discussions that better explain
                  the detected threat{" "}
                </li>
              </ul>
            </Grid>
          </Grid>

          <div>
            <FormGroup row>
              <TextField
                label="Enter reference"
                value={referenceInput}
                onChange={handleReferenceInput}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddReference();
                  }
                }}
                size="medium"
                sx={{
                  width: "100%",
                  mt: 2,
                  backgroundColor: theme.palette.background.tablecell,
                }}
                InputProps={{
                  endAdornment: (
                    <Button
                      variant="text"
                      disableElevation
                      size="medium"
                      onClick={handleAddReference}
                      startIcon={<AddCircleIcon />}
                      sx={{ width: "20%" }}
                    >
                      Add reference
                    </Button>
                  ),
                }}
              />
            </FormGroup>

            {showAlert && (
              <Alert severity="error" style={{ marginTop: "10px" }}>
                A reference must be a valid URL.
              </Alert>
            )}

            <Stack spacing={1} style={{ marginTop: "10px" }}>
              {references.map((reference, index) => (
                <Chip
                  key={index}
                  size="medium"
                  label={reference}
                  onDelete={() => handleDeleteReference(reference)}
                  style={{ marginBottom: "5px" }}
                  deleteIcon={<DeleteIcon />}
                  sx={{
                    marginBottom: "5px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                />
              ))}
            </Stack>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
