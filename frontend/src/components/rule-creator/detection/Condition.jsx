import React from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import {
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  useTheme,
} from "@mui/material";
import { ConditionAtom } from "../SigmaAtom";

export default function Condition() {
  const theme = useTheme();
  const setCondition = useSetRecoilState(ConditionAtom);
  const condition = useRecoilValue(ConditionAtom);

  return (
    <>
      <Divider textAlign="left">CONDITION</Divider>

      <FormControl sx={{ minWidth: "10%" }} margin="normal">
        <InputLabel id="rule-modifier-select-input-label">Condition</InputLabel>
        <Select
          labelId="condition-select-label"
          id="condition-select"
          autoWidth
          label="Condition"
          value={condition}
          sx={{ backgroundColor: theme.palette.background.tablecell }}
          onChange={(event) => setCondition(event.target.value)}
        >
          <MenuItem value={"selection"}>selection</MenuItem>
          <MenuItem value={"selection and not filter"}>
            selection AND NOT filter
          </MenuItem>
        </Select>
      </FormControl>
    </>
  );
}
