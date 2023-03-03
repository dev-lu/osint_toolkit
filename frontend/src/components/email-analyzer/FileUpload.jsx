import React, {useMemo, useState} from 'react';
import axios from 'axios';
import {useDropzone} from 'react-dropzone';

import Button from '@mui/material/Button';
import Introduction from '../Introduction'
import Result from './Result';

import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';


const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: 'lightgrey',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
  };
  
  const focusedStyle = {
    borderColor: '#2196f3'
  };
  
  const acceptStyle = {
    borderColor: '#00e676'
  };
  
  const rejectStyle = {
    borderColor: '#ff1744'
  };


export default function FileUpload(props) {

    const {
        getRootProps,
        getInputProps,
        acceptedFiles,
        isFocused,
        isDragAccept,
        isDragReject
      } = useDropzone({
        accept: {
          'message/rfc822': ['.eml']
        }
      });
    
      const acceptedFileItems = acceptedFiles.map(file => (
        <h4 key={file.path}>
          File: {file.path} - {file.size} bytes
        </h4>
      ));

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isFocused ? focusedStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
      }), [
        isFocused,
        isDragAccept,
        isDragReject
      ]);

    const [file, setFile] = useState(" ");

    const [showResult, setShowResult] = useState(false);
    const handleShowResult = event => {
        setShowResult(true);  
    };


  function uploadFiles(file) {
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    let fd = new FormData();
    fd.append('file',file);
    axios.post(`http://localhost:8000/api/mailanalyzer/`, fd, config)
      .then((response) => {
        const result = response.data
        setFile(result); 
        handleShowResult()
      })
      .catch(error => {
          console.log(error);
      })
  }

  return (
    <div className="drop">
      <br />
      <div {...getRootProps({style})}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop an .eml file here, or click to select a file.</p>
        <p>(Only .eml files will be accepted)</p>
        <SystemUpdateAltIcon sx={{ fontSize: "40px" }} />
      </div>
      <div align='center'>
        <br />
        {acceptedFileItems}
        <Button     
          variant="contained" 
          disableElevation size='large' 
          onClick={() => uploadFiles(acceptedFiles[0])}
          >Analyze
        </Button>
        <br />
        <br />
      </div>
      { showResult ?
      <Result result={file} /> : <Introduction moduleName='Email Analyzer' /> }
    </div>
  )
}
