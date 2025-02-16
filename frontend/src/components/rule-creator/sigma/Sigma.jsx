import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Stack, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import LinkIcon from '@mui/icons-material/Link';
import TagIcon from '@mui/icons-material/Tag';
import SecurityIcon from '@mui/icons-material/Security';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import CodeIcon from '@mui/icons-material/Code';
import WarningIcon from '@mui/icons-material/Warning';
import DownloadIcon from '@mui/icons-material/Download';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PreviewIcon from '@mui/icons-material/Preview';
import DeleteIcon from '@mui/icons-material/Delete';

import Metadata from './components/Metadata';
import References from './components/References';
import Tags from './components/Tags';
import LogSource from './components/LogSource';
import Detection from './components/Detection';
import Fields from './components/Fields';
import FalsePositives from './components/FalsePositives';
import RulePreview from '../utils/RulePreview';

const generateUUIDv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const initialMetadata = {
  title: '',
  id: '',
  description: '',
  authors: [],
  date: '',
  modified: '',
  level: 'None',
  license: '',
  status: 'None',
};

const initialLogSource = {
  product: '',
  category: '',
  service: '',
  definition: '',
};

const initialDetection = {
  selection: [],
  filter: '',
  condition: 'all',
  timeframe: '',
};

const initialCondition = {
  field: '',
  modifier: 'equals',
  value: '',
};

