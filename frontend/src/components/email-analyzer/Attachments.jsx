import React, { useState } from "react";
import ResultTable from "../ioc-tools/ioc-lookup/single-lookup/components/ui/ResultTable";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function Attachments(props) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [showHashAnalysisAttachements, setShowHashAnalysisAttachements] = useState(false);

  const handleAccordionChange = () => {
    setExpanded(!expanded);
  };

  function hashAnalysis(props) {
    const ioc = props;
    const getHashType = (ioc) => {
      if (!ioc) return "MD5";
      
      const hashLength = ioc.length;
      if (hashLength === 32) return "MD5";
      if (hashLength === 40) return "SHA1";
      if (hashLength === 64) return "SHA256";
      return "MD5"; // Default
    };
    return (
      <Box mt={1} mb={1}>
        

        <ResultTable ioc={ioc} iocType={getHashType(ioc)} />
      </Box>
    );
  }

  function showAttachements() {
    if (props.result.length > 0) {
      return props.result.map((row, index) => (
        <React.Fragment key={index}>
          <TableContainer 
            sx={{ 
              maxWidth: "100%", 
              mb: 2,
              border: "1px solid rgba(224, 224, 224, 1)",
              borderRadius: 1,
            }}
          >
            <Table size="small" aria-label="attachments table">
              <TableHead>
                <TableRow>
                  <TableCell
                    colSpan={3}
                    sx={{ 
                      backgroundColor: theme.palette.background.tablecell,
                      py: 1
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      id={row.md5}
                      component="div"
                      fontWeight="bold"
                    >
                      {row.filename != null ? row.filename : "Unknown filename"}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell align="left" sx={{ width: '80px', py: 0.75 }}>
                    <Typography variant="body2" fontWeight="medium">MD5</Typography>
                  </TableCell>
                  <TableCell align="left" sx={{ overflowWrap: "anywhere", py: 0.75 }}>
                    <Typography variant="body2" fontFamily="monospace">{row.md5}</Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ width: '100px', py: 0.75 }}>
                    <Button
                      variant="outlined"
                      disableElevation
                      size="small"
                      onClick={() => setShowHashAnalysisAttachements(!showHashAnalysisAttachements)}
                    >
                      Analyze
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left" sx={{ py: 0.75 }}>
                    <Typography variant="body2" fontWeight="medium">SHA1</Typography>
                  </TableCell>
                  <TableCell align="left" sx={{ overflowWrap: "anywhere", py: 0.75 }}>
                    <Typography variant="body2" fontFamily="monospace">{row.sha1}</Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ py: 0.75 }}>
                    <Button
                      variant="outlined"
                      disableElevation
                      size="small"
                      onClick={() => setShowHashAnalysisAttachements(!showHashAnalysisAttachements)}
                    >
                      Analyze
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left" sx={{ py: 0.75 }}>
                    <Typography variant="body2" fontWeight="medium">SHA256</Typography>
                  </TableCell>
                  <TableCell align="left" sx={{ overflowWrap: "anywhere", py: 0.75 }}>
                    <Typography variant="body2" fontFamily="monospace">{row.sha256}</Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ py: 0.75 }}>
                    <Button
                      variant="outlined"
                      disableElevation
                      size="small"
                      onClick={() => setShowHashAnalysisAttachements(!showHashAnalysisAttachements)}
                    >
                      Analyze
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          {showHashAnalysisAttachements ? hashAnalysis(row.md5) : null}
        </React.Fragment>
      ));
    } else {
      return (
        <Typography variant="body2" sx={{ px: 1 }}>
          No attachments found
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
        aria-controls="attachments-content"
        id="attachments-header"
        sx={{ minHeight: '48px', padding: '0 16px' }}
      >
        <Box display="flex" alignItems="center">
          <AttachFileIcon sx={{ mr: 1 }} fontSize="small" />
          <Typography variant="subtitle1" fontWeight="medium">
            Attachments ({props.result.length})
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 1 }}>
        {showAttachements()}
      </AccordionDetails>
    </Accordion>
  );
}
