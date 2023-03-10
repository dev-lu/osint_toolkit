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


import Emailrepio from './services/email/Emailrepio';
import Haveibeenpwnd from './services/email/Haveibeenpwnd';
import Hunterio from './services/email/Hunterio';
import Reddit from './services/Reddit';
import Twitter from './services/Twitter';

import { apiKeysState } from '../../App';
import NoApikeys from './NoApikeys';

export default function Email(props) {
    const apiKeys = useRecoilValue(apiKeysState);

    function showResult() {
        if (
          !apiKeys.twitter_bearer && 
          !apiKeys.hunterio &&
          !apiKeys.reddit_cid &&
          !apiKeys.reddit_cs &&
          !apiKeys.emailrepio &&
          !apiKeys.hibp) {
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
                      {apiKeys.emailrepio ? <Emailrepio email={props.ioc} type='email' /> : <></>}
                      {apiKeys.hunterio ? <Hunterio email={props.ioc} type='email' /> : <></>}
                      {apiKeys.hibp ? <Haveibeenpwnd email={props.ioc} type='email' /> : <></>}
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
