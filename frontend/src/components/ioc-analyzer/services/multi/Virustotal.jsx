import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';

import NoDetails from '../NoDetails';
import ResultRow from "../../ResultRow";
import { closestIndexTo } from 'date-fns';


export default function Virustotal(props) {
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [malCount, setMalCount] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = 'http://localhost:8000/api/' + props.type + '/virustotal?ioc=' + encodeURIComponent(props.ioc);
                const response = await axios.get(url);
                setResult(response.data);
                setMalCount(response.data.data.attributes.last_analysis_stats.malicious);
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
            result.data ? <Box sx={{ margin: 1 }}>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                <Card key="details_card" variant="outlined" sx={{m: 1, p: 2, borderRadius: 5, boxShadow: 0, flexBasis: '48%' }}>
                <h3>Details</h3> 
                <p> <b>Detected as malicious by</b> { malCount } engine(s)</p>
                { result['data']['attributes']['regional_internet_registry'] ? 
                    <p> <b>Internet registry:</b> { result['data']['attributes']['regional_internet_registry'] }</p> : 
                    null }
                { result['data']['attributes']['network'] ? 
                    <p> <b>Network:</b> { result['data']['attributes']['network'] }</p> : 
                    null }
                { result['data']['attributes']['country'] ? 
                    <p> <b>Country:</b> { result['data']['attributes']['country'] }</p> : 
                    null }
                { result['data']['attributes']['as_owner'] ? 
                    <p> <b>AS owner:</b> { result['data']['attributes']['as_owner'] }</p> :
                    null }
                </Card>

                <Card key={"statistics_card"} variant="outlined" sx={{m:1, p: 2, borderRadius: 5, boxShadow: 0, flexBasis: '48%' }}>
                    <h3>Analysis statistics</h3> 
                    <p> <b>Harmless:</b> { result['data']['attributes']['last_analysis_stats']['harmless'] }</p>
                    <p> <b>Malicious:</b> { result['data']['attributes']['last_analysis_stats']['malicious'] }</p>
                    <p> <b>Suspicious:</b> { result['data']['attributes']['last_analysis_stats']['suspicious'] }</p>
                    <p> <b>Undetected:</b> { result['data']['attributes']['last_analysis_stats']['undetected'] }</p>
                    <p> <b>Timeout:</b> { result['data']['attributes']['last_analysis_stats']['timeout'] }</p>
                </Card>
            </div>


            {result['data']['attributes']['tags'] && result['data']['attributes']['tags'].length > 0 ? <Card variant="outlined" key="tags_card" sx={{m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}>
            <p>
            <b>Tags</b>
                { result['data']['attributes']['tags'] > 0 ?
                    result['data']['attributes']['tags'].map((tag) => {
                        return <li key={tag}> {tag} </li>
                    }) : <p>None</p>
                }
            </p> 
            </Card> : null}

            {result['data']['attributes']['crowdsourced_context'] && result['data']['attributes']['crowdsourced_context'].length > 0 ? <Card key="crowdsourced_context_card" variant="outlined" sx={{m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}>
            <h3>Crowdsourced context</h3>
                { result['data']['attributes']['crowdsourced_context'].length > 0 ?
                    result['data']['attributes']['crowdsourced_context'].map((cc, index) => {
                        return (<div key={index + "_div"}>
                                    <b>Title: </b>{cc.title}<br />
                                    <b>Source: </b>{cc.source}<br />
                                    <b>Timestamp: </b>{cc.timestamp}<br />
                                    <b>Detail: </b>{cc.detail}<br />
                                    <b>Severity: </b>{cc.severity}<br />
                            </div>)
                    }) : <p>None</p>
                }
            </Card> : null}
            

            {result['data']['attributes']['popularity_ranks'] && Object.keys(result['data']['attributes']['popularity_ranks']).length > 0 ?
            <Card key="popularity_card" variant="outlined" sx={{m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}>
                <h3>Popularity ranks</h3>
                { 
                Object.entries(result['data']['attributes']['popularity_ranks']).map(([name, data]) => {
                return (
                    <div key={name + "_div"}>
                        <Card variant="outlined" key={name + "_popularity_card"} sx={{m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}>
                            <p><b>{name} </b> </p>
                            <p><b>Rank: </b> {data.rank}</p>
                        </Card>
                    </div>
                );
            }) 
            }
            </Card> : null}

            {result['data']['attributes']['last_analysis_results'] && Object.keys(result['data']['attributes']['last_analysis_results']).length > 0 ?
            <Card key="last_analysis_results_card" variant="outlined" sx={{m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}>
                <h3>Last analysis results</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                { 
                Object.entries(result['data']['attributes']['last_analysis_results']).map(([name, data], index) => {
                return (
                    <div key={index}>
                        <Card variant="outlined" key={name + "_analysis_results_card"} sx={{
                            m: 2, 
                            p: 2, 
                            borderRadius: 5, 
                            boxShadow: 0, 
                            flexBasis: '30%',
                            color: 'white',
                            backgroundColor: data.category === 'malicious' ? 'red' : 'green' }}>

                            <h4>{name} </h4>
                            <Divider variant="middle" sx={{m:1}} />
                            <p><b>Category: </b> {data.category}</p>
                            <p><b>Result: </b> {data.result}</p>
                            <p><b>Method: </b> {data.method}</p>
                            <p><b>Engine name: </b> {data.engine_name}</p>
                        </Card>
                    </div>
                );
            }) 
            }
            </div>
            </Card> : null}
            

            {result['data']['attributes']['whois'] ? <Card key="whois_card" variant="outlined" sx={{m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}>
                <h3>Whois</h3>
                <p style={{ whiteSpace: 'pre-wrap' }}>{ result['data']['attributes']['whois'] }</p> 
            </Card> : null}
            </Box> : <Box sx={{ margin: 1 }}>
                    <Grid xs item={true} display="flex" justifyContent="center" alignItems="center">
                        <NoDetails />
                    </Grid>
                </Box> 
        ) : null }
    </>
   )

  return (
    <>
        <ResultRow
            name="Virustotal"
            id="virustotal"
            icon="vt_logo_small"
            loading={loading}
            result={result}
            summary={malCount === null ? "No matches found" : 
            "Detected as malicious by " + malCount + " engine(s)" }
            summary_color={{ color: null }}
            color={malCount > 0 ? 'red' : 'green' }
            error={error}
            details={details}
        />
     </>
  );
}
