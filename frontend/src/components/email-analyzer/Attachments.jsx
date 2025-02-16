import React, { useState } from "react";

import CardHeader from "../styled/CardHeader";
import Hash from "../ioc-analyzer/Hash.jsx";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Collapse,
  Grow,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export default function Attachments(props) {
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

  const [showHashAnalysisAttachements, setShowHashAnalysisAttachements] =
    React.useState(false);
  function hashAnalysis(props) {
    const ioc = props;
    return (
      <>
        <br />
        <br />
        <Hash ioc={ioc} />
        <br />
      </>
    );
  }

  function showAttachements() {
    if (props.result.length > 0) {
      return props.result.map((row, index) => (
        <React.Fragment key={index}>
          <TableContainer sx={tableContainerStyle}>
            <Table aria-label="simple table" >
              <TableHead>
                <TableRow>
                  <TableCell
                    colSpan={3}
                    sx={{ backgroundColor: theme.palette.background.tablecell }}
                  >
                    <Typography
                      sx={{ flex: "1 1 100%" }}
                      variant="h6"
                      id={row.md5}
                      component="div"
                    >
                      <b>
                        {row.filename != null
                          ? row.filename
                          : "Unknown filename"}
                      </b>
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell align="left" sx={{ overflowWrap: "anywhere" }}>
                    {" "}
                    <b> MD5 </b>{" "}
                  </TableCell>
                  <TableCell align="left" sx={{ overflowWrap: "anywhere" }}>
                    {" "}
                    {row.md5}{" "}
                  </TableCell>
                  <TableCell align="left" sx={{ overflowWrap: "anywhere" }}>
                    <Button
                      variant="outlined"
                      disableElevation
                      size="small"
                      onClick={() =>
                        setShowHashAnalysisAttachements(
                          !showHashAnalysisAttachements
                        )
                      }
                      sx={{ float: "right" }}
                    >
                      Analyze
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left" sx={{ overflowWrap: "anywhere" }}>
                    {" "}
                    <b> SHA1 </b>{" "}
                  </TableCell>
                  <TableCell align="left" sx={{ overflowWrap: "anywhere" }}>
                    {" "}
                    {row.sha1}{" "}
                  </TableCell>
                  <TableCell align="left" sx={{ overflowWrap: "anywhere" }}>
                    <Button
                      variant="outlined"
                      disableElevation
                      size="small"
                      onClick={() =>
                        setShowHashAnalysisAttachements(
                          !showHashAnalysisAttachements
                        )
                      }
                      sx={{ float: "right" }}
                    >
                      Analyze
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left" sx={{ overflowWrap: "anywhere" }}>
                    {" "}
                    <b> SHA256 </b>{" "}
                  </TableCell>
                  <TableCell align="left" sx={{ overflowWrap: "anywhere" }}>
                    {" "}
                    {row.sha256}{" "}
                  </TableCell>
                  <TableCell align="left" sx={{ overflowWrap: "anywhere" }}>
                    <Button
                      variant="outlined"
                      disableElevation
                      size="small"
                      onClick={() =>
                        setShowHashAnalysisAttachements(
                          !showHashAnalysisAttachements
                        )
                      }
                      sx={{ float: "right" }}
                    >
                      Analyze
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          {showHashAnalysisAttachements ? hashAnalysis(row.md5) : <></>}
        </React.Fragment>
      ));
    } else {
      return <p>No attachments found</p>;
    }
  }

  return (
    <>
      <Grow in={true}>
        <Card key={"ema_attachements_card"} sx={card_style}>
        <CardActionArea onClick={() => setOpen(!open)} sx={{ padding: '2px' }}>
            <CardContent sx={{ padding: '1px' }}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                width="100%"
              >
                <CardHeader
                  text={`Attachments (${props.result.length})`}
                  icon={<AttachFileIcon />}
                />
                <IconButton size="small">
                  {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              </Box>
            </CardContent>
          </CardActionArea>
          <Collapse in={open} timeout="auto" unmountOnExit>
            {showAttachements()}
          </Collapse>
        </Card>
      </Grow>
    </>
  );
}
