import React, { useMemo, useState, useRef } from "react";
import api from "../../api";
import { useDropzone } from "react-dropzone";

import { Button, LinearProgress, useTheme } from "@mui/material";

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
    padding: "20px",
    borderWidth: 2,
    borderRadius: 2,
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
    <h4 key={file.path}>
      File: {file.path} - {file.size} bytes
    </h4>
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
        <Introduction moduleName="Email Analyzer" />
      )}
    </div>
  );
}
