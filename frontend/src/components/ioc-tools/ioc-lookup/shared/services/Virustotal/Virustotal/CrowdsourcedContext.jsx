import React from "react";

import Card from "@mui/material/Card";
import { Typography } from "@mui/material";

export default function CrowdsourcedContext(props) {
  return (
    <Card
      key="crowdsourced_context_card"
      sx={{ m: 1, p: 2, borderRadius: 1, boxShadow: 0 }}
    >
      <Typography variant="h5" component="h2" gutterBottom>
        Crowdsourced context
      </Typography>
      {props.result["data"]["attributes"]["crowdsourced_context"].length > 0 ? (
        props.result["data"]["attributes"]["crowdsourced_context"].map(
          (cc, index) => {
            return (
              <div key={index + "_div"}>
                <b>Title: </b>
                {cc.title}
                <br />
                <b>Source: </b>
                {cc.source}
                <br />
                <b>Timestamp: </b>
                {cc.timestamp}
                <br />
                <b>Detail: </b>
                {cc.detail}
                <br />
                <b>Severity: </b>
                {cc.severity}
                <br />
              </div>
            );
          }
        )
      ) : (
        <p>None</p>
      )}
    </Card>
  );
}
