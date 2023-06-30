import React from "react";

import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import { Typography } from "@mui/material";

export default function TypeTags(props) {
  return (
    <Card
      variant="outlined"
      key="tags_card"
      sx={{ m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}
    >
      <Typography variant="h5" component="h2" gutterBottom>
        Type tags
      </Typography>
      {props.result["data"]["attributes"]["type_tags"].length > 0 ? (
        <>
          {props.result["data"]["attributes"]["type_tags"].map((tag, index) => (
            <React.Fragment key={index}>
              <Chip label={tag} sx={{ m: 0.5 }} />
              {index !==
                props.result["data"]["attributes"]["type_tags"].length - 1}
            </React.Fragment>
          ))}
        </>
      ) : (
        <p>None</p>
      )}
    </Card>
  );
}
