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

import AbuseIpdbData from "./services/ipv4/AbuseIpdb.jsx";
import Alienvault from "./services/multi/Alienvault.jsx";
import Checkphish from "./services/multi/Checkphish";
import CrowdSec from "./services/ipv4/CrowdSec.jsx";
import Github from "./services/multi/Github";
import Virustotal from "./services/multi/Virustotal.jsx";
import Threatfox from "./services/ipv4/Threatfox.jsx";
import Maltiverse from "./services/ipv4/Maltiverse.jsx";
import Pulsedive from "./services/multi/Pulsedive.jsx";
import Ipqualityscore from "./services/ipv4/Ipqualityscore.jsx";
import Shodan from "./services/multi/Shodan.jsx";
import Reddit from "./services/Reddit";
import Twitter from "./services/Twitter.jsx";
import { apiKeysState } from "../../state";
import NoApikeys from "./NoApikeys";

export default function Ipv4(props) {
  const apiKeys = useRecoilValue(apiKeysState);
  const theme = useTheme();

  function showResult() {
    if (
      !apiKeys.abuseipdb &&
      !apiKeys.alienvault &&
      !apiKeys.checkphishai &&
      !apiKeys.crowdsec &&
      !apiKeys.github &&
      !apiKeys.virustotal &&
      !apiKeys.ipqualityscore &&
      !apiKeys.maltiverse &&
      !apiKeys.threatfox &&
      !apiKeys.pulsedive &&
      !apiKeys.shodan &&
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
                borderRadius: 1,
              }}
            >
              <Table aria-label="result_table" >
                <TableHead >
                  <TableRow >
                    <TableCell
                    />
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        fontSize: 17
                      }}
                    >
                      Service
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        fontSize: 17
                      }}
                    >
                      Result
                    </TableCell>
                    <TableCell
                    ></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {apiKeys.abuseipdb ? (
                    <AbuseIpdbData ioc={props.ioc} />
                  ) : (
                    <></>
                  )}
                  {apiKeys.alienvault ? (
                    <Alienvault ioc={props.ioc} type="ip" />
                  ) : (
                    <></>
                  )}
                  {apiKeys.checkphishai ? (
                    <Checkphish ioc={props.ioc} type="ip" />
                  ) : (
                    <></>
                  )}
                  {apiKeys.crowdsec ? (
                    <CrowdSec ioc={props.ioc} type="ip" />
                  ) : (
                    <></>
                  )}
                  {apiKeys.virustotal ? (
                    <Virustotal ioc={props.ioc} type="ip" />
                  ) : (
                    <></>
                  )}
                  {apiKeys.ipqualityscore ? (
                    <Ipqualityscore ioc={props.ioc} />
                  ) : (
                    <></>
                  )}
                  {apiKeys.maltiverse ? <Maltiverse ioc={props.ioc} /> : <></>}
                  {apiKeys.threatfox ? <Threatfox ioc={props.ioc} /> : <></>}
                  {apiKeys.pulsedive ? (
                    <Pulsedive ioc={props.ioc} type="ip" />
                  ) : (
                    <></>
                  )}
                  {apiKeys.shodan ? (
                    <Shodan ioc={props.ioc} type="ip" />
                  ) : (
                    <></>
                  )}
                  {apiKeys.github ? (
                    <Github ioc={props.ioc} type="ip" />
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
