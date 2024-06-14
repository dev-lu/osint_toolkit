import React, { useEffect, useState, useRef } from "react";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import api from "../../../../api";
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
import ResultRow from "../../ResultRow";

const Breaches = ({ breaches }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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

  const filterResults = (array, searchTerm) => {
    return array.filter((item) =>
      Object.values(item).some((value) =>
        value
          ? value.toString().toLowerCase().includes(searchTerm.toLowerCase())
          : false
      )
    );
  };

  const paginate = (array, page, itemsPerPage) => {
    return array.slice(page * itemsPerPage, page * itemsPerPage + itemsPerPage);
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
    const breachText = breaches.map((account) => `${account.Name}`).join("\n");
    handleDownload(breachText, "breaches.txt");
  };

  const filteredBreaches = filterResults(breaches, searchTerm);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
      <Card
        variant="outlined"
        sx={{
          m: 1,
          p: 2,
          borderRadius: 5,
          boxShadow: 0,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Stack direction="row" spacing={2}>
            <LockOpenIcon fontSize="large" />
            <Typography variant="h5">
              Breaches ({filteredBreaches.length ? filteredBreaches.length : 0})
            </Typography>
          </Stack>
          <TextField
            label="Search Breaches"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{
              borderRadius: "10px",
              m: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
              },
            }}
            inputProps={{
              style: {
                padding: 8,
              },
            }}
          />
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 2, mb: 2 }}
        >
          A "breach" is an incident where data is inadvertently exposed in a
          vulnerable system, usually due to insufficient access controls or
          security weaknesses in the software. HIBP aggregates breaches and
          enables people to assess where their personal data has been exposed.
        </Typography>
        <CardContent sx={{ flexGrow: 1 }}>
          {filteredBreaches.length > 0 ? (
            paginate(filteredBreaches, page, itemsPerPage).map(
              (account, index) => (
                <Box key={index} mb={2}>
                  {account.Name && (
                    <Typography variant="body1">{account.Name}</Typography>
                  )}
                  <Divider sx={{ my: 1 }} />
                </Box>
              )
            )
          ) : (
            <Typography>No breaches found</Typography>
          )}
        </CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
          }}
        >
          <Button
            variant="outlined"
            color="primary"
            onClick={downloadBreaches}
          >
            Export Breaches
          </Button>
          <TablePagination
            component="div"
            count={filteredBreaches.length}
            page={page}
            onPageChange={handlePageChange}
            rowsPerPage={itemsPerPage}
            onRowsPerPageChange={handleItemsPerPageChange}
            rowsPerPageOptions={[10, 15, 25]}
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

  const filterResults = (array, searchTerm) => {
    return array.filter((item) =>
      Object.values(item).some((value) =>
        value
          ? value.toString().toLowerCase().includes(searchTerm.toLowerCase())
          : false
      )
    );
  };

  const paginate = (array, page, itemsPerPage) => {
    return array.slice(page * itemsPerPage, page * itemsPerPage + itemsPerPage);
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
    const pasteText = pastes
      .map(
        (paste) =>
          `Title: ${paste.Title}\nSource: ${paste.Source}\nDate: ${paste.Date}\nEmailCount: ${paste.EmailCount}\n\n`
      )
      .join("\n");
    handleDownload(pasteText, "pastes.txt");
  };

  const filteredPastes = filterResults(pastes, searchTerm);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
      <Card
        variant="outlined"
        sx={{
          m: 1,
          p: 2,
          borderRadius: 5,
          boxShadow: 0,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Stack direction="row" spacing={2}>
            <ContentPasteSearchIcon fontSize="large" />
            <Typography variant="h5">
              Pastes ({filteredPastes.length ? filteredPastes.length : 0})
            </Typography>
          </Stack>
          <TextField
            label="Search Pastes"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{
              borderRadius: "10px",
              m: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
              },
            }}
            inputProps={{
              style: {
                padding: 8,
              },
            }}
          />
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 2, mb: 2 }}
        >
          A "paste" is information that has been "pasted" to a publicly facing
          website designed to share content such as Pastebin. These services are
          favoured by hackers due to the ease of anonymously sharing information
          and they're frequently the first place a breach appears. HIBP searches
          through pastes that are broadcast by the accounts in the Paste Sources
          Twitter list and reported as having emails that are a potential
          indicator of a breach. Finding an email address in a paste does not
          immediately mean it has been disclosed as the result of a breach.
          Review the paste and determine if your account has been compromised
          then take appropriate action such as changing passwords.{" "}
        </Typography>
        <CardContent sx={{ flexGrow: 1 }}>
          {filteredPastes.length > 0 ? (
            paginate(filteredPastes, page, itemsPerPage).map((paste, index) => (
              <Box key={index} mb={2}>
                <Tooltip title="The title of the paste as observed on the source site.">
                  {paste.Title ? (
                    <Typography variant="h6">{paste.Title}</Typography>
                  ) : (
                    <Typography variant="h6" color="text.secondary">
                      No title
                    </Typography>
                  )}
                </Tooltip>
                {paste.Source && (
                  <Tooltip title="The paste service the record was retrieved from. Current values are: Pastebin, Pastie, Slexy, Ghostbin, QuickLeak, JustPaste, AdHocUrl, PermanentOptOut, OptOut">
                    <Typography variant="body1">
                      <b>Source:</b> {paste.Source}
                    </Typography>
                  </Tooltip>
                )}
                {paste.Date && (
                  <Tooltip title="The date and time (precision to the second) that the paste was posted. This is taken directly from the paste site when this information is available but may be null if no date is published.">
                    <Typography variant="body1">
                      <b>Date:</b> {paste.Date}
                    </Typography>
                  </Tooltip>
                )}
                {paste.EmailCount && (
                  <Tooltip title="	The number of emails that were found when processing the paste. Emails are extracted by using the regular expression \b[a-zA-Z0-9\.\-_\+]+@[a-zA-Z0-9\.\-_]+\.[a-zA-Z]+\b">
                    <Typography variant="body1">
                      <b>Email count:</b> {paste.EmailCount}
                    </Typography>
                  </Tooltip>
                )}
                <Divider sx={{ my: 1 }} />
              </Box>
            ))
          ) : (
            <Typography>No pastes found</Typography>
          )}
        </CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
          }}
        >
          <Button
            variant="outlined"
            color="primary"
            onClick={downloadPastes}
          >
            Export Pastes
          </Button>
          <TablePagination
            component="div"
            count={filteredPastes.length}
            page={page}
            onPageChange={handlePageChange}
            rowsPerPage={itemsPerPage}
            onRowsPerPageChange={handleItemsPerPageChange}
            rowsPerPageOptions={[5, 10, 15]}
          />
        </Box>
      </Card>
    </Box>
  );
};

