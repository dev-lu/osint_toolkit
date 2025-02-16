import React, { useState } from "react";

import CardHeader from "../styled/CardHeader";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Collapse,
  Grow,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from "@mui/material";
import RouteIcon from "@mui/icons-material/Route";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export default function Hops(props) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const card_style = {
    p: 1,
    mt: 2,
    boxShadow: 0,
    borderRadius: 1,
  };

  const tableContainerStyle = {
    borderRadius: 1,
    maxWidth: "95%",
    boxShadow: 0,
    border: 0,
    borderColor: "lightgrey",
    m: 2,
  };

  function showHops() {
    if (props.result != null) {
      return (
        <>
          <TableContainer component={Paper} sx={tableContainerStyle}>
            <Table aria-label="simple table" >
              <TableHead>
                <TableRow>
                  <TableCell align="left" >
                    {" "}
                    <b> Hop </b>{" "}
                  </TableCell>
                  <TableCell align="left" >
                    {" "}
                    <b> From </b>{" "}
                  </TableCell>
                  <TableCell align="left" >
                    {" "}
                    <b> By </b>{" "}
                  </TableCell>
                  <TableCell align="left" >
                    {" "}
                    <b> With </b>{" "}
                  </TableCell>
                  <TableCell align="left" >
                    {" "}
                    <b> Date / Time </b>{" "}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.result.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="left" sx={{ overflowWrap: "anywhere" }}>
                      {row["number"]}
                    </TableCell>
                    <TableCell align="left" sx={{ overflowWrap: "anywhere" }}>
                      {row["from"]}
                    </TableCell>
                    <TableCell align="left" sx={{ overflowWrap: "anywhere" }}>
                      {row["by"]}
                    </TableCell>
                    <TableCell align="left" sx={{ overflowWrap: "anywhere" }}>
                      {row["with"]}
                    </TableCell>
                    <TableCell align="left" sx={{ overflowWrap: "anywhere" }}>
                      {row["date"]}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      );
    } else {
      return (
        <>
          <p>Could not parse hops...</p>
        </>
      );
    }
  }

  return (
    <>
      <Grow in={true}>
        <Card key={"ema_file_hops_card"} sx={card_style}>
        <CardActionArea onClick={() => setOpen(!open)} sx={{ padding: '2px' }}>
            <CardContent sx={{ padding: '1px' }}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                width="100%"
              >
                <CardHeader
                  text={`Hops (${props.result.length})`}
                  icon={<RouteIcon />}
                />
                <IconButton size="small">
                  {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              </Box>
            </CardContent>
          </CardActionArea>
          <Collapse in={open} timeout="auto" unmountOnExit>
            {showHops()}
          </Collapse>
        </Card>
      </Grow>
    </>
  );
}
