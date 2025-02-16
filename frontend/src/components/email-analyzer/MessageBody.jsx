import React, { useState } from "react";
import dompurify from "dompurify";

import CardHeader from "../styled/CardHeader";
import OpenAi from "./ShowOpenAiAnswer.jsx";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Collapse,
  Grow,
  IconButton,
  useTheme,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export default function MessageBody(props) {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const card_style = {
    p: 1,
    mt: 2,
    boxShadow: 0,
    borderRadius: 1,
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <Grow in={true}>
        <Card key={"ema_message_text_card"} sx={card_style}>
        <CardActionArea onClick={() => setOpen(!open)} sx={{ padding: '2px' }}>
            <CardContent sx={{ padding: '1px' }}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                width="100%"
              >
                <CardHeader
                  text={"Message body (HTML sanitized)"}
                  icon={<ChatIcon />}
                />
                <IconButton size="small">
                  {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              </Box>
            </CardContent>
          </CardActionArea>
          <Collapse in={open} timeout="auto" unmountOnExit>
            {expanded
              ? dompurify.sanitize(props.result, {
                  USE_PROFILES: { html: false, svg: false, svgFilters: false },
                })
              : dompurify
                  .sanitize(props.result, {
                    USE_PROFILES: {
                      html: false,
                      svg: false,
                      svgFilters: false,
                    },
                  })
                  .slice(0, 700)}
            {dompurify.sanitize(props.result, {
              USE_PROFILES: { html: false, svg: false, svgFilters: false },
            }).length > 700 ? (
              <Button onClick={toggleExpanded}>
                {expanded ? "Read Less" : "Read More"}
              </Button>
            ) : null}
            <br />
            <br />
            <div align="center">
              <OpenAi
                input={dompurify.sanitize(props.result, {
                  USE_PROFILES: { html: false, svg: false, svgFilters: false },
                })}
              />
            </div>
          </Collapse>
        </Card>
      </Grow>
    </>
  );
}
