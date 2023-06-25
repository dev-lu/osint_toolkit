import React from "react";

import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import BusinessIcon from "@mui/icons-material/Business";
import ExtensionOutlinedIcon from "@mui/icons-material/ExtensionOutlined";
import GppMaybeOutlinedIcon from "@mui/icons-material/GppMaybeOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import LanIcon from "@mui/icons-material/Lan";
import RouterOutlinedIcon from "@mui/icons-material/RouterOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";

import Card from "@mui/material/Card";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import { Typography } from "@mui/material";

export default function Details(props) {
  return (
    <Card
      variant="outlined"
      sx={{
        mb: 1,
        mr: 1,
        p: 2,
        borderRadius: 5,
        boxShadow: 0,
        width: "calc(50% - 10px)",
      }}
    >
      <Typography variant="h5" component="h2" gutterBottom>
        Details
      </Typography>
      <List>
        <ListItem alignItems="flex-start">
          <ListItemIcon>
            <GppMaybeOutlinedIcon
              color={props.malCount > 0 ? "error" : "primary"}
            />
          </ListItemIcon>
          <ListItemText
            primary={`Detected as malicious by ${props.malCount} engine(s)`}
          />
        </ListItem>
        {props.result["data"]["attributes"]["regional_internet_registry"] && (
          <ListItem alignItems="flex-start">
            <ListItemIcon>
              <RouterOutlinedIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Internet registry"
              secondary={
                props.result["data"]["attributes"]["regional_internet_registry"]
              }
            />
          </ListItem>
        )}
        {props.result["data"]["attributes"]["network"] && (
          <ListItem alignItems="flex-start">
            <ListItemIcon>
              <LanIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Network"
              secondary={props.result["data"]["attributes"]["network"]}
            />
          </ListItem>
        )}
        {props.result["data"]["attributes"]["country"] && (
          <ListItem alignItems="flex-start">
            <ListItemIcon>
              <LanguageOutlinedIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Country"
              secondary={props.result["data"]["attributes"]["country"]}
            />
          </ListItem>
        )}
        {props.result["data"]["attributes"]["as_owner"] && (
          <ListItem alignItems="flex-start">
            <ListItemIcon>
              <BusinessIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="AS owner"
              secondary={props.result["data"]["attributes"]["as_owner"]}
            />
          </ListItem>
        )}
        {props.result["data"]["attributes"]["type_extension"] && (
          <ListItem alignItems="flex-start">
            <ListItemIcon>
              <ExtensionOutlinedIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Type extension"
              secondary={props.result["data"]["attributes"]["type_extension"]}
            />
          </ListItem>
        )}
        {props.result["data"]["attributes"]["magic"] && (
          <ListItem alignItems="flex-start">
            <ListItemIcon>
              <AutoFixHighIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Magic"
              secondary={props.result["data"]["attributes"]["magic"]}
            />
          </ListItem>
        )}
        {props.result["data"]["attributes"]["md5"] && (
          <ListItem alignItems="flex-start">
            <ListItemIcon>
              <InsertDriveFileOutlinedIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="MD5"
              secondary={props.result["data"]["attributes"]["md5"]}
              style={{ wordBreak: "break-all" }}
            />
          </ListItem>
        )}
        {props.result["data"]["attributes"]["sha1"] && (
          <ListItem alignItems="flex-start">
            <ListItemIcon>
              <InsertDriveFileOutlinedIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="SHA1"
              secondary={props.result["data"]["attributes"]["sha1"]}
              style={{ wordBreak: "break-all" }}
            />
          </ListItem>
        )}
        {props.result["data"]["attributes"]["sha256"] && (
          <ListItem alignItems="flex-start">
            <ListItemIcon>
              <InsertDriveFileOutlinedIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="SHA256"
              secondary={props.result["data"]["attributes"]["sha256"]}
              style={{ wordBreak: "break-all" }}
            />
          </ListItem>
        )}
        {props.result["data"]["attributes"]["ssdeep"] && (
          <ListItem alignItems="flex-start">
            <ListItemIcon>
              <InsertDriveFileOutlinedIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="ssdeep"
              secondary={props.result["data"]["attributes"]["ssdeep"]}
              style={{ wordBreak: "break-all" }}
            />
          </ListItem>
        )}
        {props.result["data"]["attributes"]["tlsh"] && (
          <ListItem alignItems="flex-start">
            <ListItemIcon>
              <InsertDriveFileOutlinedIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="TLSH"
              secondary={props.result["data"]["attributes"]["tlsh"]}
              style={{ wordBreak: "break-all" }}
            />
          </ListItem>
        )}
        {props.result["data"]["attributes"]["vhash"] && (
          <ListItem alignItems="flex-start">
            <ListItemIcon>
              <InsertDriveFileOutlinedIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="vhash"
              secondary={props.result["data"]["attributes"]["vhash"]}
              style={{ wordBreak: "break-all" }}
            />
          </ListItem>
        )}
        {props.result["data"]["attributes"]["unique_sources"] && (
          <ListItem alignItems="flex-start">
            <ListItemIcon>
              <CategoryOutlinedIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Unique sources"
              secondary={props.result["data"]["attributes"]["unique_sources"]}
            />
          </ListItem>
        )}
      </List>
    </Card>
  );
}
