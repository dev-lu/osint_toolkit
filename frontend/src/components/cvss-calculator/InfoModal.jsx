import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import InfoIcon from "@mui/icons-material/Info";

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
          p: 2,
          borderRadius: 1,
        }}
      >
        <Typography variant="h4" sx={{ p: 2 }}>
          <InfoIcon /> {props.title}
        </Typography>
        <Typography sx={{ p: 2 }}>{props.text}</Typography>
      </Box>
    </Modal>
  );
}
