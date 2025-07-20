import React, { useMemo, useRef, useState } from "react";
import api from "../../api";
import { useDropzone } from "react-dropzone";

import ResultRows from "./ResultRows";

import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import LanIcon from "@mui/icons-material/Lan";
import LinkIcon from "@mui/icons-material/Link";
import PublicIcon from "@mui/icons-material/Public";
import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";
import {
  Button,
  Box,
  CircularProgress,
  Grid,
  Paper,
  Typography,
  LinearProgress,
  Card,
  CardHeader,
  CardContent,
  TableContainer,
} from "@mui/material";
import { useTheme } from '@mui/material/styles';

export default function Extractor(props) {
  const theme = useTheme();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(" ");
  const [showTable, setShowTable] = useState(false);

  const baseStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "10px",
    borderWidth: 3,
    borderRadius: 1,
    borderColor: "lightgrey",
    borderStyle: "dashed",
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

  const handleShowTable = () => {
    setShowTable(true);
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
        setUploadProgress(0); 
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setUploadProgress(0); 
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
    <React.Fragment>
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
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : "Extract"}
        </Button>
        <br />
        <br />
      </div>
      {showTable ? (
        <TableContainer component={Paper} sx={{ boxShadow: 0, borderRadius: 1 }}>
          {/* Statistics Card replacing the Alert */}
          <Card>
            <CardHeader
              title={
                <Typography variant="h6" component="div" fontWeight="bold">
                  {file["statistics"]["total_unique_iocs"]} unique IOCs found
                </Typography>
              }
              subheader="The following duplicates were removed:"
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2">
                    <strong>Domains:</strong> {file["statistics"]["domains_removed_duplicates"]}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2">
                    <strong>IP addresses:</strong> {file["statistics"]["ips_removed_duplicates"]}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2">
                    <strong>URLs:</strong> {file["statistics"]["urls_removed_duplicates"]}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2">
                    <strong>Email addresses:</strong> {file["statistics"]["emails_removed_duplicates"]}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2">
                    <strong>MD5 hashes:</strong> {file["statistics"]["md5_removed_duplicates"]}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2">
                    <strong>SHA1 hashes:</strong> {file["statistics"]["sha1_removed_duplicates"]}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2">
                    <strong>SHA256 hashes:</strong> {file["statistics"]["sha256_removed_duplicates"]}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
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
        <Paper sx={{ p: 3 }}>
          <Box sx={{ mb: 4 }}>
            <Typography paragraph>
              IOC Extractor is a module that allows you to extract and organize indicators of compromise (IOCs)
              from unstructured files using regular expressions (Regex). The module automatically removes any duplicates,
              so you don't have to worry about sorting through the same IOCs multiple times.
            </Typography>
            <Typography>
              There are no complicated settings or features to worry about – just drop your file containing the IOCs
              into the tool and let it do the work for you. With a single click, you can analyze every detected IOC,
              saving you the time and effort of building Excel sheets to extract IOCs from files manually.
            </Typography>
          </Box>

          <Typography variant="h6" sx={{ mb: 2 }}>
            Key Features
          </Typography>

          <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
              <Paper elevation={0} sx={{ p: 1 }}>
                <Typography color="primary" fontWeight="medium">
                  Automated Extraction
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Extracts IOCs from unstructured files using regular expressions
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper elevation={0} sx={{ p: 1 }}>
                <Typography color="primary" fontWeight="medium">
                  Duplicate Removal
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Automatically removes duplicate IOCs from the results
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper elevation={0} sx={{ p: 1 }}>
                <Typography color="primary" fontWeight="medium">
                  Simple Interface
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Drop files and get results with no configuration needed
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper elevation={0} sx={{ p: 1 }}>
                <Typography color="primary" fontWeight="medium">
                  One-Click Analysis
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Analyze each detected IOC with a single click
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      )}
    </React.Fragment>
  );
}
