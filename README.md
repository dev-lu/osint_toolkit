![ost_logo](https://user-images.githubusercontent.com/44299200/210261186-1f0486a7-79e8-41b6-85f1-9e69915123aa.png)

# OSINT Toolkit
> **Warning**
> OSINT Toolkit is not production ready yet. This is an early prototype, that still needs some work to be done. 
## A fullstack web application built for security analysts

https://github.com/dev-lu/osint_toolkit/assets/44299200/1d9b16db-cadd-45b8-8e0e-a0d36afbbb48

OSINT Toolkit is a full-stack web application designed to assist security analysts in their work. It combines various functions and services into a single tool, making it easier for analysts to identify potential threats and stay updated with the latest developments in the field of cybersecurity.

* [Integrated services](#integrated-services)
* [Features](#features)
  * [Newsfeed](#features)
  * [Email Analyzer](#features)
  * [IOC Analyzer](#ioc-analyzer)
  * [IOC Extractor](#ioc-extractor)
  * [Domain Monitoring](#domain-monitoring)
  * [AI Assistant](#ai-assistant)
  * [CVSS Calculator](#cvss-calculator)
  * [GUI to create Sigma rules](#rules)
  * [Customizability](#customizable)
* [Planned features](#planned-features-for-later-versions)
* [Deploy with Docker](#deploy-with-docker)
* [Deploy from source](#deploy-from-source)

## Integrated services
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

## Features
### Newsfeed
The Newsfeed module keeps you informed about the latest cybersecurity news by aggregating articles from trusted sources such as Wired, The Hacker News, Security Magazine, Threatpost, TechCrunch Security, and Dark Reading. Stay up-to-date with industry trends and potential threats without having to visit multiple websites or subscribe to numerous newsletters.
![227624764-ebfc69b5-8a02-4967-af19-2c1196732ffa](https://github.com/dev-lu/osint_toolkit/assets/44299200/8ec3edd0-31e3-41b9-b2c5-049627cd9e53)

### IOC Analyzer
The IOC Analyzer module helps you analyze different types of indicators of compromise (IOCs) such as IP addresses, hashes, email addresses, domains, and URLs. It leverages services like VirusTotal, AlienVault, AbuseIPDB, and social media platforms like Reddit and Twitter to gather information about the IOCs. The module automatically detects the type of IOC being analyzed and utilizes the appropriate services to provide relevant information, enabling you to identify potential threats and take necessary actions to protect your organization.
![ioc_analyzer](https://github.com/dev-lu/osint_toolkit/assets/44299200/6ceee92b-ecbe-4a4e-8fb0-9b0866939488)

### Email Analyzer
The Email Analyzer module allows you to analyze .eml files for potential threats. Simply drag and drop an .eml file into the module, and it will parse the file, perform basic security checks, extract indicators of compromise (IOCs), and analyze messages with the help of AI. Analyze the IOCs using various open-source intelligence (OSINT) services, and enhance your organization's email security.
![ema](https://github.com/dev-lu/osint_toolkit/assets/44299200/4f4c8a5b-348a-4db8-a5f5-15ebc4f2ea87)

### IOC Extractor
The IOC Extractor module allows you to extract and organize IOCs from unstructured files using regular expressions (Regex). It automatically removes duplicates, saving you the effort of sorting through the same IOCs multiple times. Simply drop your file containing the IOCs into the tool, and analyze each detected IOC with a single click.
![ioce](https://github.com/dev-lu/osint_toolkit/assets/44299200/db3072cb-a358-4fa1-81d2-bec8273d7c54)

### Domain monitoring
The Domain Monitoring module helps you protect your organization from phishing attacks by searching for recently registered domains that match specific patterns. By utilizing the URLScan.io API, you can view screenshots of websites associated with domains without visiting them directly. Additionally, you can check each domain and its resolved IP against multiple threat intelligence services, further enhancing your organization's security.
![dm](https://github.com/dev-lu/osint_toolkit/assets/44299200/e71c2b38-219c-4e7c-aebb-8df5da06bbfb)

### AI Assistant
The AI Assistant module provides powerful AI-based solutions for log data analysis, email text analysis, and source code explanation. Leveraging advanced AI algorithms from OpenAI, it helps security experts respond quickly and effectively to potential security threats, protecting their networks and maintaining system integrity.
<img width="1227" alt="aia" src="https://user-images.githubusercontent.com/44299200/223217940-8a8d1d61-5d74-4fd0-b8b2-d7d1198660cf.png">

### CVSS Calculator
The CVSS Calculator module allows you to calculate the CVSS 3.1 score of a vulnerability and export the calculation as a markdown or JSON file.
![cvss_calc](https://github.com/dev-lu/osint_toolkit/assets/44299200/6700a805-8698-445e-9cfc-e404370f58c0)

### Rules
The Rules module is a GUI for creating Sigma rules.
![rules](https://github.com/dev-lu/osint_toolkit/assets/44299200/2422f5f2-7623-4c81-bd29-0ef3fff80067)



### Customizable
Customize the descriptions of each module with your own markdown-formatted text. Disable any modules that are not needed, and they will not be shown. Tailor the toolkit to your specific requirements.
<img width="1233" alt="settings" src="https://user-images.githubusercontent.com/44299200/223217991-1bd45aee-a8ea-4bfc-a3fa-1723fee75c73.png">

## Planned features for later versions
- Add more OSINT services
- Generate hashes from files to analyse them in a privacy-friendly way.
- Export reports
- Save history and generate statistics
- Metadata viewer

## Deploy with docker
1. Download the repository and extract the files
2. Navigate to the directory where the `docker-compose.yaml` file is located
3. If you deploy the app on a remote machine, set the `BACKEND_URL` argument in the Compose file to the remote machines IP address
4. Run the following command: `docker-compose up -d`
5. Once the container is running, you can access the app in your browser at http://localhost:3000

## Deploy from source
### Prerequisites
- Python 3.10 or higher
- Pip (Python package installer)
- Node.js 17 or higher with NPM
- Port 3000 and 8000 available

### Backend
#### Windows
1. Install Python requirements: `py -m pip install -r requirements.txt`
2. Start the backend: `py -m uvicorn main:app`

#### Linux / MacOS
1. Install Python requirements: `pip install -r requirements.txt`
2. Start the backend: `uvicorn main:app`

### Frontend
1. Install required packages: `npm install`
2. Start frontend: `npm start`
3. Access the app in your browser at http://localhost:3000
