import React from "react";
import { useRecoilValue } from "recoil";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialOceanic } from "react-syntax-highlighter/dist/esm/styles/prism";
import { modulesState, generalSettingsState } from '../state';

function Introduction(props) {
  const modules = useRecoilValue(modulesState);
  const generalSettings = useRecoilValue(generalSettingsState);
  const { moduleName, centerText } = props;
  const isDarkMode = generalSettings.darkmode;

  const contentClass = `${isDarkMode ? 'markdown-content dark-mode' : 'markdown-content light-mode'} ${centerText ? 'center-text' : ''}`;

  return (
    <div className="markdown-container">
      <div className={contentClass}>
        <ReactMarkdown
          children={
            modules[moduleName]
              ? modules[moduleName].description.toString()
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
      </div>
    </div>
  );
}

export default Introduction;
