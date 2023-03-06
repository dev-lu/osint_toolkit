import React from "react";
import { atom, useSetRecoilState, useRecoilValue } from "recoil";
import axios from "axios";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialOceanic } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";

import { apiKeysState } from '../../App';
import Introduction from "../Introduction";
import NoApikeys from "../ioc-analyzer/NoApikeys";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Grow from "@mui/material/Grow";
import { LinearProgress } from "@mui/material";
import PropTypes from "prop-types";
import Stack from "@mui/material/Stack";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TextField from "@mui/material/TextField";


export const aiassistantTabIndex = atom({
  key: "AiassistantTabIndexState",
  default: 0,
});

export default function AiAssistant() {
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState(null);
  const [buttonClicked, setButtonClicked] = React.useState(false);
  const apiKeys = useRecoilValue(apiKeysState);

  const cardStyle = {
    m: 1,
    p: 2,
    borderRadius: 5,
    backgroundColor: "white",
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
        const response = await axios.post(
          "http://localhost:8000/api/aiassistant/" + endpoint,
          { input: input }
        );
        setResult(response.data.analysis_result);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    }
  }

  function showResult(answer) {
    return (
      <>
        <Grow in={true}>
          <Card
            sx={{
              m: 2,
              p: 3,
              borderRadius: 5,
              backgroundColor: "aliceblue",
              boxShadow: 0,
            }}
          >
            <h2>Analysis Result</h2>
            <ReactMarkdown
              children={answer.toString()}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter
                      children={String(children).replace(/\n$/, "")}
                      style={materialOceanic}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    />
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            />
          </Card>
        </Grow>
      </>
    );
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
          <Card sx={cardStyle}>
            <TextField
              id="aiassistant_la-input-textfield"
              label="Paste logs here"
              fullWidth
              multiline
              rows={10}
            />
            <Stack spacing={2} justifyContent="center">
              <Button
                variant="contained"
                color="primary"
                align="center"
                disableElevation
                size="large"
                type="submit"
                sx={{ borderRadius: 5, mt: 2, ml: 1 }}
                onClick={() =>
                  callOpenAI(
                    document.getElementById("aiassistant_la-input-textfield")
                      .value,
                    "loganalysis"
                  )
                }
              >
                <Stack spacing={2} justifyContent="center">
                  Send logs to OpenAI
                  {loading ? <LinearProgress color="inherit" /> : null}
                </Stack>
              </Button>
            </Stack>
          </Card>

          {!apiKeys.openai && buttonClicked ? <><NoApikeys /></> : result ? (
            showResult(result)
          ) : (
            <Introduction moduleName="AI Assistant LA" />
          )}
        </Stack>
      </AiassistantTabPanel>
      <AiassistantTabPanel value={tabIndex} index={1}>
        <Stack>
          <Card sx={cardStyle}>
            <TextField
              id="aiassistant_pa-input-textfield"
              label="Paste email body here"
              fullWidth
              multiline
              rows={10}
            />
            <Stack spacing={2} justifyContent="center">
              <Button
                variant="contained"
                color="primary"
                align="center"
                disableElevation
                size="large"
                type="submit"
                sx={{ borderRadius: 5, mt: 2, ml: 1 }}
                onClick={() => 
                  callOpenAI(
                    document.getElementById("aiassistant_pa-input-textfield")
                      .value,
                    "mailanalysis"
                  )
                }
              >
                <Stack spacing={2} justifyContent="center">
                  Send email text to OpenAI
                  {loading ? <LinearProgress color="inherit" /> : null}
                </Stack>
              </Button>
            </Stack>
          </Card>

          {!apiKeys.openai && buttonClicked ? <><NoApikeys /></> : result ? (
            showResult(result)
          ) : (
            <Introduction moduleName="AI Assistant PA" />
          )}
        </Stack>
      </AiassistantTabPanel>
      <AiassistantTabPanel value={tabIndex} index={2}>
        <Stack>
          <Card sx={cardStyle}>
            <TextField
              id="aiassistant_ce-input-textfield"
              label="Paste code snippet here"
              fullWidth
              multiline
              rows={10}
            />
            <Stack spacing={2} justifyContent="center">
              <Button
                variant="contained"
                color="primary"
                align="center"
                disableElevation
                size="large"
                type="submit"
                sx={{ borderRadius: 5, mt: 2, ml: 1 }}
                onClick={() =>
                  callOpenAI(
                    document.getElementById("aiassistant_ce-input-textfield")
                      .value,
                    "codeexpert"
                  )
                }
              >
                <Stack spacing={2} justifyContent="center">
                  Send code snippet to OpenAI
                  {loading ? <LinearProgress color="inherit" /> : null}
                </Stack>
              </Button>
            </Stack>
          </Card>

          {!apiKeys.openai && buttonClicked ? <><NoApikeys /></> : result ? (
            showResult(result)
          ) : (
            <Introduction moduleName="AI Assistant CE" />
          )}
        </Stack>
      </AiassistantTabPanel>
      <AiassistantTabPanel value={tabIndex} index={3}>
        <Stack>
          <Card sx={cardStyle}>
            <TextField
              id="aiassistant_cdo-input-textfield"
              label="Paste code snippet here"
              fullWidth
              multiline
              rows={10}
            />
            <Stack spacing={2} justifyContent="center">
              <Button
                variant="contained"
                color="primary"
                align="center"
                disableElevation
                size="large"
                type="submit"
                sx={{ borderRadius: 5, mt: 2, ml: 1 }}
                onClick={() =>
                  callOpenAI(
                    document.getElementById("aiassistant_cdo-input-textfield")
                      .value,
                    "codeexpert"
                  )
                }
              >
                <Stack spacing={2} justifyContent="center">
                  Send code snippet to OpenAI
                  {loading ? <LinearProgress color="inherit" /> : null}
                </Stack>
              </Button>
            </Stack>
          </Card>

          {!apiKeys.openai && buttonClicked ? <><NoApikeys /></> : result ? (
            showResult(result)
          ) : (
            <Introduction moduleName="AI Assistant CDO" />
          )}
        </Stack>
      </AiassistantTabPanel>
    </>
  );
}
