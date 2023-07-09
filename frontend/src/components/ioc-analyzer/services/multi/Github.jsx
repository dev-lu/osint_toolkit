import React from "react";
import api from "../../../../api";
import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import NoDetails from "../NoDetails";
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
import Typography from "@mui/material/Typography";

import ResultRow from "../../ResultRow";

export default function Github(props) {
  const theme = useTheme();
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const url = "/api/multi/github?ioc=" + props.ioc;
        const response = await api.get(url);
        setResult(response.data);
      } catch (e) {
        setError(e);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const details = (
    <>
      {result && result["items"] && result["items"].length > 0 ? (
        <Box sx={{ margin: 1 }}>
          <Card
            variant="outlined"
            sx={{ mb: 2, borderRadius: 5, boxShadow: 0 }}
          >
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                GitHub results
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
                        Filename
                      </TableCell>
                      <TableCell
                        sx={{
                          bgcolor: theme.palette.background.tablecell,
                          fontWeight: "bold",
                        }}
                      >
                        URL
                      </TableCell>
                      <TableCell
                        sx={{
                          bgcolor: theme.palette.background.tablecell,
                          fontWeight: "bold",
                        }}
                      >
                        Repository
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {result["items"]
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((result, index) => (
                        <TableRow key={index}>
                          <TableCell>{result["name"]}</TableCell>
                          <TableCell>{result["html_url"]}</TableCell>
                          <TableCell>
                            {result["repository"]["full_name"]}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                <TablePagination
                  rowsPerPageOptions={[3, 5, 10, 25, 50, 100]}
                  component="div"
                  count={Object.entries(result["items"]).length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableContainer>
            </CardContent>
          </Card>
        </Box>
      ) : (
        <Grid
          xs
          item={true}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <NoDetails />
        </Grid>
      )}
    </>
  );

  return (
    <>
      <ResultRow
        name="GitHub"
        id="github"
        icon="github_logo_small"
        loading={loading}
        result={result ? result : null}
        summary={result ? result.total_count + " result(s) " : null}
        summary_color={{ color: null }}
        color={result && result.total_count > 0 ? "red" : "green"}
        error={error}
        details={details}
      />
    </>
  );
}
