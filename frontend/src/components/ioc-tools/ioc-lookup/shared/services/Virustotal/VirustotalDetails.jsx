import React from "react";

import Box from "@mui/material/Box";

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

import NoDetails from "../NoDetails"; 

export default function VirustotalDetailsComponent({ result, ioc }) {

  if (!result) { 
     return (
      <Box sx={{ margin: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 100 }}>
        <NoDetails message="Loading VirusTotal details..." />
      </Box>
    );
  }
  
  if (result.error || result.data?.error) {
    const errorMessage = result.error?.message || result.data?.error?.message || result.error || "Unknown error";
     return (
      <Box sx={{ margin: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 100 }}>
        <NoDetails message={`Error fetching VirusTotal details: ${errorMessage}`} />
      </Box>
    );
  }

  if (!result.data || !result.data.attributes) {
    return (
      <Box sx={{ margin: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 100 }}>
        <NoDetails message={`No detailed VirusTotal attributes found for "${ioc}". The API response might be incomplete or the IOC was not found.`} />
      </Box>
    );
  }

  const attributes = result.data.attributes;
  const analysisStats = attributes.last_analysis_stats || {};

  const malCount = analysisStats.malicious || 0;
  const totalEngines = (analysisStats.harmless || 0) +
                       (analysisStats.malicious || 0) +
                       (analysisStats.suspicious || 0) +
                       (analysisStats.timeout || 0) +
                       (analysisStats.undetected || 0);

  return (
    <Box sx={{ margin: 1, mt:0 }}> 
      <Box 
        sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: 2, 
            mb: 2, 
            alignItems: 'stretch',
        }}
      >
        <Details malCount={malCount} result={result} ioc={ioc} /> 
        <AnalysisStatistics
            malCount={malCount}
            totalEngines={totalEngines}
            result={result}
        />
      </Box>

      {attributes.tags && attributes.tags.length > 0 && (
        <Tags result={result} />
      )}

      {attributes.type_tags && attributes.type_tags.length > 0 && (
        <TypeTags result={result} />
      )}

      {attributes.popular_threat_classification && (
        <ThreatClassification result={result} />
      )}

      {attributes.crowdsourced_context && attributes.crowdsourced_context.length > 0 && (
        <CrowdsourcedContext result={result} />
      )}

      {attributes.popularity_ranks && Object.keys(attributes.popularity_ranks).length > 0 && (
        <PopularityRanks result={result} />
      )}

      {attributes.names && attributes.names.length > 0 && (
        <Filenames result={result} />
      )}

      {attributes.elf_info && attributes.elf_info.section_list?.length > 0 && ( 
        <ELFInformation result={result} />
      )}

      {attributes.crowdsourced_ids_results && attributes.crowdsourced_ids_results.length > 0 && (
        <CrowdsourcedIDSRules result={result} />
      )}

      {attributes.last_analysis_results && Object.keys(attributes.last_analysis_results).length > 0 && (
        <LastAnalysisResults result={result} />
      )}

      {attributes.whois && ( 
        <Whois result={result} />
      )}
    </Box>
  );
}