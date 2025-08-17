![ost_logo](https://user-images.githubusercontent.com/44299200/210261186-1f0486a7-79e8-41b6-85f1-9e69915123aa.png)

# OSINT Toolkit
> **Warning**
> OSINT Toolkit is not production ready yet. This is an early prototype, that still needs some work to be done. 
## A fullstack web application built for security analysts

OSINT Toolkit is a self-hostable, on-demand analysis platform designed for security specialists. It consolidates various security tools into a single, easy-to-use environment, streamlining everyday tasks. Optimized for single-user operation, OSINT Toolkit runs locally in a Docker container and is not intended for long-term data storage or management. Instead, it focuses on accelerating daily workflows, such as news aggregation and analysis, IOC and email investigations, and the creation of threat detection rules. To further enhance efficiency, OSINT Toolkit integrates generative AI capabilities, providing additional support for analysis and decision-making. 


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
The Newsfeed module keeps you up to date about the latest cybersecurity news by aggregating articles from trusted sources such as Wired, The Hacker News, Security Magazine, Threatpost, TechCrunch Security, and Dark Reading. Stay up-to-date with industry trends and potential threats without having to visit multiple websites or subscribe to numerous newsletters. The module extracts IOCs automatically from the news articles and lets you analyze news in no time using AI.
<img width="1679" height="1084" alt="newsfeed" src="https://github.com/user-attachments/assets/0c23cc14-4a1a-4c34-9fb8-5064a0f23889" />


### IOC Tools
The IOC Tools module helps you analyze different types of indicators of compromise (IOCs) such as IP addresses, hashes, email addresses, domains, and URLs. It leverages services like VirusTotal, AlienVault, AbuseIPDB, and social media platforms like Reddit and Twitter to gather information about the IOCs. The module automatically detects the type of IOC being analyzed and utilizes the appropriate services to provide relevant information, enabling you to identify potential threats and take necessary actions to protect your organization. Analysis can be done individual per IOC or in bulk. Also fanging and defanging is possible for sharing IOCs safely.
<img width="1679" height="1102" alt="ioc_lookup" src="https://github.com/user-attachments/assets/40b1e656-ba6c-4f36-b8dd-beee0dca3fdd" />


### Email Analyzer
The Email Analyzer module allows you to analyze .eml files for potential threats. Simply drag and drop an .eml file into the module, and it will parse the file, perform basic security checks, extract indicators of compromise (IOCs), and analyze messages with the help of AI. Analyze the IOCs using various open-source intelligence (OSINT) services, and enhance your organization's email security.


### Domain Finder
The Domain Finder module helps you to protect your organization from phishing attacks by searching for recently registered domains that match specific patterns. By utilizing the URLScan.io API, you can view screenshots of websites associated with domains without visiting them directly. Additionally, you can check each domain and its resolved IP against multiple threat intelligence services, further enhancing your organization's security.


### AI Templates
The AI Templates module provides powerful AI-based solutions for log data analysis, email text analysis, and source code explanation. It lets you create templates for AI tasks and supports you in the prompt engineering process.
<img width="1679" height="1102" alt="ai_templates" src="https://github.com/user-attachments/assets/42c52c8c-7d2d-4b70-b25c-666d6993832c" />


### CVSS Calculator
The CVSS Calculator module allows you to calculate the CVSS 3.1 score of a vulnerability and export the calculation as a markdown or JSON file.


### Detection Rules
The Detection Rules module is a GUI for creating Sigma, Yara and Snort/Suricate rules.



## Deploy with docker
1. Download the repository and extract the files
2. Navigate to the directory where the `docker-compose.yaml` file is located
3. Run the following command: `docker-compose up -d`
4. Once the container is running, you can access the application in your browser at http://localhost:4000
