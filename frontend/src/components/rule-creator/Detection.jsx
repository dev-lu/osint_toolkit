import React from "react";
import { Card, CardContent, Grid, Divider, Chip } from "@mui/material";
import RadarIcon from "@mui/icons-material/Radar";
import Selection from "./detection/Selection";
import Filter from "./detection/Filter";
import Timeframe from "./detection/Timeframe";
import Condition from "./detection/Condition";

export default function Detection() {
  const listStyle = {
    marginLeft: "20px",
  };

  return (
    <>
      <Divider>
        <Chip
          icon={<RadarIcon />}
          label="Detection"
          style={{ fontSize: "20px", padding: "10px", height: "40px" }}
        />
      </Divider>

      <Card
        variant="outlined"
        key={"sigma_rule_card"}
        sx={{
          m: 1,
          mb: 3,
          p: 2,
          borderRadius: 5,
          boxShadow: 0,
          height: "100%",
        }}
      >
        <CardContent sx={{ "& > *": { my: 2 } }}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <ul style={listStyle}>
                <li>
                  If your list consists of a single element, don't use a list
                </li>
                <li>Use only lowercase identifiers</li>
                <li>
                  Put comments on lines if you like to (use 2 spaces to separate
                  the expression from your comment, e.g. - 'cmd.exe' # command
                  line)
                </li>
              </ul>
            </Grid>

            <Grid item xs={6}>
              <ul style={listStyle}>
                <li>
                  Don't use regular expressions unless you really have to (e.g.
                  instead of CommandLine|re: '\\payload.*\skeyset' use
                  CommandLine|contains|all with the values \payload and keyset).
                </li>
                <li>
                  In new sources use the field names as they appear in the log
                  source, remove spaces and keep hyphens (e.g. SAM User Account
                  becomes SAMUserAccount)
                </li>
                <li>Don't use SIEM specific logic in your condition</li>
              </ul>
            </Grid>
          </Grid>

          <Selection />
          <br />
          <Filter />

          <Timeframe />

          <Condition />
        </CardContent>
      </Card>
    </>
  );
}
