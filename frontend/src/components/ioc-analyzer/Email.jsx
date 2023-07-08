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
import useTheme from "@mui/material/styles/useTheme";

import Emailrepio from "./services/email/Emailrepio";
import Github from "./services/multi/Github";
import Haveibeenpwnd from "./services/email/Haveibeenpwnd";
import Hunterio from "./services/email/Hunterio";
import Reddit from "./services/Reddit";
import Twitter from "./services/Twitter";

import { apiKeysState } from "../../App";
import NoApikeys from "./NoApikeys";

export default function Email(props) {
  const theme = useTheme();
  const apiKeys = useRecoilValue(apiKeysState);

  function showResult() {
    if (
      !apiKeys.github &&
      !apiKeys.twitter_bearer &&
      !apiKeys.hunterio &&
      !apiKeys.reddit_cid &&
      !apiKeys.reddit_cs &&
      !apiKeys.emailrepio &&
      !apiKeys.hibp
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
                  {apiKeys.emailrepio ? (
                    <Emailrepio email={props.ioc} type="email" />
                  ) : (
                    <></>
                  )}
                  {apiKeys.hunterio ? (
                    <Hunterio email={props.ioc} type="email" />
                  ) : (
                    <></>
                  )}
                  {apiKeys.github ? (
                    <Github ioc={props.ioc} type="email" />
                  ) : (
                    <></>
                  )}
                  {apiKeys.hibp ? (
                    <Haveibeenpwnd email={props.ioc} type="email" />
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
