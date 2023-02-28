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


export default function ResultTable(props) {
  const [response] = React.useState(null);

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
    <TableContainer component={Paper}>
      <Table aria-label="result_table">
        <TableHead sx={{ bgcolor: "WhiteSmoke" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>
              {" "}
              <PublicIcon /> Domains{" "}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {response["domains"] ? (
            response["domains"].map((section) => {
              return (
                <TableRow key={section}>
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
