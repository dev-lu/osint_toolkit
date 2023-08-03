import React from "react";
import api from "../../../../api";
import { useEffect, useState, useRef } from "react";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import ContactsIcon from "@mui/icons-material/Contacts";
import FacebookIcon from "@mui/icons-material/Facebook";
import Grid from "@mui/material/Grid";
import InfoIcon from "@mui/icons-material/Info";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import PersonIcon from "@mui/icons-material/Person";
import PinterestIcon from "@mui/icons-material/Pinterest";
import RedditIcon from "@mui/icons-material/Reddit";
import TwitterIcon from "@mui/icons-material/Twitter";
import { Typography } from "@mui/material";
import YouTubeIcon from "@mui/icons-material/YouTube";

import NoDetails from "../NoDetails";
import ResultRow from "../../ResultRow";

export default function Emailrepio(props) {
  const propsRef = useRef(props);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mailStatus, setMailStatus] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url =
          "/api/" +
          propsRef.current.type +
          "/emailrepio/" +
          encodeURIComponent(propsRef.current.email);
        const response = await api.get(url);
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
      {result && !result.error ? (
        <Box sx={{ margin: 1 }}>
          <Card
            key="details"
            variant="outlined"
            sx={{ m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}
          >
            <Grid direction="row" container spacing={2} pt={2} pl={2}>
              <InfoIcon />
              <Typography variant="h5" gutterBottom component="div" pl={2}>
                Details
              </Typography>
            </Grid>
            <List>
              <ListItem>
                <ListItemText
                  primary={
                    <Typography variant="h6" color="text.primary">
                      Reputation
                    </Typography>
                  }
                  secondary={result.reputation ? result.reputation : "N/A"}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    <Typography variant="h6" color="text.primary">
                      References
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {result.references ? result.references : "N/A"}
                      </Typography>
                      {
                        " - Total number of positive and negative sources of reputation. Note that these may not all be direct references to the email address, but can include reputation sources for the domain or other related information."
                      }
                    </>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    <Typography variant="h6" color="text.primary">
                      Blacklisted
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {result.details.blacklisted ? "Yes" : "No"}
                      </Typography>
                      {" - The email is believed to be malicious or spammy. "}
                    </>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    <Typography variant="h6" color="text.primary">
                      Malicious activity
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {result.details.malicious_activity ? "Yes" : "No"}
                      </Typography>
                      {
                        " - The email has exhibited malicious behavior (e.g. phishing or fraud). "
                      }
                    </>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    <Typography variant="h6" color="text.primary">
                      Recent malicious activity
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {result.details.malicious_activity_recent
                          ? "Yes"
                          : "No"}
                      </Typography>
                      {
                        " - Malicious behavior in the last 90 days (e.g. in the case of temporal account takeovers) "
                      }
                    </>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    <Typography variant="h6" color="text.primary">
                      Credentials leaked
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {result.details.credentials_leaked ? "Yes" : "No"}
                      </Typography>
                      {" - Credentials were leaked in the last 90 days"}
                    </>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    <Typography variant="h6" color="text.primary">
                      Data breaches
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {result.details.data_breach ? "Yes" : "No"}
                      </Typography>
                      {
                        " - The email was in a data breach at some point in time (e.g. pastebin, dark web, etc.). "
                      }
                    </>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    <Typography variant="h6" color="text.primary">
                      First seen
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {result.details.first_seen
                          ? result.details.first_seen
                          : "N/A"}
                      </Typography>
                      {
                        " - The first date the email was observed in a breach, credential leak, or exhibiting malicious or spammy behavior ('never' if never seen"
                      }
                    </>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    <Typography variant="h6" color="text.primary">
                      Last seen
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {result.details.last_seen
                          ? result.details.last_seen
                          : "N/A"}
                      </Typography>
                      {
                        " - The last date the email was observed in a breach, credential leak, or exhibiting malicious or spammy behavior ('never' if never seen)"
                      }
                    </>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    <Typography variant="h6" color="text.primary">
                      Domain exists
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {result.details.domain_exists ? "Yes" : "No"}
                      </Typography>
                      {" - Valid Domain"}
                    </>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    <Typography variant="h6" color="text.primary">
                      Domain reputation
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {result.details.domain_reputation
                          ? result.details.domain_reputation
                          : "N/A"}
                      </Typography>
                      {
                        " - High/medium/low/n/a (n/a if the domain is a free_provider, disposable, or doesn't exist)"
                      }
                    </>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    <Typography variant="h6" color="text.primary">
                      New domain
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {result.details.new_domain ? "Yes" : "No"}
                      </Typography>
                      {" - The domain was created within the last year"}
                    </>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    <Typography variant="h6" color="text.primary">
                      Days since domain creation
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {result.details.days_since_domain_creation
                          ? result.details.days_since_domain_creation
                          : "N/A"}
                      </Typography>
                      {" - Days since the domain was created"}
                    </>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    <Typography variant="h6" color="text.primary">
                      Suspicious TLD
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {result.details.suspicious_tld ? "Yes" : "No"}
                      </Typography>
                      {
                        " - The domain has a suspicious top level domain (e.g. .tk)"
                      }
                    </>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    <Typography variant="h6" color="text.primary">
                      Spam
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {result.details.spam ? "Yes" : "No"}
                      </Typography>
                      {
                        " - The email has exhibited spammy behavior (e.g. spam traps, login form abuse)"
                      }
                    </>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    <Typography variant="h6" color="text.primary">
                      Free provider
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {result.details.free_provider ? "Yes" : "No"}
                      </Typography>
                      {" - The email uses a free email provider"}
                    </>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    <Typography variant="h6" color="text.primary">
                      Disposable
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {result.details.disposable ? "Yes" : "No"}
                      </Typography>
                      {" - The email uses a temporary/disposable service"}
                    </>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    <Typography variant="h6" color="text.primary">
                      Deliverable
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {result.details.deliverable ? "Yes" : "No"}
                      </Typography>
                      {" - The email is deliverable"}
                    </>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    <Typography variant="h6" color="text.primary">
                      Accept all
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {result.details.accept_all ? "Yes" : "No"}
                      </Typography>
                      {
                        " - Whether the mail server has a default accept all policy. Some mail servers return inconsistent responses, so we may default to an accept_all for those to be safe"
                      }
                    </>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    <Typography variant="h6" color="text.primary">
                      Valid MX
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {result.details.valid_mx ? "Yes" : "No"}
                      </Typography>
                      {" - The domain has valid MX records"}
                    </>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    <Typography variant="h6" color="text.primary">
                      Primary MX
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {result.details.primary_mx ? "Yes" : "No"}
                      </Typography>
                      {" - The domain's primary MX record"}
                    </>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    <Typography variant="h6" color="text.primary">
                      Spoofable
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {result.details.spoofable ? "Yes" : "No"}
                      </Typography>
                      {
                        " - Email address can be spoofed (e.g. not a strict SPF policy or DMARC is not enforced)"
                      }
                    </>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    <Typography variant="h6" color="text.primary">
                      SPF strict
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {result.details.spf_strict ? "Yes" : "No"}
                      </Typography>
                      {" - Sufficiently strict SPF record to prevent spoofing"}
                    </>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    <Typography variant="h6" color="text.primary">
                      DMARC enforced
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {result.details.dmarc_enforced ? "Yes" : "No"}
                      </Typography>
                      {" - DMARC is configured correctly and enforced"}
                    </>
                  }
                />
              </ListItem>
            </List>
          </Card>

          <Card
            variant="outlined"
            key="profiles"
            sx={{ m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}
          >
            <Grid direction="row" container spacing={2} pt={2} pl={2}>
              <ContactsIcon />
              <Typography variant="h5" gutterBottom component="div" pl={2}>
                Profiles
              </Typography>
            </Grid>
            <Typography variant="body2">
              Online profiles used by the email
            </Typography>
            <List>
              {result.details.profiles && result.details.profiles.length > 0 ? (
                result.details.profiles.map((profile, index) => (
                  <ListItem key={index}>
                    <ListItemAvatar>
                      <Avatar>
                        {profile === "facebook" ? (
                          <FacebookIcon />
                        ) : profile === "instagram" ? (
                          <InstagramIcon />
                        ) : profile === "linkedin" ? (
                          <LinkedInIcon />
                        ) : profile === "pinterest" ? (
                          <PinterestIcon />
                        ) : profile === "reddit" ? (
                          <RedditIcon />
                        ) : profile === "twitter" ? (
                          <TwitterIcon />
                        ) : profile === "youtube" ? (
                          <YouTubeIcon />
                        ) : (
                          <PersonIcon />
                        )}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={profile} />
                  </ListItem>
                ))
              ) : (
                <Typography variant="body2">No profiles found</Typography>
              )}
            </List>
          </Card>
        </Box>
      ) : (
        <Box sx={{ margin: 1 }}>
          <Grid display="flex" justifyContent="center" alignItems="center">
            <NoDetails />
          </Grid>
        </Box>
      )}
    </>
  );

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
              Reputation: {mailStatus}
              <br />
              Suspicious: {result.suspicious ? "Yes" : "No"}
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
