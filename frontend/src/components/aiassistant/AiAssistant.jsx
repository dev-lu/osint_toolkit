import React from "react";
import { useRecoilValue } from "recoil";
import api from "../../api";
import { apiKeysState } from '../../state';
import InputCard from "./InputCard";
import Introduction from "../Introduction";
import NoApikeys from "../ioc-analyzer/NoApikeys";
import ResultCard from "./ResultCard";
import CreateTemplate from "./CreateTemplate";
import UseTemplate from "./UseTemplate";

import Stack from "@mui/material/Stack";
import useTheme from "@mui/material/styles/useTheme";

import { Routes, Route, Navigate } from "react-router-dom";

export default function AiAssistant() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="templates" replace />} />
      <Route path="create-template" element={<CreateTemplate />} />
      <Route path="templates" element={<UseTemplate />} />
      <Route path="log-analysis" element={<LogAnalysis />} />
      <Route path="phishing-check" element={<PhishingCheck />} />
      <Route path="code-explain" element={<CodeExplain />} />
      <Route path="code-deobfuscate" element={<CodeDeobfuscate />} />
      <Route path="incident-review" element={<IncidentReview />} />
      <Route path="config-analysis" element={<ConfigAnalysis />} />
      <Route path="patchnote-review" element={<PatchnoteReview />} />
      <Route path="access-control-check" element={<AccessControlCheck />} />
      <Route path="*" element={<div>Sub-Module Not Found</div>} />
    </Routes>
  );
}


function LogAnalysis() {
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState(null);
  const [buttonClicked, setButtonClicked] = React.useState(false);
  const apiKeys = useRecoilValue(apiKeysState);
  const theme = useTheme();

  const cardStyle = {
    m: 1,
    p: 2,
    borderRadius: 1,
    backgroundColor: theme.palette.background.textfieldlarge,
    boxShadow: 0,
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
    <Stack sx={{ mt: 2 }}>
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
  );
}

function PhishingCheck() {
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
    <Stack sx={{ mt: 2 }}>
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
  );
}

function CodeExplain() {
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
    <Stack sx={{ mt: 2 }}>
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
  );
}

function CodeDeobfuscate() {
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
    <Stack sx={{ mt: 2 }}>
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
  );
}

function IncidentReview() {
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
    <Stack sx={{ mt: 2 }}>
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
  );
}

function ConfigAnalysis() {
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
    <Stack sx={{ mt: 2 }}>
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
  );
}

function PatchnoteReview() {
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
    <Stack sx={{ mt: 2 }}>
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
  );
}

function AccessControlCheck() {
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
    <Stack sx={{ mt: 2 }}>
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
  );
}
