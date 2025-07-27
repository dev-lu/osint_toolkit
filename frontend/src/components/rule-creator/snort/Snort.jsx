import React from 'react';
import { Box, Typography, Button, Stack, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import SettingsIcon from '@mui/icons-material/Settings';
import DownloadIcon from '@mui/icons-material/Download';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PreviewIcon from '@mui/icons-material/Preview';
import DeleteIcon from '@mui/icons-material/Delete';

import RuleHeader from './components/forms/RuleHeader';
import RuleOptions from './components/forms/RuleOptions';
import RuleContent from './components/forms/RuleContent';
import RuleMetadata from './components/forms/RuleMetadata';
import RulePreview from '../utils/RulePreview';
import { useSnortRule } from './hooks/ui/useSnortRule';

export default function Snort() {
  const {
    ruleHeader,
    ruleOptions,
    ruleContent,
    ruleMetadata,
    previewOpen,
    rulePreview,
    setRuleHeader,
    setRuleOptions,
    setRuleContent,
    setRuleMetadata,
    handlePreview,
    handleExport,
    handleReset,
    handleClosePreview,
    isRuleValid,
  } = useSnortRule();

  return (
    <Box sx={{ width: '100%', p: { xs: 1, sm: 2 }, minHeight: '100vh' }}>
      <Typography variant="h5" align="center" gutterBottom>
        Snort/Suricata Rule Builder
      </Typography>

      {/* Rule Header Section */}
      <Accordion sx={{ border: 'none', boxShadow: 'none' }} defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            px: 1,
            py: 0.5,
            minHeight: '40px',
            '& .MuiAccordionSummary-content': {
              margin: 0,
            },
          }}
        >
          <Box display="flex" alignItems="center">
            <NetworkCheckIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="subtitle2">Rule Header</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 1, py: 1 }}>
          <RuleHeader ruleHeader={ruleHeader} handleRuleHeaderChange={setRuleHeader} />
        </AccordionDetails>
      </Accordion>

      {/* Rule Options Section */}
      <Accordion sx={{ border: 'none', boxShadow: 'none', mt: 1 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            px: 1,
            py: 0.5,
            minHeight: '40px',
            '& .MuiAccordionSummary-content': {
              margin: 0,
            },
          }}
        >
          <Box display="flex" alignItems="center">
            <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="subtitle2">Rule Options</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 1, py: 1 }}>
          <RuleOptions ruleOptions={ruleOptions} handleRuleOptionsChange={setRuleOptions} />
        </AccordionDetails>
      </Accordion>

      {/* Rule Content Section */}
      <Accordion sx={{ border: 'none', boxShadow: 'none', mt: 1 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            px: 1,
            py: 0.5,
            minHeight: '40px',
            '& .MuiAccordionSummary-content': {
              margin: 0,
            },
          }}
        >
          <Box display="flex" alignItems="center">
            <FingerprintIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="subtitle2">Detection Content</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 1, py: 1 }}>
          <RuleContent ruleContent={ruleContent} handleRuleContentChange={setRuleContent} />
        </AccordionDetails>
      </Accordion>

      {/* Rule Metadata Section */}
      <Accordion sx={{ border: 'none', boxShadow: 'none', mt: 1 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            px: 1,
            py: 0.5,
            minHeight: '40px',
            '& .MuiAccordionSummary-content': {
              margin: 0,
            },
          }}
        >
          <Box display="flex" alignItems="center">
            <DescriptionIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="subtitle2">Enhanced Metadata</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 1, py: 1 }}>
          <RuleMetadata ruleMetadata={ruleMetadata} handleRuleMetadataChange={setRuleMetadata} />
        </AccordionDetails>
      </Accordion>

      {/* Export, Preview, and Reset Buttons */}
      <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <Button
            variant="outlined"
            startIcon={<PreviewIcon />}
            onClick={handlePreview}
            disabled={!isRuleValid()}
            size="small"
          >
            Preview Rule
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
            disabled={!isRuleValid()}
            size="small"
          >
            Export Snort Rule
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<DeleteIcon />}
            onClick={handleReset}
            size="small"
          >
            Reset
          </Button>
        </Stack>
      </Box>

      {/* Preview Dialog */}
      <RulePreview 
        open={previewOpen} 
        onClose={handleClosePreview} 
        rulePreview={rulePreview} 
        title="Snort Rule Preview" 
      />
    </Box>
  );
}
