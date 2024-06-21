import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/Info";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { styled } from "@mui/material/styles";

const MarkdownContainer = styled(Box)(({ theme }) => ({
  overflowY: "auto",
  maxHeight: "60vh",
  padding: theme.spacing(2),
  "& table": {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: theme.spacing(2),
    "& th, & td": {
      border: `1px solid ${theme.palette.divider}`,
      padding: theme.spacing(1),
      textAlign: "left",
    },
    "& th": {
      backgroundColor: theme.palette.grey[200],
    },
  },
  "& p": {
    marginBottom: theme.spacing(2),
  },
  "& h4": {
    marginBottom: theme.spacing(2),
  },
}));

export default function InfoModal(props) {
  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Box
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          width: "70%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 5,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h4" sx={{ display: "flex", alignItems: "center" }}>
            <InfoIcon sx={{ mr: 1 }} /> {props.title}
          </Typography>
          <IconButton onClick={props.onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <MarkdownContainer>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{props.text}</ReactMarkdown>
        </MarkdownContainer>
      </Box>
    </Modal>
  );
}
