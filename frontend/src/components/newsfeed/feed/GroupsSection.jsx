import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Chip,
  Stack,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FindInPage as FindInPageIcon } from "@mui/icons-material";
import { blueGrey, deepOrange, teal, indigo, pink, grey } from "@mui/material/colors";

export default function GroupsSection({ item }) {
  if (!item.matches || item.matches.length === 0) {
    return null;
  }

  return (
    <Accordion sx={{ border: 'none', boxShadow: 'none', bgcolor: grey[900] }} >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{ flexDirection: "row-reverse" }} 
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <FindInPageIcon />
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Groups
            {item.matches.length > 1 ? "es " : " "}
            ({item.matches.length})
          </Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {item.matches.map((keyword, idx) => (
            <Chip
              key={idx}
              label={keyword}
              variant="outlined" 
              sx={{
                mb: 1,
              }}
            />
          ))}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}