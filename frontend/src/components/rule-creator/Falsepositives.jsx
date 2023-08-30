import React, { useState } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import {
  Card,
  CardContent,
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
import BlockIcon from "@mui/icons-material/Block";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { FalsepositivesAtom } from "./SigmaAtom";

export default function Falsepositives() {
  const theme = useTheme();
  const [fpInput, setFpInput] = useState("");
  const setFps = useSetRecoilState(FalsepositivesAtom);
  const fps = useRecoilValue(FalsepositivesAtom);

  const handleFpInput = (event) => {
    setFpInput(event.target.value);
  };

  const handleAddFp = () => {
    if (fpInput.trim() !== "") {
      setFps([...fps, fpInput]);
      setFpInput("");
    }
  };

  const handleDeleteFp = (fpToDelete) => {
    const updatedFps = fps.filter((fp) => fp !== fpToDelete);
    setFps(updatedFps);
  };

  return (
    <>
      <Divider>
        <Chip
          icon={<BlockIcon />}
          label="Falsepositives (optional)"
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
          backgroundColor: theme.palette.background.cvssCard,
        }}
      >
        <CardContent sx={{ "& > *": { my: 2 } }}>
          <Typography>
            Think about possible false positive conditions that could also
            trigger the rule. This list should contain useful hints for an
            analyst. E.g. the comment "Legitimate processes that delete the
            shadow copies" can be a hint for an analyst to check for backup
            processes on that system or ask for any unusual administrative
            activity that involved the deletion of the local volume shadow
            copies.
          </Typography>
          <div>
            <FormGroup row>
              <TextField
                label="Enter false positives"
                value={fpInput}
                onChange={handleFpInput}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddFp();
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
                      onClick={handleAddFp}
                      startIcon={<AddCircleIcon />}
                      sx={{
                        whiteSpace: "nowrap",
                      }}
                    >
                      Add false positive
                    </Button>
                  ),
                }}
              />
            </FormGroup>
            <Stack spacing={1} style={{ marginTop: "10px" }}>
              {fps.map((fp, index) => (
                <Chip
                  key={index}
                  size="medium"
                  label={fp}
                  onDelete={() => handleDeleteFp(fp)}
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
