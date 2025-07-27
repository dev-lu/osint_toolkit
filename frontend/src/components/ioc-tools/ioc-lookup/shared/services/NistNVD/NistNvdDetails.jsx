import React from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import InfoIcon from "@mui/icons-material/Info";
import { List, ListItem, ListItemIcon, ListItemText, Grid } from "@mui/material";
import Typography from "@mui/material/Typography";

import ConfTable from "./ConfTable";
import CvssMetrics from "./CvssMetrics";
import Details from "./Details";
import RefTable from "./RefTable";
import VendorComments from "./VendorComments";
import Weaknesses from "./Weaknesses";
import NoDetails from "../NoDetails";

export default function NistNvdDetails({ result, ioc }) { 

  if (!result) { 
     return (
      <Box sx={{ margin: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 100 }}>
        <NoDetails message="Loading NIST NVD details..." />
      </Box>
    );
  }
  
  if (result.error) {
    return (
      <Box sx={{ margin: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 100 }}>
        <NoDetails message={`Error fetching NIST NVD details: ${result.message || result.error}`} />
      </Box>
    );
  }

  const cveDetails = (result.vulnerabilities && result.vulnerabilities.length > 0)
    ? result.vulnerabilities[0].cve
    : null;

  if (!cveDetails) {
    let message = `No detailed vulnerability information found for CVE ID: ${ioc}.`;
    if (result.totalResults === 0) {
        message = `CVE ID: ${ioc} was not found in the NIST NVD.`;
    }
    return (
      <Box sx={{ margin: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 100 }}>
        <NoDetails message={message} />
      </Box>
    );
  }

  let primaryCvssMetric = null;
  let cvssVersion = "";
  if (cveDetails.metrics?.cvssMetricV31 && cveDetails.metrics.cvssMetricV31.length > 0) {
    primaryCvssMetric = cveDetails.metrics.cvssMetricV31[0];
    cvssVersion = "CVSS v3.1";
  } else if (cveDetails.metrics?.cvssMetricV30 && cveDetails.metrics.cvssMetricV30.length > 0) {
    primaryCvssMetric = cveDetails.metrics.cvssMetricV30[0];
    cvssVersion = "CVSS v3.0";
  } else if (cveDetails.metrics?.cvssMetricV2 && cveDetails.metrics.cvssMetricV2.length > 0) {
    primaryCvssMetric = cveDetails.metrics.cvssMetricV2[0];
    cvssVersion = "CVSS v2.0";
  }


  return (
    <Box sx={{ margin: 1, mt:0 }}> 
      {cveDetails && <Details details={cveDetails} />}

      {primaryCvssMetric && (
        <CvssMetrics metrics={primaryCvssMetric} version={cvssVersion} />
      )}

      {cveDetails.weaknesses && cveDetails.weaknesses.length > 0 && (
        <Weaknesses weaknesses={cveDetails.weaknesses} />
      )}

      {cveDetails.references && cveDetails.references.length > 0 && (
        <Card elevation={0} sx={{ mt: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom component="div">
              References
            </Typography>
            <List dense disablePadding sx={{mb:1}}>
              <ListItem>
                <ListItemIcon sx={{minWidth:36, alignItems:'flex-start'}}><InfoIcon color="action" /></ListItemIcon>
                <ListItemText 
                    primaryTypographyProps={{variant:'caption', color:'text.secondary'}}
                    primary="References to advisories, solutions, and tools. By selecting these links, you may be leaving NIST webspace. NIST does not necessarily endorse the views expressed or products mentioned on these sites." 
                />
              </ListItem>
            </List>
            <RefTable references={cveDetails.references} />
          </CardContent>
        </Card>
      )}

      {cveDetails.vendorComments && cveDetails.vendorComments.length > 0 && (
        <VendorComments comments={cveDetails.vendorComments} />
      )}

      {cveDetails.configurations && cveDetails.configurations.length > 0 && (
        <Card elevation={0} sx={{ mt: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom component="div">
              Affected Configurations (CPEs)
            </Typography>
            <List dense disablePadding sx={{mb:1}}>
              <ListItem>
                <ListItemIcon sx={{minWidth:36, alignItems:'flex-start'}}><InfoIcon color="action" /></ListItemIcon>
                <ListItemText 
                    primaryTypographyProps={{variant:'caption', color:'text.secondary'}}
                    primary="CVE applicability statements conveying which product(s) are associated with the vulnerability." 
                />
              </ListItem>
            </List>
            {cveDetails.configurations.map((configuration, index) => (
              <Box key={index} sx={{mb: 2, mt: index > 0 ? 2 : 0}}> 
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  component="div"
                  sx={{ fontWeight:'medium' }}
                >
                  Configuration #{index + 1}
                  {configuration.nodes?.[0]?.operator && ` (Operator: ${configuration.nodes[0].operator})`}
                  {configuration.negate ? " - Negated" : ""}
                </Typography>
                <ConfTable configuration={configuration} index={index} />
              </Box>
            ))}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}