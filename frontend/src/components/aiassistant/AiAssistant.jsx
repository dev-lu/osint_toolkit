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
        style={{ float: "left" }}
      >
        <Tab label="Log Analyzer" />
        <Tab label="Phishing Analyzer" />
        <Tab label="Code Expert" />
        <Tab label="Code Deobfuscator" />
      </Tabs>
      <AiassistantTabPanel value={tabIndex} index={0}>
        <Stack>
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
        <Stack>
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
        <Stack>
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
        <Stack>
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
    </>
  );
}
