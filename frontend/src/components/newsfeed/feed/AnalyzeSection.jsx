import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Stack,
  Typography,
} from "@mui/material";
import {
  AutoAwesome as AutoAwesomeIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import ReactMarkdown from "react-markdown";
import { useTheme } from "@mui/material/styles";

export default function AnalyzeSection({ item }) {
  const theme = useTheme();
  
  // Extract the markdown content from the analysis_result
  const getMarkdownContent = () => {
    try {
      // Check if analysis_result is a string that needs parsing
      if (typeof item.analysis_result === 'string') {
        const parsed = JSON.parse(item.analysis_result);
        return parsed.markdown || '';
      }
      
      // Check if it's already an object with markdown property
      if (typeof item.analysis_result === 'object' && item.analysis_result.markdown) {
        return item.analysis_result.markdown;
      }
      
      // Fallback: if it's an object but doesn't have markdown property
      if (typeof item.analysis_result === 'object') {
        return JSON.stringify(item.analysis_result, null, 2);
      }
      
      return '';
    } catch (error) {
      console.error("Error parsing analysis result:", error);
      return "Error displaying analysis";
    }
  };

  return (
    <Accordion
      variant="secondary"
      sx={{borderRadius: 1}}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          "& .MuiAccordionSummary-content": { margin: 0 },
          flexDirection: "row-reverse"
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
        >
          <AutoAwesomeIcon />
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            AI Analysis
          </Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 2 }}>
        <Stack direction="column" spacing={1} sx={{p: 1}}>
          <Box sx={{
            '& ul': { 
              paddingLeft: 4,
              marginTop: 0.5,
              marginBottom: 1
            },
            '& li': {
              marginBottom: 0.5 
            },
            '& p': {
              marginTop: 1,
              marginBottom: 1.5
            },
            '& strong': {
              display: 'block',
              marginTop: 1.5,
              marginBottom: 0.5
            }
          }}>
            <ReactMarkdown>
              {getMarkdownContent()}
            </ReactMarkdown>
          </Box>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}