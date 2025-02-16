import React from 'react'
import api from '../../api';
import { useRecoilValue } from "recoil";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialOceanic } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";

import { apiKeysState } from '../../state';

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import { LinearProgress } from "@mui/material";
import Grow from "@mui/material/Grow";
import Stack from "@mui/material/Stack";
import useTheme from "@mui/material/styles/useTheme";


export default function ShowOpenAiAnswer(props) {
    const [loading, setLoading] = React.useState(false);
    const [result, setResult] = React.useState(null);
    const apiKeys = useRecoilValue(apiKeysState);
    const theme = useTheme();

    async function callOpenAI(input, endpoint) {
        setLoading(true);
        try {
          const response = await api.post(
            "/api/aiassistant/" + endpoint,
            { input: input }
          );
          setResult(response.data.analysis_result);
          
        } catch (error) {
          console.error(error);
        }
        setLoading(false);
    }
    
      function showResult(answer) {
        return (
          <>
            <Grow in={true}>
              <Card
                sx={{
                  m: 2,
                  p: 2,
                  borderRadius: 1,
                  boxShadow: 0,
                  textAlign: "left",
                }}
                key="openai_answer_card"
              >
                <h3>OpenAI message-body analysis:</h3>
                <br />
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
    <> {
      !apiKeys.openai ? null : <Button
      variant="contained"
      disableElevation
      size="small"
      onClick={() => callOpenAI(props.input, "mailanalysis")}
    >
      <Stack spacing={2}>
        Analyze message body with OpenAI
        {loading ? <LinearProgress color="inherit" /> : null}
      </Stack>
    </Button>
    }
      
      {result ? (showResult(result)) : null}
    </>
  )
}
