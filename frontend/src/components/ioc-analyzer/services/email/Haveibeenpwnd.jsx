import React, { useEffect, useState, useRef, useCallback } from "react";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import VisibilityIcon from "@mui/icons-material/Visibility";
import api from "../../../../api";
import {
  Box,
  Card,
  Divider,
  Typography,
  Grid,
  TextField,
  TablePagination,
  CardContent,
  Stack,
  Tooltip,
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

  const filteredBreaches = filterResults(breaches, searchTerm);

  return (
    <Card variant="outlined" sx={{ m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Stack direction="row" spacing={2}>
          <VisibilityIcon fontSize="large" />
          <Typography variant="h5">Breaches</Typography>
        </Stack>
        <TextField
          label="Search Breaches"
          variant="outlined"
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
              padding: 10,
            },
          }}
        />
      </Box>
      <Typography variant="body2" sx={{ mt: 2, mb: 2 }}>
        A "breach" is an incident where data is inadvertently exposed in a
        vulnerable system, usually due to insufficient access controls or
        security weaknesses in the software. HIBP aggregates breaches and
        enables people to assess where their personal data has been exposed.
      </Typography>
      <CardContent>
        {filteredBreaches.length > 0 ? (
          paginate(filteredBreaches, page, itemsPerPage).map(
            (account, index) => (
              <Box key={index} mb={2}>
                {account.Name && (
                  <Typography variant="body1">{account.Name}</Typography>
                )}
                {account.Title && (
                  <Typography variant="body1">
                    <b>Title:</b> {account.Title}
                  </Typography>
                )}
                {account.Domain && (
                  <Typography variant="body1">
                    <b>Domain:</b> {account.Domain}
                  </Typography>
                )}
                {account.BreachDate && (
                  <Typography variant="body1">
                    <b>Breach date:</b> {account.BreachDate}
                  </Typography>
                )}
                {account.AddedDate && (
                  <Typography variant="body1">
                    <b>Added date:</b> {account.AddedDate}
                  </Typography>
                )}
                {account.ModifiedDate && (
                  <Typography variant="body1">
                    <b>Modified date:</b> {account.ModifiedDate}
                  </Typography>
                )}
                {account.IsMalware && (
                  <Typography variant="body1">
                    <b>Breach is sourced from malware:</b> {account.IsMalware}
                  </Typography>
                )}
                {account.IsSpamList && (
                  <Typography variant="body1">
                    <b>Is a spam list:</b> {account.IsSpamList}
                  </Typography>
                )}
                {account.IsFabricated && (
                  <Typography variant="body1">
                    <b>Is fabricated:</b> {account.IsFabricated}
                  </Typography>
                )}
                <Divider sx={{ my: 1 }} />
              </Box>
            )
          )
        ) : (
          <Typography>No breaches found</Typography>
        )}
      </CardContent>
      <TablePagination
        component="div"
        count={filteredBreaches.length}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={itemsPerPage}
        onRowsPerPageChange={handleItemsPerPageChange}
        rowsPerPageOptions={[8, 16, 32]}
      />
    </Card>
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

  const filteredPastes = filterResults(pastes, searchTerm);

  return (
    <Card variant="outlined" sx={{ m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Stack direction="row" spacing={2}>
          <ContentPasteSearchIcon fontSize="large" />
          <Typography variant="h5">Pastes</Typography>
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
              padding: 10,
            },
          }}
        />
      </Box>
      <Typography variant="body2" sx={{ mt: 2, mb: 2 }}>
        A "paste" is information that has been "pasted" to a publicly facing
        website designed to share content such as Pastebin. These services are
        favoured by hackers due to the ease of anonymously sharing information
        and they're frequently the first place a breach appears. HIBP searches
        through pastes that are broadcast by the accounts in the Paste Sources
        Twitter list and reported as having emails that are a potential
        indicator of a breach. Finding an email address in a paste does not
        immediately mean it has been disclosed as the result of a breach. Review
        the paste and determine if your account has been compromised then take
        appropriate action such as changing passwords.{" "}
      </Typography>
      <CardContent>
        {filteredPastes.length > 0 ? (
          paginate(filteredPastes, page, itemsPerPage).map((paste, index) => (
            <Box key={index} mb={2}>
              {paste.Title && (
                <Tooltip title="The title of the paste as observed on the source site.">
                  <Typography variant="body1">
                    <b>Title:</b> {paste.Title}
                  </Typography>
                </Tooltip>
              )}
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
      <TablePagination
        component="div"
        count={filteredPastes.length}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={itemsPerPage}
        onRowsPerPageChange={handleItemsPerPageChange}
        rowsPerPageOptions={[5, 10, 15]}
      />
    </Card>
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
              <Grid item xs={12} md={6}>
                <Breaches breaches={result.breachedaccount} />
              </Grid>
            )}
            {result.pasteaccount && (
              <Grid item xs={12} md={6}>
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
              {result.breachedaccount ? result.breachedaccount.length : 0}{" "}
              Breaches and{" "}
              {result.pasteaccount ? result.pasteaccount.length : 0} Pastes
              found{" "}
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
