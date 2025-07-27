import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CategoryIcon from "@mui/icons-material/Category";
import Chip from "@mui/material/Chip";
import CircleIcon from "@mui/icons-material/Circle";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import InfoIcon from "@mui/icons-material/Info";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import PolicyIcon from "@mui/icons-material/Policy";
import Typography from "@mui/material/Typography";
import NoDetails from "../NoDetails";

const getTlpColor = (tlpString) => {
  if (!tlpString) return 'action'; 
  switch (tlpString.toUpperCase()) {
    case 'RED': return 'error';
    case 'AMBER': return 'warning';
    case 'GREEN': return 'success';
    case 'BLUE': return 'info';
    case 'WHITE': return 'disabled'; 
    default: return 'action';
  }
};

export default function AlienvaultDetails({ result }) {
  if (!result || result.error) {
    return <NoDetails message="Detailed information for Alienvault OTX is unavailable or still loading." />;
  }

  const pulses = result.pulse_info?.count || 0;

  return (
    <Box sx={{ margin: 1 }}>
      <Card sx={{ mb: 2, borderRadius: 1, boxShadow: 0 }}>
        <CardContent>
          <Grid container alignItems="center" spacing={1}>
            <Grid item>
              <InfoIcon />
            </Grid>
            <Grid item>
              <Typography variant="h6" component="h2">
                General Information
              </Typography>
            </Grid>
          </Grid>
          <List dense sx={{ mb: 1, mt:1 }}>
            <ListItem disablePadding>
              <ListItemText
                primary="Indicator"
                secondary={result.indicator || "N/A"}
              />
            </ListItem>
            {result.reputation ? (
              <ListItem disablePadding>
                <ListItemText
                  primary="Reputation Valdez Score" 
                  secondary={String(result.reputation.valdez_rating) || "N/A"} 
                />
              </ListItem>
            ) : null}
             {result.reputation?.activities?.length > 0 && (
                <ListItem disablePadding>
                    <ListItemText
                    primary="Activities"
                    secondary={
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                        {result.reputation.activities.map((activity, index) => (
                            <Chip key={index} label={activity.name} size="small" />
                        ))}
                        </Box>
                    }
                    />
                </ListItem>
            )}
            {result.country_name ? (
              <ListItem disablePadding>
                <ListItemText
                  primary="Country"
                  secondary={result.country_name}
                />
              </ListItem>
            ) : null}
            {result.type ? (
              <ListItem disablePadding>
                <ListItemText primary="Type" secondary={result.type} />
              </ListItem>
            ) : null}
            {result.asn ? (
              <ListItem disablePadding>
                <ListItemText primary="ASN" secondary={result.asn} />
              </ListItem>
            ) : null}
          </List>
        </CardContent>
      </Card>

      {result.pulse_info && (
        <Card sx={{ mb: 2, borderRadius: 1, boxShadow: 0 }}>
            <CardContent>
            <Grid container alignItems="center" spacing={1}>
                <Grid item>
                <PolicyIcon />
                </Grid>
                <Grid item>
                <Typography variant="h6" component="h2">
                    Pulse Information
                </Typography>
                </Grid>
            </Grid>
            <Box sx={{ display: "flex", alignItems: "baseline", mt: 2, mb: pulses > 0 ? 1 : 0 }}>
                <Typography variant="h4" component="span" sx={{ mr: 1 }}>
                {pulses}
                </Typography>
                <Typography variant="subtitle1" component="span" color="text.secondary">
                {pulses === 1 ? "Pulse" : "Pulses"}
                </Typography>
            </Box>
            {pulses > 0 && result.pulse_info.pulses && (
                <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" component="h3" gutterBottom sx={{fontWeight: 'medium'}}>
                    Referenced Pulses:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {result.pulse_info.pulses.map((pulse) => (
                    <Chip
                    key={pulse.id}
                    label={pulse.name}
                    icon={
                        pulse.TLP ? (
                        <CircleIcon
                            color={getTlpColor(pulse.TLP)}
                            sx={{ fontSize: "1rem" }}
                        />
                        ) : null
                    }
                    size="small"
                    variant="outlined"
                    />
                ))}
                </Box>
                </>
            )}
            </CardContent>
        </Card>
      )}
      
      {result.general?.type === 'file' && result.analysis && (
        <Card sx={{ mb: 2, borderRadius: 1, boxShadow: 0 }}>
            <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>File Analysis</Typography>
                <Typography variant="body2">Status: {result.analysis.analysis_status}</Typography>
                {result.analysis.malware?.family?.length > 0 && (
                    <Typography variant="body2">Family: {result.analysis.malware.family.join(', ')}</Typography>
                )}
            </CardContent>
        </Card>
      )}

      {result.sections && result.sections.length > 0 && (
        <Card sx={{ borderRadius: 1, boxShadow: 0 }}>
            <CardContent>
            <Grid container alignItems="center" spacing={1}>
                <Grid item>
                <CategoryIcon />
                </Grid>
                <Grid item>
                <Typography variant="h6" component="h2">
                    OTX Sections
                </Typography>
                </Grid>
            </Grid>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                {result.sections.map((section) => (
                <Chip key={section} label={section} size="small" />
                ))}
            </Box>
            </CardContent>
        </Card>
      )}
    </Box>
  );
}