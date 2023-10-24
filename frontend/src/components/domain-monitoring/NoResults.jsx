import React from "react";

import { Card } from "@mui/material";
import Divider from "@mui/material/Divider";
import Grow from "@mui/material/Grow";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import MuiGrid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

export default function NoApikeys(props) {
  const Grid = styled(MuiGrid)(({ theme }) => ({
    width: "100%",
    ...theme.typography.body2,
    '& [role="separator"]': {
      margin: theme.spacing(0, 2),
    },
  }));

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Grow in={true}>
        <Card
          variant="outlined"
          elevation={0}
          sx={{ maxWidth: "80%", m: 2, p: 2, borderRadius: 5 }}
        >
          <Grid container>
            <Grid
              xs
              item={true}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <SearchOffIcon sx={{ fontSize: 100, color: "lightgrey" }} />
            </Grid>
            <Divider orientation="vertical" flexItem></Divider>
            <Grid xs item={true} sx={{ p: 2 }}>
              <Typography variant="h5">No results</Typography>
              <Typography variant="body1">
                There are no results for your search: "{props.searchterm}"
              </Typography>
            </Grid>
          </Grid>
        </Card>
      </Grow>
    </div>
  );
}
