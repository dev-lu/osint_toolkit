import React, { useState } from 'react';
import {
  Grid,
  TextField,
  Tooltip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LinkIcon from '@mui/icons-material/Link';

export default function References({ references, handleReferencesChange }) {
  const [currentReference, setCurrentReference] = useState('');

  const handleAddReference = () => {
    const trimmedReference = currentReference.trim();
    if (trimmedReference && !references.includes(trimmedReference)) {
      handleReferencesChange((prev) => [...prev, trimmedReference]);
      setCurrentReference('');
    }
  };

  const handleDeleteReference = (refToDelete) => {
    handleReferencesChange((prev) => prev.filter((ref) => ref !== refToDelete));
  };

  return (
    <Box> 
      <Typography variant="subtitle2" gutterBottom>
        Add references to web pages or documents that provide more context about the detected threat.
      </Typography>
      <Typography variant="body2" ml={2} gutterBottom component="div"> 
        <ul>
          <li>Use links to web pages or documents only.</li>
          <li>Do not link to EVTX files, PCAPs, or other raw content.</li>
          <li>Do not include links to MITRE ATT&CK techniques (we use tags for that).</li>
        </ul>
      </Typography>
      <Typography variant="caption" gutterBottom>
        Examples: blog posts, tweets, project pages, manual pages, advisories, discussions.
      </Typography>
      <TextField
        fullWidth
        label="Reference"
        value={currentReference}
        onChange={(e) => setCurrentReference(e.target.value)}
        size="small"
        variant="outlined"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleAddReference();
          }
        }}
        placeholder="Enter reference and press Enter or click Add"
        InputProps={{
          endAdornment: (
            <Tooltip title="Add Reference">
              <IconButton
                onClick={handleAddReference}
                disabled={!currentReference.trim()}
                size="small"
              >
                <AddCircleIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          ),
        }}
        sx={{ mt: 2 }} 
      />
      {/* List of References */}
      {references.length > 0 && (
        <List sx={{ mt: 2, maxHeight: 150, overflow: 'auto' }}>
          {references.map((ref, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton
                  edge="end"
                  onClick={() => handleDeleteReference(ref)}
                  size="small"
                >
                  <DeleteIcon fontSize="small" color="error" />
                </IconButton>
              }
              sx={{ py: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 30 }}>
                <LinkIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={ref} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}