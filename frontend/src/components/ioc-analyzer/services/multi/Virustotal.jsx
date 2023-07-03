import React from "react";
import api from "../../../../api";
import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import NoDetails from "../NoDetails";
import ResultRow from "../../ResultRow";
import Details from "./Virustotal/Details";
import AnalysisStatistics from "./Virustotal/AnalysisStatistics";
import CrowdsourcedContext from "./Virustotal/CrowdsourcedContext";
import Tags from "./Virustotal/Tags";
import TypeTags from "./Virustotal/TypeTags";
import PopularityRanks from "./Virustotal/PopularityRanks";
import Filenames from "./Virustotal/Filenames";
import ELFInformation from "./Virustotal/ELFInformation";
import CrowdsourcedIDSRules from "./Virustotal/CrowdsourcedIDSRules";
import LastAnalysisResults from "./Virustotal/LastAnalysisResults";
import Whois from "./Virustotal/Whois";
import ThreatClassification from "./Virustotal/ThreatClassification";

export default function Virustotal(props) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [malCount, setMalCount] = useState(null);
  const [totalEngines, setTotalEngines] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url =
          "/api/" +
          props.type +
          "/virustotal?ioc=" +
          encodeURIComponent(props.ioc);
        const response = await api.get(url);
        setResult(response.data);
        setMalCount(
          response.data.data.attributes.last_analysis_stats.malicious
        );
        setTotalEngines(
          response.data.data.attributes.last_analysis_stats.harmless +
            response.data.data.attributes.last_analysis_stats.malicious +
            response.data.data.attributes.last_analysis_stats.suspicious +
            response.data.data.attributes.last_analysis_stats.timeout +
            response.data.data.attributes.last_analysis_stats.undetected
        );
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
        result.data ? (
          <Box sx={{ margin: 1 }}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "stretch",
                height: "100%",
              }}
            >
              <Details malCount={malCount} result={result} />
              <AnalysisStatistics
                malCount={malCount}
                totalEngines={totalEngines}
                result={result}
              />
            </div>

            {result["data"]["attributes"]["tags"] &&
            result["data"]["attributes"]["tags"].length > 0 ? (
              <Tags result={result} />
            ) : null}

            {result["data"]["attributes"]["type_tags"] &&
            result["data"]["attributes"]["type_tags"].length > 0 ? (
              <TypeTags result={result} />
            ) : null}

            {result["data"]["attributes"]["popular_threat_classification"] && (
              <ThreatClassification result={result} />
            )}

            {result["data"]["attributes"]["crowdsourced_context"] &&
            result["data"]["attributes"]["crowdsourced_context"].length > 0 ? (
              <CrowdsourcedContext result={result} />
            ) : null}

            {result["data"]["attributes"]["popularity_ranks"] &&
            Object.keys(result["data"]["attributes"]["popularity_ranks"])
              .length > 0 ? (
              <PopularityRanks result={result} />
            ) : null}

            {result["data"]["attributes"]["names"] &&
              result["data"]["attributes"]["names"].length > 0 && (
                <Filenames result={result} />
              )}

            {result["data"]["attributes"]["elf_info"] &&
            result["data"]["attributes"]["elf_info"]["section_list"].length >
              0 ? (
              <ELFInformation result={result} />
            ) : null}

            {result["data"]["attributes"]["crowdsourced_ids_results"] &&
            result["data"]["attributes"]["crowdsourced_ids_results"].length >
              0 ? (
              <CrowdsourcedIDSRules result={result} />
            ) : null}

            {result["data"]["attributes"]["last_analysis_results"] &&
            Object.keys(result["data"]["attributes"]["last_analysis_results"])
              .length > 0 ? (
              <LastAnalysisResults result={result} />
            ) : null}

            {result["data"]["attributes"]["whois"] && <Whois result={result} />}
          </Box>
        ) : (
          <Box sx={{ margin: 1 }}>
            <Grid
              xs
              item={true}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <NoDetails />
            </Grid>
          </Box>
        )
      ) : null}
    </>
  );

  return (
    <>
      <ResultRow
        name="Virustotal"
        id="virustotal"
        icon="vt_logo_small"
        loading={loading}
        result={result}
        summary={
          malCount === null
            ? "No matches found"
            : "Detected as malicious by " + malCount + " engine(s)"
        }
        summary_color={{ color: null }}
        color={malCount > 0 ? "red" : "green"}
        error={error}
        details={details}
      />
    </>
  );
}
