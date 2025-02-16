import React, { useState } from 'react';
import {
  Grid,
  TextField,
  Tooltip,
  IconButton,
  Chip,
  Stack,
  Typography,
  InputAdornment,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';

export default function Fields({ fields, handleFieldsChange }) {
  const [currentField, setCurrentField] = useState('');

  const handleAddField = () => {
    const trimmedField = currentField.trim();
    if (trimmedField && !fields.includes(trimmedField)) {
      handleFieldsChange((prev) => [...prev, trimmedField]);
      setCurrentField('');
    }
  };

  const handleDeleteField = (fieldToDelete) => {
    handleFieldsChange((prev) => prev.filter((field) => field !== fieldToDelete));
  };

  return (
    <>
      {/* Info text */}
      <Typography variant="caption" display="block" gutterBottom>
        These are the fields that are very helpful in the evaluation of a certain
        event. For example, it is helpful to know the parent process of a process
        that contains suspicious strings in its command line parameters. These
        fields could be extracted automatically and presented to the analyst in
        order to speed up the analysis.
      </Typography>

      <Grid container spacing={1} alignItems="center">
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Add Field"
            value={currentField}
            onChange={(e) => setCurrentField(e.target.value)}
            size="small"
            variant="outlined"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddField();
              }
            }}
            placeholder="Enter field"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="Add Field">
                    <IconButton
                      onClick={handleAddField}
                      disabled={!currentField.trim()}
                      size="small"
                    >
                      <AddCircleIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      {/* Display Fields */}
      {fields.length > 0 && (
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 2 }}>
          {fields.map((field, index) => (
            <Chip
              key={index}
              label={field}
              onDelete={() => handleDeleteField(field)}
              size="small"
              variant="outlined"
            />
          ))}
        </Stack>
      )}
    </>
  );
}