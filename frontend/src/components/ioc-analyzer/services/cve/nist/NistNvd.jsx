import React from "react";
import api from "../../../../../api";
import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import InfoIcon from "@mui/icons-material/Info";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import Typography from "@mui/material/Typography";

import ConfTable from "./ConfTable";
import CvssMetrics from "./CvssMetrics";
import Details from "./Details";
import RefTable from "./RefTable";
import ResultRow from "../../../ResultRow";
import VendorComments from "./VendorComments";
import Weaknesses from "./Weaknesses";

export default function NistNvd(props) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cveDetails, setCveDetails] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url =
          "/api/" +
          props.type +
          "/nist_nvd/" +
          encodeURIComponent(props.cve);
        const response = await api.get(url);
        setResult(response.data);
        response.data.vulnerabilities[0].cve
          ? setCveDetails(response.data.vulnerabilities[0].cve)
          : setCveDetails(false);
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
          <Details details={cveDetails} />

          {cveDetails.metrics.cvssMetricV31 ? (
            <CvssMetrics metrics={cveDetails.metrics.cvssMetricV31[0]} />
          ) : null}

          {cveDetails.weaknesses ? (
            <Weaknesses
              weaknesses={cveDetails.weaknesses}
              details={cveDetails}
            />
          ) : null}

          <Card
            variant="outlined"
            key="references_card"
            sx={{ m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}
          >
            <Typography variant="h5" gutterBottom component="div">
              References
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <InfoIcon />
                </ListItemIcon>
                <ListItemText secondary="References to Advisories, Solutions, and Tools By selecting these links, you will be leaving NIST webspace. We have provided these links to other web sites because they may have information that would be of interest to you. No inferences should be drawn on account of other sites being referenced, or not, from this page. There may be other web sites that are more appropriate for your purpose. NIST does not necessarily endorse the views expressed, or concur with the facts presented on these sites. Further, NIST does not endorse any commercial products that may be mentioned on these sites." />
              </ListItem>
            </List>
            {cveDetails ? (
              <>
                <RefTable references={cveDetails.references} />
              </>
            ) : null}
          </Card>

          {cveDetails.vendorComments ? (
            <VendorComments comments={cveDetails.vendorComments} />
          ) : null}

          {cveDetails.configurations ? (
            <Card
              variant="outlined"
              key="cveConfigurations_card"
              sx={{ m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}
            >
              <Typography variant="h5" gutterBottom component="div">
                Configurations
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <InfoIcon />
                  </ListItemIcon>
                  <ListItemText secondary="This contains the CVE applicability statements that convey which product, or products, are associated with the vulnerability according to the NVD analysis. Please note, a CVE that is Awaiting Analysis, Undergoing Analysis, or Rejected will not include the configurations object." />
                </ListItem>
              </List>
              {cveDetails.configurations.map((configuration, index) => (
                <>
                  <Typography
                    variant="h6"
                    gutterBottom
                    component="div"
                    sx={{ mt: 3, ml: 2 }}
                  >
                    ({index + 1}) - Operator: {configuration.nodes[0].operator}{" "}
                    {configuration.negate ? "- Negate" : null}
                  </Typography>
                  <ConfTable configuration={configuration} index={index} />
                </>
              ))}
            </Card>
          ) : null}
        </Box>
      ) : null}
    </>
  );

  return (
    <>
      <ResultRow
        name="NIST NVD"
        id="nistnvd"
        icon="nistnvd_logo_small"
        loading={loading}
        result={result}
        summary={result && result.totalResults + " results found"}
        summary_color={{ color: null }}
        color={result && (result.totalResults > 0 ? "red" : "green")}
        error={error}
        details={details}
      />
    </>
  );
}
