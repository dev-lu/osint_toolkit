import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { 
    TableRow, 
    TableCell
  } from '@mui/material'
import twitter_logo_small from '../icons/twitter_logo_small.png';
import NoDetails from './NoDetails';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import useTheme from "@mui/material/styles/useTheme";



export default function Twitter(props) {
    const [result, setResult] = useState(null);
    const [setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const url = 'http://localhost:8000/api/socialmedia/twitter/' + encodeURIComponent(props.ioc);
                const response = await axios.get(url);
                setResult(response.data);
            } catch (e) {
                setError(e);
            }
            setLoading(false);
        }
        fetchData();
    }, []);

    if (loading) {
        return (
          <>
              <TableRow key='twitter_row'>
                  <TableCell>
                      <IconButton
                          aria-label="expand row"
                          size="large"
                      >
                          <KeyboardArrowDownIcon />
                      </IconButton>
                  </TableCell>
                  <TableCell>
                      <img src={twitter_logo_small} alt='' style={{ height: '12px' }} />
                      &nbsp;&nbsp;Twitter
                  </TableCell>
                  <TableCell> <CircularProgress /> </TableCell>
                  <TableCell ></TableCell>
              </TableRow>
          </>
      )
    }
    /*
    if (error) {
        return <div>Error: {error.message}</div>
    }
    */
    if (!result) {
        return (
          <>
              <TableRow key='twitter_row'>
                  <TableCell>
                      <IconButton
                          aria-label="expand row"
                          size="large"
                      >
                          <KeyboardArrowDownIcon />
                      </IconButton>
                  </TableCell>
                  <TableCell>
                      <img src={twitter_logo_small} alt='' style={{ height: '12px' }} />
                      &nbsp;&nbsp;Twitter
                  </TableCell>
                  <TableCell> Error </TableCell>
                  <TableCell bgcolor='black' ></TableCell>
              </TableRow>
          </>     
      )
    }

  return (
    <>
        <TableRow key='twitter_row'>
            <TableCell>
                <IconButton
                    aria-label="expand row"
                    size="large"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
            </TableCell>
            <TableCell>
                    <img src={twitter_logo_small} alt='' style={{ height: '12px' }} />
                    &nbsp;&nbsp;Twitter
            </TableCell>
            <TableCell> At least { result[0]['count'] } Tweets within the last 7 days </TableCell>
            <TableCell bgcolor='lightgrey' ></TableCell>
        </TableRow>
        <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0, backgroundColor: theme.palette.background.tablecell }} colSpan={6}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box key="tweets_box" sx={{ margin: 1 }}>
                        <h3>Tweets</h3>
                            { result[0]['count'] > 0 ?
                                result.slice(1).map((tweet, index) => {
                                    return (
                                        <React.Fragment key={index + "_tweet_fragment"}>
                                            <Card elevation={0} variant="outlined" key={index + "_tweet_card"} sx={{ m: 1.5, p: 2, borderRadius: 5 }}>
                                                <p><b>Author: </b></p>
                                                <p>{tweet['author']}</p>
                                                <br />
                                                <p><b>Created at: </b></p>
                                                <p>{tweet['created_at']}</p>
                                                <br />
                                                <p><b>Text: </b></p>
                                                <p sx={{maxWidth: '100px', overflowWrap: 'break-word'}}>{tweet['text']}</p>
                                            </Card>
                                        </React.Fragment>
                                    )
                                }) : <Grid display="flex" justifyContent="center" alignItems="center">
                                    <NoDetails /></Grid>
                            }
                    </Box>
                </Collapse>
            </TableCell>
        </TableRow>
    </>
  )
}
