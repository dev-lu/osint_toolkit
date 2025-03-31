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
import RouteIcon from "@mui/icons-material/Route";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function Hops(props) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  const handleAccordionChange = () => {
    setExpanded(!expanded);
  };

  function showHops() {
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
          <Table size="small" aria-label="hops table">
            <TableHead>
              <TableRow>
                <TableCell align="left" sx={{ py: 1 }}>
                  <Typography variant="body2" fontWeight="medium">Hop</Typography>
                </TableCell>
                <TableCell align="left" sx={{ py: 1 }}>
                  <Typography variant="body2" fontWeight="medium">From</Typography>
                </TableCell>
                <TableCell align="left" sx={{ py: 1 }}>
                  <Typography variant="body2" fontWeight="medium">By</Typography>
                </TableCell>
                <TableCell align="left" sx={{ py: 1 }}>
                  <Typography variant="body2" fontWeight="medium">With</Typography>
                </TableCell>
                <TableCell align="left" sx={{ py: 1 }}>
                  <Typography variant="body2" fontWeight="medium">Date / Time</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.result.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="left" sx={{ overflowWrap: "anywhere", py: 0.75 }}>
                    <Typography variant="body2">{row["number"]}</Typography>
                  </TableCell>
                  <TableCell align="left" sx={{ overflowWrap: "anywhere", py: 0.75 }}>
                    <Typography variant="body2" fontFamily="monospace" fontSize="0.75rem">{row["from"]}</Typography>
                  </TableCell>
                  <TableCell align="left" sx={{ overflowWrap: "anywhere", py: 0.75 }}>
                    <Typography variant="body2" fontFamily="monospace" fontSize="0.75rem">{row["by"]}</Typography>
                  </TableCell>
                  <TableCell align="left" sx={{ overflowWrap: "anywhere", py: 0.75 }}>
                    <Typography variant="body2">{row["with"]}</Typography>
                  </TableCell>
                  <TableCell align="left" sx={{ overflowWrap: "anywhere", py: 0.75 }}>
                    <Typography variant="body2">{row["date"]}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
    } else {
      return (
        <Typography variant="body2" sx={{ px: 1 }}>
          Could not parse hops
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
        aria-controls="hops-content"
        id="hops-header"
        sx={{ minHeight: '48px', padding: '0 16px' }}
      >
        <Box display="flex" alignItems="center">
          <RouteIcon sx={{ mr: 1 }} fontSize="small" />
          <Typography variant="subtitle1" fontWeight="medium">
            Hops ({props.result ? props.result.length : 0})
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 1 }}>
        {showHops()}
      </AccordionDetails>
    </Accordion>
  );
}