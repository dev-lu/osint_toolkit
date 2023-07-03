import React, { useState } from 'react';
import { useSetRecoilState, useRecoilValue } from "recoil";
import api from '../../api';

import { generalSettingsState } from "../../App";

import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Card from "@mui/material/Card";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import FormControl from '@mui/material/FormControl';
import { FormControlLabel } from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import FormHelperText from '@mui/material/FormHelperText';
import MenuItem from '@mui/material/MenuItem';
import SaveIcon from "@mui/icons-material/Save";
import Select from '@mui/material/Select';
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import useTheme from "@mui/material/styles/useTheme";


export default function General() {
  const generalSettings = useRecoilValue(generalSettingsState);
  const setGeneralSettings = useSetRecoilState(generalSettingsState);
  const [selectedFont, setSelectedFont] = useState('Poppins');
  const theme = useTheme();

  
  function handleFontChange(event) {
    setSelectedFont(event.target.value);
    document.body.setAttribute('data-font', event.target.value);
  }


  const cardStyle = {
    p: 1,
    pl: 2,
    m: 1,
    boxShadow: "0",
    backgroundColor: theme.palette.background.card,
    borderRadius: 5,
  };

  function handleDarkmodeChange() {
    try {
      if (!generalSettings.darkmode) {
        api
          .put(
            "/api/settings/general/darkmode/?darkmode=true"
          )
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
          .put(
            "/api/settings/general/darkmode/?darkmode=false"
          )
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

  function handleProxyStringEnabledChange() {
    try {
      if (!generalSettings.proxy_enabled) {
        api
          .put(
            "/api/settings/general/proxy_enabled/?proxy_enabled=true"
          )
          .then((response) => {
            if (response.status === 200) {
              setGeneralSettings({ ...generalSettings, proxy_enabled: true });
            }
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        api
          .put(
            "/api/settings/general/proxy_enabled/?proxy_enabled=false"
          )
          .then((response) => {
            if (response.status === 200) {
              setGeneralSettings({ ...generalSettings, proxy_enabled: false });
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

  function handleProxyStringInput(proxyString) {
    api
      .put(
        `/api/settings/general/proxy_string/?proxy_string=${proxyString}`
      )
      .then((response) => {
        if (response.status === 200) {
          setGeneralSettings({ ...generalSettings, proxy_string: proxyString });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function handleDeleteProxyString() {
    api
      .put(
        `/api/settings/general/proxy_string/?proxy_string=${""}`
      )
      .then((response) => {
        if (response.status === 200) {
          setGeneralSettings({ ...generalSettings, proxy_string: "" });
        }
      })
      .catch((error) => {
        console.error(error);
      });
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
          value={selectedFont}
          onChange={handleFontChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
        >
          <MenuItem value="Poppins">Poppins</MenuItem>
          <MenuItem value="Nunito">Nunito</MenuItem>
          <MenuItem value="Roboto">Roboto</MenuItem>
          <MenuItem value="Arial">Arial</MenuItem>
          <MenuItem value="Helvetica">Helvetica</MenuItem>
        </Select>
        <FormHelperText>Change the application wide font for OSINT Toolkit</FormHelperText>
      </FormControl>
      </Card>
      <Card sx={cardStyle}>
        <h3> Proxy (not working at the moment)</h3>
        <p> Here you can configure your proxy. Enter your proxy string <u>without</u> http:// or https:// at the beginning.</p>
        <FormGroup row>
          <TextField
            id="proxy_textfield"
            label="Proxystring"
            defaultValue={generalSettings.proxy_string}
            variant="filled"
            size="small"
            sx={{ width: "50%" }}
            disabled={
              !generalSettings.proxy_enabled
                ? true
                : generalSettings.proxy_string.length > 0
                ? true
                : false
            }
          />
          <ButtonGroup
            disableElevation
            variant="contained"
            aria-label="Disabled elevation buttons"
          >
            {generalSettings.proxy_string ? (
              <Button
                variant="contained"
                color="error"
                disableElevation
                size="small"
                onClick={() => handleDeleteProxyString()}
              >
                <DeleteForeverIcon />
              </Button>
            ) : null}
            {!generalSettings.proxy_string ? (
              <Button
                variant="contained"
                color="success"
                disableElevation
                size="small"
                onClick={() =>
                  handleProxyStringInput(
                    document.getElementById("proxy_textfield").value
                  )
                }
              >
                <SaveIcon />
              </Button>
            ) : null}
          </ButtonGroup>
        </FormGroup>
        <br />
        <FormControlLabel
          control={
            <Switch
              checked={generalSettings.proxy_enabled}
              onChange={() => handleProxyStringEnabledChange()}
            />
          }
          label="Proxy enabled"
        />
      </Card>
    </>
  );
}
