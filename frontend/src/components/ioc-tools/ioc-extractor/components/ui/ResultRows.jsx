import React from "react";
import { useState } from "react";

import ResultTable from "../../../ioc-lookup/single-lookup/components/ui/ResultTable";
import NoData from "./NoData";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Modal from "@mui/material/Modal";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TablePagination,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Stack } from "@mui/system";
import { useTheme } from '@mui/material/styles';

export default function ResultRows(props) {
    const [selectedData, setSelectedData] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const theme = useTheme();

    const handleAnalyze = (rowData, type) => {
        setSelectedData(rowData);
        setSelectedType(type);
        setShowModal(true);
    };
    
    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleCopyAll = () => {
        if (props.list && props.list.length > 0) {
            const text = props.list.join('\n');
            navigator.clipboard.writeText(text).then(() => {
                setSnackbar({ open: true, message: `Copied ${props.list.length} ${props.title.toLowerCase()} to clipboard`, severity: 'success' });
            }).catch(() => {
                setSnackbar({ open: true, message: 'Failed to copy to clipboard', severity: 'error' });
            });
        }
    };

    const handleExportAll = () => {
        if (props.list && props.list.length > 0) {
            const text = props.list.join('\n');
            const blob = new Blob([text], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${props.title.toLowerCase().replace(/\s+/g, '_')}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            setSnackbar({ open: true, message: `Exported ${props.list.length} ${props.title.toLowerCase()} to file`, severity: 'success' });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const getHashType = (hash) => {
        if (!hash) return "MD5";
        
        const hashLength = hash.length;
        if (hashLength === 32) return "MD5";
        if (hashLength === 40) return "SHA1";
        if (hashLength === 64) return "SHA256";
        return "MD5"; // Default
    };

    // Calculate pagination
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedList = props.list ? props.list.slice(startIndex, endIndex) : [];

  return (
    <React.Fragment key={""}>
        <Accordion sx={{ boxShadow: 1, '&:before': { display: 'none' } }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`${props.type}-content`}
            id={`${props.type}-header`}
            sx={{ minHeight: 48, '&.Mui-expanded': { minHeight: 48 } }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {props.icon}
                <Typography sx={{ ml: 1, fontWeight: 500 }}>
                  {props.title} ({props.count})
                </Typography>
              </Box>
              {props.list && props.list.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1 }} onClick={(e) => e.stopPropagation()}>
                  <Tooltip title={`Copy all ${props.title.toLowerCase()}`}>
                    <IconButton size="small" onClick={handleCopyAll}>
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={`Export all ${props.title.toLowerCase()}`}>
                    <IconButton size="small" onClick={handleExportAll}>
                      <FileDownloadIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            {props.list && props.list.length > 0 ? (
              <Box>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, py: 1 }}>IOC</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, py: 1, width: 100 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedList.map((ioc, index) => (
                      <TableRow key={startIndex + index + "_" + props.type + "_result_row"} hover>
                        <TableCell sx={{ py: 1, wordBreak: 'break-all', fontSize: '0.875rem' }}>
                          {ioc}
                        </TableCell>
                        <TableCell align="right" sx={{ py: 1 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleAnalyze(ioc, props.type)}
                            sx={{ 
                              minWidth: 'auto', 
                              px: 1.5,
                              py: 0.25,
                              fontSize: '0.75rem'
                            }}
                          >
                            Analyze
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {props.list.length > rowsPerPage && (
                  <TablePagination
                    component="div"
                    count={props.list.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                    sx={{ borderTop: '1px solid', borderColor: 'divider' }}
                  />
                )}
              </Box>
            ) : (
              <Box sx={{ p: 1.5, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <NoData />
              </Box>
            )}
          </AccordionDetails>
        </Accordion>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
        {showModal && (
            <Modal open={showModal} onClose={handleCloseModal}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "60%",
                  overflowY: "scroll",
                  maxHeight: "90%",
                  p: 4,
                }}
              >
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    borderRadius: 5,
                  }}
                >
                  <Stack spacing={2} sx={{ width: "100%" }}>
                    <p><b>Analysis for: </b>{selectedData}</p>
                    {selectedType === "ipv6" ? (
                      <ResultTable ioc={selectedData} iocType="IPv4" />
                    ) : null}
                    {selectedType === "ipv4" ? (
                      <ResultTable ioc={selectedData} iocType="IPv6" />
                    ) : null}
                    {selectedType === "domain" ? (
                      <ResultTable ioc={selectedData} iocType="Domain" />
                    ) : null}
                    {selectedType === "url" ? (
                    <ResultTable ioc={selectedData} iocType="URL" />
                    ) : null}
                    {selectedType === "email" ? (
                      <ResultTable ioc={selectedData} iocType="Email" />
                    ) : null}
                    {selectedType === "md5" ? (
                      <ResultTable ioc={selectedData} iocType={getHashType(selectedData)} />
                    ) : null}
                    {selectedType === "sha1" ? (
                      <ResultTable ioc={selectedData} iocType={getHashType(selectedData)} />
                    ) : null}
                    {selectedType === "sha256" ? (
                      <ResultTable ioc={selectedData} iocType={getHashType(selectedData)} />
                    ) : null}
                  </Stack>
                </Paper>
              </Box>
            </Modal>
          )}
    </React.Fragment>
  )
}
