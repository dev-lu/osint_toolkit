import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  IconButton,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditNoteIcon from '@mui/icons-material/EditNote';
import ReactMarkdown from "react-markdown";
import { grey } from "@mui/material/colors";

export default function NotesSection({
  item,
  updateArticleField,
  icon,
  isButton = false,
  api
}) {
  const [noteContent, setNoteContent] = useState(item.note || "");

  const handleNoteEdit = () => {
    updateArticleField(item.id, "editNote", true);
  };

  const handleNoteSave = async () => {
    console.log('handleNoteSave called');
    console.log('api prop:', api);
    if (!api) {
      console.error('api prop is missing');
      return;
    }
    try {
      await api.put(`/api/newsfeed/article/${item.id}`, {
        note: noteContent,
      });
      
      await updateArticleField(item.id, "note", noteContent);
      updateArticleField(item.id, "editNote", false);
    } catch (error) {
      console.error(`Error saving note for article ${item.id}:`, error);
    }
  };

  const handleCancel = () => {
    setNoteContent(item.note || "");
    updateArticleField(item.id, "editNote", false);
  };

  if (isButton) {
    return (
      <IconButton
        onClick={handleNoteEdit}
        color="primary"
        aria-label={item.note ? "Edit Note" : "Add Note"}
      >
        {icon}
      </IconButton>
    );
  }

  return (
    <Accordion
      sx={{
        borderRadius: 1,
      }}
      variant="secondary"
      defaultExpanded
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{ flexDirection: "row-reverse" }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <EditNoteIcon />
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Note:
          </Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        {item.editNote ? (
          <Stack direction="column" spacing={1}>
            <TextField
              variant="outlined"
              fullWidth
              multiline
              minRows={3}
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Enter your note here..."
            />
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                disableElevation
                onClick={handleNoteSave}
              >
                Save Note
              </Button>
              <Button
                variant="outlined"
                disableElevation
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        ) : (
          <Typography sx={{ mt: 1 }}>
            <ReactMarkdown>{item.note}</ReactMarkdown>
          </Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );
}