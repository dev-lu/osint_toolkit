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
import HorizontalSplitIcon from "@mui/icons-material/HorizontalSplit";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export default function Header(props) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const card_style = {
    p: 2,
    mt: 2,
    backgroundColor: theme.palette.background.tablecell,
    boxShadow: 0,
    borderRadius: 5,
  };

  const tableCellStyle = {
    backgroundColor: theme.palette.background.tablecell,
  };

  const tableContainerStyle = {
    borderRadius: 5,
    maxWidth: "95%",
    boxShadow: 0,
    border: 0,
    borderColor: "lightgrey",
    m: 2,
  };

  function showHeaderFields() {
    if (props.result != null) {
      return (
        <>
          <TableContainer component={Paper} sx={tableContainerStyle}>
            <Table aria-label="simple table" sx={tableCellStyle}>
              <TableHead>
                <TableRow>
                  <TableCell align="left" sx={tableCellStyle}>
                    {" "}
                    <b> Keys </b>{" "}
                  </TableCell>
                  <TableCell align="left" sx={tableCellStyle}>
                    {" "}
                    <b> Value </b>{" "}
                  </TableCell>
                </TableRow>
              </TableHead>
              {Object.entries(props.result).map((key, index) => (
                <React.Fragment key={index}>
                  <TableBody>
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell align="left">{Object.keys(key[1])}</TableCell>
                      <TableCell align="left" sx={{ overflowWrap: "anywhere" }}>
                        {Object.values(key[1])}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </React.Fragment>
              ))}
            </Table>
          </TableContainer>
        </>
      );
    }
  }
  return (
    <>
      {/* Full header card */}
      <Grow in={true}>
        <Card key={"ema_file_header_card"} sx={card_style}>
          <CardActionArea onClick={() => setOpen(!open)}>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                width="100%"
              >
                <CardHeader
                  text={`Complete Header (${props.result.length} fields)`}
                  icon={<HorizontalSplitIcon />}
                />
                <IconButton size="small">
                  {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              </Box>
            </CardContent>
          </CardActionArea>
          <Collapse in={open} timeout="auto" unmountOnExit>
            {showHeaderFields()}
          </Collapse>
        </Card>
      </Grow>
    </>
  );
}
