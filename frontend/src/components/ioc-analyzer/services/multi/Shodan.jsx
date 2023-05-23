import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

import ResultRow from "../../ResultRow";


export default function Shodan(props) {
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const url = 'http://localhost:8000/api/' + props.type + '/shodan?ioc=' + encodeURIComponent(props.ioc);
                const response = await axios.get(url);
                setResult(response.data);
            } catch (e) {
                setError(e);
            }
            setLoading(false);
        }
        fetchData();
    }, []);

    
const details = (
  <>
    {result && !result['error'] && (
      <Box sx={{ margin: 1 }}>
        <Card key="shodan_details" elevation={0} variant="outlined" sx={{ m: 1.5, p: 2, borderRadius: 5 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Details
          </Typography>
          <Typography variant="body1" gutterBottom>
            {result['city'] && <><b>City:</b> {result['city']}<br /></>}
            {result['region_code'] && <><b>Region code:</b> {result['region_code']}<br /></>}
            {result['country_code'] && <><b>Country code:</b> {result['country_code']}<br /></>}
            {result['country_name'] && <><b>Country:</b> {result['country_name']}<br /></>}
            {result['org'] && <><b>Organisation:</b> {result['org']}<br /></>}
            {result['isp'] && <><b>ISP:</b> {result['isp']}<br /></>}
            {result['asn'] && <><b>ASN:</b> {result['asn']}<br /></>}
            {result['domain'] && <><b>Domain:</b> {result['domain']}<br /></>}
          </Typography>
        </Card>

        {result['ports'] && result['ports'].length > 0 && (
          <Card key="shodan_ports" elevation={0} variant="outlined" sx={{ m: 1.5, p: 2, borderRadius: 5 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Open ports
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
              {result['ports'].map((port, index) => (
                <Chip key={index} label={port} variant="outlined" sx={{ m: 0.5 }} />
              ))}
            </Box>
          </Card>
        )}

        {result['domains'] && result['domains'].length > 0 && (
          <Card key="shodan_domains" elevation={0} variant="outlined" sx={{ m: 1.5, p: 2, borderRadius: 5 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Domains
            </Typography>
            <Typography variant="body1" gutterBottom>
              {result['domains'].map((domain, index) => (
                <React.Fragment key={index}>
                  {domain}<br />
                </React.Fragment>
              ))}
            </Typography>
          </Card>
        )}

        {result['subdomains'] && result['subdomains'].length > 0 && (
          <Card key="shodan_subdomains" elevation={0} variant="outlined" sx={{ m: 1.5, p: 2, borderRadius: 5 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Subdomains
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
              {result['subdomains'].map((subdomain, index) => (
                <Chip key={index} label={subdomain} variant="outlined" sx={{ m: 0.5 }} />
              ))}
            </Box>
          </Card>
        )}

        {result['hostnames'] && result['hostnames'].length > 0 && (
          <Card key="shodan_hostnames" elevation={0} variant="outlined" sx={{ m: 1.5, p: 2, borderRadius: 5 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Hostnames
            </Typography>
            <Typography variant="body1" gutterBottom>
              {result['hostnames'].map((hostname, index) => (
                <React.Fragment key={index}>
                  {hostname}<br />
                </React.Fragment>
              ))}
            </Typography>
          </Card>
        )}

        {result['tags'] && result['tags'].length > 0 && (
          <Card key="shodan_tags" elevation={0} variant="outlined" sx={{ m: 1.5, p: 2, borderRadius: 5 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Tags
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
              {result['tags'].map((tag, index) => (
                <Chip key={index} label={tag} variant="outlined" sx={{ m: 0.5 }} />
              ))}
            </Box>
          </Card>
        )}
      </Box>
    )}
  </>
);

  return (
    <>
        <ResultRow
            name="Shodan"
            id="shodan"
            icon="shodan_logo_small"
            loading={loading}
            result={result}
            summary={"Expand this row for details"}
            summary_color={{ color: 'grey' }}
            color={"lightgrey"}
            error={error}
            details={details}
        />
    </>
  )
}
