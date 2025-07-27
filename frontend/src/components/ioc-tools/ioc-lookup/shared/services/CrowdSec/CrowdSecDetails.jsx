import React, { useState } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveChoropleth } from "@nivo/geo";
import worldCountries from "../../data/world_countries.json";

import BusinessIcon from "@mui/icons-material/Business";
import DnsIcon from "@mui/icons-material/Dns";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import LanIcon from "@mui/icons-material/Lan";
import LanguageIcon from "@mui/icons-material/Language";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Box, Typography, IconButton } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import InfoModal from "../../../../../infoModal";
import NoDetails from "../NoDetails";

const countryCodeMapping = {
  AF: "AFG", AL: "ALB", DZ: "DZA", AS: "ASM", AD: "AND", AO: "AGO", AI: "AIA", AQ: "ATA", AG: "ATG", AR: "ARG", AM: "ARM", AW: "ABW", AU: "AUS", AT: "AUT", AZ: "AZE",
  BS: "BHS", BH: "BHR", BD: "BGD", BB: "BRB", BY: "BLR", BE: "BEL", BZ: "BLZ", BJ: "BEN", BM: "BMU", BT: "BTN", BO: "BOL", BQ: "BES", BA: "BIH", BW: "BWA", BR: "BRA", IO: "IOT", BN: "BRN", BG: "BGR", BF: "BFA", BI: "BDI",
  CV: "CPV", KH: "KHM", CM: "CMR", CA: "CAN", KY: "CYM", CF: "CAF", TD: "TCD", CL: "CHL", CN: "CHN", CX: "CXR", CC: "CCK", CO: "COL", KM: "COM", CG: "COG", CD: "COD", CK: "COK", CR: "CRI", CI: "CIV", HR: "HRV", CU: "CUB", CW: "CUW", CY: "CYP", CZ: "CZE",
  DK: "DNK", DJ: "DJI", DM: "DMA", DO: "DOM",
  EC: "ECU", EG: "EGY", SV: "SLV", GQ: "GNQ", ER: "ERI", EE: "EST", SZ: "SWZ", ET: "ETH",
  FK: "FLK", FO: "FRO", FJ: "FJI", FI: "FIN", FR: "FRA", GF: "GUF", PF: "PYF",
  GA: "GAB", GM: "GMB", GE: "GEO", DE: "DEU", GH: "GHA", GI: "GIB", GR: "GRC", GL: "GRL", GD: "GRD", GP: "GLP", GU: "GUM", GT: "GTM", GG: "GGY", GN: "GIN", GW: "GNB", GY: "GUY",
  HT: "HTI", HN: "HND", HK: "HKG", HU: "HUN",
  IS: "ISL", IN: "IND", ID: "IDN", IR: "IRN", IQ: "IRQ", IE: "IRL", IM: "IMN", IL: "ISR", IT: "ITA",
  JM: "JAM", JP: "JPN", JE: "JEY", JO: "JOR",
  KZ: "KAZ", KE: "KEN", KI: "KIR", KP: "PRK", KR: "KOR", KW: "KWT", KG: "KGZ",
  LA: "LAO", LV: "LVA", LB: "LBN", LS: "LSO", LR: "LBR", LY: "LBY",
  LI: "LIE", LT: "LTU", LU: "LUX",
  MO: "MAC", MG: "MDG", MW: "MWI", MY: "MYS", MV: "MDV", ML: "MLI", MT: "MLT", MH: "MHL", MQ: "MTQ", MR: "MRT", MU: "MUS", YT: "MYT", MX: "MEX", FM: "FSM", MD: "MDA", MC: "MCO", MN: "MNG", ME: "MNE", MS: "MSR", MA: "MAR", MZ: "MOZ", MM: "MMR",
  NA: "NAM", NR: "NRU", NP: "NPL", NL: "NLD", NC: "NCL", NZ: "NZL", NI: "NIC", NE: "NER", NG: "NGA", NU: "NIU", NF: "NFK", MK: "MKD", MP: "MNP", NO: "NOR",
  OM: "OMN",
  PK: "PAK", PW: "PLW", PS: "PSE", PA: "PAN", PG: "PNG", PY: "PRY", PE: "PER", PH: "PHL", PN: "PCN", PL: "POL", PT: "PRT", PR: "PRI",
  QA: "QAT",
  RE: "REU", RO: "ROU", RU: "RUS", RW: "RWA",
  BL: "BLM", SH: "SHN", KN: "KNA", LC: "LCA", MF: "MAF", PM: "SPM", VC: "VCT", WS: "WSM", SM: "SMR", ST: "STP", SA: "SAU", SN: "SEN", RS: "SRB", SC: "SYC", SL: "SLE", SG: "SGP", SX: "SXM", SK: "SVK", SI: "SVN", SB: "SLB", SO: "SOM", ZA: "ZAF", SS: "SSD", ES: "ESP", LK: "LKA", SD: "SDN", SR: "SUR", SE: "SWE", CH: "CHE", SY: "SYR",
  TW: "TWN", TJ: "TJK", TZ: "TZA", TH: "THA", TL: "TLS", TG: "TGO", TK: "TKL", TO: "TON", TT: "TTO", TN: "TUN", TR: "TUR", TM: "TKM", TC: "TCA", TV: "TUV",
  UG: "UGA", UA: "UKR", AE: "ARE", GB: "GBR", US: "USA", UY: "URY", UZ: "UZB",
  VU: "VUT", VE: "VEN", VN: "VNM", VG: "VGB", VI: "VIR",
  WF: "WLF", EH: "ESH",
  YE: "YEM",
  ZM: "ZMB", ZW: "ZWE",
};

