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

  if (props.loading) {
    return (
      <>
        <TableRow key={props.id + "_row"}>
          <TableCell>
            <IconButton aria-label="expand row" size="large">
              <KeyboardArrowDownIcon />
            </IconButton>
          </TableCell>
          <TableCell>
            <CardHeader
              avatar={
                <Avatar
                  alt={`${props.icon} icon`}
                  src={require(`./icons/${props.icon}.png`)}
                  sx={{
                    width: 30,
                    height: 30,
                    border: "solid",
                    border: 1,
                    borderColor: theme.palette.background.tableborder,
                  }}
                />
              }
              title={props.name}
            />
          </TableCell>
          <TableCell>
            {" "}
            <CircularProgress />{" "}
          </TableCell>
          <TableCell></TableCell>
        </TableRow>
      </>
    );
  }

  if (!props.result || props.result === null) {
    return (
      <>
        <TableRow key={props.id + "_row"}>
          <TableCell>
            <IconButton aria-label="expand row" size="large">
              <KeyboardArrowDownIcon />
            </IconButton>
          </TableCell>
          <TableCell>
            <CardHeader
              avatar={
                <Avatar
                  alt={`${props.icon} icon`}
                  src={require(`./icons/${props.icon}.png`)}
                  sx={{
                    width: 30,
                    height: 30,
                    border: "solid",
                    border: 1,
                    borderColor: theme.palette.background.tableborder,
                  }}
                />
              }
              title={props.name}
            />
          </TableCell>
          <TableCell> Error </TableCell>
          <TableCell bgcolor="black"></TableCell>
        </TableRow>
      </>
    );
  }

  if (props.result.error && props.result.error === 401) {
    return (
      <>
        <TableRow key={props.id + "_row"}>
          <TableCell>
            <IconButton aria-label="expand row" size="large">
              <KeyboardArrowDownIcon />
            </IconButton>
          </TableCell>
          <TableCell>
            <CardHeader
              avatar={
                <Avatar
                  alt={`${props.icon} icon`}
                  src={require(`./icons/${props.icon}.png`)}
                  sx={{
                    width: 30,
                    height: 30,
                    border: "solid",
                    border: 1,
                    borderColor: theme.palette.background.tableborder,
                  }}
                />
              }
              title={props.name}
            />
          </TableCell>
          <TableCell>Invalid API key (401 Unauthorized) </TableCell>
          <TableCell bgcolor="black"></TableCell>
        </TableRow>
      </>
    );
  }

  if (props.result.error && props.result.error === 429) {
    return (
      <>
        <TableRow key={props.id + "_row"}>
          <TableCell>
            <IconButton aria-label="expand row" size="large">
              <KeyboardArrowDownIcon />
            </IconButton>
          </TableCell>
          <TableCell>
            <CardHeader
              avatar={
                <Avatar
                  alt={`${props.icon} icon`}
                  src={require(`./icons/${props.icon}.png`)}
                  sx={{
                    width: 30,
                    height: 30,
                    border: "solid",
                    border: 1,
                    borderColor: theme.palette.background.tableborder,
                  }}
                />
              }
              title={props.name}
            />
          </TableCell>
          <TableCell>API limits exceeded (429 Too Many Requests) </TableCell>
          <TableCell bgcolor="black"></TableCell>
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
          <TableCell>
            <IconButton aria-label="expand row" size="large">
              <KeyboardArrowDownIcon />
            </IconButton>
          </TableCell>
          <TableCell>
            <CardHeader
              avatar={
                <Avatar
                  alt={`${props.icon} icon`}
                  src={require(`./icons/${props.icon}.png`)}
                  sx={{
                    width: 30,
                    height: 30,
                    border: "solid",
                    border: 1,
                    borderColor: theme.palette.background.tableborder,
                  }}
                />
              }
              title={props.name}
            />
          </TableCell>
          <TableCell> Error: {props.result.error} </TableCell>
          <TableCell bgcolor="black"></TableCell>
        </TableRow>
      </>
    );
  }

  return (
    <>
      <TableRow key={props.id + "_row"}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="large"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          <CardHeader
            avatar={
              <Avatar
                alt={`${props.icon} icon`}
                src={require(`./icons/${props.icon}.png`)}
                sx={{
                  width: 30,
                  height: 30,
                  border: "solid",
                  border: 1,
                  borderColor: theme.palette.background.tableborder,
                }}
              />
            }
            title={props.name}
          />
        </TableCell>
        <TableCell>
          {" "}
          <>
            <p style={props.summary_color}> {props.summary} </p>
          </>
        </TableCell>
        <TableCell bgcolor={props.color}></TableCell>
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
