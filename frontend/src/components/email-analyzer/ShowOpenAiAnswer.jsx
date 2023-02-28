import React from 'react'
import axios from "axios";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialOceanic } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import { LinearProgress } from "@mui/material";
import Grow from "@mui/material/Grow";
import Stack from "@mui/material/Stack";


export default function ShowOpenAiAnswer(props) {
    const [loading, setLoading] = React.useState(false);
    const [result, setResult] = React.useState(null);

    async function callOpenAI(input, endpoint) {
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
                <h3>OpenAI message body analysis:</h3>
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
    <Button
          variant="contained"
          disableElevation
          size="small"
          onClick={() => callOpenAI(props.input, "mailanalysis")}
        >
            <Stack spacing={2} justifyContent="center">
                Analyze message body with OpenAI
                {loading ? <LinearProgress color="inherit" /> : null}
            </Stack>
        </Button>
        {result ? (showResult(result)) : null}
    </>
  )
}
