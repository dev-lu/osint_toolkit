import React from "react";
import { useRecoilValue } from "recoil";

import ApiKeyInput from "./ApiKeyInput";
import { apiKeysState } from "../../state";

import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import PaidIcon from "@mui/icons-material/Paid";
import Stack from "@mui/material/Stack";
import { Tooltip, Typography } from "@mui/material";
import useTheme from "@mui/material/styles/useTheme";

export default function ApiKeys() {
  const apiKeys = useRecoilValue(apiKeysState);
  const theme = useTheme();

  const cardStyle = {
    m: 1,
    p: 1.5,
    borderRadius: 1,
    backgroundColor: theme.palette.background.card,
    boxShadow: 0,
  };

  return (
    <>
      <Card sx={cardStyle}>
      <Typography variant="h5">
      API keys
      </Typography>
        <Typography>
          In order to use the full potential of this tool, you have to generate
          quiete a lot of API keys.
        </Typography>
        <Typography>It is some initial work, but it is worth it.</Typography>
      </Card>
      {/* Abuseipdb */}
      <Card sx={cardStyle}>
        <Stack spacing={2}>
          <Typography variant="h6" component="div">
            AbuseIPDB
          </Typography>
          <Typography variant="body2" color="text.secondary">
            AbuseIPDB is a project managed by Marathon Studios Inc. Our mission
            is to help make Web safer by providing a central repository for
            webmasters, system administrators, and other interested parties to
            report and identify IP addresses that have been associated with
            malicious activity online. We're committed to keeping AbuseIPDB
            fast, available and free for all of our users and contributors.
          </Typography>
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
          <Typography variant="h6">
          Alienvault
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Open Threat Exchange is the neighborhood watch of the global
            intelligence community. It enables private companies, independent
            security researchers, and government agencies to openly collaborate
            and share the latest information about emerging threats, attack
            methods, and malicious actors, promoting greater security across the
            entire community.
          </Typography>
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
          <Typography variant="h6">
          Checkphish.ai
          </Typography>
          <Typography variant="body2" color="text.secondary">
            CheckPhish is a FREE tool designed to safeguard your web and email
            domains against typosquatting attacks. With its powerful features of
            domain monitoring, email link protection, and a phishing scanner,
            you get one place that delivers protection against typosquats, all
            for free!
          </Typography>
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
        {/* CrowdSec */}
        <Stack spacing={1}>
          <Typography variant="h6">
            CrowdSec
          </Typography>
          <Typography variant="body2" color="text.secondary">
            CrowdSec Cyber Threat Intelligence is the largest and most diverse
            CTI network on earth, delivering key contextualized and curated
            benchmarking insights from real users across the globe.
          </Typography>
          <ApiKeyInput
            name="crowdsec"
            description="CrowdSec"
            link="https://app.crowdsec.net/settings/api-keys"
            apiKeys={apiKeys}
          />
          <Stack direction="row" spacing={1}>
            <Chip label="IPv4" />
          </Stack>
        </Stack>
      </Card>
      <Card sx={cardStyle}>
        {/* emailrep.io */}
        <Stack spacing={1}>
        <Typography variant="h6">
          Emailrep.io
        </Typography>
          <Typography variant="body2" color="text.secondary">
            EmailRep uses hundreds of factors like domain age, traffic rankings,
            presence on social media sites, professional networking sites,
            personal connections, public records, deliverability, data breaches,
            dark web credential leaks, phishing emails, threat actor emails, and
            more to answer these types of questions: Is this email risky? Is
            this a throwaway account? What kind of online presence does this
            email have? Is this a trustworthy sender?
          </Typography>
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
          <Typography variant="h6">
            GitHub
          </Typography>
          <Typography variant="body2" color="text.secondary">
          GitHub is a developer platform that allows developers to create, store, manage and share their code. It uses Git software, providing the distributed version control of Git plus access control, bug tracking, software feature requests, task management, continuous integration, and wikis for every project. 
          </Typography>
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
          <Typography variant="h6">
            Google Safe Browsing
          </Typography>
          <Typography variant="body2" color="text.secondary">
          Google Safe Browsing helps protect over five billion devices every day by showing warnings to users when they attempt to navigate to dangerous sites or download dangerous files. Safe Browsing also notifies webmasters when their websites are compromised by malicious actors and helps them diagnose and resolve the problem so that their visitors stay safer. Safe Browsing protections work across Google products and power safer browsing experiences across the Internet.
          </Typography>
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
          <Typography variant="h6">
            IPQualityScore
          </Typography>
          <Typography variant="body2" color="text.secondary">
          At IPQS, we're dedicated to enhancing businesses' fraud prevention and security efforts. Our goal is simple. To provide instant, impactful protection that safeguards you and your customers. With advanced tools, we measure various risk signals, helping your business to stay ahead of any threats.
          </Typography>
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
            <Tooltip title="Paid service">
              <PaidIcon sx={{ mr: 1 }} />
            </Tooltip>
            <Typography variant="h6">
              Have I Been Pwned
            </Typography>
            <Typography variant="body2" color="text.secondary">
            Have I Been Pwned allows you to search across multiple data breaches to see if your email address or phone number has been compromised.
            </Typography>
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
          <Typography variant="h6">
            Hunter.io
          </Typography>
          <Typography variant="body2" color="text.secondary">
          Hunter was created by Antoine Finkelstein and François Grante in 2015. Freshly graduated, they saw the untapped potential of cold emails and wanted to address the challenges of prospecting and finding contact information. To achieve great success rate while complying with privacy regulations, they decided to use emails found on the public web. Email Hunter was born.

Soon rebranded as Hunter, the tool quickly became a game-changer in business intelligence. Within weeks, it attracted thousands of users thanks to its user-friendly interface, handy browser extension, affordable pricing, and data accuracy. Unlike its peers, Hunter aimed not at large enterprises but at making cold emailing accessible to all.

Over time, Hunter grew into a comprehensive email outreach platform, offering everything from finding contact information to sending cold emails. Antoine and François, with a focused team, continued to empower professionals with simple, powerful tools.
          </Typography>
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
          <Typography variant="h6">
            OpenAI
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Provides access to large language models.
          </Typography>
          <ApiKeyInput
            name="openai"
            description="OpenAI"
            link="https://platform.openai.com/account/api-keys"
            apiKeys={apiKeys}
          />
          <Stack direction="row" spacing={1}>
            <Chip label="For AI features" />
          </Stack>
        </Stack>
      </Card>
      <Card sx={cardStyle}>
        {/* Maltiverse */}
        <Stack spacing={1}>
          <Typography variant="h6">
            Maltiverse
          </Typography>
          <Typography variant="body2" color="text.secondary">
          Maltiverse works as a broker for Threat intelligence sources that are aggregated from more than a hundred different Public, Private and Community sources. Once the data is ingested, the IoC Scoring Algorithm applies a qualitative classification to the IoC that changes. Finally this data can be queried in a Threat Intelligence feed that can be delivered to your Firewalls, SOAR, SIEM, EDR or any other technology.
          </Typography>
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
          <Typography variant="h6">
            NIST NVD
          </Typography>
          <Typography variant="body2" color="text.secondary">
          The NVD is the U.S. government repository of standards based vulnerability management data represented using the Security Content Automation Protocol (SCAP).
          </Typography>
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
          <Typography variant="h6">
            Pulsedive
          </Typography>
          <Typography variant="body2" color="text.secondary">
          Pulsedive is a free threat intelligence platform. Search, scan, and enrich IPs, URLs, domains and other IOCs from OSINT feeds or submit your own.
          </Typography>
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
          <Typography variant="h6">
            Reddit
          </Typography>
          <Typography variant="body2" color="text.secondary">
          Reddit is a network of communities where people can dive into their interests, hobbies and passions. There's a community for whatever you're interested in ...
          </Typography>
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
          <Typography variant="h6">
            Shodan
          </Typography>
          <Typography variant="body2" color="text.secondary">
          Shodan is the world's first search engine for Internet-connected devices. Discover how Internet intelligence can help you make better decisions.
          </Typography>
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
          <Typography variant="h6">
            ThreatFox
          </Typography>
          <Typography variant="body2" color="text.secondary">
          ThreatFox is a project of abuse.ch with the goal of sharing indicators of compromise (IOCs)
          </Typography>
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
          <Typography variant="h6">
            Twitter bearer
          </Typography>
          <Typography variant="body2" color="text.secondary">
          From breaking news and entertainment to sports and politics, get the full story with all the live commentary.
          </Typography>
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
          <Typography variant="h6">
            URLScan
          </Typography>
          <Typography variant="body2" color="text.secondary">
          urlscan.io - Website scanner for suspicious and malicious URLs.
          </Typography>
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
      <Card sx={cardStyle}>
        {/* Virustotal */}
        <Stack spacing={1}>
        <Typography variant="h6">
          Virustotal
        </Typography>
          <Typography variant="body2" color="text.secondary">
          VirusTotal inspects items with over 70 antivirus scanners and URL/domain blocklisting services, in addition to a myriad of tools to extract signals from the studied content. Any user can select a file from their computer using their browser and send it to VirusTotal. VirusTotal offers a number of file submission methods, including the primary public web interface, desktop uploaders, browser extensions and a programmatic API.
          </Typography>
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
