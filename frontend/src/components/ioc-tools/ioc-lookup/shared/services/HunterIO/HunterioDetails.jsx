import React, { useState } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import InfoIcon from "@mui/icons-material/Info";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import SourceIcon from "@mui/icons-material/Source";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Link, 
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { useTheme } from '@mui/material/styles';

import NoDetails from "../NoDetails";

const DetailListItem = ({ primary, secondary }) => (
  <ListItem dense disableGutters>
    <ListItemText
      primary={primary}
      secondary={typeof secondary === 'boolean' ? (secondary ? "Yes" : "No") : (secondary || "N/A")}
      primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
      secondaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
    />
  </ListItem>
);

export default function HunterioDetails({ result, ioc }) { 
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

  if (!result || !result.data) {
    const message = result && result.error 
        ? `Error fetching Hunter.io details: ${result.message || result.error}` 
        : "Hunter.io details are unavailable or the data is incomplete.";
    return (
      <Box sx={{ margin: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 100 }}>
        <NoDetails message={message} />
      </Box>
    );
  }

  const hunterData = result.data; 
  const sources = Array.isArray(hunterData.sources) ? hunterData.sources : [];

  return (
    <Box sx={{ margin: 1, mt:0 }}> 
      <Grid container spacing={2}>
        {/* Verification Details Card */}
        <Grid item xs={12} md={5}>
          <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <CardContent>
              <Grid direction="row" container spacing={1} alignItems="center" mb={1}>
                <InfoIcon color="action" />
                <Typography variant="h6" component="div" sx={{ ml: 1 }}>
                  Email Verification Details
                </Typography>
              </Grid>
              <List dense>
                <DetailListItem primary="Queried Email:" secondary={hunterData.email || ioc} />
                <DetailListItem primary="Verification Result:" secondary={hunterData.result} />
                <DetailListItem primary="Status:" secondary={hunterData.status} />
                <DetailListItem primary="Score:" secondary={hunterData.score} />
                <DetailListItem primary="Regexp Valid:" secondary={hunterData.regexp} />
                <DetailListItem primary="Gibberish (Auto-generated):" secondary={hunterData.gibberish} />
                <DetailListItem primary="Disposable Email:" secondary={hunterData.disposable} />
                <DetailListItem primary="Webmail (e.g., Gmail):" secondary={hunterData.webmail} />
                <DetailListItem primary="MX Records Found:" secondary={hunterData.mx_records} />
                <DetailListItem primary="SMTP Server Connect:" secondary={hunterData.smtp_server} />
                <DetailListItem primary="SMTP Check (No Bounce):" secondary={hunterData.smtp_check} />
                <DetailListItem primary="Domain Accepts All:" secondary={hunterData.accept_all} />
                <DetailListItem primary="SMTP Check Blocked:" secondary={hunterData.block} />
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Sources Card */}
        <Grid item xs={12} md={7}>
          <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{flexGrow: 1, display: 'flex', flexDirection: 'column'}}>
              <Grid direction="row" container spacing={1} alignItems="center" mb={1}>
                <SourceIcon color="action" />
                <Typography variant="h6" component="div" sx={{ ml: 1 }}>
                  Sources ({sources.length})
                </Typography>
              </Grid>
              <Typography variant="caption" color="text.disabled" display="block" mb={2}>
                Web pages where this email address was found. Limited to the most recent sources by Hunter.io.
              </Typography>
              {sources.length > 0 ? (
                <TableContainer
                  component={Paper}
                  elevation={0}
                  sx={{
                    border: '1px solid',
                    borderColor: theme.palette.divider,
                    borderRadius: 1,
                    flexGrow: 1 
                  }}
                >
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ bgcolor: theme.palette.background.paper, fontWeight: "bold" }}>Domain</TableCell>
                        <TableCell sx={{ bgcolor: theme.palette.background.paper, fontWeight: "bold" }}>URI</TableCell>
                        <TableCell sx={{ bgcolor: theme.palette.background.paper, fontWeight: "bold" }}>Extracted</TableCell>
                        <TableCell sx={{ bgcolor: theme.palette.background.paper, fontWeight: "bold" }}>Last Seen</TableCell>
                        <TableCell sx={{ bgcolor: theme.palette.background.paper, fontWeight: "bold" }}>Still on Page</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sources
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((source, index) => (
                          <TableRow hover key={source.uri + index}> 
                            <TableCell sx={{wordBreak:'break-all'}}>{source.domain}</TableCell>
                            <TableCell sx={{wordBreak:'break-all'}}>
                                <Link href={source.uri} target="_blank" rel="noopener noreferrer" sx={{display:'block', maxWidth: 200, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}} title={source.uri}>
                                    {source.uri}
                                </Link>
                            </TableCell>
                            <TableCell>{source.extracted_on || 'N/A'}</TableCell>
                            <TableCell>{source.last_seen_on || 'N/A'}</TableCell>
                            <TableCell>{source.still_on_page ? "Yes" : "No"}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography sx={{textAlign:'center', mt:2}}>No public sources found for this email address.</Typography>
              )}
            </CardContent>
             {sources.length > 0 && (
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={sources.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{ borderTop: `1px solid ${theme.palette.divider}`, flexShrink: 0 }} 
                />
             )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}