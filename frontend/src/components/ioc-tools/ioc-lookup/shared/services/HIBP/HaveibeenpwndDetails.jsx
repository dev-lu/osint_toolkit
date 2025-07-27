import React, { useState } from "react"; 
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Stack,
  TablePagination,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import NoDetails from "../NoDetails"; 

const Breaches = ({ breaches }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  if (!breaches || breaches.length === 0) {
    return (
      <Card variant="outlined" sx={{ m: 1, p: 2, borderRadius: 2, boxShadow: 0, flexGrow: 1, border: '1px solid', borderColor: 'divider' }}>
        <Stack direction="row" spacing={1} alignItems="center" mb={1}>
          <LockOpenIcon />
          <Typography variant="h6">Breaches</Typography>
        </Stack>
        <Typography>No breaches found for this email address.</Typography>
      </Card>
    );
  }

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const filterResults = (array, term) => {
    if (!term) return array;
    return array.filter((item) =>
      Object.values(item).some((value) =>
        value
          ? value.toString().toLowerCase().includes(term.toLowerCase())
          : false
      )
    );
  };

  const paginate = (array, p, ipp) => {
    return array.slice(p * ipp, p * ipp + ipp);
  };

  const handleDownload = (data, filename) => {
    const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadBreaches = () => {
    const breachText = filteredBreaches.map((account) => `${account.Name}`).join("\n");
    handleDownload(breachText, "breaches.txt");
  };

  const filteredBreaches = filterResults(breaches, searchTerm);
  const paginatedBreaches = paginate(filteredBreaches, page, itemsPerPage);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, height: '100%' }}>
      <Card
        variant="outlined"
        sx={{
          m: 1, 
          p: 2,
          borderRadius: 2,
          boxShadow: 0,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          border: '1px solid', 
          borderColor: 'divider'
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb:1
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <LockOpenIcon />
            <Typography variant="h6">
              Breaches ({filteredBreaches.length})
            </Typography>
          </Stack>
          <TextField
            label="Search Breaches"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ borderRadius: "10px", "& .MuiOutlinedInput-root": { borderRadius: "10px" }, inputProps: {style: { padding: 8 }} }}
          />
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
          Incidents where data was inadvertently exposed in vulnerable systems.
        </Typography>
        <CardContent sx={{ flexGrow: 1, p:0, overflowY: 'auto' }}> 
          {paginatedBreaches.length > 0 ? (
            paginatedBreaches.map((account) => ( 
              <Box key={account.Name || account.Title } mb={1} >
                {account.Name && (
                  <Typography variant="body1" component="div">
                    {account.Name}
                    {account.IsVerified && <Typography component="span" variant="caption" color="success.main" sx={{ml:1}}>(Verified)</Typography>}
                  </Typography>
                )}
                 {account.Domain && <Typography variant="caption" color="text.secondary" display="block">Domain: {account.Domain}</Typography>}
                <Divider sx={{ my: 0.5 }} />
              </Box>
            ))
          ) : (
            <Typography sx={{textAlign: 'center', mt: 2}}>No matching breaches found for search term.</Typography>
          )}
        </CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pt: 2, 
            borderTop: '1px solid',
            borderColor: 'divider',
            mt: 'auto' 
          }}
        >
          <Button
            variant="outlined"
            size="small"
            color="primary"
            onClick={downloadBreaches}
            disabled={filteredBreaches.length === 0}
          >
            Export List
          </Button>
          <TablePagination
            component="div"
            count={filteredBreaches.length}
            page={page}
            onPageChange={handlePageChange}
            rowsPerPage={itemsPerPage}
            onRowsPerPageChange={handleItemsPerPageChange}
            rowsPerPageOptions={[5, 10, 15, 25]}
            size="small"
          />
        </Box>
      </Card>
    </Box>
  );
};

