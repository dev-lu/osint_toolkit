![ost_logo](https://user-images.githubusercontent.com/44299200/210261186-1f0486a7-79e8-41b6-85f1-9e69915123aa.png)

# OSINT Toolkit

> **Warning**
> OSINT Toolkit is not production ready yet. This is an early prototype that still needs additional work and testing.

## A fullstack web application built for security analysts

OSINT Toolkit is a self-hostable, on-demand analysis platform designed for security specialists. It consolidates various security tools into a single, easy-to-use environment, streamlining everyday tasks. Optimized for single-user operation, OSINT Toolkit runs locally in a Docker container and is not intended for long-term data storage or management. Instead, it focuses on accelerating daily workflows, such as news aggregation and analysis, IOC and email investigations, and the creation of threat detection rules. To further enhance efficiency, OSINT Toolkit integrates generative AI capabilities, providing additional support for analysis and decision-making.

---

# Integrated services

| IPs            | Domains       | URLs                 | Emails           | Hashes     | CVEs     |
|----------------|---------------|----------------------|------------------|------------|----------|
| AbuseIPDB      | Alienvault    | Alienvault           | Emailrep.io      | Alienvault | GitHub   |
| Alienvault     | Checkphish.ai | Checkphish.ai        | GitHub           | GitHub     | NIST NVD |
| Checkphish.ai  | GitHub        | GitHub               | Hunter.io        | Maltiverse |          |
| CrowdSec       | Maltiverse    | Google Safe Browsing | Have I Been Pwnd | Pulsedive  |          |
| GitHub         | Pulsedive     | Maltiverse           | Reddit           | Reddit     |          |
| IPQualityScore | Shodan        | Pulsedive            | Twitter          | ThreatFox  |          |
| Maltiverse     | ThreatFox     | Shodan               |                  | Twitter    |          |
| Pulsedive      | Reddit        | ThreatFox            |                  | Virustotal |          |
| Shodan         | Twitter       | Reddit               |                  |            |          |
| Reddit         | URLScan       | Twitter              |                  |            |          |
| ThreatFox      | Virustotal    | URLScan              |                  |            |          |
| Twitter        |               | Virustotal           |                  |            |          |
| Virustotal     |               |                      |                  |            |          |

---

# Features

## Newsfeed

The Newsfeed module keeps you up to date with the latest cybersecurity news by aggregating articles from trusted sources such as Wired, The Hacker News, Security Magazine, Threatpost, TechCrunch Security, and Dark Reading.

Stay informed about industry trends and emerging threats without visiting multiple websites or subscribing to endless newsletters like it’s still 2009.

The module automatically extracts IOCs from news articles and supports AI-assisted analysis.

<img width="1679" height="1084" alt="newsfeed" src="https://github.com/user-attachments/assets/0c23cc14-4a1a-4c34-9fb8-5064a0f23889" />

---

## IOC Tools

The IOC Tools module helps analyze different types of indicators of compromise (IOCs) such as:

- IP addresses
- Hashes
- Email addresses
- Domains
- URLs

It leverages services like VirusTotal, AlienVault, AbuseIPDB, Reddit, Twitter, and others to gather intelligence about suspicious indicators.

The module automatically detects the IOC type and queries the relevant services. Analysis can be performed individually or in bulk. Fanging and defanging functionality is also included for safe IOC sharing.

<img width="1679" height="1102" alt="ioc_lookup" src="https://github.com/user-attachments/assets/40b1e656-ba6c-4f36-b8dd-beee0dca3fdd" />

---

## Email Analyzer

The Email Analyzer module allows you to analyze `.eml` files for potential threats.

Simply drag and drop an email file into the application and the module will:

- Parse the email
- Perform security checks
- Extract IOCs
- Analyze content using AI

The extracted indicators can then be investigated through integrated OSINT services.

---

## Domain Finder

The Domain Finder module helps identify potentially malicious or phishing-related domains by searching for newly registered domains matching specific patterns.

Using the URLScan.io API, the module can display screenshots of suspicious websites without requiring direct visits.

Domains and resolved IP addresses can also be checked against multiple threat intelligence services.

---

## AI Templates

The AI Templates module provides reusable AI-powered workflows for:

- Log analysis
- Email analysis
- Source code explanation
- Threat hunting assistance

Templates support custom prompts and simplify prompt engineering workflows.

<img width="1679" height="1102" alt="ai_templates" src="https://github.com/user-attachments/assets/42c52c8c-7d2d-4b70-b25c-666d6993832c" />

---

## CVSS Calculator

The CVSS Calculator module allows you to calculate CVSS 3.1 vulnerability scores and export the results as:

- Markdown
- JSON

---

## Detection Rules

The Detection Rules module provides a GUI for creating and managing:

- Sigma rules
- YARA rules
- Snort/Suricata rules

---

# Installation

OSINT Toolkit can be run either with Docker or locally without Docker.

---

# Deploy with Docker

## 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/osint_toolkit.git
cd osint_toolkit
```

## 2. Start the containers

```bash
docker-compose up -d
```

## 3. Access the application

Open:

```text
http://localhost:4000
```

## Database migrations

If the database schema changed, run:

```bash
docker compose run --rm backend alembic upgrade head
```

---

# Local installation

## Requirements

Install the following software:

- Python 3.12
- uv
- Node.js 20+
- npm

---

## 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/osint_toolkit.git
cd osint_toolkit
```

---

## 2. Install backend dependencies

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
uv sync
```

---

## 3. Configure environment variables

Create a `.env` file inside the `backend` directory.

If an example file exists:

### Windows

```powershell
copy .env.example .env
```

### Linux/macOS

```bash
cp .env.example .env
```

Edit the `.env` file and configure your API keys and application settings.

---

## 4. Run database migrations

From the `backend` directory:

```bash
uv run alembic upgrade head
```

---

## 5. Start the backend server

```bash
uv run uvicorn main:app --reload
```

If your FastAPI application is located elsewhere:

```bash
uv run uvicorn app.main:app --reload
```

Backend URL:

```text
http://localhost:8000
```

---

## 6. Install frontend dependencies

Open a second terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

---

## 7. Start the frontend

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:4000
```

or the URL shown in the terminal.

---

# Windows Notes

## Install uv

If `uv` is not recognized:

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

Restart the terminal afterward because Windows enjoys pretending environment variables are optional suggestions.

---

## Verify Python version

```bash
python --version
```

Expected:

```text
Python 3.12.x
```

---

## Common FastAPI startup examples

```bash
uv run uvicorn main:app --reload
```

```bash
uv run uvicorn app.main:app --reload
```

```bash
uv run uvicorn src.main:app --reload
```

Use the path where your FastAPI `app` object is actually defined.

---

# License

OSINT Toolkit is licensed under the [GNU Affero General Public License v3.0](LICENSE).

You are free to use, modify, and distribute this software, provided that any modified versions or hosted services built on it are also made available under AGPL-3.0, including when offered as a network service.

---

# Commercial Licensing

If AGPL-3.0 does not fit your use case, for example if you want to integrate OSINT Toolkit into a proprietary product or offer it as a managed service without open-sourcing your modifications, a commercial license is available.

Contact:

```text
contact@osint-toolkit.com
```

---

# Prior Versions

Versions up to and including `v0.1.0` were released under the MIT License and remain available under those terms.
