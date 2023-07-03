import React from "react";
import api from "../../api";
import { format, parseISO } from "date-fns";
import ReactCountryFlag from "react-country-flag";

import CircleIcon from "@mui/icons-material/Circle";
import Collapse from "@mui/material/Collapse";
import Grow from "@mui/material/Grow";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import LinearProgress from "@mui/material/LinearProgress";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Paper,
} from "@mui/material";
import useTheme from "@mui/material/styles/useTheme";
import Details from "./Details";

export default function ResultTable(props) {
  const theme = useTheme();
  const [response, setResponse] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(15);

  React.useEffect(() => {
    setLoading(true);
    api
      .get("/api/url/urlscanio/" + props.domain)
      .then((response) => {
        setResponse(response.data);
        setLoading(false);
      });
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading)
    return (
      <>
        <br />
        <LinearProgress />
        <br />
        <br />
      </>
    );
  if (!response) return null;

  function Row(props) {
    const section = props.row;
    const [open, setOpen] = React.useState(false);

    function Status(props) {
      const status = props;
      if (String(status).startsWith(2)) {
        return <CircleIcon sx={{ color: "green", fontSize: "small" }} />;
      } else if (String(status).startsWith(4)) {
        return <CircleIcon sx={{ color: "orange", fontSize: "small" }} />;
      } else if (String(status).startsWith(5)) {
        return <CircleIcon sx={{ color: "red", fontSize: "small" }} />;
      } else if (status === null) {
        return <></>;
      } else {
        return <CircleIcon sx={{ color: "darkgrey", fontSize: "small" }} />;
      }
    }

    return (
      <>
        <TableRow
          key={section["task"]["uuid"]}
          sx={{ bgcolor: theme.palette.background.tablecell }}
        >
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell>
            <ReactCountryFlag countryCode={section["page"]["country"]} />
            &nbsp;&nbsp;
            {section["task"]["domain"]}
          </TableCell>
          <TableCell>
            {Status(section["page"]["status"])}
            &nbsp;{section["page"]["status"]}
          </TableCell>
          <TableCell>
            {format(parseISO(section["task"]["time"]), "dd.MM.yyyy - hh:mm")}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell
            style={{
              paddingBottom: 0,
              paddingTop: 0,
              backgroundColor: theme.palette.background.card,
              overflowWrap: "anywhere",
            }}
            colSpan={6}
          >
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Details section={section} />
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  }

  return (
    <>
      <Grow in={true}>
        <TableContainer
          component={Paper}
          sx={{
            boxShadow: 0,
            borderRadius: 5,
            border: 1,
            borderColor: theme.palette.background.tableborder,
          }}
        >
          <Table aria-label="result_table">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ bgcolor: theme.palette.background.tableheader }}
                />
                <TableCell
                  sx={{
                    bgcolor: theme.palette.background.tableheader,
                    fontWeight: "bold",
                  }}
                >
                  Domain
                </TableCell>
                <TableCell
                  sx={{
                    bgcolor: theme.palette.background.tableheader,
                    fontWeight: "bold",
                  }}
                >
                  Status code
                </TableCell>
                <TableCell
                  sx={{
                    bgcolor: theme.palette.background.tableheader,
                    fontWeight: "bold",
                    textAlign: "left",
                  }}
                >
                  Found
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {response ? (
                response
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((section) => {
                    return <Row key={section["task"]["uuid"]} row={section} />;
                  })
              ) : (
                <TableRow>
                  <TableCell>No Data</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[15, 25, 50, 75, 100]}
            component="div"
            count={response.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Grow>
    </>
  );
}
