import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import ResultRow from "../../ResultRow";

export default function Alienvault(props) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pulses, setPulses] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const url =
          "http://localhost:8000/api/" +
          props.type +
          "/alienvault?ioc=" +
          props.ioc;
        const response = await axios.get(url);
        setResult(response.data);
        setPulses(response.data.pulse_info.count);
      } catch (e) {
        setError(e);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const details = (
    <>
      {result ? (
        <Box sx={{ margin: 1 }}>
          <Card
            variant="outlined"
            sx={{ m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}
            key={"pulse_info"}
          >
            <h3>Pulse information</h3>
            <p>Pulse count: {pulses} </p>
            <p>
              {pulses > 0 ? (
                <>
                  <br />
                  <b>Pulses</b>
                  <br />
                </>
              ) : null}
              {result["pulse_info"]["pulses"]
                ? result["pulse_info"]["pulses"].map((pulse) => {
                    return (
                      <>
                        <Chip key={pulse.name} label={pulse.name} sx={{ m: 0.5 }} />
                        <br />
                      </>
                    );
                  })
                : "None"}
            </p>
          </Card>
          <Card
            variant="outlined"
            sx={{ m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}
          >
            <h4>General information</h4>
            <p>Indicator: {result["indicator"]} </p>
            <p>Reputation: {result["reputation"]} </p>
            <p>Country: {result["country_name"]} </p>
            <p>Type: {result["type"]} </p>
            <p>ASN: {result["asn"]} </p>
            <br />
          </Card>
          <Card
            variant="outlined"
            sx={{ m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}
          >
              <b>Sections:</b>
              <br />{" "}
              {result["sections"]
                ? result["sections"].map((section) => {
                    return <Chip key={section} label={section} sx={{ m: 0.5 }} />;
                  })
                : "None"}
          </Card>
        </Box>
      ) : null}
    </>
  );

  return (
    <>
      <ResultRow
        name="Alienvault OTX"
        id="alienvault"
        icon="avotx_logo_small"
        loading={loading}
        result={result}
        summary={pulses + " pulse(s) "}
        summary_color={{ color: null }}
        color={pulses > 0 ? "red" : "green"}
        error={error}
        details={details}
      />
    </>
  );
}