export default function Sigma() {
  const [metadata, setMetadata] = useState(initialMetadata);
  const [logSource, setLogSource] = useState(initialLogSource);
  const [detections, setDetections] = useState(initialDetection);
  const [conditionsList, setConditionsList] = useState([]);
  const [fields, setFields] = useState([]);
  const [references, setReferences] = useState([]);
  const [tags, setTags] = useState([]);
  const [falsePositives, setFalsePositives] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [rulePreview, setRulePreview] = useState('');

  useEffect(() => {
    setMetadata(prev => ({
      ...prev,
      id: generateUUIDv4(),
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    }));
  }, []);


  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the form? All data will be lost.')) {
      setMetadata(initialMetadata);
      setLogSource(initialLogSource);
      setDetections(initialDetection);
      setConditionsList([]);
      setFields([]);
      setReferences([]);
      setTags([]);
      setFalsePositives([]);
      setRulePreview('');
      setPreviewOpen(false);

      setMetadata(prev => ({
        ...prev,
        id: generateUUIDv4(),
        date: new Date().toISOString().split('T')[0],
      }));
    }
  };

  const generateSigmaRule = () => {
    if (!metadata.title || !metadata.id) {
      alert('Title and ID are required for the Sigma rule.');
      return '';
    }

    let rule = `title: ${metadata.title}\n`;
    rule += `id: ${metadata.id}\n`;
    rule += `status: ${metadata.status}\n`;
    if (metadata.description) rule += `description: ${metadata.description}\n`;
    if (metadata.authors.length > 0) {
      rule += `authors:\n`;
      metadata.authors.forEach(author => {
        rule += `  - ${author}\n`;
      });
    }
    if (metadata.date) rule += `date: ${metadata.date}\n`;
    if (metadata.modified) rule += `modified: ${metadata.modified}\n`;
    if (metadata.license) rule += `license: ${metadata.license}\n`;
    rule += `level: ${metadata.level}\n`;
    if (tags.length > 0) {
      rule += `tags:\n`;
      tags.forEach(tag => {
        rule += `  - ${tag}\n`;
      });
    }
    if (references.length > 0) {
      rule += `references:\n`;
      references.forEach(ref => {
        rule += `  - ${ref}\n`;
      });
    }
    if (falsePositives.length > 0) {
      rule += `falsepositives:\n`;
      falsePositives.forEach(fp => {
        rule += `  - ${fp}\n`;
      });
    }
    rule += `logsource:\n`;
    if (logSource.product) rule += `  product: ${logSource.product}\n`;
    if (logSource.category) rule += `  category: ${logSource.category}\n`;
    if (logSource.service) rule += `  service: ${logSource.service}\n`;
    if (logSource.definition) rule += `  definition: ${logSource.definition}\n`;
    rule += `detection:\n`;

    if (conditionsList.length > 0 || detections.filter || detections.timeframe) {
      if (conditionsList.length > 0) {
        rule += `  selection:\n`;
        conditionsList.forEach(cond => {
          if (cond.modifier !== 'equals') {
            rule += `    ${cond.field}|${cond.modifier} ${cond.modifier === 're' ? '' : cond.modifier} "${cond.value}"\n`;
          } else {
            rule += `    ${cond.field} ${cond.modifier} "${cond.value}"\n`;
          }
        });
      }
      if (detections.filter) {
        rule += `  filter:\n    ${detections.filter}\n`;
      }
      if (detections.condition) {
        rule += `  condition: ${detections.condition}\n`;
      }
      if (detections.timeframe) {
        rule += `  timeframe: ${detections.timeframe}\n`;
      }
    }

    if (fields.length > 0) {
      rule += `fields:\n`;
      fields.forEach(field => {
        rule += `  - ${field}\n`;
      });
    }

    return rule;
  };

  const handleExport = () => {
    const rule = generateSigmaRule();
    if (!rule) return;
    const blob = new Blob([rule], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${metadata.title.replace(/\s+/g, '_')}.yml`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handlePreview = () => {
    const rule = generateSigmaRule();
    if (!rule) return;
    setRulePreview(rule);
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setRulePreview('');
  };

  return (
    <Box sx={{ width: '100%', p: { xs: 1, sm: 2 }, minHeight: '100vh' }}>
      <Typography variant="h5" align="center" gutterBottom>
        Sigma Rule Builder
      </Typography>

      {/* Rule Metadata Section */}
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
            <DescriptionIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="subtitle2">Rule Metadata</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 1, py: 1 }}>
          <Metadata metadata={metadata} handleMetadataChange={setMetadata} />
        </AccordionDetails>
      </Accordion>

      {/* References Section */}
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
            <LinkIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="subtitle2">References</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 1, py: 1 }}>
          <References references={references} handleReferencesChange={setReferences} />
        </AccordionDetails>
      </Accordion>

      {/* Tags Section */}
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
            <TagIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="subtitle2">Tags</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 1, py: 1 }}>
          <Tags tags={tags} handleTagsChange={setTags} />
        </AccordionDetails>
      </Accordion>

      {/* Log Source Section */}
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
            <SecurityIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="subtitle2">Log Source</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 1, py: 1 }}>
          <LogSource logSource={logSource} handleLogSourceChange={setLogSource} />
        </AccordionDetails>
      </Accordion>

      {/* Detection Section */}
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
            <Typography variant="subtitle2">Detection</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 1, py: 1 }}>
          <Detection
            detections={detections}
            handleDetectionsChange={setDetections}
            conditionsList={conditionsList}
            handleConditionsListChange={setConditionsList}
          />
        </AccordionDetails>
      </Accordion>

      {/* Fields Section */}
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
            <CodeIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="subtitle2">Fields</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 1, py: 1 }}>
          <Fields fields={fields} handleFieldsChange={setFields} />
        </AccordionDetails>
      </Accordion>

      {/* False Positives Section */}
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
            <WarningIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="subtitle2">False Positives</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 1, py: 1 }}>
          <FalsePositives falsePositives={falsePositives} handleFalsePositivesChange={setFalsePositives} />
        </AccordionDetails>
      </Accordion>

      {/* Export, Preview, and Reset Buttons */}
      <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <Button
            variant="outlined"
            startIcon={<PreviewIcon />}
            onClick={handlePreview}
            disabled={!metadata.title.trim() || !metadata.id.trim()}
            size="small"
          >
            Preview Rule
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
            disabled={!metadata.title.trim() || !metadata.id.trim()}
            size="small"
          >
            Export Sigma Rule
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
      <RulePreview open={previewOpen} onClose={handleClosePreview} rulePreview={rulePreview} />
    </Box>
    
  );
}