export default function Haveibeenpwnd(props) {
  const propsRef = useRef(props);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url =
          "/api/" +
          propsRef.current.type +
          "/haveibeenpwnd/" +
          encodeURIComponent(propsRef.current.email);
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
      {result && (
        <Box sx={{ margin: 1 }}>
          <Grid container spacing={2}>
            {result.breachedaccount && (
              <Grid item xs={12} md={6} sx={{ display: "flex" }}>
                <Breaches breaches={result.breachedaccount} />
              </Grid>
            )}
            {result.pasteaccount && (
              <Grid item xs={12} md={6} sx={{ display: "flex" }}>
                <Pastes pastes={result.pasteaccount} />
              </Grid>
            )}
          </Grid>
        </Box>
      )}
    </>
  );

  return (
    <>
      <ResultRow
        name="Have I Been Pwned"
        id="hibp"
        icon="hibp_logo_small"
        loading={loading}
        result={result}
        summary={
          result &&
          ((result.pasteaccount && result.pasteaccount.length > 0) ||
          (result.breachedaccount && result.breachedaccount.length > 0) ? (
            <>
              This address was found in{" "}
              <b>
                {result.breachedaccount ? result.breachedaccount.length : 0}
              </b>{" "}
              Breaches and{" "}
              <b>{result.pasteaccount ? result.pasteaccount.length : 0}</b>{" "}
              Pastes
            </>
          ) : (
            <>No pastes or breaches found</>
          ))
        }
        summary_color={{ color: null }}
        color={
          result &&
          ((result.pasteaccount && result.pasteaccount.length > 0) ||
          (result.breachedaccount && result.breachedaccount.length > 0)
            ? result.breachedaccount
              ? "orange"
              : "green"
            : "green")
        }
        error={error}
        details={details}
      />
    </>
  );
}
