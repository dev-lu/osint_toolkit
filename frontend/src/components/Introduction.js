import React from "react";
import { useRecoilValue } from "recoil";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialOceanic } from "react-syntax-highlighter/dist/esm/styles/prism";
import Card from "@mui/material/Card";
import { modulesState } from "../App";


function Introduction(props) {
  const modules = useRecoilValue(modulesState);
  return (
    <>
      <br></br>
      <Card elevation={0} align="center">
        <ReactMarkdown
          children={
            modules[props.moduleName]
              ? modules[props.moduleName].description.toString()
              : ""
          }
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
    </>
  );
}

export default Introduction;
