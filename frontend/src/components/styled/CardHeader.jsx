import React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

export default function CardHeader({ text, icon }) {
  return (
    <>
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar
          sx={{
            width: 40,
            height: 40,
            color: "white",
          }}
        >
          {icon}
        </Avatar>
        <Typography variant="h5">{text}</Typography>
      </Box>
    </>
  );
}
