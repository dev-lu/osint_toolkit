import React from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import {
  Box,
  Divider,
  Select,
  FormControl,
  InputLabel,
  TextField,
  MenuItem,
  useTheme,
} from "@mui/material";
import { TimeframeAtom } from "../SigmaAtom";

export default function Timeframe() {
  const theme = useTheme();
  const setTimeframe = useSetRecoilState(TimeframeAtom);
  const timeframe = useRecoilValue(TimeframeAtom);

  const updateTime = (newValue) => {
    setTimeframe((prevTime) => ({
      ...prevTime,
      timeframe: newValue,
    }));
  };

  const updateUnit = (newValue) => {
    setTimeframe((prevUnit) => ({
      ...prevUnit,
      unit: newValue,
    }));
  };

  return (
    <>
      <Divider textAlign="left">TIMEFRAME</Divider>
      <Box display="flex" alignItems="center" gap="1rem" marginBottom="1rem">
        <TextField
          label="Timeframe (optional)"
          value={timeframe.timeframe}
          onChange={(event) => updateTime(event.target.value)}
          variant="outlined"
          margin="normal"
          InputProps={{
            sx: {
              borderRadius: "10px",
            },
          }}
        />
        <FormControl margin="normal" sx={{ minWidth: "10%" }}>
          <InputLabel id="time-unit-select-input-label">Unit</InputLabel>
          <Select
            labelId="time-unit-level-select-label"
            id="time-unit-level-select"
            defaultValue={timeframe.unit}
            onChange={(event) => updateUnit(event.target.value)}
            autoWidth
            label="Unit"
            sx={{ borderRadius: "10px" }}
          >
            <MenuItem value={"s"}>Seconds</MenuItem>
            <MenuItem value={"m"}>Minutes</MenuItem>
            <MenuItem value={"h"}>Hours</MenuItem>
            <MenuItem value={"d"}>Days</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </>
  );
}
