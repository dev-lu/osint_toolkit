import React from "react";
import { useState } from "react";

import NoDetails from "./services/NoDetails";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import CardHeader from "@mui/material/CardHeader";
import CircularProgress from "@mui/material/CircularProgress";
import Collapse from "@mui/material/Collapse";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { TableRow, TableCell } from "@mui/material";
import useTheme from "@mui/material/styles/useTheme";

export default function ResultRow(props) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  /*
    Available props:  
    - name
    - icon
    - loading
    - result
    - summary
    - summary_color
    - color
    - details
  */

  const cellStyle = {
    padding: "16px",
    verticalAlign: "middle",
  };

  const avatarStyle = {
    width: 30,
    height: 30,
    border: "1px solid",
    borderColor: theme.palette.background.tableborder,
  };

  if (props.loading) {
    return (
      <>
        <TableRow key={props.id + "_row"}>
          <TableCell style={cellStyle}>
            <IconButton aria-label="expand row" size="small">
              <KeyboardArrowDownIcon />
            </IconButton>
          </TableCell>
          <TableCell style={cellStyle}>
            <CardHeader
              avatar={
                <Avatar
                  alt={`${props.icon} icon`}
                  src={require(`./icons/${props.icon}.png`)}
                  sx={avatarStyle}
                />
              }
              title={props.name}
              sx={{ padding: 0 }}
            />
          </TableCell>
          <TableCell style={cellStyle}>
            <CircularProgress size={24} />
          </TableCell>
          <TableCell style={cellStyle}></TableCell>
        </TableRow>
      </>
    );
  }

  if (!props.result || props.result === null) {
    return (
      <>
        <TableRow key={props.id + "_row"}>
          <TableCell style={cellStyle}>
            <IconButton aria-label="expand row" size="small">
              <KeyboardArrowDownIcon />
            </IconButton>
          </TableCell>
          <TableCell style={cellStyle}>
            <CardHeader
              avatar={
                <Avatar
                  alt={`${props.icon} icon`}
                  src={require(`./icons/${props.icon}.png`)}
                  sx={avatarStyle}
                />
              }
              title={props.name}
              sx={{ padding: 0 }}
            />
          </TableCell>
          <TableCell style={cellStyle}> Error </TableCell>
          <TableCell style={cellStyle} bgcolor="black"></TableCell>
        </TableRow>
      </>
    );
  }

  if (props.result.error && props.result.error === 401) {
    return (
      <>
        <TableRow key={props.id + "_row"}>
          <TableCell style={cellStyle}>
            <IconButton aria-label="expand row" size="small">
              <KeyboardArrowDownIcon />
            </IconButton>
          </TableCell>
          <TableCell style={cellStyle}>
            <CardHeader
              avatar={
                <Avatar
                  alt={`${props.icon} icon`}
                  src={require(`./icons/${props.icon}.png`)}
                  sx={avatarStyle}
                />
              }
              title={props.name}
              sx={{ padding: 0 }}
            />
          </TableCell>
          <TableCell style={cellStyle}>
            Invalid API key (401 Unauthorized){" "}
          </TableCell>
          <TableCell style={cellStyle} bgcolor="black"></TableCell>
        </TableRow>
      </>
    );
  }

  if (props.result.error && props.result.error === 404) {
    return (
      <>
        <TableRow key={props.id + "_row"}>
          <TableCell style={cellStyle}>
            <IconButton aria-label="expand row" size="small">
              <KeyboardArrowDownIcon />
            </IconButton>
          </TableCell>
          <TableCell style={cellStyle}>
            <CardHeader
              avatar={
                <Avatar
                  alt={`${props.icon} icon`}
                  src={require(`./icons/${props.icon}.png`)}
                  sx={avatarStyle}
                />
              }
              title={props.name}
              sx={{ padding: 0 }}
            />
          </TableCell>
          <TableCell style={cellStyle}>
            No intelligence information found
          </TableCell>
          <TableCell style={cellStyle} bgcolor="green"></TableCell>
        </TableRow>
      </>
    );
  }

  if (props.result.error && props.result.error === 429) {
    return (
      <>
        <TableRow key={props.id + "_row"}>
          <TableCell style={cellStyle}>
            <IconButton aria-label="expand row" size="small">
              <KeyboardArrowDownIcon />
            </IconButton>
          </TableCell>
          <TableCell style={cellStyle}>
            <CardHeader
              avatar={
                <Avatar
                  alt={`${props.icon} icon`}
                  src={require(`./icons/${props.icon}.png`)}
                  sx={avatarStyle}
                />
              }
              title={props.name}
              sx={{ padding: 0 }}
            />
          </TableCell>
          <TableCell style={cellStyle}>
            API limits exceeded (429 Too Many Requests){" "}
          </TableCell>
          <TableCell style={cellStyle} bgcolor="black"></TableCell>
        </TableRow>
      </>
    );
  }

  if (
    props.result.error &&
    typeof props.result.error === "number" &&
    String(props.result.error).length === 3
  ) {
    return (
      <>
        <TableRow key={props.id + "_row"}>
          <TableCell style={cellStyle}>
            <IconButton aria-label="expand row" size="small">
              <KeyboardArrowDownIcon />
            </IconButton>
          </TableCell>
          <TableCell style={cellStyle}>
            <CardHeader
              avatar={
                <Avatar
                  alt={`${props.icon} icon`}
                  src={require(`./icons/${props.icon}.png`)}
                  sx={avatarStyle}
                />
              }
              title={props.name}
              sx={{ padding: 0 }}
            />
          </TableCell>
          <TableCell style={cellStyle}> Error: {props.result.error} </TableCell>
          <TableCell style={cellStyle} bgcolor="black"></TableCell>
        </TableRow>
      </>
    );
  }

  return (
    <>
      <TableRow key={props.id + "_row"}>
        <TableCell style={cellStyle}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell style={cellStyle}>
          <CardHeader
            avatar={
              <Avatar
                alt={`${props.icon} icon`}
                src={require(`./icons/${props.icon}.png`)}
                sx={avatarStyle}
              />
            }
            title={props.name}
            sx={{ padding: 0 }}
          />
        </TableCell>
        <TableCell style={cellStyle}>
          {" "}
          <>
            <p style={props.summary_color}> {props.summary} </p>
          </>
        </TableCell>
        <TableCell
          style={{ ...cellStyle, backgroundColor: props.color }}
        ></TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{
            paddingBottom: 0,
            paddingTop: 0,
            backgroundColor: theme.palette.background.card,
          }}
          colSpan={6}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              {props.result["error"] ? (
                <Grid
                  xs
                  item={true}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <NoDetails />
                </Grid>
              ) : (
                <>{props.details}</>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
