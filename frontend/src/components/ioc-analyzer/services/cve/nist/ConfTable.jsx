import React, { useState } from "react";
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
import useTheme from "@mui/material/styles/useTheme";

export default function ConfTable(props) {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const cpeMatchLength = props.configuration.nodes
    .map((node) => node.cpeMatch)
    .reduce((acc, curr) => acc + curr.length, 0);

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
    <TableContainer component={Paper} sx={tableContainerStyle}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={tableCellStyle}>Vulnerable</TableCell>
            <TableCell sx={tableCellStyle}>Criteria</TableCell>
            <TableCell sx={tableCellStyle}>Verson from</TableCell>
            <TableCell sx={tableCellStyle}>Version to</TableCell>
            <TableCell sx={tableCellStyle}>Criteria ID</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.configuration.nodes.map((node, index) =>
            node.cpeMatch
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((cpeMatch, index) => (
                <TableRow>
                  <TableCell>{cpeMatch.vulnerable ? "Yes" : "No"}</TableCell>
                  <TableCell sx={{ whiteSpace: "pre-line" }}>
                    {cpeMatch.criteria}
                  </TableCell>
                  <TableCell>{cpeMatch.versionStartIncluding}</TableCell>
                  <TableCell>{cpeMatch.versionEndExcluding}</TableCell>
                  <TableCell>{cpeMatch.matchCriteriaId}</TableCell>
                </TableRow>
              ))
          )}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        component="div"
        count={cpeMatchLength}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
}
