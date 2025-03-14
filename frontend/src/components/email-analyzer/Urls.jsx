import React, { useState } from "react";

import CardHeader from "../styled/CardHeader";
import Url from "../ioc-analyzer/Url.jsx";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Collapse,
  Grow,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  useTheme,
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export default function Urls(props) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const card_style = {
    p: 1,
    mt: 2,
    boxShadow: 0,
    borderRadius: 1,
  };

  const tableContainerStyle = {
    borderRadius: 1,
    maxWidth: "95%",
    boxShadow: 0,
    border: 0,
    borderColor: "lightgrey",
    m: 2,
  };

  const [url, setUrl] = React.useState(null);
  const [showUrlAnalyse, setShowUrlAnalyse] = React.useState(false);
  function urlAnalyse(props) {
    return (
      <>
        <br />
        <br />
        <Url ioc={url} />
        <br />
      </>
    );
  }

  function showUrls() {
    if (props.result.length > 0) {
      return (
        <React.Fragment key="urls_fragment">
          <TableContainer component={Paper} sx={tableContainerStyle}>
            <Table aria-label="simple table" >
              <TableBody>
                {props.result.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell align="left" sx={{ overflowWrap: "anywhere" }}>
                      {row}
                    </TableCell>
                    <TableCell sx={{ overflowWrap: "anywhere" }}>
                      <Button
                        variant="outlined"
                        disableElevation
                        size="small"
                        onClick={() => {
                          setShowUrlAnalyse(!showUrlAnalyse);
                          setUrl(row);
                        }}
                        sx={{ float: "right", whiteSpace: "nowrap" }}
                      >
                        Analyze
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {showUrlAnalyse ? urlAnalyse(url) : <></>}
        </React.Fragment>
      );
    } else {
      return <p>No URLs found...</p>;
    }
  }

  return (
    <>
      <Grow in={true}>
        <Card key={"ema_url_card"} sx={card_style}>
        <CardActionArea onClick={() => setOpen(!open)} sx={{ padding: '2px' }}>
            <CardContent sx={{ padding: '1px' }}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                width="100%"
              >
                <CardHeader
                  text={`URLs in body (${props.result.length})`}
                  icon={<LinkIcon />}
                />
                <IconButton size="small">
                  {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              </Box>
            </CardContent>
          </CardActionArea>
          <Collapse in={open} timeout="auto" unmountOnExit>
            {showUrls()}
          </Collapse>
        </Card>
      </Grow>
    </>
  );
}
