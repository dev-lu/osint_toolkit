import React from 'react';
import Card from '@mui/material/Card';
import Grow from '@mui/material/Grow';
import { useTheme } from '@mui/material/styles';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialOceanic } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ResultCard = ({ answer }) => {
  const theme = useTheme();
  const displayAnswer = answer ? answer.toString() : "Could not get answer";

  return (
    <Grow in={true}>
      <Card
        sx={{
          m: 2,
          p: 3,
          borderRadius: 5,
          backgroundColor: theme.palette.background.card,
          '& h2': {
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: theme.palette.text.primary,
          },
          '& p': {
            fontSize: '1rem',
            lineHeight: '1.6',
            color: theme.palette.text.secondary,
          },
          '& code': {
            fontSize: '0.875rem',
            backgroundColor: theme.palette.action.hover,
            padding: '0.2rem 0.4rem',
            borderRadius: '4px',
            color: theme.palette.text.secondary,
          },
          '& ol, & ul': {
            paddingLeft: '1.5rem',
            '& li': {
              marginBottom: '0.5rem',
            },
          },
          '& ol li': {
            listStyleType: 'decimal',
          },
          '& ul li': {
            listStyleType: 'disc',
          },
          '& ul ul': {
            paddingLeft: '1.5rem',
            listStyleType: 'circle',
          },
          '& ol ol': {
            paddingLeft: '1.5rem',
            listStyleType: 'lower-roman',
          },
        }}
      >
        <h2>Analysis Result</h2>
        <ReactMarkdown
          children={displayAnswer}
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
  );
};

export default ResultCard;
