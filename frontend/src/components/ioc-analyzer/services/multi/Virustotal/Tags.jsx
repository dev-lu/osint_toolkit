import React from "react";

import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";

import TagIcon from "@mui/icons-material/Tag";

export default function Tags(props) {
  return (
    <Card
      variant="outlined"
      key="tags_card"
      sx={{ m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}
    >
      <Grid container alignItems="center">
        <Grid mr={1} item>
          <TagIcon />
        </Grid>
        <Grid item>
          <Typography variant="h5" component="h2" gutterBottom>
            Tags
          </Typography>
        </Grid>
      </Grid>
      {props.result["data"]["attributes"]["tags"].length > 0 ? (
        <>
          {props.result["data"]["attributes"]["tags"].map((tag, index) => (
            <React.Fragment key={index}>
              <Chip label={tag} sx={{ m: 0.5 }} />
              {index !== props.result["data"]["attributes"]["tags"].length - 1}
            </React.Fragment>
          ))}
        </>
      ) : (
        <p>None</p>
      )}
    </Card>
  );
}
