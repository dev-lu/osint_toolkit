import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import HorizontalSplitIcon from "@mui/icons-material/HorizontalSplit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function Header(props) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  const handleAccordionChange = () => {
    setExpanded(!expanded);
  };

  function showHeaderFields() {
    if (props.result != null) {
      return (
        <TableContainer 
          component={Paper} 
          sx={{ 
            maxWidth: "100%",
            boxShadow: 0,
            borderRadius: 1
          }}
        >
          <Table size="small" aria-label="header fields table">
            <TableHead>
              <TableRow>
                <TableCell align="left" sx={{ py: 1, width: '30%' }}>
                  <Typography variant="body2" fontWeight="medium">Keys</Typography>
                </TableCell>
                <TableCell align="left" sx={{ py: 1 }}>
                  <Typography variant="body2" fontWeight="medium">Value</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(props.result).map((key, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="left" sx={{ py: 0.75 }}>
                    <Typography variant="body2" fontWeight="medium">{Object.keys(key[1])}</Typography>
                  </TableCell>
                  <TableCell align="left" sx={{ overflowWrap: "anywhere", py: 0.75 }}>
                    <Typography variant="body2" fontFamily="monospace" fontSize="0.75rem">
                      {Object.values(key[1])}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
    }
    return (
      <Typography variant="body2" sx={{ px: 1 }}>
        No header fields available
      </Typography>
    );
  }
  
  return (
    <Accordion 
      expanded={expanded} 
      onChange={handleAccordionChange}
      sx={{ mt: 2, borderRadius: 2, '&.MuiPaper-root': { boxShadow: 0, border: '1px solid rgba(0, 0, 0, 0.12)' } }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="header-fields-content"
        id="header-fields-header"
        sx={{ minHeight: '48px', padding: '0 16px' }}
      >
        <Box display="flex" alignItems="center">
          <HorizontalSplitIcon sx={{ mr: 1 }} fontSize="small" />
          <Typography variant="subtitle1" fontWeight="medium">
            Complete Header ({props.result ? props.result.length : 0} fields)
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 1 }}>
        {showHeaderFields()}
      </AccordionDetails>
    </Accordion>
  );
}