import React, { useMemo, useRef } from "react";
import { useState } from "react";
import api from "../../api";
import { useDropzone } from "react-dropzone";

import Introduction from "../Introduction";
import ResultRows from "./ResultRows";

import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import LanIcon from "@mui/icons-material/Lan";
import LinkIcon from "@mui/icons-material/Link";
import PublicIcon from "@mui/icons-material/Public";
import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";
import {
  Alert,
  AlertTitle,
  Button,
  CircularProgress,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  LinearProgress,
  Paper,
} from "@mui/material";
import useTheme from "@mui/material/styles/useTheme";

export default function Extractor(props) {
  const theme = useTheme();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(" ");

  const baseStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    borderWidth: 3,
    borderRadius: 15,
    borderColor: "lightgrey",
    borderStyle: "dashed",
    backgroundColor: theme.palette.background.uploadarea,
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

  const [showTable, setshowTable] = useState(false);
  const handleShowTable = (event) => {
    setshowTable(true);
  };

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
    <b key={file.path}>
      {file.path} - {file.size} bytes
    </b>
  ));

  function uploadFiles(file) {
    setIsLoading(true);
    const config = {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: function (progressEvent) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(percentCompleted);
      },
    };

    let fd = new FormData();
    fd.append("file", file);

    api
      .post(`/api/extractor/`, fd, config)
      .then((response) => {
        const result = response.data;
        setFile(result);
        handleShowTable();
        setUploadProgress(0); // Reset progress bar
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setUploadProgress(0); // Reset progress bar on error
        setIsLoading(false);
      });
  }

  const acceptStyleRef = useRef(acceptStyle);
  const baseStyleRef = useRef(baseStyle);
  const focusedStyleRef = useRef(focusedStyle);
  const rejectStyleRef = useRef(rejectStyle);

  const style = useMemo(
    () => ({
      ...baseStyleRef.current,
      ...(isFocused ? focusedStyleRef.current : {}),
      ...(isDragAccept ? acceptStyleRef.current : {}),
      ...(isDragReject ? rejectStyleRef.current : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  return (
    <React.Fragment key="drop">
      <br />
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop a file here, or click to select a file.</p>
        <p>(Only .txt and .csv files will be accepted)</p>
        <SystemUpdateAltIcon sx={{ fontSize: "40px" }} />
      </div>
      {uploadProgress > 0 && (
        <LinearProgress
          sx={{ mb: 2 }}
          variant="determinate"
          value={uploadProgress}
        />
      )}
      <div align="center">
        <br />
        <p>{acceptedFileItems}</p>
        <br />
        <Button
          variant="contained"
          disableElevation
          size="large"
          onClick={() => uploadFiles(acceptedFiles[0])}
          disabled={isLoading} //
        >
          {isLoading ? <CircularProgress size={24} /> : "Extract"}
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
          }}
        >
          <Alert
            severity="info"
            sx={{ backgroundColor: theme.palette.background.tableheader }}
          >
            <AlertTitle>
              <b>{file["statistics"]["total"]} unique IOCs found</b>
            </AlertTitle>
            <p>Following duplicates were removed:</p>
            <TableContainer>
              <Table>
                <TableBody>
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
                </TableBody>
              </Table>
            </TableContainer>
          </Alert>
          <ResultRows
            title="Domains"
            type="domain"
            list={file["domains"]}
            count={file["statistics"]["domains"]}
            icon={<PublicIcon sx={{ verticalAlign: "middle" }} />}
          />
          <ResultRows
            title="IP addresses"
            type="ipv4"
            list={file["ips"]}
            count={file["statistics"]["ips"]}
            icon={<LanIcon sx={{ verticalAlign: "middle" }} />}
          />
          <ResultRows
            title="URLs"
            type="url"
            list={file["urls"]}
            count={file["statistics"]["urls"]}
            icon={<LinkIcon sx={{ verticalAlign: "middle" }} />}
          />
          <ResultRows
            title="Email addresses"
            type="email"
            list={file["emails"]}
            count={file["statistics"]["emails"]}
            icon={<AlternateEmailIcon sx={{ verticalAlign: "middle" }} />}
          />
          <ResultRows
            title="MD5 hashes"
            type="md5"
            list={file["md5"]}
            count={file["statistics"]["md5"]}
            icon={<InsertDriveFileIcon sx={{ verticalAlign: "middle" }} />}
          />
          <ResultRows
            title="SHA1 hashes"
            type="sha1"
            list={file["sha1"]}
            count={file["statistics"]["sha1"]}
            icon={<InsertDriveFileIcon sx={{ verticalAlign: "middle" }} />}
          />
          <ResultRows
            title="SHA256 hashes"
            type="sha256"
            list={file["sha256"]}
            count={file["statistics"]["sha256"]}
            icon={<InsertDriveFileIcon sx={{ verticalAlign: "middle" }} />}
          />
        </TableContainer>
      ) : (
        <Introduction moduleName="IOC Extractor" />
      )}
    </React.Fragment>
  );
}