export default function CrowdSecDetails({ result, ioc }) { 
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", text: "" });

  const handleOpenModal = (title, text) => {
    setModalContent({ title, text });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  if (!result || result.error) {
    const message = result && result.error 
        ? `Error fetching CrowdSec details: ${result.message || result.error}` 
        : (result && result.message && result.message.includes("not found")) 
            ? "IP not found in CrowdSec CTI."
            : "CrowdSec details are unavailable.";
    return <NoDetails message={message} />;
  }
  if (Object.keys(result).length === 0 || typeof result.ip_range_score === 'undefined') {
    return <NoDetails message="Insufficient data received from CrowdSec CTI."/>;
  }


  const transformDataForPie = (data) => {
    if (!data) return [];
    return Object.keys(data).map((key) => ({
      id: key,
      label: key,
      value: data[key],
    }));
  };

  const transformDataForMap = (data) => {
    if (!data) return [];
    return Object.keys(data).map((key) => ({
      id: countryCodeMapping[key.toUpperCase()] || key, 
      value: data[key],
    }));
  };

  const scoreData = [
    { name: "Overall", aggressiveness: result.scores?.overall?.aggressiveness || 0, threat: result.scores?.overall?.threat || 0, trust: result.scores?.overall?.trust || 0, anomaly: result.scores?.overall?.anomaly || 0, total: result.scores?.overall?.total || 0 },
    { name: "Last Day", aggressiveness: result.scores?.last_day?.aggressiveness || 0, threat: result.scores?.last_day?.threat || 0, trust: result.scores?.last_day?.trust || 0, anomaly: result.scores?.last_day?.anomaly || 0, total: result.scores?.last_day?.total || 0 },
    { name: "Last Week", aggressiveness: result.scores?.last_week?.aggressiveness || 0, threat: result.scores?.last_week?.threat || 0, trust: result.scores?.last_week?.trust || 0, anomaly: result.scores?.last_week?.anomaly || 0, total: result.scores?.last_week?.total || 0 },
    { name: "Last Month", aggressiveness: result.scores?.last_month?.aggressiveness || 0, threat: result.scores?.last_month?.threat || 0, trust: result.scores?.last_month?.trust || 0, anomaly: result.scores?.last_month?.anomaly || 0, total: result.scores?.last_month?.total || 0 },
  ];

  const ipRangeScore = result.ip_range_score ?? 'N/A';

  return (
    <Box sx={{p:1}}>
      <InfoModal
        open={openModal}
        onClose={handleCloseModal}
        title={modalContent.title}
        text={modalContent.text}
      />
      <Grid container spacing={2}>
        {/* Details Card */}
        <Grid item xs={12} md={6} lg={5}> 
            <Card sx={{ p: 2, borderRadius: 2, height: '100%', border: '1px solid', borderColor: 'divider'  }}>
                <Typography variant="h6" component="h3" gutterBottom>
                    IP Reputation Details ({result.ip || ioc})
                </Typography>
                <List dense>
                    <ListItem>
                        <ListItemIcon sx={{minWidth: 36}}><LanIcon /></ListItemIcon>
                        <ListItemText primary="IP Range Score" secondary={`${ipRangeScore}/5`} />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon sx={{minWidth: 36}}><BusinessIcon /></ListItemIcon>
                        <ListItemText primary="AS Name" secondary={result.as_name || "N/A"} />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon sx={{minWidth: 36}}><LanguageIcon /></ListItemIcon>
                        <ListItemText primary="Country" secondary={result.location?.country || "N/A"} />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon sx={{minWidth: 36}}><LocationCityIcon /></ListItemIcon>
                        <ListItemText primary="City" secondary={result.location?.city || "N/A"} />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon sx={{minWidth: 36}}><DnsIcon /></ListItemIcon>
                        <ListItemText primary="Reverse DNS" secondary={result.location?.reverse_dns || "N/A"} sx={{wordBreak: 'break-all'}}/>
                    </ListItem>
                     <ListItem>
                        <ListItemIcon sx={{minWidth: 36}}><InfoIcon /></ListItemIcon>
                        <ListItemText primary="Remediation" secondary={result.remediation || "N/A"} />
                    </ListItem>
                </List>
            </Card>
        </Grid>

        {/* CTI Scores Bar Chart Card */}
        <Grid item xs={12} md={6} lg={7}>
            <Card sx={{ p: 2, borderRadius: 2, height: '100%', border: '1px solid', borderColor: 'divider'  }}>
                <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="h6" component="h3" gutterBottom sx={{flexGrow: 1, mb:0}}>
                        CTI Scores Breakdown
                    </Typography>
                    <IconButton onClick={() => handleOpenModal("CTI Score Information", "The scores indicate malevolence for an IP over time (Overall, Last Day, Week, Month).\n\n- Aggressiveness: Intensity of attacks (number reported).\n- Threat Level: Seriousness of reported attack types (e.g., crawl vs. exploit).\n- Trust: Confidence in reporting actors (reputation, diversity).\n- Anomaly: Red flags from IP's static description.\n- Total: Aggregation of these components (0=low to 5=high malevolence).")} size="small">
                        <InfoIcon fontSize="small" />
                    </IconButton>
                </Box>
                 <Box sx={{ height: "380px" }}> 
                    <ResponsiveBar
                        data={scoreData}
                        keys={["aggressiveness", "threat", "trust", "anomaly", "total"]}
                        indexBy="name"
                        margin={{ top: 20, right: 20, bottom: 60, left: 40 }}
                        padding={0.2}
                        innerPadding={2}
                        groupMode="stacked"
                        valueScale={{ type: 'linear', min: 0, max: 'auto' }}
                        colors={{ scheme: "spectral" }}
                        borderColor={{ from: "color", modifiers: [["darker", 0.6]] }}
                        borderWidth={1}
                        borderRadius={2}
                        axisTop={null}
                        axisRight={null}
                        axisBottom={{ tickSize: 5, tickPadding: 5, tickRotation: 0, legend: "Period", legendPosition: "middle", legendOffset: 40 }}
                        axisLeft={{ tickSize: 5, tickPadding: 5, tickRotation: 0, legend: "Score", legendPosition: "middle", legendOffset: -30 }}
                        enableLabel={false} 
                        legends={[]} 
                        animate={true}
                        motionStiffness={90}
                        motionDamping={15}
                        theme={{
                            axis: { ticks: { text: { fontSize: 10 } }, legend: { text: { fontSize: 12 } } },
                            tooltip: { container: { background: "#333", color: "#fff", fontSize: "12px" } },
                        }}
                    />
                </Box>
            </Card>
        </Grid>

        {/* Target Countries Pie Chart and Map */}
        {result.target_countries && Object.keys(result.target_countries).length > 0 && (
            <Grid item xs={12}> 
                <Card sx={{ mt: 2, p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="h6" component="h3" gutterBottom>
                        Target Countries by Report Count
                    </Typography>
                    <Grid container spacing={2} alignItems="stretch"> 
                        <Grid item xs={12} md={5} sx={{ height: "400px" }}>
                            <ResponsivePie
                                data={transformDataForPie(result.target_countries)}
                                sortByValue={true}
                                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                                innerRadius={0.5}
                                padAngle={1}
                                cornerRadius={3}
                                activeOuterRadiusOffset={8}
                                colors={{ scheme: "blues" }}
                                borderWidth={1}
                                borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
                                arcLinkLabelsSkipAngle={10}
                                arcLinkLabelsTextColor="#333333"
                                arcLinkLabelsThickness={2}
                                arcLinkLabelsColor={{ from: "color" }}
                                arcLabelsSkipAngle={10}
                                arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
                                theme={{ tooltip: { container: { background: "#333", color: "#fff", fontSize: "12px" } } }}
                            />
                        </Grid>
                        <Grid item xs={12} md={7} sx={{ height: "400px" }}>
                             <ResponsiveChoropleth
                                data={transformDataForMap(result.target_countries)}
                                features={worldCountries.features}
                                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                                colors="YlGnBu"
                                domain={[0, Math.max(1, ...Object.values(result.target_countries))]} 
                                unknownColor="#E0E0E0"
                                label="properties.name"
                                valueFormat=".2s"
                                projectionScale={Math.min(150, 150 * (400/600) )}
                                projectionTranslation={[0.5, 0.5]}
                                borderWidth={0.5}
                                borderColor="#333333"
                                theme={{ tooltip: { container: { background: "#333", color: "#fff", fontSize: "12px" } } }}
                                legends={[]}
                            />
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
        )}

        {/* Behaviors Card */}
        {result.behaviors && result.behaviors.length > 0 && (
            <Grid item xs={12} md={6}>
                <Card sx={{ mt: 2, p: 2, borderRadius: 2, height: '100%', border: '1px solid', borderColor: 'divider'  }}>
                    <Typography variant="h6" component="h3" gutterBottom>Behaviours</Typography>
                    <List dense>
                        {result.behaviors.map((behaviour, index) => (
                            <ListItem key={index} disablePadding>
                                <ListItemText primary={behaviour.name || behaviour.label} secondary={behaviour.description} />
                            </ListItem>
                        ))}
                    </List>
                </Card>
            </Grid>
        )}

        {/* Attack Details Card */}
        {result.attack_details && result.attack_details.length > 0 && (
            <Grid item xs={12} md={6}>
                <Card sx={{ mt: 2, p: 2, borderRadius: 2, height: '100%', border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="h6" component="h3" gutterBottom>Attack Details</Typography>
                    <List dense>
                        {result.attack_details.map((attack, index) => (
                            <ListItem key={index} disablePadding>
                                <ListItemText primary={attack.name || attack.label} secondary={attack.description} />
                            </ListItem>
                        ))}
                    </List>
                </Card>
            </Grid>
        )}
        
        {/* References Card - Assuming 'references' structure is similar to 'behaviors' or 'attack_details' */}
        {result.references && result.references.length > 0 && (
            <Grid item xs={12}>
                <Card sx={{ mt: 2, p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="h6" component="h3" gutterBottom>References</Typography>
                    <List dense>
                        {result.references.map((ref, index) => (
                             <ListItem key={index} disablePadding>
                                <ListItemText primary={ref.name || ref.label || `Reference ${index + 1}`} secondary={ref.description || ref.url || "No description"} />
                            </ListItem>
                        ))}
                    </List>
                </Card>
            </Grid>
        )}
      </Grid>
    </Box>
  );
}
