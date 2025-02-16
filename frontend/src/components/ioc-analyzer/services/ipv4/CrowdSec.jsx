import React from "react";
import api from "../../../../api";
import { useEffect, useState, useRef } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveChoropleth } from "@nivo/geo";
import worldCountries from "./world_countries.json";

import BusinessIcon from "@mui/icons-material/Business";
import DnsIcon from "@mui/icons-material/Dns";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import LanIcon from "@mui/icons-material/Lan";
import LanguageIcon from "@mui/icons-material/Language";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Box, Typography } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

import ResultRow from "../../ResultRow";
import InfoModal from "../../../infoModal";

export default function CrowdSec(props) {
  const propsRef = useRef(props);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", text: "" });

  const handleOpenModal = (title, text) => {
    setModalContent({ title, text });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const url = "/api/ip/crowdsec/" + propsRef.current.ioc;
        const response = await api.get(url);
        setResult(response.data);
        setScore(response.data["ip_range_score"]);
      } catch (e) {
        setError(e);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const countryCodeMapping = {
    AF: "AFG",
    AL: "ALB",
    DZ: "DZA",
    AS: "ASM",
    AD: "AND",
    AO: "AGO",
    AI: "AIA",
    AQ: "ATA",
    AG: "ATG",
    AR: "ARG",
    AM: "ARM",
    AW: "ABW",
    AU: "AUS",
    AT: "AUT",
    AZ: "AZE",
    BS: "BHS",
    BH: "BHR",
    BD: "BGD",
    BB: "BRB",
    BY: "BLR",
    BE: "BEL",
    BZ: "BLZ",
    BJ: "BEN",
    BM: "BMU",
    BT: "BTN",
    BO: "BOL",
    BQ: "BES",
    BA: "BIH",
    BW: "BWA",
    BR: "BRA",
    IO: "IOT",
    BN: "BRN",
    BG: "BGR",
    BF: "BFA",
    BI: "BDI",
    CV: "CPV",
    KH: "KHM",
    CM: "CMR",
    CA: "CAN",
    KY: "CYM",
    CF: "CAF",
    TD: "TCD",
    CL: "CHL",
    CN: "CHN",
    CX: "CXR",
    CC: "CCK",
    CO: "COL",
    KM: "COM",
    CG: "COG",
    CD: "COD",
    CK: "COK",
    CR: "CRI",
    CI: "CIV",
    HR: "HRV",
    CU: "CUB",
    CW: "CUW",
    CY: "CYP",
    CZ: "CZE",
    DK: "DNK",
    DJ: "DJI",
    DM: "DMA",
    DO: "DOM",
    EC: "ECU",
    EG: "EGY",
    SV: "SLV",
    GQ: "GNQ",
    ER: "ERI",
    EE: "EST",
    SZ: "SWZ",
    ET: "ETH",
    FK: "FLK",
    FO: "FRO",
    FJ: "FJI",
    FI: "FIN",
    FR: "FRA",
    GF: "GUF",
    PF: "PYF",
    GA: "GAB",
    GM: "GMB",
    GE: "GEO",
    DE: "DEU",
    GH: "GHA",
    GI: "GIB",
    GR: "GRC",
    GL: "GRL",
    GD: "GRD",
    GP: "GLP",
    GU: "GUM",
    GT: "GTM",
    GG: "GGY",
    GN: "GIN",
    GW: "GNB",
    GY: "GUY",
    HT: "HTI",
    HN: "HND",
    HK: "HKG",
    HU: "HUN",
    IS: "ISL",
    IN: "IND",
    ID: "IDN",
    IR: "IRN",
    IQ: "IRQ",
    IE: "IRL",
    IM: "IMN",
    IL: "ISR",
    IT: "ITA",
    JM: "JAM",
    JP: "JPN",
    JE: "JEY",
    JO: "JOR",
    KZ: "KAZ",
    KE: "KEN",
    KI: "KIR",
    KP: "PRK",
    KR: "KOR",
    KW: "KWT",
    KG: "KGZ",
    LA: "LAO",
    LV: "LVA",
    LB: "LBN",
    LS: "LSO",
    LR: "LBR",
    LY: "LBY",
    LI: "LIE",
    LT: "LTU",
    LU: "LUX",
    MO: "MAC",
    MG: "MDG",
    MW: "MWI",
    MY: "MYS",
    MV: "MDV",
    ML: "MLI",
    MT: "MLT",
    MH: "MHL",
    MQ: "MTQ",
    MR: "MRT",
    MU: "MUS",
    YT: "MYT",
    MX: "MEX",
    FM: "FSM",
    MD: "MDA",
    MC: "MCO",
    MN: "MNG",
    ME: "MNE",
    MS: "MSR",
    MA: "MAR",
    MZ: "MOZ",
    MM: "MMR",
    NA: "NAM",
    NR: "NRU",
    NP: "NPL",
    NL: "NLD",
    NC: "NCL",
    NZ: "NZL",
    NI: "NIC",
    NE: "NER",
    NG: "NGA",
    NU: "NIU",
    NF: "NFK",
    MK: "MKD",
    MP: "MNP",
    NO: "NOR",
    OM: "OMN",
    PK: "PAK",
    PW: "PLW",
    PS: "PSE",
    PA: "PAN",
    PG: "PNG",
    PY: "PRY",
    PE: "PER",
    PH: "PHL",
    PN: "PCN",
    PL: "POL",
    PT: "PRT",
    PR: "PRI",
    QA: "QAT",
    RE: "REU",
    RO: "ROU",
    RU: "RUS",
    RW: "RWA",
    BL: "BLM",
    SH: "SHN",
    KN: "KNA",
    LC: "LCA",
    MF: "MAF",
    PM: "SPM",
    VC: "VCT",
    WS: "WSM",
    SM: "SMR",
    ST: "STP",
    SA: "SAU",
    SN: "SEN",
    RS: "SRB",
    SC: "SYC",
    SL: "SLE",
    SG: "SGP",
    SX: "SXM",
    SK: "SVK",
    SI: "SVN",
    SB: "SLB",
    SO: "SOM",
    ZA: "ZAF",
    SS: "SSD",
    ES: "ESP",
    LK: "LKA",
    SD: "SDN",
    SR: "SUR",
    SE: "SWE",
    CH: "CHE",
    SY: "SYR",
    TW: "TWN",
    TJ: "TJK",
    TZ: "TZA",
    TH: "THA",
    TL: "TLS",
    TG: "TGO",
    TK: "TKL",
    TO: "TON",
    TT: "TTO",
    TN: "TUN",
    TR: "TUR",
    TM: "TKM",
    TC: "TCA",
    TV: "TUV",
    UG: "UGA",
    UA: "UKR",
    AE: "ARE",
    GB: "GBR",
    US: "USA",
    UY: "URY",
    UZ: "UZB",
    VU: "VUT",
    VE: "VEN",
    VN: "VNM",
    VG: "VGB",
    VI: "VIR",
    WF: "WLF",
    EH: "ESH",
    YE: "YEM",
    ZM: "ZMB",
    ZW: "ZWE",
  };

  const transformData = (data) => {
    return Object.keys(data).map((key) => ({
      id: key,
      label: key,
      value: data[key],
    }));
  };

  const transformMapData = (data) => {
    return Object.keys(data).map((key) => ({
      id: countryCodeMapping[key] || key,
      value: data[key],
    }));
  };

  const scoreData = [
    {
      name: "Overall",
      aggressiveness: result?.scores?.overall?.aggressiveness || 0,
      threat: result?.scores?.overall?.threat || 0,
      trust: result?.scores?.overall?.trust || 0,
      anomaly: result?.scores?.overall?.anomaly || 0,
      total: result?.scores?.overall?.total || 0,
    },
    {
      name: "Last Day",
      aggressiveness: result?.scores?.last_day?.aggressiveness || 0,
      threat: result?.scores?.last_day?.threat || 0,
      trust: result?.scores?.last_day?.trust || 0,
      anomaly: result?.scores?.last_day?.anomaly || 0,
      total: result?.scores?.last_day?.total || 0,
    },
    {
      name: "Last Week",
      aggressiveness: result?.scores?.last_week?.aggressiveness || 0,
      threat: result?.scores?.last_week?.threat || 0,
      trust: result?.scores?.last_week?.trust || 0,
      anomaly: result?.scores?.last_week?.anomaly || 0,
      total: result?.scores?.last_week?.total || 0,
    },
    {
      name: "Last Month",
      aggressiveness: result?.scores?.last_month?.aggressiveness || 0,
      threat: result?.scores?.last_month?.threat || 0,
      trust: result?.scores?.last_month?.trust || 0,
      anomaly: result?.scores?.last_month?.anomaly || 0,
      total: result?.scores?.last_month?.total || 0,
    },
  ];

  const details = (
    <>
      {result && (
        <>
          <Card sx={{ p: 2, borderRadius: 1, boxShadow: 0 }}>
            <Typography variant="h5" component="h3" gutterBottom>
              Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <List dense sx={{ mt: 1 }}>
                  <ListItem>
                    <ListItemIcon>
                      <LanIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="IP range"
                      secondary={`${
                        result && result.location && result.location.ip_range
                          ? result["ip_range"]
                          : "N/A"
                      }`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <BusinessIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="AS name"
                      secondary={`${
                        result && result.location && result.location.as_name
                          ? result["as_name"]
                          : "N/A"
                      }`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LanguageIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Country"
                      secondary={`${
                        result && result.location && result.location.country
                          ? result["location"]["country"]
                          : "N/A"
                      }`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LocationCityIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="City"
                      secondary={`${
                        result && result.location && result.location.city
                          ? result["location"]["city"]
                          : "N/A"
                      }`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <DnsIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Reverse DNS"
                      secondary={`${
                        result && result.location && result.location.reverse_dns
                          ? result["location"]["reverse_dns"]
                          : "N/A"
                      }`}
                    />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={6} style={{ height: "400px" }}>
                <Typography variant="h6" component="h3" gutterBottom>
                  CTI Scores
                  <InfoIcon
                    sx={{ ml: 1, cursor: "pointer" }}
                    onClick={() =>
                      handleOpenModal(
                        "Score Data Information",
                        `The scores are indicators of malevolence associated with an IP address, computed over several periods of time: 1 day, 1 week, 1 month and overall.

For a given period, the indicator of malevolence is summarized under the total key with a value ranging from 0 (no reports) to 5 (high malevolence).

This value is a summary based on 4 components (see below) also ranging from 0 (Not Applicable/ Missing) to 5 (High), comparing to all the signals reported by the community.


**Aggressiveness**  
What is the intensity of the attack? This component measures the number of attacks reported over a period of time.

**Threat Level**  
How serious is the type of threats reported? The category of attacks reported by the community defines the danger induced by the attacks. An IP known for crawling and scanning will have a lower threat level than an IP reported for brute-force and exploits. This score ranges from 1 (mainly crawling) to 5 (exploit). 0 is the default for unknown scenarios.


**Trust**  
What is the level of confidence in the actors which reported the IP address? This component is based on the reputation (age, number of reports) and the diversity (number of IP ranges, AS Numbers) of all the actors reporting the IP. It ranges from 0 (low confidence) to 5 (high confidence).


**Anomaly**  
What are the red flags associated with this IP address? It analyzes the static description of the reported IP address and checks for red flags which can be linked to evidence of malicious activities.


**Total**  
Aggregation of 4 components calculated on threats reported by the community and described below.`
)                      
                    }
                  />
                </Typography>
                {openModal && (
                  <InfoModal
                    open={openModal}
                    onClose={handleCloseModal}
                    title={modalContent.title}
                    text={modalContent.text}
                  />
                )}
                <ResponsiveBar
                  data={scoreData}
                  keys={[
                    "aggressiveness",
                    "threat",
                    "trust",
                    "anomaly",
                    "total",
                  ]}
                  indexBy="name"
                  margin={{ top: 10, right: 50, bottom: 70, left: 60 }}
                  padding={0.3}
                  innerPadding={3}
                  groupMode="stacked"
                  colors={{ scheme: "reds" }}
                  borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
                  borderWidth={2}
                  borderRadius={4}
                  theme={{
                    axis: {
                      domain: {
                        line: {
                          stroke: "#777777",
                          strokeWidth: 1,
                        },
                      },
                      ticks: {
                        line: {
                          stroke: "#777777",
                          strokeWidth: 1,
                        },
                        text: {
                          fill: "#eeeeee",
                        },
                      },
                      legend: {
                        text: {
                          fill: "#eeeeee",
                        },
                      },
                    },
                    grid: {
                      line: {
                        stroke: "#444444",
                        strokeWidth: 1,
                      },
                    },
                    legends: {
                      text: {
                        fill: "#eeeeee",
                      },
                    },
                    tooltip: {
                      container: {
                        background: "#333333",
                        color: "#ffffff",
                        fontSize: "14px",
                      },
                    },
                  }}
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "Period",
                    legendPosition: "middle",
                    legendOffset: 32,
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "Score",
                    legendPosition: "middle",
                    legendOffset: -40,
                  }}
                  enableLabel={true}
                  label={(d) => `${d.id}`}
                  labelSkipWidth={12}
                  labelSkipHeight={12}
                  labelTextColor={{
                    from: "color",
                    modifiers: [["darker", 1.6]],
                  }}
                  legends={[]}
                  animate={true}
                  motionStiffness={90}
                  motionDamping={15}
                />
              </Grid>
            </Grid>
          </Card>
        </>
      )}

      {result && result["target_countries"] && (
        <Card
          sx={{ mt: 2, p: 2, borderRadius: 1, boxShadow: 0 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h5" component="h3" gutterBottom>
                Target Countries
              </Typography>
              <Box sx={{ height: "400px" }}>
                <ResponsivePie
                  data={transformData(result["target_countries"])}
                  sortByValue={true}
                  margin={{ top: 40, right: 50, bottom: 50, left: 50 }}
                  innerRadius={0.5}
                  padAngle={2}
                  cornerRadius={4}
                  colors={{ scheme: "reds" }}
                  borderWidth={2}
                  borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
                  radialLabelsSkipAngle={10}
                  radialLabelsTextColor={null}
                  radialLabelsLinkColor={null}
                  sliceLabelsSkipAngle={10}
                  arcLinkLabelsTextColor={{ from: "color", modifiers: [] }}
                  arcLinkLabelsColor={{ from: "color", modifiers: [] }}
                  sliceLabel={({ id, value }) => `${id}: ${value}`}
                  sliceLabelsTextStyle={{
                    fontWeight: "bold",
                  }}
                  theme={{
                    tooltip: {
                      container: {
                        background: "#333333",
                        color: "#ffffff",
                        fontSize: "14px",
                      },
                    },
                  }}
                  legends={[]}
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              {result && result.target_countries ? (
                <Box sx={{ height: "400px" }} marginTop={4}>
                  <ResponsiveChoropleth
                    data={transformMapData(result.target_countries)}
                    features={worldCountries.features}
                    margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                    colors="YlOrRd"
                    domain={[
                      0,
                      Math.max(...Object.values(result.target_countries)),
                    ]}
                    unknownColor="#666666"
                    label="properties.name"
                    valueFormat=".2s"
                    projectionScale={100}
                    projectionTranslation={[0.5, 0.5]}
                    projectionRotation={[0, 0, 0]}
                    borderWidth={0.5}
                    borderColor="#152538"
                    theme={{
                      tooltip: {
                        container: {
                          background: "#333333",
                          color: "#ffffff",
                          fontSize: "14px",
                        },
                      },
                    }}
                    legends={[]}
                  />
                </Box>
              ) : (
                <></>
              )}
            </Grid>
          </Grid>
        </Card>
      )}

      {result && result["behaviors"] && result["behaviors"].length > 0 && (
        <Card
          variant="outlined"
          sx={{ mt: 2, p: 2, borderRadius: 5, boxShadow: 0 }}
        >
          <Typography variant="h5" component="h3" gutterBottom>
            Behaviours
          </Typography>
          <List>
            {result["behaviors"].map((behaviour, index) => (
              <ListItem>
                <ListItemText
                  primary={behaviour.label}
                  secondary={behaviour.description}
                />
              </ListItem>
            ))}
          </List>
        </Card>
      )}

      {result &&
        result["attack_details"] &&
        result["attack_details"].length > 0 && (
          <Card
            variant="outlined"
            sx={{ mt: 2, p: 2, borderRadius: 5, boxShadow: 0 }}
          >
            <Typography variant="h5" component="h3" gutterBottom>
              Attack details
            </Typography>
            <List>
              {result["attack_details"].map((behaviour, index) => (
                <ListItem>
                  <ListItemText
                    primary={behaviour.label}
                    secondary={behaviour.description}
                  />
                </ListItem>
              ))}
            </List>
          </Card>
        )}

      {result && result["references"] && result["references"].length > 0 && (
        <Card
          variant="outlined"
          sx={{ mt: 2, p: 2, borderRadius: 5, boxShadow: 0 }}
        >
          <Typography variant="h5" component="h3" gutterBottom>
            References
          </Typography>
          <List>
            {result["references"].map((behaviour, index) => (
              <ListItem>
                <ListItemText
                  primary={behaviour.label}
                  secondary={behaviour.description}
                />
              </ListItem>
            ))}
          </List>
        </Card>
      )}
    </>
  );

  return (
    <>
      <ResultRow
        name="CrowdSec"
        id="crowdsec"
        icon="crowdsec_logo_small"
        loading={loading}
        result={result}
        summary={
          "Malevolence: " +
          score +
          " (from 0 - no reports to 5 - high malevolence)"
        }
        summary_color={{ color: null }}
        color={score === 0 ? "green" : score <= 2 ? "orange" : "red"}
        error={error}
        details={details}
      />
    </>
  );
}
