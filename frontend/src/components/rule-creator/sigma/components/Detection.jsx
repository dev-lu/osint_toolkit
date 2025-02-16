import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import RadarIcon from '@mui/icons-material/Radar';

const FieldData = [
  'process.name',
  'event.type',
  'user.name',
  'source.ip',
  'destination.ip',
  'file.path',
];

const modifiers = [
  'contains',
  'startswith',
  'endswith',
  'base64',
  'base64offset',
  'utf16',
  'utf16le',
  'utf16be',
  'wide',
  're',
  'all',
  'equals',
  'windash',
];

const initialCondition = {
  field: '',
  modifier: 'equals',
  value: '',
};

export default function Detection({
  detections,
  handleDetectionsChange,
  conditionsList,
  handleConditionsListChange,
}) {
  const [currentCondition, setCurrentCondition] = useState(initialCondition);
  const [keywords, setKeywords] = useState([]);

  const handleAddKeyword = () => {
    if (currentCondition.keyword.trim() === '') {
      alert('Keyword is required.');
      return;
    }
    setKeywords([...keywords, currentCondition.keyword.trim()]);
    setCurrentCondition((prev) => ({ ...prev, keyword: '' }));
  };

  const handleDeleteKeyword = (keywordToDelete) => {
    setKeywords(keywords.filter((keyword) => keyword !== keywordToDelete));
  };

  const handleAddCondition = () => {
    if (currentCondition.field.trim() === '' || currentCondition.value.trim() === '') {
      alert('Field and Value are required for a condition.');
      return;
    }
    handleConditionsListChange((prev) => [
      ...prev,
      {
        field: currentCondition.field.trim(),
        modifier: currentCondition.modifier,
        value: currentCondition.value.trim(),
      },
    ]);
    setCurrentCondition(initialCondition);
  };

  const handleDeleteCondition = (index) => {
    handleConditionsListChange((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Box>
      {/* Info texts */}
      <Typography variant="caption" display="block" gutterBottom>
        If your list consists of a single element, don't use a list.
      </Typography>
      <Typography variant="caption" display="block" gutterBottom>
        Use only lowercase identifiers.
      </Typography>
      <Typography variant="caption" display="block" gutterBottom>
        Put comments on lines if you like to (use 2 spaces to separate the expression
        from your comment, e.g. - 'cmd.exe' # command line).
      </Typography>
      <Typography variant="caption" display="block" gutterBottom>
        Don't use regular expressions unless you really have to (e.g. instead of
        CommandLine|re: '\\payload.*\skeyset' use CommandLine|contains|all with
        the values \payload and keyset).
      </Typography>
      <Typography variant="caption" display="block" gutterBottom>
        In new sources use the field names as they appear in the log source, remove
        spaces and keep hyphens (e.g. SAM User Account becomes SAMUserAccount).
      </Typography>
      <Typography variant="caption" display="block" gutterBottom>
        Don't use SIEM specific logic in your condition.
      </Typography>

      {/* Keywords Section */}
      <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
        Keywords
      </Typography>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={12} sm={11}>
          <TextField
            fullWidth
            label="Keyword"
            value={currentCondition.keyword || ''}
            onChange={(e) =>
              setCurrentCondition((prev) => ({ ...prev, keyword: e.target.value }))
            }
            size="small"
            variant="outlined"
            placeholder="Enter keyword and press Enter or click Add"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddKeyword();
              }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={1}>
          <Tooltip title="Add Keyword">
            <IconButton onClick={handleAddKeyword} size="small">
              <AddCircleIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
      {/* Display Keywords */}
      <Box sx={{ mt: 1 }}>
        {keywords.map((keyword) => (
          <Chip
            key={keyword}
            label={keyword}
            onDelete={() => handleDeleteKeyword(keyword)}
            sx={{ mr: 1, mb: 1 }}
          />
        ))}
      </Box>

      {/* Selection Conditions Section */}
      <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
        Selection Conditions
      </Typography>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={12} sm={4}>
          <Autocomplete
            options={FieldData}
            value={currentCondition.field}
            onChange={(event, newValue) => {
              setCurrentCondition((prev) => ({
                ...prev,
                field: newValue || '',
              }));
            }}
            onInputChange={(event, newInputValue) => {
              setCurrentCondition((prev) => ({
                ...prev,
                field: newInputValue,
              }));
            }}
            freeSolo
            renderInput={(params) => (
              <TextField {...params} label="Field" size="small" variant="outlined" />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Modifier</InputLabel>
            <Select
              value={currentCondition.modifier}
              label="Modifier"
              onChange={(e) =>
                setCurrentCondition((prev) => ({
                  ...prev,
                  modifier: e.target.value,
                }))
              }
            >
              {modifiers.map((mod) => (
                <MenuItem key={mod} value={mod}>
                  {mod}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Value"
            value={currentCondition.value}
            onChange={(e) =>
              setCurrentCondition((prev) => ({
                ...prev,
                value: e.target.value,
              }))
            }
            size="small"
            variant="outlined"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddCondition();
              }
            }}
            placeholder="Enter value and press Enter or click Add"
          />
        </Grid>
        <Grid item xs={12} sm={1}>
          <Tooltip title="Add Condition">
            <IconButton
              onClick={handleAddCondition}
              disabled={!currentCondition.field.trim() || !currentCondition.value.trim()}
              size="small"
            >
              <AddCircleIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>

      {/* List of Conditions */}
      {conditionsList.length > 0 && (
        <List sx={{ mt: 2, maxHeight: 150, overflow: 'auto' }}>
          {conditionsList.map((cond, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <Tooltip title="Delete Condition">
                  <IconButton
                    edge="end"
                    onClick={() => handleDeleteCondition(index)}
                    size="small"
                  >
                    <DeleteIcon fontSize="small" color="error" />
                  </IconButton>
                </Tooltip>
              }
              sx={{ py: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 30 }}>
                <RadarIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={`${cond.field} ${
                  cond.modifier !== 'equals' ? `|${cond.modifier}` : ''
                } ${cond.modifier === 're' ? '' : cond.modifier} "${cond.value}"`}
              />
            </ListItem>
          ))}
        </List>
      )}

      {/* Filter and Timeframe */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Filter"
            value={detections.filter}
            onChange={(e) =>
              handleDetectionsChange((prev) => ({
                ...prev,
                filter: e.target.value,
              }))
            }
            size="small"
            variant="outlined"
            placeholder="e.g., selection and some_other_condition"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Timeframe"
            value={detections.timeframe}
            onChange={(e) =>
              handleDetectionsChange((prev) => ({
                ...prev,
                timeframe: e.target.value,
              }))
            }
            size="small"
            variant="outlined"
            placeholder="e.g., 1h, 30m"
          />
        </Grid>
      </Grid>

      {/* Condition Selection */}
      {(conditionsList.length > 0 || keywords.length > 0 || detections.filter || detections.timeframe) && (
        <FormControl fullWidth size="small" sx={{ mt: 2 }}>
          <InputLabel>Condition</InputLabel>
          <Select
            value={detections.condition}
            label="Condition"
            onChange={(e) =>
              handleDetectionsChange((prev) => ({
                ...prev,
                condition: e.target.value,
              }))
            }
          >
            <MenuItem value="all">All conditions must be met (AND)</MenuItem>
            <MenuItem value="any">At least one condition must be met (OR)</MenuItem>
            <MenuItem value="count">
              {"Number of conditions (e.g., count >= 2)"}
            </MenuItem>
          </Select>
        </FormControl>
      )}
    </Box>
  );
}