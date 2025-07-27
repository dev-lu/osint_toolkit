import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
} from '@mui/material';
import RouterIcon from '@mui/icons-material/Router';
import LanguageIcon from '@mui/icons-material/Language';
import DomainIcon from '@mui/icons-material/Domain';
import PublicIcon from '@mui/icons-material/Public';
import BusinessIcon from '@mui/icons-material/Business';
import DnsIcon from '@mui/icons-material/Dns';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import StorageIcon from '@mui/icons-material/Storage';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const GeneralInfo = ({
  data = {},
  loading = false,
  error = null,
}) => {
  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error loading information</Typography>;

  const {
    ip,
    ipType,
    ipRange,
    reverseDns,
    domain,
    hostnames = [],
    type,
    country,
    countryCode,
    region,
    city,
    organisation,
    isp,
    asn = {},
  } = data;

  return (
    <Card sx={{ borderRadius: 1 }}>
      <CardContent sx={{ p: 1 }}>
        {/* Network Information */}
        <Typography variant="subtitle2" color="textSecondary" sx={{ pl: 2, pb: 0.5 }}>Network Information</Typography>
        <List disablePadding>
          <ListItem dense>
            <ListItemIcon>
              <RouterIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="IP" secondary={ip} />
          </ListItem>
          <ListItem dense>
            <ListItemIcon>
              <RouterIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="IP Type" secondary={ipType} />
          </ListItem>
          {ipRange && (
            <ListItem dense>
              <ListItemIcon>
                <RouterIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="IP Range" secondary={ipRange} />
            </ListItem>
          )}
          {reverseDns && (
            <ListItem dense>
              <ListItemIcon>
                <DnsIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Reverse DNS" secondary={reverseDns} />
            </ListItem>
          )}
        </List>

        {/* Domain Information */}
        <Divider sx={{ my: 0.5 }} />
        <Typography variant="subtitle2" color="textSecondary" sx={{ pl: 2, py: 0.5 }}>Domain Information</Typography>
        <List disablePadding>
          {domain && (
            <ListItem dense>
              <ListItemIcon>
                <DomainIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Domain" secondary={domain} />
            </ListItem>
          )}
          {hostnames?.length > 0 && (
            <ListItem dense>
              <ListItemIcon>
                <DnsIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Hostnames" secondary={hostnames.join(", ")} />
            </ListItem>
          )}
          {type && (
            <ListItem dense>
              <ListItemIcon>
                <StorageIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Type" secondary={type} />
            </ListItem>
          )}
        </List>

        {/* Location Information */}
        <Divider sx={{ my: 0.5 }} />
        <Typography variant="subtitle2" color="textSecondary" sx={{ pl: 2, py: 0.5 }}>Location Information</Typography>
        <List disablePadding>
          {country && (
            <ListItem dense>
              <ListItemIcon>
                <PublicIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Country" secondary={country} />
            </ListItem>
          )}
          {countryCode && (
            <ListItem dense>
              <ListItemIcon>
                <PublicIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Country Code" secondary={countryCode} />
            </ListItem>
          )}
          {region && (
            <ListItem dense>
              <ListItemIcon>
                <LocationCityIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Region" secondary={region} />
            </ListItem>
          )}
          {city && (
            <ListItem dense>
              <ListItemIcon>
                <LocationCityIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="City" secondary={city} />
            </ListItem>
          )}
        </List>

        {/* Organization Information */}
        <Divider sx={{ my: 0.5 }} />
        <Typography variant="subtitle2" color="textSecondary" sx={{ pl: 2, py: 0.5 }}>Organization Information</Typography>
        <List disablePadding>
          {organisation && (
            <ListItem dense>
              <ListItemIcon>
                <BusinessIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Organisation" secondary={organisation} />
            </ListItem>
          )}
          {isp && (
            <ListItem dense>
              <ListItemIcon>
                <LanguageIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="ISP" secondary={isp} />
            </ListItem>
          )}
        </List>

        {/* ASN Information */}
        {asn && Object.keys(asn).length > 0 && (
          <>
            <Divider sx={{ my: 0.5 }} />
            <Accordion
              sx={{
                '&:before': { display: 'none' },
                boxShadow: 'none',
                borderRadius: 1,
              }}
              defaultExpanded
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{ p: 0, minHeight: 36 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <NetworkCheckIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2" color="textSecondary">ASN Information</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0 }}>
                <List disablePadding>
                  {asn.asn && (
                    <ListItem dense>
                      <ListItemIcon>
                        <NetworkCheckIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="ASN" secondary={asn.asn} />
                    </ListItem>
                  )}
                  {asn.asOwner && (
                    <ListItem dense>
                      <ListItemIcon>
                        <BusinessIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="AS Owner" secondary={asn.asOwner} />
                    </ListItem>
                  )}
                  {asn.asnCidr && (
                    <ListItem dense>
                      <ListItemIcon>
                        <RouterIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="ASN CIDR" secondary={asn.asnCidr} />
                    </ListItem>
                  )}
                  {asn.asnCountryCode && (
                    <ListItem dense>
                      <ListItemIcon>
                        <PublicIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="ASN Country" secondary={asn.asnCountryCode} />
                    </ListItem>
                  )}
                  {asn.asnDate && (
                    <ListItem dense>
                      <ListItemIcon>
                        <StorageIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="ASN Date" secondary={asn.asnDate} />
                    </ListItem>
                  )}
                  {asn.asnRegistry && (
                    <ListItem dense>
                      <ListItemIcon>
                        <StorageIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="ASN Registry" secondary={asn.asnRegistry} />
                    </ListItem>
                  )}
                </List>
              </AccordionDetails>
            </Accordion>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default GeneralInfo;