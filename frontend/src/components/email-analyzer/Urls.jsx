import React, { useState } from "react";
import Url from "../ioc-analyzer/Url.jsx";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function Urls(props) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [url, setUrl] = useState(null);
  const [showUrlAnalyse, setShowUrlAnalyse] = useState(false);

  const handleAccordionChange = () => {
    setExpanded(!expanded);
  };

  function urlAnalyse(props) {
    return (
      <Box mt={1} mb={1}>
        <Url ioc={url} />
      </Box>
    );
  }

  function showUrls() {
    if (props.result.length > 0) {
      return (
        <React.Fragment key="urls_fragment">
          <TableContainer 
            component={Paper} 
            sx={{ 
              maxWidth: "100%",
              boxShadow: 0,
              borderRadius: 1
            }}
          >
            <Table size="small" aria-label="urls table">
              <TableBody>
                {props.result.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell 
                      align="left" 
                      sx={{ 
                        overflowWrap: "anywhere", 
                        py: 0.75,
                        fontFamily: "monospace",
                        fontSize: "0.75rem"
                      }}
                    >
                      {row}
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        overflowWrap: "anywhere", 
                        width: "100px", 
                        py: 0.75 
                      }}
                    >
                      <Button
                        variant="outlined"
                        disableElevation
                        size="small"
                        onClick={() => {
                          setShowUrlAnalyse(!showUrlAnalyse);
                          setUrl(row);
                        }}
                      >
                        Analyze
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {showUrlAnalyse ? urlAnalyse(url) : null}
        </React.Fragment>
      );
    } else {
      return (
        <Typography variant="body2" sx={{ px: 1 }}>
          No URLs found
        </Typography>
      );
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
        aria-controls="urls-content"
        id="urls-header"
        sx={{ minHeight: '48px', padding: '0 16px' }}
      >
        <Box display="flex" alignItems="center">
          <LinkIcon sx={{ mr: 1 }} fontSize="small" />
          <Typography variant="subtitle1" fontWeight="medium">
            URLs in body ({props.result.length})
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 1 }}>
        {showUrls()}
      </AccordionDetails>
    </Accordion>
  );
}