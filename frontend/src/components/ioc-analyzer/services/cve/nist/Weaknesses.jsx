import React from "react";

import Card from "@mui/material/Card";
import CategoryIcon from "@mui/icons-material/Category";
import Grid from "@mui/material/Grid";
import InfoIcon from "@mui/icons-material/Info";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import NumbersIcon from "@mui/icons-material/Numbers";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from "@mui/material";
import SourceIcon from "@mui/icons-material/Source";
import Typography from "@mui/material/Typography";
import useTheme from "@mui/material/styles/useTheme";

export default function Weaknesses(props) {
  const theme = useTheme();
  const tableContainerStyle = {
    boxShadow: 0,
    borderRadius: 5,
    border: 1,
    borderColor: theme.palette.background.tableborder,
    mb: 2,
  };

  const tableCellStyle = {
    bgcolor: theme.palette.background.tablecell,
    fontWeight: "bold",
  };

  return (
    <Card
      variant="outlined"
      key="weaknesses_card"
      sx={{ m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}
    >
      <Typography variant="h5" gutterBottom component="div">
        Weaknesses
      </Typography>
      <List>
        <ListItem>
          <ListItemIcon>
            <InfoIcon />
          </ListItemIcon>
          <ListItemText secondary="This object contains information on specific weaknesses, considered the cause of the vulnerability. Source identifies the organization that provided the weakness information and type identifies whether the organization is a primary or secondary source. Primary sources include the NVD and CNA who have reached the provider level in CVMAP. 10% of provider level submissions are audited by the NVD. If a submission has been audited the NVD will appear as the primary source and the provider level CNA will appear as the secondary source." />
        </ListItem>
      </List>
      {props.details ? (
        <>
          <TableContainer component={Paper} sx={tableContainerStyle}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={tableCellStyle}>
                    <Grid container direction={"row"}>
                      <NumbersIcon sx={{ mr: 1 }} />
                      <Typography variant="h7" gutterBottom component="div">
                        CWE-ID
                      </Typography>
                    </Grid>
                  </TableCell>
                  <TableCell sx={tableCellStyle}>
                    <Grid container direction={"row"}>
                      <CategoryIcon sx={{ mr: 1 }} />
                      <Typography variant="h7" gutterBottom component="div">
                        Type
                      </Typography>
                    </Grid>
                  </TableCell>
                  <TableCell sx={tableCellStyle}>
                    <Grid container direction={"row"}>
                      <SourceIcon sx={{ mr: 1 }} />
                      <Typography variant="h7" gutterBottom component="div">
                        Source
                      </Typography>
                    </Grid>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.weaknesses.map((weaknews, index) => (
                  <TableRow key={index}>
                    <TableCell> {weaknews.description[0].value} </TableCell>
                    <TableCell> {weaknews.type} </TableCell>
                    <TableCell> {weaknews.source} </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : null}
    </Card>
  );
}
