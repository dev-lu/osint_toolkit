import React, { useState, useEffect } from 'react';
import {
  Autocomplete,
    Box,
  Grid,
  TextField,
  Tooltip,
  IconButton,
  Chip,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import licensesData from '../data/licenses.json';

const generateUUIDv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const statuses = ['None', 'Experimental', 'Test', 'Stable', 'Deprecated', 'Unsupported'];
const levels = ['None', 'Informational', 'Low', 'Medium', 'High', 'Critical'];

export default function Metadata({ metadata, handleMetadataChange }) {
  const [authorInput, setAuthorInput] = useState('');
  const [licenses, setLicenses] = useState([]);

  useEffect(() => {
    const licenseOptions = licensesData.licenses.map((license) => license.licenseId);
    setLicenses(licenseOptions);
  }, []);

  const handleGenerateUUID = () => {
    handleMetadataChange((prev) => ({
      ...prev,
      id: generateUUIDv4(),
    }));
  };

  const handleAddAuthor = () => {
    const trimmedAuthor = authorInput.trim();
    if (trimmedAuthor && !metadata.authors.includes(trimmedAuthor)) {
      handleMetadataChange((prev) => ({
        ...prev,
        authors: [...prev.authors, trimmedAuthor],
      }));
      setAuthorInput('');
    }
  };

  const handleDeleteAuthor = (authorToDelete) => {
    handleMetadataChange((prev) => ({
      ...prev,
      authors: prev.authors.filter((author) => author !== authorToDelete),
    }));
  };

  return (
    <Grid container spacing={2} rowSpacing={2}> 
      {/* Title */}
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Title"
          value={metadata.title}
          onChange={(e) => handleMetadataChange((prev) => ({ ...prev, title: e.target.value }))}
          required
          size="small"
          variant="outlined"
        />
      </Grid>
      {/* ID */}
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="ID"
          value={metadata.id}
          onChange={(e) => handleMetadataChange((prev) => ({ ...prev, id: e.target.value }))}
          required
          size="small"
          variant="outlined"
          InputProps={{
            endAdornment: (
              <Tooltip title="Generate New UUID">
                <IconButton onClick={handleGenerateUUID} size="small">
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            ),
          }}
        />
      </Grid>
      {/* Description */}
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Description"
          multiline
          rows={2}
          value={metadata.description}
          onChange={(e) => handleMetadataChange((prev) => ({ ...prev, description: e.target.value }))}
          size="small"
          variant="outlined"
        />
      </Grid>
      {/* Date and Modified Date */}
      <Grid item xs={12} sm={6}> 
        <Stack direction="row" spacing={2} alignItems="center"> 
          <TextField
            fullWidth
            label="Date"
            type="date"
            value={metadata.date}
            onChange={(e) => handleMetadataChange((prev) => ({ ...prev, date: e.target.value }))}
            size="small"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            fullWidth
            label="Modified Date"
            type="date"
            value={metadata.modified}
            onChange={(e) => handleMetadataChange((prev) => ({ ...prev, modified: e.target.value }))}
            size="small"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Stack>
      </Grid>
      {/* Level and Status */}
      <Grid item xs={12} sm={6}>
        <Stack direction="row" spacing={2} alignItems="center"> 
          <FormControl fullWidth size="small">
            <InputLabel>Level</InputLabel>
            <Select
              value={metadata.level}
              label="Level"
              onChange={(e) => handleMetadataChange((prev) => ({ ...prev, level: e.target.value }))}
            >
              {levels.map((level) => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={metadata.status}
              label="Status"
              onChange={(e) => handleMetadataChange((prev) => ({ ...prev, status: e.target.value }))}
            >
              {statuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Grid>
       {/* Authors and License */}
<Grid item xs={12}>
  <Stack direction="row" spacing={2} alignItems="center">
    <TextField
      fullWidth
      label="Add Author"
      value={authorInput}
      onChange={(e) => setAuthorInput(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleAddAuthor();
        }
      }}
      InputProps={{
        endAdornment: (
          <IconButton onClick={handleAddAuthor} disabled={!authorInput.trim()} size="small">
            <AddCircleIcon fontSize="small" />
          </IconButton>
        )
      }}
      size="small"
      variant="outlined"
    />
    <Autocomplete
      fullWidth
      freeSolo
      options={licenses}
      value={metadata.license}
      onChange={(event, newValue) => {
        handleMetadataChange((prev) => ({ ...prev, license: newValue }));
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="License"
          size="small"
          variant="outlined"
        />
      )}
    />
  </Stack>
  {/* Display Authors */}
  {metadata.authors.length > 0 && (
    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
      {metadata.authors.map((author, index) => (
        <Chip
          key={index}
          label={author}
          onDelete={() => handleDeleteAuthor(author)}
          size="small"
          variant="outlined"
        />
      ))}
    </Stack>
  )}
</Grid>
    </Grid>
  );
}