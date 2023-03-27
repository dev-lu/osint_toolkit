import React from "react";

import Card from "@mui/material/Card";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import Stack from "@mui/material/Stack";
import useTheme from "@mui/material/styles/useTheme";

import liberapay from './images/donate_liberapay.png';
import kofi from './images/donate_kofi.png';
import patreon from './images/donate_patreon.png';


export default function About() {
  const theme = useTheme();
  const cardStyle = {
    m: 1,
    p: 2,
    borderRadius: 5,
    backgroundColor: theme.palette.background.card,
    boxShadow: 0,
  };

  return (
    <>
      {/* Version card */}
      <Card sx={cardStyle}>
        <h2>About - OSINT Toolkit v0.1 (beta)</h2>
        <p>
          OSINT Toolkit is a web application designed to make the life of
          security analysts easier by combining many functions and services into
          a single tool. Written in React and FastAPI, the toolkit provides a
          range of features to help you identify potential threats and stay
          informed about the latest developments in the field of cyber security.
          With OSINT Toolkit, you can analyze indicators of compromise (IOCs)
          such as IP addresses, hashes, email addresses, domains, and URLs using
          services like VirusTotal, AlienVault, and AbuseIPDB, as well as social
          media platforms like Twitter. You can also search for recently
          registered domains that match a specific pattern, view screenshots of
          websites to see what is behind them, check domains and IPs against
          threat intelligence services, extract and organize IOCs from
          unstructured files, and stay up to date on the latest cyber security
          news. All of these features are designed to help you save time and
          effort while protecting your organization from potential threats and
          staying informed about the latest developments in the field of cyber
          security.
        </p>
        <p>
          The name OSINT Toolkit is a temporary name. The name may be changed in
          the future.
        </p>
      </Card>

      {/* Made by card */}
      <Card sx={cardStyle}>
        <h2>Made by Lars Ursprung</h2>
        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
          <GitHubIcon />
          <p>https://github.com/dev-lu</p>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
          <LinkedInIcon />
          <p>https://linkedin.com/in/lars-ursprung</p>
        </Stack>
      </Card>

      {/* Donate card */}
      <Card sx={cardStyle}>
        <h2>Donate to support the development</h2>
        <p>
          If you want to support the development of OSINT Toolkit, you can donate using
          a service of your choice.
        </p>
        <br />
        <Stack direction="row" spacing={4} sx={{ mb: 1 }}>
          <a href="https://liberapay.com/Dev-LU/donate" target="_blank" rel="noreferrer">
            <img
              alt="Donate using Liberapay"
              height={60}
              src={liberapay}
            />
          </a>
          <a href="https://ko-fi.com/devlu" target="_blank" rel="noreferrer">
            <img
              alt="Donate using Ko-fi"
              height={60}
              src={kofi}
            />
          </a>
          <a href="https://patreon.com/devlu" target="_blank" rel="noreferrer">
            <img
              alt="Donate using Patreon"
              height={60}
              src={patreon}
            />
          </a>
        </Stack>
      </Card>
    </>
  );
}
