import React, { useState } from "react";

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
  Link,
} from "@mui/material";
import { useTheme } from '@mui/material/styles';
import Typography from "@mui/material/Typography";
import GitHubIcon from '@mui/icons-material/GitHub';

export default function GithubDetails({ result, ioc }) { 
  const theme = useTheme();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (!result || result.error) {
    const message = result && result.error 
        ? `Error fetching GitHub details: ${result.message || result.error}` 
        : "GitHub details are unavailable or the data is incomplete.";
    return (
      <Box sx={{ margin: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 100 }}>
        <NoDetails message={message} />
      </Box>
    );
  }

  const items = Array.isArray(result.items) ? result.items : [];
  const totalCount = result.total_count || 0; 

  if (items.length === 0) {
    return (
      <Box sx={{ margin: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 100 }}>
        <NoDetails message={`No GitHub mentions found for "${ioc}". (Total reported: ${totalCount})`} />
      </Box>
    );
  }

  return (
    <Box sx={{ margin: 1, mt:0 }}> 
      <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <CardContent>
          <Grid container spacing={1} alignItems="center" mb={2}>
            <GitHubIcon color="action"/>
            <Typography variant="h6" component="div" sx={{ ml: 1 }}>
              GitHub Mentions ({totalCount} total)
            </Typography>
          </Grid>
          <TableContainer
            component={Paper}
            elevation={0} 
            sx={{
              borderRadius: 1,
              border: '1px solid', 
              borderColor: theme.palette.divider,
            }}
          >
            <Table stickyHeader aria-label="github results table">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      bgcolor: theme.palette.background.paper,
                      fontWeight: "bold",
                    }}
                  >
                    Filename
                  </TableCell>
                  <TableCell
                    sx={{
                      bgcolor: theme.palette.background.paper,
                      fontWeight: "bold",
                    }}
                  >
                    URL
                  </TableCell>
                  <TableCell
                    sx={{
                      bgcolor: theme.palette.background.paper,
                      fontWeight: "bold",
                    }}
                  >
                    Repository
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items
                  .slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                  .map((item, index) => (
                    <TableRow 
                        key={item.html_url || index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        hover
                    >
                      <TableCell sx={{wordBreak: 'break-all'}}>{item.name}</TableCell>
                      <TableCell sx={{wordBreak: 'break-all'}}>
                        <Link href={item.html_url} target="_blank" rel="noopener noreferrer">
                          {item.html_url}
                        </Link>
                      </TableCell>
                      <TableCell sx={{wordBreak: 'break-all'}}>
                        <Link href={item.repository?.html_url} target="_blank" rel="noopener noreferrer">
                            {item.repository?.full_name}
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[3, 5, 10, 25, 50, 100]}
              component="div"
              count={items.length} 
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{ borderTop: `1px solid ${theme.palette.divider}`}}
            />
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}