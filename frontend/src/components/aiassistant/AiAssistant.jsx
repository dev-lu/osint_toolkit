import React from "react";
import { atom, useSetRecoilState, useRecoilValue } from "recoil";
import api from "../../api";
import { apiKeysState } from "../../App";
import InputCard from "./InputCard";
import Introduction from "../Introduction";
import NoApikeys from "../ioc-analyzer/NoApikeys";
import ResultCard from "./ResultCard";

import PropTypes from "prop-types";
import Stack from "@mui/material/Stack";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import useTheme from "@mui/material/styles/useTheme";

export const aiassistantTabIndex = atom({
  key: "AiassistantTabIndexState",
  default: 0,
});

export default function AiAssistant() {
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState(null);
  const [buttonClicked, setButtonClicked] = React.useState(false);
  const apiKeys = useRecoilValue(apiKeysState);
  const theme = useTheme();

  const cardStyle = {
    m: 1,
    p: 2,
    borderRadius: 5,
    backgroundColor: theme.palette.background.textfieldlarge,
    boxShadow: 0,
  };

  function AiassistantTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`aiassistant-tabpanel-${index}`}
        key={`aiassistant-tabpanel-${index}`}
        aria-labelledby={`aiassistant-tab-${index}`}
        {...other}
      >
        {value === index && <div>{children}</div>}
      </div>
    );
  }

  AiassistantTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  const tabIndex = useRecoilValue(aiassistantTabIndex);
  const setTabIndex = useSetRecoilState(aiassistantTabIndex);
  const handleTabIndexChange = (event, newIndex) => {
    setTabIndex(newIndex);
    setResult(null);
  };

  async function callOpenAI(input, endpoint) {
    if (!apiKeys.openai) {
      setButtonClicked(true);
    } else {
      setLoading(true);
      try {
        const response = await api.post("/api/aiassistant/" + endpoint, {
          input: input,
        });
        setResult(response.data.analysis_result);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    }
  }

  return (
    <>
      <Tabs
        value={tabIndex}
        onChange={handleTabIndexChange}
        orientation="vertical"
        sx={{
          float: "left",
          '.MuiTabs-indicator': {
            left: 0,
          },
        }}
      >
        <Tab label="Log Analysis" sx={{ alignSelf: 'start', padding: '8px 16px', minHeight: 'auto' }} />
        <Tab label="Phishing Check" sx={{ alignSelf: 'start', padding: '8px 16px', minHeight: 'auto' }} />
        <Tab label="Code Explain" sx={{ alignSelf: 'start', padding: '8px 16px', minHeight: 'auto' }} />
        <Tab label="Code Deobfuscate" sx={{ alignSelf: 'start', padding: '8px 16px', minHeight: 'auto' }} />
        <Tab label="Incident Review" sx={{ alignSelf: 'start', padding: '8px 16px', minHeight: 'auto' }} />
        <Tab label="Config Analysis" sx={{ alignSelf: 'start', padding: '8px 16px', minHeight: 'auto' }} />
        <Tab label="Patchnote Review" sx={{ alignSelf: 'start', padding: '8px 16px', minHeight: 'auto' }} />
        <Tab label="Access Control Check" sx={{ alignSelf: 'start', padding: '8px 16px', minHeight: 'auto' }} />
      </Tabs>
      <AiassistantTabPanel value={tabIndex} index={0} >
        <Stack sx={{mt: 2}}>
          <InputCard
            inputId="aiassistant_la-input-textfield"
            inputLabel="Paste logs here"
            buttonLabel="logs"
            callType="loganalysis"
            callOpenAI={callOpenAI}
            loading={loading}
            cardStyle={cardStyle}
            apiKeys={apiKeys}
            buttonClicked={buttonClicked}
            result={result}
            NoApikeys={NoApikeys}
            ResultCard={ResultCard}
            Introduction={Introduction}
            moduleName="AI Assistant LA"
          />
        </Stack>
      </AiassistantTabPanel>
      <AiassistantTabPanel value={tabIndex} index={1}>
        <Stack sx={{mt: 2}}>
          <InputCard
            inputId="aiassistant_pa-input-textfield"
            inputLabel="Paste email body here"
            buttonLabel="email body"
            callType="mailanalysis"
            callOpenAI={callOpenAI}
            loading={loading}
            cardStyle={cardStyle}
            apiKeys={apiKeys}
            buttonClicked={buttonClicked}
            result={result}
            NoApikeys={NoApikeys}
            ResultCard={ResultCard}
            Introduction={Introduction}
            moduleName="AI Assistant PA"
          />
        </Stack>
      </AiassistantTabPanel>
      <AiassistantTabPanel value={tabIndex} index={2}>
        <Stack sx={{mt: 2}}>
          <InputCard
            inputId="aiassistant_ce-input-textfield"
            inputLabel="Paste code snippet here"
            buttonLabel="code snippet"
            callType="codeexpert"
            callOpenAI={callOpenAI}
            loading={loading}
            cardStyle={cardStyle}
            apiKeys={apiKeys}
            buttonClicked={buttonClicked}
            result={result}
            NoApikeys={NoApikeys}
            ResultCard={ResultCard}
            Introduction={Introduction}
            moduleName="AI Assistant CE"
          />
        </Stack>
      </AiassistantTabPanel>
      <AiassistantTabPanel value={tabIndex} index={3}>
        <Stack sx={{mt: 2}}>
          <InputCard
            inputId="aiassistant_cdo-input-textfield"
            inputLabel="Paste code snippet here"
            buttonLabel="code snippet"
            callType="deobfuscator"
            callOpenAI={callOpenAI}
            loading={loading}
            cardStyle={cardStyle}
            apiKeys={apiKeys}
            buttonClicked={buttonClicked}
            result={result}
            NoApikeys={NoApikeys}
            ResultCard={ResultCard}
            Introduction={Introduction}
            moduleName="AI Assistant CDO"
          />
        </Stack>
      </AiassistantTabPanel>
      <AiassistantTabPanel value={tabIndex} index={4}>
        <Stack sx={{mt: 2}}>
          <InputCard
            inputId="aiassistant_inca-input-textfield"
            inputLabel="Paste incident text here"
            buttonLabel="incident text"
            callType="incidentreport"
            callOpenAI={callOpenAI}
            loading={loading}
            cardStyle={cardStyle}
            apiKeys={apiKeys}
            buttonClicked={buttonClicked}
            result={result}
            NoApikeys={NoApikeys}
            ResultCard={ResultCard}
            Introduction={Introduction}
            moduleName="AI Assistant INCA"
          />
        </Stack>
      </AiassistantTabPanel>
      <AiassistantTabPanel value={tabIndex} index={5}>
        <Stack sx={{mt: 2}}>
          <InputCard
            inputId="aiassistant_confreview-input-textfield"
            inputLabel="Paste config text here"
            buttonLabel="config text"
            callType="configreview"
            callOpenAI={callOpenAI}
            loading={loading}
            cardStyle={cardStyle}
            apiKeys={apiKeys}
            buttonClicked={buttonClicked}
            result={result}
            NoApikeys={NoApikeys}
            ResultCard={ResultCard}
            Introduction={Introduction}
            moduleName="AI Assistant CONFREVIEW"
          />
        </Stack>
      </AiassistantTabPanel>
      <AiassistantTabPanel value={tabIndex} index={6}>
        <Stack sx={{mt: 2}}>
          <InputCard
            inputId="aiassistant_patchnotes-input-textfield"
            inputLabel="Paste patch notes here"
            buttonLabel="patch notes"
            callType="patchanalysis"
            callOpenAI={callOpenAI}
            loading={loading}
            cardStyle={cardStyle}
            apiKeys={apiKeys}
            buttonClicked={buttonClicked}
            result={result}
            NoApikeys={NoApikeys}
            ResultCard={ResultCard}
            Introduction={Introduction}
            moduleName="AI Assistant PATCHNOTES"
          />
        </Stack>
      </AiassistantTabPanel>
      <AiassistantTabPanel value={tabIndex} index={7}>
        <Stack sx={{mt: 2}}>
          <InputCard
            inputId="aiassistant_acreview-input-textfield"
            inputLabel="Paste access control list here"
            buttonLabel="access control list"
            callType="accesscontrol"
            callOpenAI={callOpenAI}
            loading={loading}
            cardStyle={cardStyle}
            apiKeys={apiKeys}
            buttonClicked={buttonClicked}
            result={result}
            NoApikeys={NoApikeys}
            ResultCard={ResultCard}
            Introduction={Introduction}
            moduleName="AI Assistant ACREVIEW"
          />
        </Stack>
      </AiassistantTabPanel>
    </>
  );
}
