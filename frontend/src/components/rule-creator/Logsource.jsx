import React from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";

import {
  Autocomplete,
  Card,
  CardContent,
  Grid,
  Typography,
  Divider,
  Chip,
  TextField,
  useTheme,
} from "@mui/material";
import SourceIcon from "@mui/icons-material/Source";
import { LogsourceAtom } from "./SigmaAtom";
import LogsourceData from "./LogsourceData.json";

export default function Logsource() {
  const theme = useTheme();
  const products = Object.values(LogsourceData.product);
  const services = Object.values(LogsourceData.service);
  const categories = Object.values(LogsourceData.category);

  const setLogsrc = useSetRecoilState(LogsourceAtom);
  const logsrc = useRecoilValue(LogsourceAtom);

  const updateField = (field, newValue) => {
    setLogsrc((prevLogsource) => ({
      ...prevLogsource,
      [field]: newValue,
    }));
  };

  return (
    <>
      <Divider>
        <Chip
          icon={<SourceIcon />}
          label="Logsource"
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
          backgroundColor: theme.palette.background.cvssCard,
        }}
      >
        <CardContent sx={{ "& > *": { my: 2 } }}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Typography>
                Application and the type that is required in the detection. It
                consists of three attributes that are evaluated automatically by
                the converters and an arbitrary number of optional elements. We
                recommend using a "definition" value in cases in which further
                explanation is necessary.
              </Typography>
              <ul style={{ marginLeft: "20px" }}>
                <li>product (e.g. linux, windows, cisco)</li>
                <li>service (e.g. sysmon, ldapd, dhcp)</li>
                <li>category (e.g. process_creation)</li>
              </ul>
            </Grid>

            <Grid item xs={6}>
              <Typography>
                The "category" value is used to select all log files written by
                a certain group of products, like firewalls or web server logs.
                The automatic converter will use the keyword as a selector for
                multiple indices. The "product" value is used to select all log
                outputs of a certain product, e.g. all Windows Eventlog types
                including "Security", "System", "Application" and the new log
                types like "AppLocker" and "Windows Defender". Use the "service"
                value to select only a subset of a product's logs, like the
                "sshd" on Linux or the "Security" Eventlog on Windows systems.
                The "definition" can be used to describe the log source,
                including some information on the log verbosity level or
                configurations that have to be applied. It is not automatically
                evaluated by the converters but gives useful information to
                readers on how to configure the source to provide the necessary
                events used in the detection.
              </Typography>
            </Grid>
          </Grid>

          <Autocomplete
            options={products}
            value={logsrc.product}
            onChange={(_, newValue) => updateField("product", newValue)}
            freeSolo
            renderInput={(params) => (
              <TextField
                margin="normal"
                {...params}
                label="Product"
                sx={{ backgroundColor: theme.palette.background.tablecell }}
              />
            )}
          />
          <Autocomplete
            options={services}
            value={logsrc.service}
            onChange={(_, newValue) => updateField("service", newValue)}
            freeSolo
            renderInput={(params) => (
              <TextField
                margin="normal"
                {...params}
                label="Service"
                sx={{ backgroundColor: theme.palette.background.tablecell }}
              />
            )}
          />
          <Autocomplete
            options={categories}
            value={logsrc.category}
            onChange={(_, newValue) => updateField("category", newValue)}
            freeSolo
            renderInput={(params) => (
              <TextField
                margin="normal"
                {...params}
                label="Category"
                sx={{ backgroundColor: theme.palette.background.tablecell }}
              />
            )}
          />
          <TextField
            label="Definition (optional)"
            variant="outlined"
            margin="normal"
            value={logsrc.definition}
            onChange={(event) => updateField("definition", event.target.value)}
            fullWidth
            sx={{ backgroundColor: theme.palette.background.tablecell }}
          />
        </CardContent>
      </Card>
    </>
  );
}
