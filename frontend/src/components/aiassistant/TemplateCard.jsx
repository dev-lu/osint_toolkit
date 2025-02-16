import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import {
  Info as InfoIcon,
  Edit as EditIcon,
  Public as PublicIcon,
  Lock as LockIcon,
} from '@mui/icons-material';

const TemplateCard = ({ template, selected, onSelect, onShowExample, onEdit }) => (
  <Card 
    sx={{ 
      mb: 2,
      border: selected ? 2 : 0,
      borderColor: 'primary.main',
      cursor: 'pointer',
      '&:hover': {
        boxShadow: (theme) => theme.shadows[4],
      },
    }}
    onClick={() => onSelect(template)}
  >
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" component="div">
          {template.title}
        </Typography>
        <Chip
          icon={template.is_public ? <PublicIcon /> : <LockIcon />}
          label={template.is_public ? "Public" : "Private"}
          size="small"
          color={template.is_public ? "primary" : "default"}
        />
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        {template.description}
      </Typography>
      {template.ai_agent_role && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          <strong>Agent Role:</strong> {template.ai_agent_role}
        </Typography>
      )}
      <Box mt={2}>
        <Typography variant="caption" color="text.secondary">
          Required fields: {Array.isArray(template.payload_fields) ? 
            template.payload_fields.filter(f => f.required).length : 0}
        </Typography>
      </Box>
    </CardContent>
    <CardActions>
      <Button 
        size="small" 
        startIcon={<InfoIcon />}
        onClick={(e) => {
          e.stopPropagation();
          onShowExample(template);
        }}
      >
        View Example
      </Button>
      <Button 
        size="small" 
        startIcon={<EditIcon />}
        onClick={(e) => {
          e.stopPropagation();
          onEdit(template);
        }}
      >
        Edit
      </Button>
    </CardActions>
  </Card>
);

export default TemplateCard;
