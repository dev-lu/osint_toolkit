import React, { useMemo, useState, useRef } from "react";
import api from "../../api";
import { useDropzone } from "react-dropzone";

import { Button, Box, Chip, Grid, LinearProgress, Typography, Paper, useTheme } from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";

import Introduction from "../Introduction";
import Result from "./Result";

import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";

export default function FileUpload(props) {
  const theme = useTheme();
  const [uploadProgress, setUploadProgress] = useState(0);
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

  const {
    getRootProps,
    getInputProps,
    acceptedFiles,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: {
      "message/rfc822": [".eml"],
    },
  });

  const acceptedFileItems = acceptedFiles.map((file) => (
    <Chip
      icon={<MailIcon />}
      label={`File: ${file.path} - Size: ${file.size} bytes`}
      style={{
        fontSize: "15px",
        padding: "10px",
        height: "40px",
        marginBottom: "20px",
      }}
    />
  ));

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

  const [file, setFile] = useState(" ");

  const [showResult, setShowResult] = useState(false);
  const handleShowResult = (event) => {
    setShowResult(true);
  };

  function uploadFiles(file) {
    setUploadProgress(0);
    const config = {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(percentCompleted);
      },
    };
    let fd = new FormData();
    fd.append("file", file);
    api
      .post(`/api/mailanalyzer/`, fd, config)
      .then((response) => {
        const result = response.data;
        setFile(result);
        handleShowResult();
      })
      .catch((error) => {
        console.log(error);
        setUploadProgress(0);
      });
  }

  return (
    <div className="drop">
      <br />
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop an .eml file here, or click to select a file.</p>
        <p>(Only .eml files will be accepted)</p>
        <SystemUpdateAltIcon sx={{ fontSize: "40px" }} />
      </div>
      {uploadProgress > 0 && uploadProgress < 100 && (
        <LinearProgress
          sx={{ mb: 2 }}
          variant="determinate"
          value={uploadProgress}
        />
      )}
      <div align="center">
        <br />
        {acceptedFileItems}
        <br />
        <Button
          variant="contained"
          disableElevation
          size="large"
          onClick={() => uploadFiles(acceptedFiles[0])}
        >
          Analyze
        </Button>
        <br />
        <br />
      </div>
      {showResult ? (
        <Result result={file} />
      ) : (
        <Paper sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography paragraph>
          Email Analyzer is a module that allows you to analyze .eml files for potential threats. 
          To use the module, simply drag an .eml file into it. The module will then parse the file 
          and perform basic security checks to identify any potential risks.
        </Typography>
        <Typography>
          It also extracts all indicators of compromise (IOCs) from the file and makes it possible 
          to analyze them using various open source intelligence (OSINT) services. In addition, 
          Email Analyzer generates hash values for every attachment in the file, allowing you to 
          perform a privacy-friendly analysis of these files.
        </Typography>
      </Box>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Capabilities
      </Typography>

      <Grid container spacing={1}>
        <Grid item xs={12} sm={6}>
          <Paper elevation={0} sx={{ p: 1 }}>
            <Typography color="primary" fontWeight="medium">Security Analysis</Typography>
            <Typography variant="body2" color="text.secondary">
              Performs basic security checks on .eml files
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper elevation={0} sx={{ p: 1 }}>
            <Typography color="primary" fontWeight="medium">IOC Extraction</Typography>
            <Typography variant="body2" color="text.secondary">
              Extracts and analyzes IOCs using OSINT services
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper elevation={0} sx={{ p: 1 }}>
            <Typography color="primary" fontWeight="medium">Attachment Analysis</Typography>
            <Typography variant="body2" color="text.secondary">
              Generates hash values for all email attachments
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper elevation={0} sx={{ p: 1 }}>
            <Typography color="primary" fontWeight="medium">Privacy-Friendly</Typography>
            <Typography variant="body2" color="text.secondary">
              Analyze attachments without exposing original files
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Paper>
      )}
    </div>
  );
}