const Pastes = ({ pastes }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  if (!pastes || pastes.length === 0) {
     return (
      <Card variant="outlined" sx={{ m: 1, p: 2, borderRadius: 2, boxShadow: 0, flexGrow: 1, border: '1px solid', borderColor: 'divider' }}>
        <Stack direction="row" spacing={1} alignItems="center" mb={1}>
          <ContentPasteSearchIcon />
          <Typography variant="h6">Pastes</Typography>
        </Stack>
        <Typography>No pastes found for this email address.</Typography>
      </Card>
    );
  }

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const filterResults = (array, term) => {
    if (!term) return array;
    return array.filter((item) =>
      Object.values(item).some((value) =>
        value
          ? value.toString().toLowerCase().includes(term.toLowerCase())
          : false
      )
    );
  };

  const paginate = (array, p, ipp) => {
    return array.slice(p * ipp, p * ipp + ipp);
  };

  const handleDownload = (data, filename) => {
    const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPastes = () => {
    const pasteText = filteredPastes
      .map(
        (paste) =>
          `Title: ${paste.Title || 'N/A'}\nSource: ${paste.Source}\nDate: ${paste.Date ? new Date(paste.Date).toLocaleDateString() : 'N/A'}\nEmailCount: ${paste.EmailCount}\n\n`
      )
      .join("\n");
    handleDownload(pasteText, "pastes.txt");
  };

  const filteredPastes = filterResults(pastes, searchTerm);
  const paginatedPastes = paginate(filteredPastes, page, itemsPerPage);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, height: '100%' }}>
      <Card
        variant="outlined"
        sx={{
          m: 1,
          p: 2,
          borderRadius: 2,
          boxShadow: 0,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          border: '1px solid', 
          borderColor: 'divider'
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <ContentPasteSearchIcon />
            <Typography variant="h6">
              Pastes ({filteredPastes.length})
            </Typography>
          </Stack>
          <TextField
            label="Search Pastes"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ borderRadius: "10px", "& .MuiOutlinedInput-root": { borderRadius: "10px" }, inputProps: {style: { padding: 8 }} }}
          />
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
          Information "pasted" to public sharing sites, often an early indicator of a breach.
        </Typography>
        <CardContent sx={{ flexGrow: 1, p:0, overflowY: 'auto' }}> 
          {paginatedPastes.length > 0 ? (
            paginatedPastes.map((paste) => ( 
              <Box key={paste.Id} mb={1}>
                <Tooltip title={paste.Title || "No Title Available"}>
                    <Typography variant="subtitle1" noWrap sx={{fontWeight:'medium'}}>
                        {paste.Title || "No Title"}
                    </Typography>
                </Tooltip>
                {paste.Source && (
                  <Typography variant="caption" display="block">
                    <b>Source:</b> {paste.Source}
                  </Typography>
                )}
                {paste.Date && (
                  <Typography variant="caption" display="block">
                    <b>Date:</b> {new Date(paste.Date).toLocaleDateString()}
                  </Typography>
                )}
                {typeof paste.EmailCount !== 'undefined' && (
                  <Typography variant="caption" display="block">
                    <b>Email count:</b> {paste.EmailCount}
                  </Typography>
                )}
                <Divider sx={{ my: 0.5 }} />
              </Box>
            ))
          ) : (
            <Typography sx={{textAlign: 'center', mt: 2}}>No matching pastes found for search term.</Typography>
          )}
        </CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pt: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            mt: 'auto'
          }}
        >
          <Button
            variant="outlined"
            size="small"
            color="primary"
            onClick={downloadPastes}
            disabled={filteredPastes.length === 0}
          >
            Export List
          </Button>
          <TablePagination
            component="div"
            count={filteredPastes.length}
            page={page}
            onPageChange={handlePageChange}
            rowsPerPage={itemsPerPage}
            onRowsPerPageChange={handleItemsPerPageChange}
            rowsPerPageOptions={[3, 5, 10]}
            size="small"
          />
        </Box>
      </Card>
    </Box>
  );
};

export default function HaveibeenpwndDetails({ result, ioc }) {

  if (!result) { 
     return (
      <Box sx={{ margin: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 100 }}>
        <NoDetails message="Loading Have I Been Pwned details..." />
      </Box>
    );
  }
  
  if (result.error) {
    return (
      <Box sx={{ margin: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 100 }}>
        <NoDetails message={`Error fetching HIBP details: ${result.message || result.error}`} />
      </Box>
    );
  }

  const breaches = result.breachedaccount || [];
  const pastes = result.pasteaccount || [];

  if (breaches.length === 0 && pastes.length === 0) {
     return (
      <Box sx={{ margin: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 100 }}>
        <NoDetails message={`No breaches or pastes found for "${ioc}" according to Have I Been Pwned.`} />
      </Box>
    );
  }

  return (
    <Box sx={{ margin: 1, mt:0 }}> 
      <Grid container spacing={2} alignItems="stretch"> 
        {(breaches.length > 0 || pastes.length === 0) && ( 
            <Grid item xs={12} md={pastes.length > 0 ? 6 : 12} sx={{ display: "flex" }}> 
                <Breaches breaches={breaches} />
            </Grid>
        )}
        {(pastes.length > 0 || breaches.length === 0) && (
            <Grid item xs={12} md={breaches.length > 0 ? 6 : 12} sx={{ display: "flex" }}> 
                <Pastes pastes={pastes} />
            </Grid>
        )}
      </Grid>
    </Box>
  );
}