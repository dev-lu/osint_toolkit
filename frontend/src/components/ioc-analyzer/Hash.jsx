import React from 'react'
import { useRecoilValue } from 'recoil';

import Alienvault from './services/multi/Alienvault';
import Grow from '@mui/material/Grow';
import { TableContainer, 
    Table, 
    TableHead, 
    TableBody, 
    TableRow, 
    TableCell, 
    Paper 
  } from '@mui/material'

import Reddit from './services/Reddit';
import Twitter from './services/Twitter';
import Virustotal from './services/multi/Virustotal';
import Pulsedive from './services/multi/Pulsedive';
import Maltiverse from './services/ipv4/Maltiverse';
import Threatfox from './services/ipv4/Threatfox';
import { apiKeysState } from '../../App';
import NoApikeys from './NoApikeys';


export default function Hash(props) {
    const apiKeys = useRecoilValue(apiKeysState);

    function showResult() {
        if (
          !apiKeys.alienvault && 
          !apiKeys.virustotal && 
          !apiKeys.reddit_cid &&
          !apiKeys.reddit_cs &&
          !apiKeys.twitter_bearer) {
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
                    borderColor: 'grey.100' 
                    }}>
                  <Table aria-label='result_table' >
                    <TableHead>
                      <TableRow>
                        <TableCell />
                        <TableCell sx={{ fontWeight: 'bold' }}>Service</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Result</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                        {apiKeys.alienvault ? <Alienvault ioc={props.ioc} type='hash' /> : <></>}
                        {apiKeys.pulsedive ? <Pulsedive ioc={props.ioc} type='hash' /> : <></>}
                        {apiKeys.threatfox ? <Threatfox ioc={props.ioc} type='hash' /> : <></>}
                        {apiKeys.virustotal ? <Virustotal ioc={props.ioc} type='hash' /> : <></>}
                        {apiKeys.reddit_cid && apiKeys.reddit_cs ? <Reddit ioc={props.ioc} /> : <></>}
                        {apiKeys.twitter_bearer ? <Twitter ioc={props.ioc} /> : <></>}
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
