import React from "react";
import { useRecoilValue } from "recoil";

import ApiKeyInput from "./ApiKeyInput";
import { apiKeysState } from "../../App";

import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import PaidIcon from "@mui/icons-material/Paid";
import Stack from "@mui/material/Stack";
import useTheme from "@mui/material/styles/useTheme";

export default function ApiKeys() {
  const apiKeys = useRecoilValue(apiKeysState);
  const theme = useTheme();

  const cardStyle = {
    m: 1,
    p: 1.5,
    borderRadius: 5,
    backgroundColor: theme.palette.background.card,
    boxShadow: 0,
  };

  return (
    <>
      <Card sx={cardStyle}>
        <h2>API keys</h2>
        <p>
          In order to use the full potential of this tool, you have to generate
          quiete a lot of API keys.
        </p>
        <p>It is some initial work, but it is worth it.</p>
      </Card>
      {/* Abuseipdb */}
      <Card sx={cardStyle}>
        <Stack spacing={1}>
          <p>
            <b>AbuseIPDB</b>
          </p>
          <ApiKeyInput
            name="abuseipdb"
            description="ABUSE IPDB"
            link="https://www.abuseipdb.com/api"
            apiKeys={apiKeys}
          />
          <Stack direction="row" spacing={1}>
            <Chip label="IPv4" />
            <Chip label="IPv6" />
          </Stack>
        </Stack>
      </Card>
      <Card sx={cardStyle}>
        {/* Alienvault */}
        <Stack spacing={1}>
          <p>
            <b>Alienvault</b>
          </p>
          <ApiKeyInput
            name="alienvault"
            description="Alienvault"
            link="https://otx.alienvault.com/api"
            apiKeys={apiKeys}
          />
          <Stack direction="row" spacing={1}>
            <Chip label="IPv4" />
            <Chip label="IPv6" />
            <Chip label="Domains" />
            <Chip label="URLs" />
            <Chip label="Hashes" />
          </Stack>
        </Stack>
      </Card>
      <Card sx={cardStyle}>
        {/* Checkphish */}
        <Stack spacing={1}>
          <p>
            <b>Checkphish.ai</b>
          </p>
          <ApiKeyInput
            name="checkphishai"
            description="Checkphish"
            link="https://checkphish.ai/docs/checkphish-api/"
            apiKeys={apiKeys}
          />
          <Stack direction="row" spacing={1}>
            <Chip label="IPv4" />
            <Chip label="Domains" />
            <Chip label="URLs" />
          </Stack>
        </Stack>
      </Card>
      <Card sx={cardStyle}>
        {/* emailrep.io */}
        <Stack spacing={1}>
          <p>
            <b>Emailrep.io</b>
          </p>
          <ApiKeyInput
            name="emailrepio"
            description="emailrep.io"
            link="https://emailrep.io/key"
            apiKeys={apiKeys}
          />
          <Stack direction="row" spacing={1}>
            <Chip label="Email" />
          </Stack>
        </Stack>
      </Card>
      <Card sx={cardStyle}>
        {/* GitHub */}
        <Stack spacing={1}>
          <p>
            <b>GitHub</b>
          </p>
          <ApiKeyInput
            name="github"
            description="GitHub"
            link="https://docs.github.com/de/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens"
            apiKeys={apiKeys}
          />
          <Stack direction="row" spacing={1}>
            <Chip label="CVEs" />
            <Chip label="Domains" />
            <Chip label="Email" />
            <Chip label="Hashes" />
            <Chip label="IPv4" />
            <Chip label="IPv6" />
            <Chip label="URLs" />
          </Stack>
        </Stack>
      </Card>
      <Card sx={cardStyle}>
        {/* Google Safe Browsing */}
        <Stack spacing={1}>
          <p>
            <b>Google Safe Browsing</b>
          </p>
          <ApiKeyInput
            name="safebrowsing"
            description="Google Safe Browsing"
            link="https://developers.google.com/safe-browsing/v4/get-started"
            apiKeys={apiKeys}
          />
          <Stack direction="row" spacing={1}>
            <Chip label="Domains" />
            <Chip label="URLs" />
          </Stack>
        </Stack>
      </Card>
      <Card sx={cardStyle}>
        {/* IPQualityScore */}
        <Stack spacing={1}>
          <p>
            <b>IPQualityScore</b>
          </p>
          <ApiKeyInput
            name="ipqualityscore"
            description="IPQualityScore"
            link="https://www.ipqualityscore.com/documentation/overview"
            apiKeys={apiKeys}
          />
          <Stack direction="row" spacing={1}>
            <Chip label="IPv4" />
            <Chip label="IPv6" />
          </Stack>
        </Stack>
      </Card>
      <Card sx={cardStyle}>
        {/* HaveIBeenPWND */}
        <Stack spacing={1}>
          <Stack direction="row" alignItems="center">
            <PaidIcon sx={{ mr: 1 }} />
            <b> Have I Been Pwned</b>
          </Stack>
          <ApiKeyInput
            name="hibp"
            description="Have I Been Pwned"
            link="https://haveibeenpwned.com/API/v3#Authorisation"
            apiKeys={apiKeys}
          />
          <Stack direction="row" spacing={1}>
            <Chip label="Email" />
          </Stack>
        </Stack>
      </Card>
      <Card sx={cardStyle}>
        {/* Hunter */}
        <Stack spacing={1}>
          <p>
            <b>Hunter.io</b>
          </p>
          <ApiKeyInput
            name="hunterio"
            description="Hunter.io"
            link="https://hunter.io/api"
            apiKeys={apiKeys}
          />
          <Stack direction="row" spacing={1}>
            <Chip label="Email" />
          </Stack>
        </Stack>
      </Card>
      <Card sx={cardStyle}>
        {/* OpenAI */}
        <Stack spacing={1}>
          <p>
            <b>OpenAI</b>
          </p>
          <ApiKeyInput
            name="openai"
            description="OpenAI"
            link="https://platform.openai.com/account/api-keys"
            apiKeys={apiKeys}
          />
          <Stack direction="row" spacing={1}>
            <Chip label="For AI Assistant module" />
          </Stack>
        </Stack>
      </Card>
      <Card sx={cardStyle}>
        {/* Maltiverse */}
        <Stack spacing={1}>
          <p>
            <b>Maltiverse</b>
          </p>
          <ApiKeyInput
            name="maltiverse"
            description="Maltiverse"
            link="https://app.swaggerhub.com/apis-docs/maltiverse/api/1.1"
            apiKeys={apiKeys}
          />
          <Stack direction="row" spacing={1}>
            <Chip label="IPv4" />
            <Chip label="IPv6" />
            <Chip label="Domains" />
            <Chip label="URLs" />
            <Chip label="Hashes" />
          </Stack>
        </Stack>
      </Card>
      <Card sx={cardStyle}>
        {/* NIST NVD */}
        <Stack spacing={1}>
          <p>
            <b>NIST NVD</b>
          </p>
          <ApiKeyInput
            name="nist_nvd"
            description="NIST NVD"
            link="https://nvd.nist.gov/developers/request-an-api-key"
            apiKeys={apiKeys}
          />
          <Stack direction="row" spacing={1}>
            <Chip label="CVEs" />
          </Stack>
        </Stack>
      </Card>
      <Card sx={cardStyle}>
        {/* Pulsedive */}
        <Stack spacing={1}>
          <p>
            <b>Pulsedive</b>
          </p>
          <ApiKeyInput
            name="pulsedive"
            description="PulseDive"
            link="https://pulsedive.com/api/"
            apiKeys={apiKeys}
          />
          <Stack direction="row" spacing={1}>
            <Chip label="IPv4" />
            <Chip label="IPv6" />
            <Chip label="Domains" />
            <Chip label="URLs" />
            <Chip label="Hashes" />
          </Stack>
        </Stack>
      </Card>
      <Card sx={cardStyle}>
        {/* Reddit */}
        <Stack spacing={1}>
          <p>
            <b>Reddit</b>
          </p>
          <ApiKeyInput
            name="reddit_cid"
            description="Reddit client ID"
            link="https://www.reddit.com/dev/api/"
            apiKeys={apiKeys}
          />
          <ApiKeyInput
            name="reddit_cs"
            description="Reddit client secret"
            link="https://www.reddit.com/dev/api/"
            apiKeys={apiKeys}
          />
          <Stack direction="row" spacing={1}>
            <Chip label="IPv4" />
            <Chip label="IPv6" />
            <Chip label="Domains" />
            <Chip label="URLs" />
            <Chip label="Hashes" />
            <Chip label="Email" />
          </Stack>
        </Stack>
      </Card>
      <Card sx={cardStyle}>
        {/* Shodan */}
        <Stack spacing={1}>
          <p>
            <b>Shodan</b>
          </p>
          <ApiKeyInput
            name="shodan"
            description="Shodan"
            link="https://developer.shodan.io/api/requirements"
            apiKeys={apiKeys}
          />
          <Stack direction="row" spacing={1}>
            <Chip label="IPv4" />
            <Chip label="IPv6" />
            <Chip label="Domains" />
            <Chip label="URLs" />
          </Stack>
        </Stack>
      </Card>
      <Card sx={cardStyle}>
        {/* ThreatFox */}
        <Stack spacing={1}>
          <p>
            <b>ThreatFox</b>
          </p>
          <ApiKeyInput
            name="threatfox"
            description="ThreatFox"
            link="https://threatfox.abuse.ch/api/"
            apiKeys={apiKeys}
          />
          <Stack direction="row" spacing={1}>
            <Chip label="IPv4" />
            <Chip label="IPv6" />
            <Chip label="Domains" />
            <Chip label="URLs" />
            <Chip label="Hashes" />
          </Stack>
        </Stack>
      </Card>
      <Card sx={cardStyle}>
        {/* Twitter */}
        <Stack spacing={1}>
          <p>
            <b>Twitter bearer | </b>IPv4, IPv6, Domains, URLs, Hashes, Email
          </p>
          <ApiKeyInput
            name="twitter_bearer"
            description="Twitter"
            link="https://developer.twitter.com/en/docs"
            apiKeys={apiKeys}
          />
          <Stack direction="row" spacing={1}>
            <Chip label="IPv4" />
            <Chip label="IPv6" />
            <Chip label="Domains" />
            <Chip label="URLs" />
            <Chip label="Hashes" />
            <Chip label="Email" />
          </Stack>
        </Stack>
      </Card>
      <Card sx={cardStyle}>
        {/* URLScan */}
        <Stack spacing={1}>
          <p>
            <b>URLScan</b>
          </p>
          <ApiKeyInput
            name="urlscan"
            description="urlscan.io"
            link="https://urlscan.io/docs/api/"
            apiKeys={apiKeys}
          />
          <Stack direction="row" spacing={1}>
            <Chip label="Domains" />
            <Chip label="URLs" />
          </Stack>
        </Stack>
      </Card>
      {/*
      <Card sx={cardStyle}>
        <p>
          <b>Mastodon.social bearer | </b>IPv4, IPv6, Domains, URLs, Hashes,
          Email
        </p>
        <ApiKeyInput
          name="mastodon_bearer"
          description="Mastodon"
          link="https://mastodon.social/settings/applications/"
          apiKeys={apiKeys}
        />
      </Card>
      */}
      <Card sx={cardStyle}>
        {/* Virustotal */}
        <Stack spacing={1}>
          <p>
            <b>Virustotal</b>
          </p>
          <ApiKeyInput
            name="virustotal"
            description="Virustotal"
            link="https://developers.virustotal.com/reference/overview"
            apiKeys={apiKeys}
          />
          <Stack direction="row" spacing={1}>
            <Chip label="IPv4" />
            <Chip label="Domains" />
            <Chip label="URLs" />
            <Chip label="Hashes" />
          </Stack>
        </Stack>
      </Card>
    </>
  );
}
