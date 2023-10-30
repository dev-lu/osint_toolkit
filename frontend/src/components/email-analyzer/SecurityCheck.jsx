import React, { useState } from "react";

import CardHeader from "../styled/CardHeader";
import {
  Alert,
  AlertTitle,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Collapse,
  Grow,
  IconButton,
  useTheme,
} from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export default function SecurityCheck(props) {
  const theme = useTheme();
  const [open, setOpen] = useState(true);

  const card_style = {
    p: 2,
    mt: 2,
    backgroundColor: theme.palette.background.tablecell,
    boxShadow: 0,
    borderRadius: 5,
  };

  function showWarnings() {
    if (props.result.length > 0) {
      return (
        <>
          {props.result.map((row, index) => (
            <Alert
              key={"ema_warnings_alert_" + index}
              severity={
                row["warning_tlp"] === "red"
                  ? "error"
                  : row["warning_tlp"] === "orange"
                  ? "warning"
                  : row["warning_tlp"] === "green"
                  ? "success"
                  : "info"
              }
              variant="filled"
              sx={{ mt: 1, borderRadius: 5 }}
            >
              <AlertTitle>
                <b>{row["warning_title"]}</b>
              </AlertTitle>
              {row["warning_message"]}
            </Alert>
          ))}
        </>
      );
    } else {
      return <></>;
    }
  }

  return (
    <>
      {/* Basic security checks card */}
      <Grow in={true}>
        <Card key={"ema_basic_checks_card"} sx={card_style}>
          <CardActionArea onClick={() => setOpen(!open)}>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                width="100%"
              >
                <CardHeader
                  text={"Basic security checks"}
                  icon={<VerifiedUserIcon />}
                />
                <IconButton size="small">
                  {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              </Box>
            </CardContent>
          </CardActionArea>
          <Collapse in={open} timeout="auto" unmountOnExit>
            {showWarnings()}
          </Collapse>
        </Card>
      </Grow>
    </>
  );
}
