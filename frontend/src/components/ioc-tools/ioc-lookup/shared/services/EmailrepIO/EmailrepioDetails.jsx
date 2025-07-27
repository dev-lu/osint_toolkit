import React from "react";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
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

const DetailListItem = ({ primaryText, secondaryText, secondaryHelperText = "" }) => (
  <ListItem sx={{ alignItems: 'flex-start' }}> 
    <ListItemText
      primary={
        <Typography variant="subtitle1" fontWeight="medium" color="text.primary">
          {primaryText}
        </Typography>
      }
      secondary={
        <>
          <Typography
            sx={{ display: "inline" }}
            component="span"
            variant="body2"
            color="text.secondary"
          >
            {secondaryText !== null && typeof secondaryText !== 'undefined' ? String(secondaryText) : "N/A"}
          </Typography>
          {secondaryHelperText && (
             <Typography component="span" variant="caption" color="text.disabled" sx={{ ml: 0.5 }}>
                {secondaryHelperText}
             </Typography>
          )}
        </>
      }
      sx={{ my: 0 }} 
    />
  </ListItem>
);


export default function EmailrepioDetails({ result, ioc }) {

  if (!result || result.error || !result.details) {
    const message = result && result.error 
        ? `Error fetching Emailrep.io details: ${result.message || result.error}` 
        : "Emailrep.io details are unavailable or the data is incomplete.";
    return (
        <Box sx={{ margin: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 100 }}>
          <NoDetails message={message} />
        </Box>
    );
  }

  const { details, reputation, references, suspicious } = result;

  return (
    <Box sx={{ margin: 1, mt:0 }}> 
      <Grid container spacing={2}>
        <Grid item xs={12} md={7}> 
          <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <CardContent>
              <Grid direction="row" container spacing={1} alignItems="center" mb={1}>
                <InfoIcon color="action" />
                <Typography variant="h6" component="div" sx={{ ml: 1 }}>
                  Reputation & Details
                </Typography>
              </Grid>
              <List dense>
                <DetailListItem primaryText="Email" secondaryText={result.email || ioc} />
                <DetailListItem primaryText="Reputation" secondaryText={reputation} />
                <DetailListItem primaryText="Suspicious" secondaryText={suspicious ? "Yes" : "No"} />
                <DetailListItem 
                    primaryText="References" 
                    secondaryText={references}
                    secondaryHelperText="- Total sources of reputation (may include domain reputation)."
                />
                <DetailListItem 
                    primaryText="Blacklisted" 
                    secondaryText={details.blacklisted ? "Yes" : "No"}
                    secondaryHelperText="- Believed to be malicious or spammy."
                />
                <DetailListItem 
                    primaryText="Malicious Activity" 
                    secondaryText={details.malicious_activity ? "Yes" : "No"}
                    secondaryHelperText="- Exhibited phishing or fraud."
                />
                <DetailListItem 
                    primaryText="Recent Malicious Activity" 
                    secondaryText={details.malicious_activity_recent ? "Yes" : "No"}
                    secondaryHelperText="- Malicious behavior in the last 90 days."
                />
                <DetailListItem 
                    primaryText="Credentials Leaked" 
                    secondaryText={details.credentials_leaked ? "Yes" : "No"}
                    secondaryHelperText="- Credentials leaked in the last 90 days."
                />
                <DetailListItem 
                    primaryText="Data Breaches" 
                    secondaryText={details.data_breach ? "Yes" : "No"}
                    secondaryHelperText="- Appeared in a data breach."
                />
                <DetailListItem 
                    primaryText="First Seen" 
                    secondaryText={details.first_seen}
                    secondaryHelperText="- First observed in breach/leak or malicious activity."
                />
                <DetailListItem 
                    primaryText="Last Seen" 
                    secondaryText={details.last_seen}
                    secondaryHelperText="- Last observed in breach/leak or malicious activity."
                />
                <DetailListItem 
                    primaryText="Domain Exists" 
                    secondaryText={details.domain_exists ? "Yes" : "No"}
                />
                <DetailListItem 
                    primaryText="Domain Reputation" 
                    secondaryText={details.domain_reputation}
                    secondaryHelperText="- (high/medium/low/n/a)"
                />
                <DetailListItem 
                    primaryText="New Domain" 
                    secondaryText={details.new_domain ? "Yes" : "No"}
                    secondaryHelperText="- Domain created within the last year."
                />
                <DetailListItem 
                    primaryText="Days Since Domain Creation" 
                    secondaryText={details.days_since_domain_creation}
                />
                <DetailListItem 
                    primaryText="Suspicious TLD" 
                    secondaryText={details.suspicious_tld ? "Yes" : "No"}
                    secondaryHelperText="- e.g., .tk, .xyz"
                />
                <DetailListItem 
                    primaryText="Spam" 
                    secondaryText={details.spam ? "Yes" : "No"}
                    secondaryHelperText="- Exhibited spammy behavior."
                />
                <DetailListItem 
                    primaryText="Free Provider" 
                    secondaryText={details.free_provider ? "Yes" : "No"}
                />
                <DetailListItem 
                    primaryText="Disposable" 
                    secondaryText={details.disposable ? "Yes" : "No"}
                    secondaryHelperText="- Uses a temporary email service."
                />
                <DetailListItem 
                    primaryText="Deliverable" 
                    secondaryText={details.deliverable ? "Yes" : "No"}
                />
                <DetailListItem 
                    primaryText="Accept All (Domain)" 
                    secondaryText={details.accept_all ? "Yes" : "No"}
                    secondaryHelperText="- Mail server has a catch-all policy."
                />
                <DetailListItem 
                    primaryText="Valid MX (Domain)" 
                    secondaryText={details.valid_mx ? "Yes" : "No"}
                />
                <DetailListItem 
                    primaryText="Spoofable" 
                    secondaryText={details.spoofable ? "Yes" : "No"}
                    secondaryHelperText="- Weak SPF or DMARC not enforced."
                />
                <DetailListItem 
                    primaryText="SPF Strict" 
                    secondaryText={details.spf_strict ? "Yes" : "No"}
                />
                <DetailListItem 
                    primaryText="DMARC Enforced" 
                    secondaryText={details.dmarc_enforced ? "Yes" : "No"}
                />
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}> 
          <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', height: '100%'  }}>
            <CardContent>
                <Grid direction="row" container spacing={1} alignItems="center" mb={1}>
                    <ContactsIcon color="action"/>
                    <Typography variant="h6" component="div" sx={{ ml: 1 }}>
                        Online Profiles
                    </Typography>
                </Grid>
                <Typography variant="caption" color="text.disabled" display="block" mb={1}>
                    Social and online profiles associated with this email address.
                </Typography>
                {details.profiles && details.profiles.length > 0 ? (
                    <List dense>
                    {details.profiles.map((profile, index) => (
                        <ListItem key={index}>
                        <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'primary.main' }}> 
                            {profile === "facebook" ? <FacebookIcon /> :
                            profile === "instagram" ? <InstagramIcon /> :
                            profile === "linkedin" ? <LinkedInIcon /> :
                            profile === "pinterest" ? <PinterestIcon /> :
                            profile === "reddit" ? <RedditIcon /> :
                            profile === "twitter" ? <TwitterIcon /> :
                            profile === "youtube" ? <YouTubeIcon /> :
                            <PersonIcon />}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primaryTypographyProps={{ textTransform: 'capitalize' }} primary={profile} />
                        </ListItem>
                    ))}
                    </List>
                ) : (
                    <Typography variant="body2" color="text.secondary" sx={{mt:2}}>No profiles found.</Typography>
                )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}