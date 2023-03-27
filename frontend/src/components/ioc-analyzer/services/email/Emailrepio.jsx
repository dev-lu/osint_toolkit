import React from 'react'
import axios from "axios";
import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

import NoDetails from "../NoDetails";
import ResultRow from "../../ResultRow";


export default function Emailrepio(props) {
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
              "/emailrepio/" +
              encodeURIComponent(props.email);
            const response = await axios.get(url);
            setResult(response.data);
            setMailStatus(response.data.reputation);
          } catch (e) {
            setError(e);
          }
          setLoading(false);
        };
        fetchData();
      }, []);

      const details = (
        <>
          {result ? (
            <Box sx={{ margin: 1 }}>
            <Card
              key="details"
              variant="outlined"
              sx={{ m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}
            >
              <h3>Details</h3>
              <b>Email: </b>
              {result.email} <br />
              <br />

              <b>Reputation: </b>
              {result.reputation} <br />
              <br />

              <b>References: </b>
              {result.references} <br />
              <p>Total number of positive and negative sources of reputation. note that these may not all be direct references to the email address, but can include reputation sources for the domain or other related information</p>
              <br />

              <b>Blacklisted: </b>
              {result.details.blacklisted ? 'Yes' : 'No'} <br />
              <p>The email is believed to be malicious or spammy</p>
              <br />

              <b>Malicious activity: </b>
              {result.details.malicious_activity ? 'Yes' : 'No'} <br />
              <p>The email has exhibited malicious behavior (e.g. phishing or fraud)</p>
              <br />

              <b>Recent malicious activity: </b>
              {result.details.malicious_activity_recent ? 'Yes' : 'No'} <br />
              <p>Malicious behavior in the last 90 days (e.g. in the case of temporal account takeovers)</p>
              <br />


              <b>Credentials leaked: </b>
              {result.details.credentials_leaked ? 'Yes' : 'No'} <br />
              <p>Credentials were leaked at some point in time (e.g. a data breach, pastebin, dark web, etc.)</p>
              <br />

              <b>Credentials leaked recent: </b>
              {result.details.credentials_leaked_recent ? 'Yes' : 'No'} <br />
              <p>Credentials were leaked in the last 90 days</p>
              <br />

              <b>Data breach: </b>
              {result.details.data_breach ? 'Yes' : 'No'} <br />
              <p>The email was in a data breach at some point in time</p>
              <br />

              <b>First seen: </b>
              {result.details.first_seen} <br />
              <p>The first date the email was observed in a breach, credential leak, or exhibiting malicious or spammy behavior ('never' if never seen)</p>
              <br />

              <b>Last seen: </b>
              {result.details.last_seen ? 'Yes' : !result.details.last_seen ? 'No' : 'Never'} <br />
              <p>The last date the email was observed in a breach, credential leak, or exhibiting malicious or spammy behavior ('never' if never seen)</p>
              <br />

              <b>Domain exists: </b>
              {result.details.domain_exists ? 'Yes' : 'No'} <br />
              <p>Valid domain</p>
              <br />

              <b>Domain reputation: </b>
              {result.details.domain_reputation} <br />
              <p>High/medium/low/n/a (n/a if the domain is a free_provider, disposable, or doesn't exist)</p>
              <br />

              <b>New domain: </b>
              {result.details.new_domain ? 'Yes' : 'No'} <br />
              <p>The domain was created within the last year</p>
              <br />

              <b>Days since domain creation: </b>
              {result.details.days_since_domain_creation} <br />
              <p>Days since the domain was created</p>
              <br />

              <b>Suspicious TLD: </b>
              {result.details.suspicious_tld ? 'Yes' : 'No'} <br />
              <br />

              <b>Spam: </b>
              {result.details.spam ? 'Yes' : 'No'} <br />
              <p>The email has exhibited spammy behavior (e.g. spam traps, login form abuse)</p>
              <br />

              <b>Free provider: </b>
              {result.details.free_provider ? 'Yes' : 'No'} <br />
              <p>The email uses a free email provider</p>
              <br />

              <b>Disposable: </b>
              {result.details.disposable ? 'Yes' : 'No'} <br />
              <p>The email uses a temporary/disposable service</p>
              <br />

              <b>Deliverable: </b>
              {result.details.deliverable ? 'Yes' : 'No'} <br />
              <br />

              <b>Accept all: </b>
              {result.details.accept_all ? 'Yes' : 'No'} <br />
              <p>Whether the mail server has a default accept all policy. Some mail servers return inconsistent responses, so we may default to an accept_all for those to be safe</p>
              <br />

              <b>Valid MX: </b>
              {result.details.valid_mx ? 'Yes' : 'No'} <br />
              <br />

              <b>Primary MX: </b>
              {result.details.primary_mx} <br />
              <br />

              <b>Spoofable: </b>
              {result.details.spoofable ? 'Yes' : 'No'} <br />
              <p>Email address can be spoofed (e.g. not a strict SPF policy or DMARC is not enforced)</p>
              <br />

              <b>SPF strict: </b>
              {result.details.spf_strict ? 'Yes' : 'No'} <br />
              <p>Sufficiently strict SPF record to prevent spoofing</p>
              <br />
              
              <b>DMARC enforced: </b>
              {result.details.dmarc_enforced ? 'Yes' : 'No'} <br />
              <p>DMARC is configured correctly and enforced</p>
            </Card>

            <Card
              variant="outlined"
              key="profiles"
              sx={{ m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}
            >
              <h3>Profiles</h3>
              <p>Online profiles used by the email</p>
            {result.details.profiles && result.details.profiles.length > 0 ? (
              result.details.profiles.map((profile, index) => (
                <>
                    <li key={index}>{profile}</li>
                </>
              ))
            ) : (
              <p>No profiles found</p>
            )}
            </Card>
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

  return (
    <>
      <ResultRow
        name="Emailrep.io"
        id="emailrepio"
        icon="emailrepio_logo_small"
        loading={loading}
        result={result}
        summary={
          mailStatus === null ? (
            "No info available"
          ) : (
            <>
              Reputation: {mailStatus}<br />
              Suspicious: {result.suspicious ? 'Yes' : 'No'}
            </>
          )          
        }
        summary_color={{ color: null }}
        color={
          mailStatus === "low" || (result && result.suspicious) === true
          ? "red"
          : mailStatus === "medium"
          ? "orange"
          : mailStatus === "none"
          ? "grey"
          : "green"
        }
        error={error}
        details={details}
      />
    </>
  );
}
