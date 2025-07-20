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
import Virustotal from "./services/multi/Virustotal";
import Safebrowsing from "./services/multi/Safebrowsing";
import { apiKeysState } from "../../state";
import NoApikeys from "./NoApikeys";

export default function Url(props) {
  const apiKeys = useRecoilValue(apiKeysState);
  const theme = useTheme();

  function showResult() {
    if (
      !apiKeys.checkphishai &&
      !apiKeys.github &&
      !apiKeys.virustotal &&
      !apiKeys.safebrowsing &&
      !apiKeys.reddit_cid &&
      !apiKeys.reddit_cs &&
      !apiKeys.twitter_apikey &&
      !apiKeys.twitter_apisecret
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
                  {apiKeys.checkphishai ? (
                    <Checkphish ioc={props.ioc} type="url" />
                  ) : (
                    <></>
                  )}
                  {apiKeys.github ? (
                    <Github ioc={props.ioc} type="cve" />
                  ) : (
                    <></>
                  )}
                  {apiKeys.safebrowsing ? (
                    <Safebrowsing ioc={props.ioc} type="domain" />
                  ) : (
                    <></>
                  )}
                  {apiKeys.virustotal ? (
                    <Virustotal ioc={props.ioc} type="domain" />
                  ) : (
                    <></>
                  )}
                  {apiKeys.reddit_cid && apiKeys.reddit_cs ? (
                    <Reddit ioc={props.ioc} />
                  ) : (
                    <></>
                  )}
                  {apiKeys.twitter_apikey && apiKeys.twitter_apisecret ? (
                    <Twitter ioc={props.ioc} />
                  ) : (
                    <></>
                  )}
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
