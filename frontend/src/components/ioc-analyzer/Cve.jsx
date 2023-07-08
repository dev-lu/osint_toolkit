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

import Github from "./services/multi/Github";
import NistNVD from "./services/cve/nist/NistNvd";

import { apiKeysState } from "../../App";
import NoApikeys from "./NoApikeys";

export default function Cve(props) {
  const theme = useTheme();
  const apiKeys = useRecoilValue(apiKeysState);

  function showResult() {
    if (!apiKeys.nist_nvd && !apiKeys.github) {
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
                  {apiKeys.nist_nvd ? (
                    <NistNVD cve={props.ioc} type="cve" />
                  ) : (
                    <></>
                  )}
                  {apiKeys.github ? (
                    <Github ioc={props.ioc} type="cve" />
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
