import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import ResultRow from "../../ResultRow";

export default function Checkphish(props) {
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const url = 'http://localhost:8000/api/' + props.type + '/checkphish/' + encodeURIComponent(props.ioc);
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
        <>
        <Box sx={{ margin: 1 }}>
            <Card key="shodan_details" elevation={0} variant="outlined" sx={{ m: 1.5, p: 2, borderRadius: 5 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    Details
                </Typography>
                <List>
                    <ListItem>
                        <ListItemText primary="Job ID" secondary={result['job_id']} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="IOC" secondary={result['url']} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="IOC SHA256" secondary={result['url_sha256']} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Status" secondary={result['status']} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Scan start" secondary={new Date(result['scan_start_ts'] * 1000).toLocaleString('en-US', {timeZone: 'UTC', dateStyle: 'short', timeStyle: 'medium'})} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Scan end" secondary={new Date(result['scan_end_ts'] * 1000).toLocaleString('en-US', {timeZone: 'UTC', dateStyle: 'short', timeStyle: 'medium'})} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Disposition" secondary={result['disposition']} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Brand" secondary={result['brand']} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Insights" secondary={result['insights']} />
                    </ListItem>
                </List>
            </Card>
        </Box>
        </>
    )}
</>
)

  return (
    <>
        <ResultRow
        name="Checkphish"
        id="checkphish"
        icon="checkphish_logo_small"
        loading={loading}
        result={result}
        summary={result && result['disposition'] ? result['disposition'] : 'N/A'}
        summary_color={{ color: null }}
        color={result && result['disposition'] === 'clean' ? 'green' : 'red'}
        error={error}
        details={details}
      />
    </>
  )
}
