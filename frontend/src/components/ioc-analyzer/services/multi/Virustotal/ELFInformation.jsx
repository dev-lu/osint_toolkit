import React from "react";
import { useState } from "react";

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";
import TerminalIcon from "@mui/icons-material/Terminal";
import { Typography } from "@mui/material";
import { useTheme } from '@mui/material/styles';

export default function ELFInformation(props) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const theme = useTheme();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Card
      key="tags_card"
      sx={{ m: 1, p: 2, borderRadius: 1, boxShadow: 0 }}
    >
      <Grid container alignItems="center">
        <Grid mr={1} item>
          <TerminalIcon />
        </Grid>
        <Grid item>
          <Typography variant="h5" component="h2" gutterBottom>
            ELF information (Executable and Linkable Format)
          </Typography>
        </Grid>
      </Grid>
      <Typography variant="h5" component="h2" gutterBottom mt={2}>
        Header
      </Typography>
      <List>
        <Grid container spacing={2}>
          {Object.entries(
            props.result["data"]["attributes"]["elf_info"]["header"]
          ).map(([key, value]) => (
            <Grid item xs={4} key={key}>
              <ListItem>
                <ListItemText primary={key} secondary={value} />
              </ListItem>
            </Grid>
          ))}
        </Grid>
      </List>
      <Typography variant="h5" component="h2" gutterBottom mt={2}>
        Section List
      </Typography>
      <TableContainer
        component={Paper}
        sx={{
          boxShadow: 0,
          borderRadius: 5,
          border: 1,
          borderColor: theme.palette.background.tableborder,
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  bgcolor: theme.palette.background.tablecell,
                  fontWeight: "bold",
                }}
              >
                Name
              </TableCell>
              <TableCell
                sx={{
                  bgcolor: theme.palette.background.tablecell,
                  fontWeight: "bold",
                }}
              >
                Section type
              </TableCell>
              <TableCell
                sx={{
                  bgcolor: theme.palette.background.tablecell,
                  fontWeight: "bold",
                }}
              >
                Virtual address
              </TableCell>
              <TableCell
                sx={{
                  bgcolor: theme.palette.background.tablecell,
                  fontWeight: "bold",
                }}
              >
                Physical offset
              </TableCell>
              <TableCell
                sx={{
                  bgcolor: theme.palette.background.tablecell,
                  fontWeight: "bold",
                }}
              >
                Flags
              </TableCell>
              <TableCell
                sx={{
                  bgcolor: theme.palette.background.tablecell,
                  fontWeight: "bold",
                }}
              >
                Size
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.result["data"]["attributes"]["elf_info"]["section_list"]
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((section, index) => (
                <TableRow key={index}>
                  <TableCell>{section["name"]}</TableCell>
                  <TableCell>{section.section_type}</TableCell>
                  <TableCell>{section.virtual_address}</TableCell>
                  <TableCell>{section.physical_offset}</TableCell>
                  <TableCell>{section.flags}</TableCell>
                  <TableCell>{section.size}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          component="div"
          count={
            Object.entries(
              props.result["data"]["attributes"]["elf_info"]["section_list"]
            ).length
          }
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
      <Typography variant="h5" component="h2" gutterBottom mt={2}>
        Segment List
      </Typography>
      <List>
        {props.result["data"]["attributes"]["elf_info"]["segment_list"].map(
          (segment, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={segment.segment_type}
                secondary={segment.resources.join(", ")}
              />
            </ListItem>
          )
        )}
      </List>
    </Card>
  );
}
