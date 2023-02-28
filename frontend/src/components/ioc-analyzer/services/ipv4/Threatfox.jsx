import React from 'react'
import axios from "axios";
import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Grid from '@mui/material/Grid';

import NoDetails from '../NoDetails';
import ResultRow from "../../ResultRow";

export default function Threatfox(props) {
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const url = 'http://localhost:8000/api/ip/threatfox/' + props.ioc;
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
                {Array.isArray(result['data']) ? <><h3>Details</h3>
                <br /></> : null}
                
                { Array.isArray(result['data']) ?
                        result['data'].map((data, index) => {
                            return (
                                <>
                                    <b>IOC #{index + 1}</b>
                                    <p>ID: {data['id']}</p>
                                    <br />
                                    <b>Threat</b>
                                    <p>Threat type: {data['threat_type']}</p>
                                    <p>Description: {data['threat_type_desc']}</p>
                                    <br />
                                    <b>IOC</b>
                                    <p>IOC type: {data['ioc_type']}</p>
                                    <p>Description: {data['ioc_type_desc']}</p>
                                    <br />
                                    <b>Malware</b>
                                    <p>Malware identifier: {data['malware']}</p>
                                    <p>Malware: {data['malware_printable']}</p>
                                    <p>Alias: {data['malware_alias']}</p>
                                    <p>Malpedia: {data['malware_malpedia']}</p>
                                    <p>Confidence: {data['confidence_level']}</p>
                                    <br />
                                    <b>Additional information</b>
                                    <p>First seen: {data['first_seen']}</p>
                                    <p>Last seend: {data['last_seen']}</p>
                                    <p>Reference: {data['reference']}</p>
                                    <p>Reporter: {data['reporter']}</p>
                                    <br />
                                    <b>Tags</b>
                                    { Array.isArray(data['tags']) ?
                                        data['tags'].map((tags) => {
                                            return (
                                                <>
                                                    <li key={tags} >{tags}</li>
                                                </>
                                            );
                                        }) : <><li key={"none" }>None</li></>
                                    }
                                    
                                    <br />
                                    <hr />
                                    <br />
                                </>
                            );
                        }) : <Grid display="flex" justifyContent="center" alignItems="center">
                        <NoDetails />
                    </Grid>
                    }
            </Box>
            ): null}
        </>
    )

  return (
    <>
      <ResultRow
        name="ThreatFox (abuse.ch)"
        id="threatfox"
        icon="threatfox_logo_small"
        loading={loading}
        result={result}
        summary={
            result && result['query_status'] === 'ok' ? "Malicious" : "Not Malicious"
        }
        summary_color={{ color: null }}
        color={
            result && result['query_status'] === 'ok' ? 'red' : 'green'
        }
        error={error}
        details={details}
      />
    </>
  )
}
