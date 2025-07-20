import React from "react";
import { useRecoilValue } from "recoil";

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

import Checkphish from "./services/multi/Checkphish";
import Github from "./services/multi/Github";
import Reddit from "./services/Reddit";
import Twitter from "./services/Twitter";
import Alienvault from "./services/multi/Alienvault";
import Pulsedive from "./services/multi/Pulsedive";
import Shodan from "./services/multi/Shodan";
import Virustotal from "./services/multi/Virustotal";
import Safebrowsing from "./services/multi/Safebrowsing";
import { apiKeysState } from "../../state";
import NoApikeys from "./NoApikeys";

export default function Domain(props) {
  const theme = useTheme();
  const apiKeys = useRecoilValue(apiKeysState);

  function showResult() {
    if (
      !apiKeys.alienvault &&
      !apiKeys.github &&
      !apiKeys.checkphishai &&
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
      );
    } else {
      return (
        <>
          <Grow in={true}>
            <TableContainer
              component={Paper}
              sx={{
                boxShadow: 0,
                borderRadius: 5,
                border: 1,
                borderColor: theme.palette.background.tableborder,
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
                    <Alienvault ioc={props.ioc} type="domain" />
                  ) : (
                    <></>
                  )}
                  {apiKeys.checkphishai ? (
                    <Checkphish ioc={props.ioc} type="domain" />
                  ) : (
                    <></>
                  )}
                  {apiKeys.safebrowsing ? (
                    <Safebrowsing ioc={props.ioc} type="domain" />
                  ) : (
                    <></>
                  )}
                  {apiKeys.pulsedive ? (
                    <Pulsedive ioc={props.ioc} type="domain" />
                  ) : (
                    <></>
                  )}
                  {apiKeys.virustotal ? (
                    <Virustotal ioc={props.ioc} type="domain" />
                  ) : (
                    <></>
                  )}
                  {apiKeys.shodan ? (
                    <Shodan ioc={props.ioc} type="domain" />
                  ) : (
                    <></>
                  )}
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
