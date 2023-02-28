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

import Reddit from './services/Reddit';
import Twitter from './services/Twitter';
import Alienvault from './services/multi/Alienvault';
import Pulsedive from './services/multi/Pulsedive';
import Shodan from './services/multi/Shodan';
import Virustotal from './services/multi/Virustotal';
import Safebrowsing from './services/multi/Safebrowsing';
import { apiKeysState } from '../../App';
import NoApikeys from './NoApikeys';


export default function Domain(props) {
    const apiKeys = useRecoilValue(apiKeysState);

    function showResult() {
        if (
          !apiKeys.alienvault && 
          !apiKeys.virustotal && 
          !apiKeys.pulsedive && 
          !apiKeys.safebrowsing &&
          !apiKeys.shodan && 
          !apiKeys.reddit_cid &&
          !apiKeys.reddit_cs &&
          !apiKeys.twitter_bearer
          ) {
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
                        {apiKeys.alienvault ? <Alienvault ioc={props.ioc} type='domain' /> : <></>}
                        {apiKeys.safebrowsing ? <Safebrowsing ioc={props.ioc} type='domain' /> : <></>}
                        {apiKeys.pulsedive ? <Pulsedive ioc={props.ioc} type='domain' /> : <></>}
                        {apiKeys.virustotal ? <Virustotal ioc={props.ioc} type='domain' /> : <></>}
                        {apiKeys.shodan ? <Shodan ioc={props.ioc} type='domain' /> : <></>}
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
