import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';

import NoDetails from '../NoDetails';
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
            {result ? (
                <Box sx={{ margin: 1 }}>
                {result['error'] ? <Grid xs display="flex" justifyContent="center" alignItems="center">
                    <NoDetails />
                    </Grid> : <>
                <Card key={"shodan_details"} elevation={0} variant="outlined" sx={{ m: 1.5, p: 2, borderRadius: 5 }}>
                    <h3>Details</h3>
                    {result['city'] ? <p><b>City: </b>{result['city']}</p> : null}
                    {result['region_code'] ? <p><b>Region code: </b>{result['region_code']}</p> : null}
                    {result['country_code'] ? <p><b>Coutry code: </b>{result['country_code']}</p> : null}
                    {result['country_name'] ? <p><b>Country: </b>{result['country_name']}</p> : null}
                    {result['org'] ? <p><b>Organisation: </b>{result['org']}</p> : null}
                    {result['isp'] ? <p><b>ISP: </b>{result['isp']}</p> : null}
                    {result['asn'] ? <p><b>ASN: </b>{result['asn']}</p> : null}
                    {result['domain'] ? <p><b>Domain: </b>{result['domain']}</p> : null}
                </Card>

                {result['ports'] && result['ports'].length > 0 ? <Card key={"shodan_ports"} elevation={0} variant="outlined" sx={{ m: 1.5, p: 2, borderRadius: 5 }}>
                    <p><b>Open ports</b></p>
                    { Array.isArray(result['ports']) ?
                        result['ports'].map((ports, index) => {
                        return (
                            <React.Fragment key={index + "_ports_fragment"}>
                                <Chip label={ports} variant="outlined" sx={{ m: 0.5 }} />
                            </React.Fragment>
                        );
                    }) : <><li>None</li></>
                    }
                </Card> : null}

                {result['domains'] && result['domains'].length > 0 ? <Card key={"shodan_domains"} elevation={0} variant="outlined" sx={{ m: 1.5, p: 2, borderRadius: 5 }}>
                    <p><b>Domains</b></p>
                    { 
                        result['domains'].map((domain, index) => {
                        return (
                            <React.Fragment key={index + "_domain_fragment"}>
                                <li key={domain} >{domain}</li>
                            </React.Fragment>
                        );
                    }) 
                    }
                </Card> : null}

                {result['subdomains'] && result['subdomains'].length > 0 ? <Card key={"shodan_domains"} elevation={0} variant="outlined" sx={{ m: 1.5, p: 2, borderRadius: 5 }}>
                    <p><b>Subdomains</b></p>
                    { 
                        result['subdomains'].map((subdomain, index) => {
                        return (
                            <React.Fragment key={index + "fragment"}>
                                <Chip key={subdomain} label={subdomain} variant="outlined" sx={{ m: 0.5 }} />
                            </React.Fragment>
                        );
                    }) 
                    }
                </Card> : null}

                { result['hostnames'] && result['hostnames'].length > 0 ? <Card key={"shodan_hostnames"} elevation={0} variant="outlined" sx={{ m: 1.5, p: 2, borderRadius: 5 }}>
                    <p><b>Hostnames</b></p>
                    {
                        result['hostnames'].map((hostname, index) => {
                        return (
                            <React.Fragment key={index + "_hostnames_fragment"}>
                                <li key={hostname} >{hostname}</li>
                            </React.Fragment>
                        );
                    }) 
                    }
                </Card> : null}

                {result['tags'] && result['tags'].length > 0 ? <Card key={"shodan_tags"} elevation={0} variant="outlined" sx={{ m: 1.5, p: 2, borderRadius: 5 }}>
                    <p><b>Tags</b></p>
                    { 
                        result['tags'].map((tags, index) => {
                        return (
                            <React.Fragment key={index + "_tags_fragment"}>
                                <Chip key={tags} label={tags} variant="outlined" sx={{ m: 0.5 }} />
                            </React.Fragment>
                        );
                    }) 
                    }
                </Card> : null}
                </>}
                </Box>
            ) : null }
        </>
    )

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
