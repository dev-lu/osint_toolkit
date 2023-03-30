import React from 'react'
import { useRecoilValue } from 'recoil';

import Grow from '@mui/material/Grow';
import { TableContainer, 
    Table, 
    TableHead, 
    TableBody, 
    TableRow, 
    TableCell, 
    Paper 
  } from '@mui/material'
import useTheme from "@mui/material/styles/useTheme";

import Reddit from './services/Reddit';
import Twitter from './services/Twitter';
import { apiKeysState } from '../../App';
import NoApikeys from './NoApikeys';

export default function Ipv6(props) {
    const apiKeys = useRecoilValue(apiKeysState);
    const theme = useTheme();

    function showResult() {
        if (
          !apiKeys.reddit_cid &&
          !apiKeys.reddit_cs &&
          !apiKeys.twitter_apikey && 
          !apiKeys.twitter_apisecret) {
            return (
              <>
                <NoApikeys />
              </>
              )
          } else {
            return (
              <>
              <Grow in={true}>
                <TableContainer 
                  component={ Paper } 
                  sx={{
                    boxShadow: 0, 
                    borderRadius: 5, 
                    border: 1, 
                    borderColor: theme.palette.background.tableborder,
                    }}>
                  <Table aria-label='result_table' >
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ bgcolor: theme.palette.background.tablecell }} />
                        <TableCell sx={{ bgcolor: theme.palette.background.tablecell, fontWeight: 'bold' }}>Service</TableCell>
                        <TableCell sx={{ bgcolor: theme.palette.background.tablecell, fontWeight: 'bold' }}>Result</TableCell>
                        <TableCell sx={{ bgcolor: theme.palette.background.tablecell }} ></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                        {apiKeys.reddit_cid && apiKeys.reddit_cs ? <Reddit ioc={props.ioc} /> : <></>}
                        {apiKeys.twitter_apikey && apiKeys.twitter_apisecret ? <Twitter ioc={props.ioc} /> : <></>}
                    </TableBody>
                  </Table>
                </TableContainer>
                </Grow>
              </>
            )
      }}

  return (
    <>
        {showResult()}
    </>
  )
}
