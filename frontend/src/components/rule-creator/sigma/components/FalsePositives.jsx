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

export default function FalsePositives({ falsePositives, handleFalsePositivesChange }) {
  const [currentFalsePositive, setCurrentFalsePositive] = useState('');

  const handleAddFalsePositive = () => {
    const trimmedFP = currentFalsePositive.trim();
    if (trimmedFP && !falsePositives.includes(trimmedFP)) {
      handleFalsePositivesChange((prev) => [...prev, trimmedFP]);
      setCurrentFalsePositive('');
    }
  };

  const handleDeleteFalsePositive = (fpToDelete) => {
    handleFalsePositivesChange((prev) => prev.filter((fp) => fp !== fpToDelete));
  };

  return (
    <>
      {/* Info text */}
      <Typography variant="caption" display="block" gutterBottom>
        Think about possible false positive conditions that could also trigger the
        rule. This list should contain useful hints for an analyst. E.g. the
        comment "Legitimate processes that delete the shadow copies" can be a hint
        for an analyst to check for backup processes on that system or ask for any
        unusual administrative activity that involved the deletion of the local
        volume shadow copies.
      </Typography>

      <Grid container spacing={1} alignItems="center">
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Add False Positive"
            value={currentFalsePositive}
            onChange={(e) => setCurrentFalsePositive(e.target.value)}
            size="small"
            variant="outlined"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddFalsePositive();
              }
            }}
            placeholder="Enter false positive"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="Add False Positive">
                    <IconButton
                      onClick={handleAddFalsePositive}
                      disabled={!currentFalsePositive.trim()}
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

      {/* Display False Positives */}
      {falsePositives.length > 0 && (
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 2 }}>
          {falsePositives.map((fp, index) => (
            <Chip
              key={index}
              label={fp}
              onDelete={() => handleDeleteFalsePositive(fp)}
              size="small"
              variant="outlined"
            />
          ))}
        </Stack>
      )}
    </>
  );
}