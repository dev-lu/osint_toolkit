import React, { useEffect } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { Box, Typography } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import GeneralInformation from "./GeneralInformation";
import References from "./References";
import Tags from "./Tags";
import Logsource from "./Logsource";
import Detection from "./Detection";
import Fields from "./Fields";
import Falsepositives from "./Falsepositives";
import Export from "./Export";
import { RuleIdAtom } from "./SigmaAtom";

export default function Sigma() {
  const setRuleId = useSetRecoilState(RuleIdAtom);
  const ruleId = useRecoilValue(RuleIdAtom);

  useEffect(() => {
    ruleId === "" && setRuleId(uuidv4);
  }, []);

  return (
    <>
      <Typography variant="h5" gutterBottom mt={2}>
        Create new Sigma Rule
      </Typography>
      <Typography variant="h7" gutterBottom mb={2}>
        ID: {ruleId}
      </Typography>

      <GeneralInformation />

      <References />

      <Tags />

      <Logsource />

      <Detection />

      <Fields />

      <Falsepositives />

      <Box display="flex" justifyContent="center">
        <Export />
      </Box>
    </>
  );
}
