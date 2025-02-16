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
          <ReactMarkdown>{item.analysis_result}</ReactMarkdown>
          </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
