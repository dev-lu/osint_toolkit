import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Stack,
  IconButton,
  Grid,
  Tooltip,
  Button,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {
  Lan as LanIcon,
  Fingerprint as FingerprintIcon,
  Link as LinkIcon,
  Public as PublicIcon,
  Email as EmailIcon,
  BugReport as BugReportIcon,
} from "@mui/icons-material";
import { grey } from "@mui/material/colors";

export default function IOCSection({ item }) {
  console.log('IOCSection received item:', item);
  console.log('IOCSection received iocs:', item.iocs);

  const IOC_TYPES = [
    {
      type: "ips",
      label: "IP Addresses",
      icon: <LanIcon color="primary" />,
    },
    {
      type: "md5",
      label: "MD5 Hashes",
      icon: <FingerprintIcon color="secondary" />,
    },
    {
      type: "sha1",
      label: "SHA1 Hashes",
      icon: <FingerprintIcon color="secondary" />,
    },
    {
      type: "sha256",
      label: "SHA256 Hashes",
      icon: <FingerprintIcon color="secondary" />,
    },
    {
      type: "urls",
      label: "URLs",
      icon: <LinkIcon color="success" />,
    },
    {
      type: "domains",
      label: "Domains",
      icon: <PublicIcon color="info" />,
    },
    {
      type: "emails",
      label: "Emails",
      icon: <EmailIcon color="warning" />,
    },
    {
      type: "cves",
      label: "CVEs",
      icon: <BugReportIcon color="error" />,
    },
  ];

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const parseIOCs = (iocData) => {
    if (!iocData) return {};
    
    try {
      if (typeof iocData === 'string') {
        return JSON.parse(iocData);
      }
      return iocData;
    } catch (error) {
      console.error('Failed to parse IOCs:', error);
      return {};
    }
  };

  const renderIOCs = () => {
    const parsedIOCsData = parseIOCs(item.iocs);
    console.log('Parsed IOCs data:', parsedIOCsData);

    return IOC_TYPES.map((ioc) => {
      const iocValues = parsedIOCsData[ioc.type] || [];
      console.log(`${ioc.type} values:`, iocValues);

      if (iocValues.length > 0) {
        return (
          <Accordion
            key={ioc.type}
            variant="secondary"
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                flexDirection: "row-reverse",
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  {ioc.icon}
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    {ioc.label} ({iocValues.length})
                  </Typography>
                </Stack>
                <Button
                  size="small"
                  endIcon={<ContentCopyIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(iocValues.join("\n"));
                  }}
                >
                  Copy All
                </Button>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={1}>
                {iocValues.map((value, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(value);
                        }}
                      >
                        <Tooltip title="Copy">
                          <ContentCopyIcon />
                        </Tooltip>
                      </IconButton>
                      <Typography variant="body2">{value}</Typography>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        );
      }
      return null;
    });
  };

  const hasIOCs = () => {
    const parsedIOCsData = parseIOCs(item.iocs);
    return IOC_TYPES.some((ioc) => {
      const iocValues = parsedIOCsData[ioc.type] || [];
      return iocValues.length > 0;
    });
  };

  if (!item.iocs || !hasIOCs()) {
    console.log('No IOCs found, returning null');
    return null;
  }

  return <>{renderIOCs()}</>;
}