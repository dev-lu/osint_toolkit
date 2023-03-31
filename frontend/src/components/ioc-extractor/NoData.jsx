import React from "react";

import { Card } from "@mui/material";
import Divider from "@mui/material/Divider";
import MuiGrid from "@mui/material/Grid";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import { styled } from "@mui/material/styles";
import useTheme from "@mui/material/styles/useTheme";


export default function NoData() {
  const theme = useTheme();
  const Grid = styled(MuiGrid)(({ theme }) => ({
    width: "100%",
    ...theme.typography.body2,
    '& [role="separator"]': {
      margin: theme.spacing(0, 2),
    },
  }));
  return (
    <>
      <Card
        elevation={0}
        sx={{
          maxWidth: 800,
          m: 2,
          p: 2,
          borderRadius: 5,
          backgroundColor: theme.palette.background.card,
        }}
      >
        <Grid container>
          <Grid xs item={true} display="flex" justifyContent="center" alignItems="center">
            <NotInterestedIcon sx={{ fontSize: 80, color: "lightgrey" }} />
          </Grid>
          <Divider orientation="vertical" flexItem></Divider>
          <Grid xs item={true} sx={{ p: 2 }}>
            <h2>No IOCs found</h2>
            <p>There are no items for this IOC type.</p>
          </Grid>
        </Grid>
      </Card>
    </>
  );
}
