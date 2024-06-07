import React from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import api from "../../api";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import FormGroup from "@mui/material/FormGroup";
import { FormControlLabel } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";

import { modulesState } from "../../App";
import { newsfeedListState } from "../../App";

import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from "@mui/material";
import useTheme from "@mui/material/styles/useTheme";

export default function Modules() {
  const modules = useRecoilValue(modulesState);
  const setModules = useSetRecoilState(modulesState);

  const newsfeedList = useRecoilValue(newsfeedListState);
  const setNewsfeedList = useSetRecoilState(newsfeedListState);

  const theme = useTheme();

  const cardStyle = {
    m: 1,
    p: 2,
    borderRadius: 5,
    backgroundColor: theme.palette.background.card,
    boxShadow: 0,
  };

  function handleModuleChange(moduleName) {
    if (modules[moduleName].enabled === false) {
      api.post("/api/settings/modules/enable/?module_name=" + moduleName);
      const newState = { ...modules };
      newState[moduleName] = { ...newState[moduleName], enabled: true };
      setModules(newState);
    } else {
      api.post("/api/settings/modules/disable/?module_name=" + moduleName);
      const newState = { ...modules };
      newState[moduleName] = { ...newState[moduleName], enabled: false };
      setModules(newState);
    }
  }

  function handleModuleDescriptionChange(moduleName, description) {
    api.put("/api/settings/modules", {
      name: moduleName,
      description: description,
      enabled: modules[moduleName].enabled,
    });
    const newState = { ...modules };
    newState[moduleName] = {
      ...newState[moduleName],
      description: description,
    };
    setModules(newState);
  }

  function handleEnableDisableNewsfeed(feedName) {
    if (newsfeedList[feedName].enabled === false) {
      api.post("/api/settings/modules/newsfeed/enable?feedName=" + feedName);
      const newState = { ...newsfeedList };
      newState[feedName] = { ...newState[feedName], enabled: true };
      setNewsfeedList(newState);
    } else {
      api.post("/api/settings/modules/newsfeed/disable?feedName=" + feedName);
      const newState = { ...newsfeedList };
      newState[feedName] = { ...newState[feedName], enabled: false };
      setNewsfeedList(newState);
    }
  }
  return (
    <>
      <Card sx={cardStyle}>
        <h2>Modules</h2>
        <p>Settings for specific modules can be configured here.</p>
      </Card>
      <FormGroup>
        <Card sx={cardStyle}>
          <FormControlLabel
            control={
              <Switch
                checked={modules["Newsfeed"].enabled}
                onChange={() => handleModuleChange("Newsfeed")}
              />
            }
            label={<h3>Newsfeed</h3>}
          />
          <p>
            The news feed is a module that shows the latest news from the
            security community.
          </p>
          <Card sx={{ borderRadius: 5, boxShadow: 0, m: 2, maxWidth: "50%" }}>
            <List
              dense={true}
              sx={{
                position: "relative",
                overflow: "auto",
                maxHeight: 300,
                "& ul": { padding: 0 },
              }}
            >
              {Object.keys(newsfeedList).map((key) => {
                const item = newsfeedList[key];
                return (
                  <ListItem key={"list-" + key}>
                    <ListItemAvatar>
                      <Avatar alt={key} src={`feedicons/${item.icon}.png`} />
                    </ListItemAvatar>
                    <ListItemText primary={key} secondary={item.url} />
                    <Switch
                      checked={item.enabled}
                      onChange={() => handleEnableDisableNewsfeed(key)}
                    />
                  </ListItem>
                );
              })}
            </List>
          </Card>
        </Card>
        <Card sx={cardStyle}>
          <FormControlLabel
            control={
              <Switch
                checked={modules["IOC Analyzer"].enabled}
                onChange={() => handleModuleChange("IOC Analyzer")}
              />
            }
            label={<h3>IOC Analyzer</h3>}
          />
          <p>
            The IOC analyzer is a module that allows you to analyze indicators
            of compromise.
          </p>
          <br />
          <TextField
            id="iocanalyzer-description-textfield"
            label="Custom description"
            disabled={modules["IOC Analyzer"].enabled === false}
            fullWidth
            multiline
            rows={4}
            sx={{
              borderRadius: "10px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
              },
            }}
            defaultValue={
              modules["IOC Analyzer"]
                ? modules["IOC Analyzer"].description.toString()
                : ""
            }
          />
          <Button
            variant="contained"
            color="success"
            disableElevation
            disabled={modules["IOC Analyzer"].enabled === false}
            size="large"
            type="submit"
            sx={{ borderRadius: 5, mt: 2, ml: 1 }}
            onClick={() =>
              handleModuleDescriptionChange(
                "IOC Analyzer",
                document.getElementById("iocanalyzer-description-textfield")
                  .value
              )
            }
          >
            <SaveIcon />
            Save
          </Button>
        </Card>
        <Card sx={cardStyle}>
          <FormControlLabel
            control={
              <Switch
                checked={modules["IOC Extractor"].enabled}
                onChange={() => handleModuleChange("IOC Extractor")}
              />
            }
            label={<h3>IOC Extractor</h3>}
          />
          <p>
            The IOC extractor is a module that allows you to extract indicators
            of compromise from a file.
          </p>
          <br />
          <TextField
            id="iocextractor-description-textfield"
            label="Custom description"
            disabled={modules["IOC Extractor"].enabled === false}
            fullWidth
            multiline
            rows={4}
            sx={{
              borderRadius: "10px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
              },
            }}
            defaultValue={
              modules["IOC Extractor"]
                ? modules["IOC Extractor"].description
                : ""
            }
          />
          <Button
            variant="contained"
            color="success"
            disableElevation
            disabled={modules["IOC Extractor"].enabled === false}
            size="large"
            type="submit"
            sx={{ borderRadius: 5, mt: 2, ml: 1 }}
            onClick={() =>
              handleModuleDescriptionChange(
                "IOC Extractor",
                document.getElementById("iocextractor-description-textfield")
                  .value
              )
            }
          >
            <SaveIcon />
            Save
          </Button>
        </Card>
        <Card sx={cardStyle}>
          <FormControlLabel
            control={
              <Switch
                checked={modules["Domain Monitoring"].enabled}
                onChange={() => handleModuleChange("Domain Monitoring")}
              />
            }
            label={<h3>Domain Monitoring</h3>}
          />
          <p>
            The domain monitoring module allows you to monitor domains for
            changes.
          </p>
          <br />
          <TextField
            id="domainmonitoring-description-textfield"
            label="Custom description"
            disabled={modules["Domain Monitoring"].enabled === false}
            fullWidth
            multiline
            rows={4}
            sx={{
              borderRadius: "10px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
              },
            }}
            defaultValue={
              modules["Domain Monitoring"]
                ? modules["Domain Monitoring"].description
                : ""
            }
          />
          <Button
            variant="contained"
            color="success"
            disableElevation
            disabled={modules["Domain Monitoring"].enabled === false}
            size="large"
            type="submit"
            sx={{ borderRadius: 5, mt: 2, ml: 1 }}
            onClick={() =>
              handleModuleDescriptionChange(
                "Domain Monitoring",
                document.getElementById(
                  "domainmonitoring-description-textfield"
                ).value
              )
            }
          >
            <SaveIcon />
            Save
          </Button>
        </Card>
        <Card sx={cardStyle}>
          <FormControlLabel
            control={
              <Switch
                checked={modules["Email Analyzer"].enabled}
                onChange={() => handleModuleChange("Email Analyzer")}
              />
            }
            label={<h3>Email Analyzer</h3>}
          />
          <p>
            The email analyzer is a module that allows you to analyze emails.
          </p>
          <br />
          <TextField
            id="emailanalyzer-description-textfield"
            label="Custom description"
            disabled={modules["Email Analyzer"].enabled === false}
            fullWidth
            multiline
            rows={4}
            sx={{
              borderRadius: "10px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
              },
            }}
            defaultValue={
              modules["Email Analyzer"]
                ? modules["Email Analyzer"].description
                : ""
            }
          />
          <Button
            variant="contained"
            color="success"
            disableElevation
            disabled={modules["Email Analyzer"].enabled === false}
            size="large"
            type="submit"
            sx={{ borderRadius: 5, mt: 2, ml: 1 }}
            onClick={() =>
              handleModuleDescriptionChange(
                "Email Analyzer",
                document.getElementById("emailanalyzer-description-textfield")
                  .value
              )
            }
          >
            <SaveIcon />
            Save
          </Button>
        </Card>
        <Card sx={cardStyle}>
          <FormControlLabel
            control={
              <Switch
                checked={modules["AI Assistant"].enabled}
                onChange={() => handleModuleChange("AI Assistant")}
              />
            }
            label={<h3>AI Assistant</h3>}
          />
          <p>The AI Assistent lets you use the power of Chat GPT.</p>
          <br />
          <TextField
            id="aiassistat-general-description-textfield"
            label="Custom general description"
            disabled={modules["AI Assistant"].enabled === false}
            fullWidth
            multiline
            rows={4}
            sx={{
              mt: 2,
              borderRadius: "10px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
              },
            }}
            defaultValue={
              modules["AI Assistant"] ? modules["AI Assistant"].description : ""
            }
          />
          <Button
            variant="contained"
            color="success"
            disableElevation
            disabled={modules["AI Assistant"].enabled === false}
            size="large"
            type="submit"
            sx={{ borderRadius: 5, mt: 2, ml: 1 }}
            onClick={() =>
              handleModuleDescriptionChange(
                "AI Assistant",
                document.getElementById(
                  "aiassistat-general-description-textfield"
                ).value
              )
            }
          >
            <SaveIcon />
            Save
          </Button>
          <TextField
            id="aiassistat-la-description-textfield"
            label="Custom log analyzer description"
            disabled={modules["AI Assistant"].enabled === false}
            fullWidth
            multiline
            rows={4}
            sx={{
              mt: 2,
              borderRadius: "10px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
              },
            }}
            defaultValue={
              modules["AI Assistant LA"]
                ? modules["AI Assistant LA"].description
                : ""
            }
          />
          <Button
            variant="contained"
            color="success"
            disableElevation
            disabled={modules["AI Assistant"].enabled === false}
            size="large"
            type="submit"
            sx={{ borderRadius: 5, mt: 2, ml: 1 }}
            onClick={() =>
              handleModuleDescriptionChange(
                "AI Assistant LA",
                document.getElementById("aiassistat-la-description-textfield")
                  .value
              )
            }
          >
            <SaveIcon />
            Save
          </Button>
          <TextField
            id="aiassistat-pa-description-textfield"
            label="Custom phishing analyzer description"
            disabled={modules["AI Assistant"].enabled === false}
            fullWidth
            multiline
            rows={4}
            sx={{
              mt: 2,
              borderRadius: "10px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
              },
            }}
            defaultValue={
              modules["AI Assistant PA"]
                ? modules["AI Assistant PA"].description
                : ""
            }
          />
          <Button
            variant="contained"
            color="success"
            disableElevation
            disabled={modules["AI Assistant"].enabled === false}
            size="large"
            type="submit"
            sx={{ borderRadius: 5, mt: 2, ml: 1 }}
            onClick={() =>
              handleModuleDescriptionChange(
                "AI Assistant PA",
                document.getElementById("aiassistat-pa-description-textfield")
                  .value
              )
            }
          >
            <SaveIcon />
            Save
          </Button>
          <TextField
            id="aiassistat-ce-description-textfield"
            label="Custom code expert description"
            disabled={modules["AI Assistant"].enabled === false}
            fullWidth
            multiline
            rows={4}
            sx={{
              mt: 2,
              borderRadius: "10px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
              },
            }}
            defaultValue={
              modules["AI Assistant CE"]
                ? modules["AI Assistant CE"].description
                : ""
            }
          />
          <Button
            variant="contained"
            color="success"
            disableElevation
            disabled={modules["AI Assistant"].enabled === false}
            size="large"
            type="submit"
            sx={{ borderRadius: 5, mt: 2, ml: 1 }}
            onClick={() =>
              handleModuleDescriptionChange(
                "AI Assistant CE",
                document.getElementById("aiassistat-ce-description-textfield")
                  .value
              )
            }
          >
            <SaveIcon />
            Save
          </Button>
          <TextField
            id="aiassistat-cdo-description-textfield"
            label="Custom code expert description"
            disabled={modules["AI Assistant"].enabled === false}
            fullWidth
            multiline
            rows={4}
            sx={{
              mt: 2,
              borderRadius: "10px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
              },
            }}
            defaultValue={
              modules["AI Assistant CDO"]
                ? modules["AI Assistant CDO"].description
                : ""
            }
          />
          <Button
            variant="contained"
            color="success"
            disableElevation
            disabled={modules["AI Assistant"].enabled === false}
            size="large"
            type="submit"
            sx={{ borderRadius: 5, mt: 2, ml: 1 }}
            onClick={() =>
              handleModuleDescriptionChange(
                "AI Assistant CDO",
                document.getElementById("aiassistat-cdo-description-textfield")
                  .value
              )
            }
          >
            <SaveIcon />
            Save
          </Button>
        </Card>
        <Card sx={cardStyle}>
          <FormControlLabel
            control={
              <Switch
                checked={modules["CVSS Calculator"].enabled}
                onChange={() => handleModuleChange("CVSS Calculator")}
              />
            }
            label={<h3>CVSS Calculator</h3>}
          />
          <p>
            CVSS Calculator is a module that allows you to calculate the CVSS
            score of a vulnerability.
          </p>
          <br />
        </Card>
        <Card sx={cardStyle}>
          <FormControlLabel
            control={
              <Switch
                checked={modules["Rules"].enabled}
                onChange={() => handleModuleChange("Rules")}
              />
            }
            label={<h3>Rules</h3>}
          />
          <p>Create Sigma rules using a graphical user interface.</p>
          <br />
        </Card>
      </FormGroup>
    </>
  );
}
