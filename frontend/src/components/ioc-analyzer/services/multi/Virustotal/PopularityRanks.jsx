import React from "react";

import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import StarIcon from "@mui/icons-material/Star";
import { Typography } from "@mui/material";

export default function PopularityRanks(props) {
  return (
    <Card
      key="popularity_card"
      variant="outlined"
      sx={{ m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}
    >
      <Typography variant="h5" component="h2" gutterBottom>
        Popularity ranks
      </Typography>
      <Typography variant="subtitle1" color="textSecondary">
        Domain's position in popularity ranks such as Alexa, Quantcast, Statvoo,
        etc.
      </Typography>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
        {Object.entries(
          props.result["data"]["attributes"]["popularity_ranks"]
        ).map(([name, data]) => (
          <div
            key={name + "_div"}
            style={{ flexBasis: "15%", marginBottom: "5px" }}
          >
            <Card
              variant="outlined"
              key={name + "_popularity_card"}
              sx={{ m: 1, p: 1.5, borderRadius: 5, boxShadow: 0 }}
            >
              <Typography variant="h6" component="h2" gutterBottom>
                {name}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Grid container spacing={1} alignItems="center">
                <Grid item>
                  <StarIcon color="primary" />
                </Grid>
                <Grid item>
                  <Typography variant="subtitle1" component="span">
                    {data.rank}
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          </div>
        ))}
      </div>
    </Card>
  );
}
