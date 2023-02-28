import React from 'react'
import axios from "axios";
import { useEffect, useState } from "react";
import GaugeChart from 'react-gauge-chart';

import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Stack from '@mui/material/Stack';

import ResultRow from "../../ResultRow";


export default function AbuseIpdb(props) {
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [score, setScore] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const url = 'http://localhost:8000/api/ip/abuseipdb/' + props.ioc;
                const response = await axios.get(url);
                setResult(response.data);
                setScore(response.data['data']['abuseConfidenceScore'])
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
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap'
                }}>
                    <Box sx={{ margin: 1, width: '65%' }}>
                        <Card variant="outlined" sx={{p: 2, borderRadius: 5, boxShadow: 0 }}>
                        <h3>Details</h3>
                        <p> <b>Score:</b> {result.data['abuseConfidenceScore']} % malicious </p> 
                        <p> <b>Total reports:</b> { result.data['totalReports'] } </p> 
                        <p> <b>Number of reporting users:</b> { result.data['numDistinctUsers'] } </p> 
                        <p> <b>Last report:</b> { result.data['lastReportedAt'] } </p> 
                        <p> <b>Whitelisted:</b> { result.data['isWhitelisted'] ? 'Yes' : 'No' } </p> 
                        </Card>
                        <br></br>
                        <Card variant="outlined" sx={{p: 2, borderRadius: 5, boxShadow: 0 }}>
                        <p> <b>Countrycode:</b> { result.data['countryCode'] } </p> 
                        <p> <b>ISP:</b> { result.data['isp'] } </p> 
                        <p> <b>Domain:</b> { result.data['domain'] } </p> 
                        <p> <b>Type:</b> { result.data['usageType'] ? result.data['usageType'] : 'Unknown' } </p> 
                        <p>
                            <b>Hostnames:</b> { result.data['hostnames'].length > 0 ?
                                result.data['hostnames'].map((hostname) => {
                                    return <li key={hostname}>{hostname}</li>
                                }) : 'None'
                            }
                        </p> 
                        </Card>
                    </Box>
                    
                    <Stack sx={{ width: '30%', align: 'right' }}>
                        <GaugeChart id="gauge-chart5"
                                    style={{width: '100%', align: 'right'}}
                                    animate={false} 
                                    arcsLength={[0.2, 0.5, 0.3]}
                                    colors={['#5BE12C', '#F5CD19', '#EA4228']}
                                    textColor="#5E5E5E"
                                    percent={score / 100}
                                    arcPadding={0.02}
                                    />
                        <h3 align='center'>Malicious</h3>
                    </Stack>
                    </div>
            ): null}
        </>
    )

  return (
    <>
      <ResultRow
        name="AbuseIPDB"
        id="abuseipdb"
        icon="aipdb_logo_small"
        loading={loading}
        result={result}
        summary={score + "% malicious"}
        summary_color={{ color: null }}
        color={score === 0 ? "green" : score <= 60 ? "orange" : "red"}
        error={error}
        details={details}
      />
    </>
  )
}
