import React from 'react';
import {
  TextField,
  Button,
  Stack
} from '@mui/material';
import {
  HealthAndSafety as HealthAndSafetyIcon,
  GppMaybe as GppMaybeIcon,
  Clear as ClearIcon,
  ContentCopy as CopyIcon
} from '@mui/icons-material';

const InputForm = ({ 
  inputText, 
  onInputChange, 
  operation, 
  onProcess, 
  onClear, 
  onCopyAllResults,
  hasResults 
}) => {
  return (
    <>
      <TextField
        fullWidth
        multiline
        rows={8}
        variant="outlined"
        label={`Enter IOCs to ${operation} (one per line)`}
        placeholder={operation === 'defang' 
          ? "https://example.com\n192.168.1.1\nuser@domain.com\nmalware.exe"
          : "hxxps[://]example[.]com\n192[.]168[.]1[.]1\nuser[@]domain[.]com"
        }
        value={inputText}
        onChange={(e) => onInputChange(e.target.value)}
        helperText={`Supports domains, IPs, URLs, emails, hashes. ${inputText.split('\n').filter(line => line.trim()).length} lines entered.`}
      />
      
      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button
          variant="contained"
          onClick={onProcess}
          disabled={!inputText.trim()}
          startIcon={operation === 'defang' ? <HealthAndSafetyIcon /> : <GppMaybeIcon />}
        >
          {operation === 'defang' ? 'Defang IOCs' : 'Fang IOCs'}
        </Button>
        <Button
          variant="outlined"
          onClick={onClear}
          startIcon={<ClearIcon />}
        >
          Clear
        </Button>
        {hasResults && (
          <Button
            variant="outlined"
            onClick={onCopyAllResults}
            startIcon={<CopyIcon />}
          >
            Copy All Results
          </Button>
        )}
      </Stack>
    </>
  );
};

export default InputForm;
