import React from "react";
import axios from "axios";

import PublicIcon from "@mui/icons-material/Public";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper
} from "@mui/material";
import useTheme from "@mui/material/styles/useTheme";


export default function ResultTable(props) {
  const [response] = React.useState(null);
  const theme = useTheme();

  const config = { headers: { "Content-Type": "multipart/form-data" } };
  let fd = new FormData();
  fd.append("file", props.result);
  axios
    .post(`http://localhost:8000/api/extractor`, fd, config)
    .then((response) => {
      const result = response.data;
    })
    .catch((error) => {
      console.log(error);
    });


  return (
    <TableContainer>
      <Table aria-label="result_table">
        <TableHead sx={{ bgcolor: theme.palette.background.tablecell }}>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>
              {" "}
              <PublicIcon /> Domains{" "}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {response["domains"] ? (
            response["domains"].map((section, index) => {
              return (
                <TableRow key={index + "_domains_row"}>
                  <TableCell>{section}</TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell>No Data</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
