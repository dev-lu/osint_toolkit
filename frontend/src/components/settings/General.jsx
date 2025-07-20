import React from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import api from "../../api";

import { generalSettingsState } from "../../state";

import Card from "@mui/material/Card";
import FormControl from "@mui/material/FormControl";
import { FormControlLabel } from "@mui/material";
import FormHelperText from "@mui/material/FormHelperText";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import { useTheme } from '@mui/material/styles';

export default function General() {
  const generalSettings = useRecoilValue(generalSettingsState);
  const setGeneralSettings = useSetRecoilState(generalSettingsState);
  const theme = useTheme();

  function handleFontChange(event) {
    try {
      api
        .put("/api/settings/general/font/?font=" + event.target.value)
        .then((response) => {
          if (response.status === 200) {
            setGeneralSettings({
              ...generalSettings,
              font: event.target.value,
            });
            document.body.setAttribute("data-font", event.target.value);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  }

  const cardStyle = {
    p: 1,
    pl: 2,
    m: 1,
    boxShadow: "0",
    backgroundColor: theme.palette.background.card,
    borderRadius: 1,
  };

  function handleDarkmodeChange() {
    try {
      if (!generalSettings.darkmode) {
        api
          .put("/api/settings/general/darkmode/?darkmode=true")
          .then((response) => {
            if (response.status === 200) {
              setGeneralSettings({ ...generalSettings, darkmode: true });
            }
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        api
          .put("/api/settings/general/darkmode/?darkmode=false")
          .then((response) => {
            if (response.status === 200) {
              setGeneralSettings({ ...generalSettings, darkmode: false });
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Card sx={cardStyle}>
        <h2> General </h2>
        <p> Application wide settings can be configured here. </p>
      </Card>
      <Card sx={cardStyle}>
        <h3> Visual </h3>
        <FormControlLabel
          control={
            <Switch
              checked={generalSettings.darkmode}
              onChange={() => handleDarkmodeChange()}
            />
          }
          label="Darkmode"
        />
        <br />
        <br />
        <p>Custom font</p>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <Select
            value={generalSettings.font}
            onChange={handleFontChange}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
          >
            <MenuItem value="Poppins">Poppins</MenuItem>
            <MenuItem value="Nunito">Nunito</MenuItem>
            <MenuItem value="Roboto">Roboto</MenuItem>
            <MenuItem value="Arial">Arial</MenuItem>
            <MenuItem value="Helvetica">Helvetica</MenuItem>
            <MenuItem value="Aldrich">Aldrich</MenuItem>
          </Select>
          <FormHelperText>
            Change the application wide font for OSINT Toolkit
          </FormHelperText>
        </FormControl>
      </Card>
    </>
  );
}
