import React, { useState, useEffect } from 'react';
import {
  TextField,
  Tooltip,
  IconButton,
  Chip,
  Stack,
  Typography,
  Box,
  Autocomplete
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import tagData from '../data/TagData.json';

export default function Tags({ tags, handleTagsChange }) {
  const [tagInput, setTagInput] = useState('');
  const [tagSuggestions, setTagSuggestions] = useState([]);

  useEffect(() => {
    const allSuggestions = Object.values(tagData).flat();
    setTagSuggestions(allSuggestions);
  }, []);

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      handleTagsChange((prev) => [...prev, trimmedTag]);
      setTagInput('');
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    handleTagsChange((prev) => prev.filter((tag) => tag !== tagToDelete));
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Use tags from MITRE ATT&CK, CAR and tags for CVE numbers.
      </Typography>
      <Typography variant="caption" gutterBottom>
        Examples tags: attack.credential_access, attack.t1003.002, car.2013-07-001, cve.2020.10189
        <br />
        Use lower-case tags only. Use . or - as divider in tag names. Replace space with an underscore _.
      </Typography>
      <Autocomplete
        freeSolo
        options={tagSuggestions}
        value={tagInput}
        onChange={(event, newValue) => {
          setTagInput(newValue || ''); 
          if (newValue) {
            handleAddTag();
          }
        }}
        onInputChange={(event, newInputValue) => {
          setTagInput(newInputValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Add Tag"
            size="small"
            variant="outlined"
            placeholder="Enter tag and press Enter or click Add"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <IconButton onClick={handleAddTag} disabled={!tagInput.trim()} size="small">
                  <AddCircleIcon fontSize="small" />
                </IconButton>
              ),
            }}
          />
        )}
        sx={{ mt: 2 }}
      />
      {/* Display Tags */}
      {tags.length > 0 && (
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 2 }}>
          {tags.map((tag, index) => (
            <Chip
              key={index}
              label={`#${tag}`}
              onDelete={() => handleDeleteTag(tag)}
              size="small"
              variant="outlined"
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}