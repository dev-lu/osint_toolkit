import React, { useMemo } from "react";
import { useState } from "react";
import { useRecoilState } from "recoil";
import axios from "axios";
import { useDropzone } from "react-dropzone";

import {
  ExtractorAtomDomain,
  ExtractorAtomIp,
  ExtractorAtomUrl,
  ExtractorAtomMd5,
  ExtractorAtomSha1,
  ExtractorAtomSha256,
} from "./ExtractorAtom";
import Ipv4 from "../ioc-analyzer/Ipv4";
import Ipv6 from "../ioc-analyzer/Ipv6";
import Hash from "../ioc-analyzer/Hash";
import Url from "../ioc-analyzer/Url";
import Domain from "../ioc-analyzer/Domain";
import Email from "../ioc-analyzer/Email";
import NoData from "./NoData";

import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import Introduction from "../Introduction";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import LanIcon from "@mui/icons-material/Lan";
import LinkIcon from "@mui/icons-material/Link";
import Modal from "@mui/material/Modal";
import PublicIcon from "@mui/icons-material/Public";
import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from "@mui/material";
import { Stack } from "@mui/system";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 5,
  borderColor: "lightgrey",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

export default function Extractor(props) {
  const [selectedData, setSelectedData] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleAnalyze = (rowData, type) => {
    setSelectedData(rowData);
    setSelectedType(type);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const [file, setFile] = useState(" ");

  const [showTable, setshowTable] = useState(false);
  const handleShowTable = (event) => {
    setshowTable(true);
  };

  const [domainOpen, setDomainOpen] = useRecoilState(ExtractorAtomDomain);
  const [ipOpen, setIpOpen] = useRecoilState(ExtractorAtomIp);
  const [urlOpen, setUrlOpen] = useRecoilState(ExtractorAtomUrl);
  const [emailOpen, setEmailOpen] = useRecoilState(ExtractorAtomUrl);
  const [md5Open, setMd5Open] = useRecoilState(ExtractorAtomMd5);
  const [sha1Open, setSha1Open] = useRecoilState(ExtractorAtomSha1);
  const [sha256Open, setSha256Open] = useRecoilState(ExtractorAtomSha256);

  const {
    getRootProps,
    getInputProps,
    acceptedFiles,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: {
      "text/csv": [".csv"],
      "text/plain": [".txt"],
    },
  });

  const acceptedFileItems = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  function uploadFiles(file) {
    const config = { headers: { "Content-Type": "multipart/form-data" } };
    let fd = new FormData();
    fd.append("file", file);
    axios
      .post(`http://localhost:8000/api/extractor/`, fd, config)
      .then((response) => {
        const result = response.data;
        setFile(result);
        handleShowTable();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  return (
    <div className="drop">
      <br />
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop a file here, or click to select a file.</p>
        <p>(Only .txt and .csv files will be accepted)</p>
        <SystemUpdateAltIcon sx={{ fontSize: "40px" }} />
      </div>
      <div align="center">
        <br />
        <p>{acceptedFileItems}</p>
        <Button
          variant="contained"
          disableElevation
          size="large"
          onClick={() => uploadFiles(acceptedFiles[0])}
        >
          Extract
        </Button>
        <br />
        <br />
      </div>
      {showTable ? (
        <TableContainer
          component={Paper}
          sx={{
            boxShadow: 0,
            borderRadius: 5,
            border: 1,
            borderColor: "grey.100",
          }}
        >
          <Alert severity="info" sx={{ backgroundColor: "#f9fafa" }}>
            <AlertTitle>
              <b>{file["statistics"]["total"]} unique IOCs found</b>
            </AlertTitle>
            <p>Following duplicates were removed:</p>
            <TableContainer>
              <TableRow>
                <TableCell>
                  <p>Domains</p>
                </TableCell>
                <TableCell>
                  <p>IP addresses</p>
                </TableCell>
                <TableCell>
                  <p>URLs</p>
                </TableCell>
                <TableCell>
                  <p>Email addresses</p>
                </TableCell>
                <TableCell>
                  <p>MD5 hashes</p>
                </TableCell>
                <TableCell>
                  <p>SHA1 hashes</p>
                </TableCell>
                <TableCell>
                  <p>SHA256 hashes</p>
                </TableCell>
              </TableRow>
              <TableRow sx={{ alignSelf: "center", textAlign: "center" }}>
                <TableCell sx={{ textAlign: "center" }}>
                  <p>{file["statistics"]["domains_rem_dupl"]}</p>
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <p>{file["statistics"]["ips_rem_dupl"]}</p>
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <p>{file["statistics"]["urls_rem_dupl"]}</p>
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <p>{file["statistics"]["emails_rem_dupl"]}</p>
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <p>{file["statistics"]["md5_rem_dupl"]}</p>
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <p>{file["statistics"]["sha1_rem_dupl"]}</p>
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <p>{file["statistics"]["sha256_rem_dupl"]}</p>
                </TableCell>
              </TableRow>
            </TableContainer>
          </Alert>
          <Table aria-label="result_table">
            {/* Domains */}
            <TableHead sx={{ bgcolor: "WhiteSmoke" }}>
              <TableRow>
                <TableCell
                  sx={{ fontWeight: "bold", fontSize: "20px", width: "100%" }}
                >
                  <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() =>
                      setDomainOpen({ domainOpen: !domainOpen.domainOpen })
                    }
                  >
                    {domainOpen.domainOpen ? (
                      <KeyboardArrowUpIcon />
                    ) : (
                      <KeyboardArrowDownIcon />
                    )}
                  </IconButton>
                  <PublicIcon sx={{ verticalAlign: "middle" }} />
                  &nbsp;Domains ({file["statistics"]["domains"]})
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <Collapse in={domainOpen.domainOpen} timeout="auto" unmountOnExit>
                {file["domains"] ? (
                  file["domains"].map((section) => {
                    return (
                      <TableRow key={section}>
                        <TableCell sx={{ width: "100%" }}>{section}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            disableElevation
                            size="small"
                            onClick={() => handleAnalyze(section, "domain")}
                            sx={{ float: "right" }}
                          >
                            Analyze
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell>No Data</TableCell>
                  </TableRow>
                )}
              </Collapse>
            </TableBody>

            {/* IP addresses */}
            <TableHead sx={{ bgcolor: "WhiteSmoke" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", fontSize: "20px" }}>
                  <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => setIpOpen({ ipOpen: !ipOpen.ipOpen })}
                  >
                    {ipOpen.ipOpen ? (
                      <KeyboardArrowUpIcon />
                    ) : (
                      <KeyboardArrowDownIcon />
                    )}
                  </IconButton>
                  <LanIcon sx={{ verticalAlign: "top" }} />
                  &nbsp;IP addresses ({file["statistics"]["ips"]})
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <Collapse in={ipOpen.ipOpen} timeout="auto" unmountOnExit>
                {file["ips"] ? (
                  file["ips"].map((section) => {
                    return (
                      <TableRow key={section}>
                        <TableCell sx={{ width: "100%" }}>{section}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            disableElevation
                            size="small"
                            onClick={() => handleAnalyze(section, "ipv4")}
                            sx={{ float: "right" }}
                          >
                            Analyze
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell>No Data</TableCell>
                  </TableRow>
                )}
              </Collapse>
            </TableBody>

            {/* URLs */}
            <TableHead sx={{ bgcolor: "WhiteSmoke" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", fontSize: "20px" }}>
                  <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => setUrlOpen({ urlOpen: !urlOpen.urlOpen })}
                  >
                    {urlOpen.urlOpen ? (
                      <KeyboardArrowUpIcon />
                    ) : (
                      <KeyboardArrowDownIcon />
                    )}
                  </IconButton>
                  <LinkIcon sx={{ verticalAlign: "top" }} />
                  &nbsp;URLs ({file["statistics"]["urls"]})
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <Collapse in={urlOpen.urlOpen} timeout="auto" unmountOnExit>
                {file["urls"] ? (
                  file["urls"].map((section) => {
                    return (
                      <TableRow key={section}>
                        <TableCell sx={{ width: "100%" }}>{section}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            disableElevation
                            size="small"
                            onClick={() => handleAnalyze(section, "url")}
                            sx={{ float: "right" }}
                          >
                            Analyze
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell>No Data</TableCell>
                  </TableRow>
                )}
              </Collapse>
            </TableBody>

            {/* email addresses */}
            <TableHead sx={{ bgcolor: "WhiteSmoke" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", fontSize: "20px" }}>
                  <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() =>
                      setEmailOpen({ emailOpen: !emailOpen.emailOpen })
                    }
                  >
                    {emailOpen.emailOpen ? (
                      <KeyboardArrowUpIcon />
                    ) : (
                      <KeyboardArrowDownIcon />
                    )}
                  </IconButton>
                  <AlternateEmailIcon sx={{ verticalAlign: "top" }} />
                  &nbsp;Email addresses ({file["statistics"]["emails"]})
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <Collapse in={emailOpen.emailOpen} timeout="auto" unmountOnExit>
                {file["emails"] ? (
                  file["emails"].map((section) => {
                    return (
                      <TableRow key={section}>
                        <TableCell sx={{ width: "100%" }}>{section}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            disableElevation
                            size="small"
                            onClick={() => handleAnalyze(section, "email")}
                            sx={{ float: "right" }}
                          >
                            Analyze
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell>No Data</TableCell>
                  </TableRow>
                )}
              </Collapse>
            </TableBody>

            {/* MD5 hashes */}
            <TableHead sx={{ bgcolor: "WhiteSmoke" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", fontSize: "20px" }}>
                  <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => setMd5Open({ md5Open: !md5Open.md5Open })}
                  >
                    {md5Open.md5Open ? (
                      <KeyboardArrowUpIcon />
                    ) : (
                      <KeyboardArrowDownIcon />
                    )}
                  </IconButton>
                  <InsertDriveFileIcon sx={{ verticalAlign: "top" }} />
                  &nbsp;MD5 hashes ({file["statistics"]["md5"]})
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <Collapse in={md5Open.md5Open} timeout="auto" unmountOnExit>
                {file["md5"] ? (
                  file["md5"].map((section) => {
                    return (
                      <TableRow key={section}>
                        <TableCell sx={{ width: "100%" }}>{section}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            disableElevation
                            size="small"
                            onClick={() => handleAnalyze(section, "md5")}
                            sx={{ float: "right" }}
                          >
                            Analyze
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell>No Data</TableCell>
                  </TableRow>
                )}
              </Collapse>
            </TableBody>

            {/* SHA1 hashes */}
            <TableHead sx={{ bgcolor: "WhiteSmoke" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", fontSize: "20px" }}>
                  <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() =>
                      setSha1Open({ sha1Open: !sha1Open.sha1Open })
                    }
                  >
                    {sha1Open.sha1Open ? (
                      <KeyboardArrowUpIcon />
                    ) : (
                      <KeyboardArrowDownIcon />
                    )}
                  </IconButton>
                  <InsertDriveFileIcon sx={{ verticalAlign: "top" }} />
                  &nbsp;SHA1 hashes ({file["statistics"]["sha1"]})
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <Collapse in={sha1Open.sha1Open} timeout="auto" unmountOnExit>
                {file["sha1"] ? (
                  file["sha1"].map((section) => {
                    return (
                      <TableRow key={section}>
                        <TableCell sx={{ width: "100%" }}>{section}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            disableElevation
                            size="small"
                            onClick={() => handleAnalyze(section, "sha1")}
                            sx={{ float: "right" }}
                          >
                            Analyze
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell>No Data</TableCell>
                  </TableRow>
                )}
              </Collapse>
            </TableBody>

            {/* SHA256 hashes */}
            <TableHead sx={{ bgcolor: "WhiteSmoke" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", fontSize: "20px" }}>
                  <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() =>
                      setSha256Open({ sha256Open: !sha256Open.sha256Open })
                    }
                  >
                    {sha256Open.sha256Open ? (
                      <KeyboardArrowUpIcon />
                    ) : (
                      <KeyboardArrowDownIcon />
                    )}
                  </IconButton>
                  <InsertDriveFileIcon sx={{ verticalAlign: "top" }} />
                  &nbsp;SHA256 hashes ({file["statistics"]["sha256"]})
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <Collapse in={sha256Open.sha256Open} timeout="auto" unmountOnExit>
                {file["sha256"] && file["sha256"].length > 0 ? (
                  file["sha256"].map((section) => {
                    return (
                      <TableRow key={section}>
                        <TableCell sx={{ width: "100%" }}>{section}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            disableElevation
                            size="small"
                            onClick={() => handleAnalyze(section, "sha256")}
                            sx={{ float: "right" }}
                          >
                            Analyze
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell>
                      {" "}
                      <NoData />{" "}
                    </TableCell>
                  </TableRow>
                )}
              </Collapse>
            </TableBody>
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
        </TableContainer>
      ) : (
        <Introduction moduleName="IOC Extractor" />
      )}
    </div>
  );
}
