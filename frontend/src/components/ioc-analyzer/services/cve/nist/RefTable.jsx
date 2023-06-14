import React from "react";
import { useState } from "react";

import Grid from "@mui/material/Grid";
import LinkIcon from "@mui/icons-material/Link";
import SourceIcon from "@mui/icons-material/Source";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TablePagination,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import useTheme from "@mui/material/styles/useTheme";

export default function RefTable(props) {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const tableContainerStyle = {
    boxShadow: 0,
    borderRadius: 5,
    border: 1,
    borderColor: theme.palette.background.tableborder,
    mb: 2,
  };

  const tableCellStyle = {
    bgcolor: theme.palette.background.tablecell,
    fontWeight: "bold",
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <TableContainer component={Paper} sx={tableContainerStyle}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={tableCellStyle}>
                <Grid container direction={"row"}>
                  <LinkIcon sx={{ mr: 1 }} />
                  <Typography variant="h7" gutterBottom component="div">
                    URL
                  </Typography>
                </Grid>
              </TableCell>
              <TableCell sx={tableCellStyle}>
                <Grid container direction={"row"}>
                  <SourceIcon sx={{ mr: 1 }} />
                  <Typography variant="h7" gutterBottom component="div">
                    Source
                  </Typography>
                </Grid>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.references
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((reference, index) => (
                <TableRow key={index}>
                  <TableCell>{reference.url}</TableCell>
                  <TableCell>{reference.source}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          component="div"
          count={props.references.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </>
  );
}
