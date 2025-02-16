import React, { useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function RulePreview({ open, onClose, rulePreview }) {
  const preRef = useRef(null);

  const handleCopyToClipboard = () => {
    if (preRef.current) {
      const text = preRef.current.innerText;
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Sigma Rule Preview</DialogTitle>
      <DialogContent>
        <Box
          ref={preRef}
          component="pre"
          sx={{
            borderRadius: 1,
            overflowX: 'auto',
            fontSize: '0.875rem',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
          }}
        >
          <SyntaxHighlighter language="yaml" style={tomorrow} showLineNumbers={true}>
            {rulePreview}
          </SyntaxHighlighter>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 1 }}>
        <Tooltip title="Copy to Clipboard">
          <IconButton onClick={handleCopyToClipboard} size="small">
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Button onClick={onClose} size="small">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}