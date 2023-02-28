import React from 'react'
import axios from "axios";
import { useEffect, useState } from "react";
import GaugeChart from 'react-gauge-chart'

import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Stack from '@mui/material/Stack';

import ResultRow from "../../ResultRow";


export default function IpQualityscore(props) {
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [score, setScore] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const url = 'http://localhost:8000/api/ip/ipqualityscore/' + props.ioc;
                const response = await axios.get(url);
                setResult(response.data);
                setScore(response.data['fraud_score']);
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
                    <Card variant="outlined" sx={{m:1, p: 2, borderRadius: 5, boxShadow: 0 }}>
                        <h3>Details</h3>
                        <p> <b>Score:</b> { result['fraud_score'] } % malicious </p> 
                        <p> <b>Country code:</b> { result['country_code'] } </p> 
                        <p> <b>Region:</b> { result['region'] } </p> 
                        <p> <b>City:</b> { result['city'] } </p> 
                        <p> <b>Organisation:</b> { result['organization'] } </p> 
                    </Card>
                    <Card variant="outlined" sx={{m:1, p: 2, borderRadius: 5, boxShadow: 0 }}>
                        <p> <b>Is crawler:</b> { result['is_crawler'] ? 'Yes' : 'No' } </p> 
                        <p> <b>Timezone:</b> { result['timezone'] } </p> 
                        <p> <b>Mobile:</b> { result['mobile'] ? 'Yes' : 'No' } </p> 
                        <p> <b>Is proxy:</b> { result['proxy'] ? 'Yes' : 'No' } </p> 
                        <p> <b>Is VPN:</b> { result['vpn'] ? 'Yes' : 'No' } </p> 
                        <p> <b>Is Tor:</b> { result['tor'] ? 'Yes' : 'No' } </p> 
                        <p> <b>Is active VPN:</b> { result['active_vpn'] ? 'Yes' : 'No' } </p> 
                        <p> <b>Is active Tor:</b> { result['active_tor'] ? 'Yes' : 'No' } </p> 
                        <p> <b>Recent abuse:</b> { result['recent_abuse'] ? 'Yes' : 'No' } </p> 
                        <p> <b>Bot:</b> { result['bot_status'] ? 'Yes' : 'No' } </p>
                    </Card>
                    </Box>
                    <Stack sx={{ width: '30%', align: 'right' }}>
                        <GaugeChart id="gauge-chart5"
                                style={{width: '100%', align: 'right'}}
                                animate={false} 
                                arcsLength={[0.2, 0.5, 0.3]}
                                colors={['#5BE12C', '#F5CD19', '#EA4228']}
                                textColor="#5E5E5E"
                                percent={result['fraud_score'] / 100}
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
        name="IPQualityScore"
        id="ipqualityscore"
        icon="ipqualityscore_logo_small"
        loading={loading}
        result={result}
        summary={score + "% malicious"}
        summary_color={{ color: null }}
        color={score === 0 ? "green" : score <= 50 ? "orange" : "red"}
        error={error}
        details={details}
      />
    </>
  )
}
