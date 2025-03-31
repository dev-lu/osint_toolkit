import React, { useState, useMemo } from "react";
import dompurify from "dompurify";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Button,
  Typography,
  Divider,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import OpenAi from "./ShowOpenAiAnswer.jsx";

export default function MessageBody(props) {
  const [expanded, setExpanded] = useState(true);
  const [contentExpanded, setContentExpanded] = useState(false);

  const sanitizedContent = useMemo(() => 
    dompurify.sanitize(props.result, {
      USE_PROFILES: { html: false, svg: false, svgFilters: false },
    }), 
    [props.result]
  );

  const displayContent = useMemo(() => 
    contentExpanded ? sanitizedContent : sanitizedContent.slice(0, 700),
    [sanitizedContent, contentExpanded]
  );

  const handleAccordionChange = () => {
    setExpanded(!expanded);
  };

  const toggleContentExpanded = () => {
    setContentExpanded(!contentExpanded);
  };

  const showReadMoreButton = sanitizedContent.length > 700;

  return (
    <Accordion 
      expanded={expanded} 
      onChange={handleAccordionChange}
      sx={{ mt: 2, borderRadius: 2, '&.MuiPaper-root': { boxShadow: 0, border: '1px solid rgba(0, 0, 0, 0.12)' } }}
      TransitionProps={{ unmountOnExit: false }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="message-body-content"
        id="message-body-header"
        sx={{ minHeight: '48px', padding: '0 16px' }}
      >
        <Box display="flex" alignItems="center">
          <ChatIcon sx={{ mr: 1 }} fontSize="small" />
          <Typography variant="subtitle1" fontWeight="medium">
            Message body (HTML sanitized)
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 1 }}>
        <Box 
          ref={(node) => {
            if (node) node.innerHTML = displayContent;
          }}
          sx={{ 
            fontSize: '0.875rem',
            maxWidth: '100%',
            overflowWrap: 'break-word',
            wordBreak: 'break-word'
          }}
        />
        
        {showReadMoreButton && (
          <Box mt={1} mb={1}>
            <Button 
              onClick={toggleContentExpanded}
              size="small" 
              variant="text"
            >
              {contentExpanded ? "Read Less" : "Read More"}
            </Button>
          </Box>
        )}
        
        <Divider sx={{ my: 2 }} />
        
        <Box display="flex" justifyContent="center" width="100%">
          <OpenAi input={sanitizedContent} />
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}