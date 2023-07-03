import React from 'react';
import api from '../../../../api';
import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import ResultRow from "../../ResultRow";
import NoDetails from '../NoDetails';

export default function Safebrowsing(props) {
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const url = '/api/' + props.type + '/safebrowsing?ioc=' + encodeURIComponent(props.ioc);
                const response = await api.get(url);
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
            {Object.keys(result).length > 0 ? <><h3>Details</h3> 
                <b>Threat Type:</b> {result.matches[0].threatType} <br />
                <b>Platform Type:</b> {result.matches[0].platformType} <br />
                <b>Threat Entry Type:</b> {result.matches[0].threatEntryType} 
                </> : <Grid display="flex" justifyContent="center" alignItems="center">
                        <NoDetails />
                    </Grid>}
        </Box>
        ) : null }
        </>
    )


  return (
    <>
        <ResultRow
        name="Google Safe Browsing"
        id="safebrowsing"
        icon="safebrowsing_logo_small"
        loading={loading}
        result={result}
        summary={
            result && Object.keys(result).length > 0 
            ? result.matches[0].threatType : 'Clean'
            }
        summary_color={{ color: null }}
        color={
            result ?
                Object.keys(result).length > 0 
                ? 'red' : 'green' : 'lightgrey'
        }
        error={error}
        details={details}
        />
    </>
  )
}
