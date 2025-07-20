import React from "react";
import { useState } from "react";

import Ipv4 from "../ioc-analyzer/Ipv4";
import Ipv6 from "../ioc-analyzer/Ipv6";
import Hash from "../ioc-analyzer/Hash";
import Url from "../ioc-analyzer/Url";
import Domain from "../ioc-analyzer/Domain";
import Email from "../ioc-analyzer/Email";
import NoData from "./NoData";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Modal from "@mui/material/Modal";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useTheme } from '@mui/material/styles';

export default function ResultRows(props) {
    const [open, setOpen] = useState(false);
    const [selectedData, setSelectedData] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const theme = useTheme();

    const handleAnalyze = (rowData, type) => {
        setSelectedData(rowData);
        setSelectedType(type);
        setShowModal(true);
      };
    
      const handleCloseModal = () => {
        setShowModal(false);
      };


  return (
    <React.Fragment key={""}>
        <Table>
        <TableHead>
            <TableRow>
                <TableCell sx={{ fontWeight: "bold", fontSize: "20px", width: "100%", backgroundColor: theme.palette.background.tableheader }}>
                <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() =>
                      setOpen(!open )
                    }
                  >
                    {open ? (
                      <KeyboardArrowUpIcon />
                    ) : (
                      <KeyboardArrowDownIcon />
                    )}
                  </IconButton>
                  {props.icon}
                  &nbsp;{props.title} ({props.count})
                  <Collapse in={open} timeout="auto" unmountOnExit>
                {props.list && props.list.length > 0 ? (
                  props.list.map((ioc, index) => {
                    return (
                      <Table key={index + "_" + props.type + "_result_table"}>
                      <TableBody>
                      <TableRow key={index + "_" + props.type + "_result_row"}>
                        <TableCell sx={{ width: "100%" }}>{ioc}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            disableElevation
                            size="small"
                            onClick={() => handleAnalyze(ioc, props.type)}
                            sx={{ float: "right" }}
                          >
                            Analyze
                          </Button>
                        </TableCell>
                      </TableRow>
                      </TableBody>
                      </Table>
                    );
                  })
                ) : (
                    <Box>
                        <Grid xs item={true} display="flex" justifyContent="center" alignItems="center">
                            <NoData />
                        </Grid>
                    </Box>
                )}
              </Collapse>
                </TableCell>
            </TableRow>
            </TableHead>
        </Table>
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
                      <Ipv4 ioc={selectedData} />
                    ) : null}
                    {selectedType === "ipv4" ? (
                      <Ipv6 ioc={selectedData} />
                    ) : null}
                    {selectedType === "domain" ? (
                      <Domain ioc={selectedData} />
                    ) : null}
                    {selectedType === "url" ? (
                    <Url ioc={selectedData} />
                    ) : null}
                    {selectedType === "email" ? (
                      <Email ioc={selectedData} />
                    ) : null}
                    {selectedType === "md5" ? (
                      <Hash ioc={selectedData} />
                    ) : null}
                    {selectedType === "sha1" ? (
                      <Hash ioc={selectedData} />
                    ) : null}
                    {selectedType === "sha256" ? (
                      <Hash ioc={selectedData} />
                    ) : null}
                  </Stack>
                </Paper>
              </Box>
            </Modal>
          )}
    </React.Fragment>
  )
}
