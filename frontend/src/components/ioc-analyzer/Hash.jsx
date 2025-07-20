import React from "react";
import { useRecoilValue } from "recoil";

import Alienvault from "./services/multi/Alienvault";
import Grow from "@mui/material/Grow";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from "@mui/material";
import { useTheme } from '@mui/material/styles';

import Github from "./services/multi/Github";
import Reddit from "./services/Reddit";
import Twitter from "./services/Twitter";
import Virustotal from "./services/multi/Virustotal";
import Pulsedive from "./services/multi/Pulsedive";
import Malwarebazaar from './services/hash/Malwarebazaar'
import { apiKeysState } from "../../state";
import NoApikeys from "./NoApikeys";

export default function Hash(props) {
  const apiKeys = useRecoilValue(apiKeysState);
  const theme = useTheme();

  function showResult() {
    if (
      !apiKeys.alienvault &&
      !apiKeys.github &&
      !apiKeys.virustotal &&
      !apiKeys.reddit_cid &&
      !apiKeys.reddit_cs &&
      !apiKeys.twitter_bearer
    ) {
      return (
        <>
          <NoApikeys />
        </>
      );
    } else {
      return (
        <>
          <Grow in={true}>
            <TableContainer
              component={Paper}
              sx={{
                boxShadow: 0,
                borderRadius: 1,
              }}
            >
              <Table aria-label="result_table">
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{ bgcolor: theme.palette.background.tablecell }}
                    />
                    <TableCell
                      sx={{
                        bgcolor: theme.palette.background.tablecell,
                        fontWeight: "bold",
                      }}
                    >
                      Service
                    </TableCell>
                    <TableCell
                      sx={{
                        bgcolor: theme.palette.background.tablecell,
                        fontWeight: "bold",
                      }}
                    >
                      Result
                    </TableCell>
                    <TableCell
                      sx={{ bgcolor: theme.palette.background.tablecell }}
                    ></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {apiKeys.alienvault ? (
                    <Alienvault ioc={props.ioc} type="hash" />
                  ) : (
                    <></>
                  )}
                  {apiKeys.pulsedive ? (
                    <Pulsedive ioc={props.ioc} type="hash" />
                  ) : (
                    <></>
                  )}
                  {apiKeys.virustotal ? (
                    <Virustotal ioc={props.ioc} type="hash" />
                  ) : (
                    <></>
                  )}
                  {
                    <Malwarebazaar ioc={props.ioc} type="hash" />
                  
                  }
                  {apiKeys.github ? (
                    <Github ioc={props.ioc} type="hash" />
                  ) : (
                    <></>
                  )}
                  {apiKeys.reddit_cid && apiKeys.reddit_cs ? (
                    <Reddit ioc={props.ioc} />
                  ) : (
                    <></>
                  )}
                  {apiKeys.twitter_bearer ? <Twitter ioc={props.ioc} /> : <></>}
                </TableBody>
              </Table>
            </TableContainer>
          </Grow>
        </>
      );
    }
  }

  return <>{showResult()}</>;
}
