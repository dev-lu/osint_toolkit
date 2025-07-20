import React from "react";

import Card from "@mui/material/Card";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import Stack from "@mui/material/Stack";
import { useTheme } from '@mui/material/styles';

import liberapay from "./images/donate_liberapay.png";
import kofi from "./images/donate_kofi.png";
import patreon from "./images/donate_patreon.png";

export default function About() {
  const theme = useTheme();
  const cardStyle = {
    m: 1,
    p: 2,
    borderRadius: 1,
    backgroundColor: theme.palette.background.card,
    boxShadow: 0,
  };

  return (
    <>
      <Card sx={cardStyle}>
        <h2>About - OSINT Toolkit v0.1 (beta)</h2>
        <p>
          OSINT Toolkit is a self-hostable, on-demand analysis platform designed
          for security specialists. It consolidates various security tools into
          a single, easy-to-use environment, streamlining everyday investigative
          tasks. Optimized for single-user operation, OSINT Toolkit runs locally
          in a Docker container and is not intended for long-term data storage
          or management. Instead, it focuses on accelerating daily workflows,
          such as news aggregation and analysis, IOC and email investigations,
          and the creation of threat detection rules. To further enhance
          efficiency, OSINT Toolkit integrates generative AI capabilities,
          providing additional support for analysis and decision-making. Beyond
          its practical applications, the project also serves as a personal
          playground for experimenting with new technologies and automation
          possibilities — potentially laying the foundation for a future
          commercial cloud platform.
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
          If you want to support the development of OSINT Toolkit, you can
          donate using a service of your choice.
        </p>
        <br />
        <Stack direction="row" spacing={4} sx={{ mb: 1 }}>
          <a
            href="https://liberapay.com/Dev-LU/donate"
            target="_blank"
            rel="noreferrer"
          >
            <img alt="Donate using Liberapay" height={60} src={liberapay} />
          </a>
          <a href="https://ko-fi.com/devlu" target="_blank" rel="noreferrer">
            <img alt="Donate using Ko-fi" height={60} src={kofi} />
          </a>
          <a href="https://patreon.com/devlu" target="_blank" rel="noreferrer">
            <img alt="Donate using Patreon" height={60} src={patreon} />
          </a>
        </Stack>
      </Card>
    </>
  );
}
