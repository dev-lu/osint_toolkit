import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  AlertTitle,
  Box,
  Typography,
} from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function SecurityCheck(props) {
  const [expanded, setExpanded] = useState(true);

  const handleAccordionChange = () => {
    setExpanded(!expanded);
  };

  function showWarnings() {
    if (props.result.length > 0) {
      return (
        <>
          {props.result.map((row, index) => (
            <Alert
              key={"ema_warnings_alert_" + index}
              severity={
                row["warning_tlp"] === "red"
                  ? "error"
                  : row["warning_tlp"] === "orange"
                  ? "warning"
                  : row["warning_tlp"] === "green"
                  ? "success"
                  : "info"
              }
              variant="filled"
              sx={{ m: 0.5, borderRadius: 1, '& .MuiAlert-message': { p: 0 } }}
            >
              <AlertTitle sx={{ m: 0, fontSize: '0.875rem', fontWeight: 500 }}>
                {row["warning_title"]}
              </AlertTitle>
              <Typography variant="body2">{row["warning_message"]}</Typography>
            </Alert>
          ))}
        </>
      );
    } else {
      return <></>;
    }
  }

  return (
    <Accordion 
      expanded={expanded} 
      onChange={handleAccordionChange}
      sx={{ mt: 2, borderRadius: 2, '&.MuiPaper-root': { boxShadow: 0, border: '1px solid rgba(0, 0, 0, 0.12)' } }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="security-checks-content"
        id="security-checks-header"
        sx={{ minHeight: '48px', padding: '0 16px' }}
      >
        <Box display="flex" alignItems="center">
          <VerifiedUserIcon sx={{ mr: 1 }} fontSize="small" />
          <Typography variant="subtitle1" fontWeight="medium">Basic security checks</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 1 }}>
        {showWarnings()}
      </AccordionDetails>
    </Accordion>
  );
}