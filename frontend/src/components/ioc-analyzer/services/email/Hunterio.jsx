import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

import NoDetails from "../NoDetails";
import ResultRow from "../../ResultRow";

export default function Hunterio(props) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mailStatus, setMailStatus] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url =
          "http://localhost:8000/api/" +
          props.type +
          "/hunterio/" +
          encodeURIComponent(props.email);
        const response = await axios.get(url);
        setResult(response.data);
        setMailStatus(response.data.data.status);
      } catch (e) {
        setError(e);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const details = (
    <>
      {result && result.data ? (
          <Box sx={{ margin: 1 }}>
          <Card
            variant="outlined"
            sx={{ m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}
          >
            <h3>Details</h3>
            <b>Status: </b>
            {result.data.status} <br />
            <b>Score: </b>
            {result.data.score} <br />
            <b>Email: </b>
            {result.data.email} <br />
            <b>Passes regular expression: </b>
            {result.data.regexp ? "Yes" : "No"} <br />
            <b>Is an automatically generated email address: </b>
            {result.data.gibberish ? "Yes" : "No"} <br />
            <b>Is an email address from a disposable email service: </b>
            {result.data.disposable ? "Yes" : "No"} <br />
            <b>Is an email from a webmail (for example Gmail): </b>
            {result.data.webmail ? "Yes" : "No"} <br />
            <b>
              MX records exist on the domain of the given email address:{" "}
            </b>
            {result.data.mx_records ? "Yes" : "No"} <br />
            <b>Connected to the SMTP server successfully: </b>
            {result.data.smtp_server ? "Yes" : "No"} <br />
            <b>Email address doesn't bounce: </b>
            {result.data.smtp_check ? "Yes" : "No"} <br />
            <b>
              SMTP server accepts all the email addresses? It means you
              can have have false positives on SMTP checks:{" "}
            </b>
            {result.data.accept_all ? "Yes" : "No"} <br />
            <b>SMTP server prevented to perform the SMTP check: </b>
            {result.data.block ? "Yes" : "No"} <br />
          </Card>

          <Card
            variant="outlined"
            key="sources"
            sx={{ m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}
          >
            <h3>Sources</h3>
            <p>
              {" "}
              If we have found the given email address somewhere on the
              web, we display the sources here. The number of sources is
              limited to 20. The extracted_on attribute contains the date
              it was found for the first time, whereas the last_seen_on
              attribute contains the date it was found for the last time.{" "}
            </p>
          </Card>
          {result.data.sources.length > 0 ? (
            result.data.sources.map((source) => (
              <Card
                variant="outlined"
                key={source.uri}
                sx={{ m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}
              >
                <b>domain: </b>
                {source.domain} <br />
                <b>uri: </b>
                {source.uri} <br />
                <b>Extracted on: </b>
                {source.extracted_on} <br />
                <b>Last seen on: </b>
                {source.last_seen_on} <br />
                <b>Still on page: </b>
                {source.still_on_page} <br />
              </Card>
            ))
          ) : (
            <Card
                variant="outlined"
                key="no_sources"
                sx={{ m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}
              >No sources found</Card>
          )}
        </Box>
      ) : (
        <Box sx={{ margin: 1 }}>
          <Grid
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <NoDetails />
          </Grid>
        </Box>
      )}
    </>
  )

  function renderMailStatus() {
    if (mailStatus === "valid") {
      return <>Email address is valid</>;
    } else if (mailStatus === "invalid") {
      return <>Email address is not valid</>;
    } else if (mailStatus === "accept_all") {
      return (
        <>
          Email address is valid but any email address is accepted by the server
        </>
      );
    } else if (mailStatus === "webmail") {
      return (
        <>
          Email address comes from an email service provider such as Gmail or
          Outlook
        </>
      );
    } else if (mailStatus === "disposable") {
      return <>Email address comes from a disposable email service provider</>;
    } else if (mailStatus === "unknown") {
      return <>Failed to verify the email address</>;
    }
  }

  

  return (
    <>
      <ResultRow
        name="Hunter.io"
        id="hunterio"
        icon="hunterio_logo_small"
        loading={loading}
        result={result}
        summary={
          mailStatus === null ? (
            "No info available"
          ) : (
            renderMailStatus()
          )
        }
        summary_color={{ color: null }}
        color={
          mailStatus === "invalid"
              ? "red"
              : mailStatus === "disposable"
              ? "orange"
              : "green"
        }
        error={error}
        details={details}
      />
    </>
  );
}
