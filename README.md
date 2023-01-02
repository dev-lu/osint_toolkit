<img width="75" alt="ost_logo" src="https://user-images.githubusercontent.com/44299200/210260672-64ba7627-746b-4613-8f1e-0e35a921a9ee.png">
# OSINT Toolkit
## A fullstack web application for security analysts
OSINT Toolkit is a web application designed to make the life of security analysts easier by combining many functions and services into a single tool. Written in React and FastAPI, the toolkit provides a range of features to help you identify potential threats and stay informed about the latest developments in the field of cyber security. With OSINT Toolkit, you can analyze indicators of compromise (IOCs) such as IP addresses, hashes, email addresses, domains, and URLs using services like VirusTotal, AlienVault, and AbuseIPDB, as well as social media platforms like Twitter. You can also search for recently registered domains that match a specific pattern, view screenshots of websites to see what is behind them, check domains and IPs against threat intelligence services, extract and organize IOCs from unstructured files, and stay up to date on the latest cyber security news. All of these features are designed to help you save time and effort while protecting your organization from potential threats and staying informed about the latest developments in the field of cyber security.
Currently the tool is at a very early stage and has only basic functionality. Since I continue to develop the app on the side when I have some spare time, I can not predict when a first usable version will be available. I plan to release a stable version in Q1 2023.

OSINT Toolkit is currently in the development stage and is expected to be published in Q1 2023. The toolkit will undergo tasks such as code refactoring, bug fixing, and error handling before the first stable version is released.

Below you can see a demo of the current state. The app already has a responsive design and can be used on both desktop and mobile devices. Nonetheless it is at a very early stage and not ready for production.

## Features
### Newsfeed
Newsfeed is a tool that keeps you up to date on the latest cyber security news by aggregating articles from trusted sources such as Wired, The Hacker News, Security Magazine, Threatpost, TechCrunch Security, and Dark Reading. With Newsfeed, you can stay informed about the latest developments in the world of cyber security without having to visit multiple websites or subscribe to multiple newsletters. Whether you are a security professional looking to stay current on industry trends or just want to stay informed about potential threats to your personal online security, Newsfeed is a valuable resource.
<img width="982" alt="otk_newsfeed" src="https://user-images.githubusercontent.com/44299200/210260604-24afc9f9-a8c8-436a-bd16-c632d6331575.png">

### IOC Analyzer
Aioc analyzer is a tool that helps you analyze various types of indicators of compromise (IOCs), including IP addresses, hashes, email addresses, domains, and URLs. It uses a variety of services, such as VirusTotal, AlienVault, and AbuseIPDB, as well as social media platforms like Twitter, to gather information about the IOCs you are interested in. The tool is able to automatically detect the type of IOC you are analyzing and uses the appropriate services to gather the most relevant information. This can help you identify potential threats and take the necessary steps to protect your organization from cyber attacks.
![otk_ioc-analyzer](https://user-images.githubusercontent.com/44299200/210260634-290b961e-d56a-40de-b2b5-c901d4aadd8c.png)

### IOC Extractor
IOC Extractor is a simple and straightforward tool that allows you to extract and organize indicators of compromise (IOCs) from unstructured files using regular expressions (Regex). The tool automatically removes any duplicates, so you don't have to worry about sorting through the same IOCs multiple times. There are no complicated settings or features to worry about – just drop your file containing the IOCs into the tool and let it do the work for you. With a single click, you can analyze every detected IOC, saving you the time and effort of building Excel sheets to extract IOCs from files manually. Whether you are an experienced security professional or new to the field, IOC Extractor can help you quickly and easily identify potential threats to your organization.
![ost_ioc-extractor](https://user-images.githubusercontent.com/44299200/210260767-50921812-cd0d-4b4f-8a8f-bcc48f710c2b.png)

### Email Analyzer
Email Analyzer is a tool that allows you to analyze .eml files for potential threats. To use the tool, simply drag an .eml file into it. The tool will then parse the file and perform basic security checks to identify any potential risks. It also extracts all indicators of compromise (IOCs) from the file and makes it possible to analyze them using various open source intelligence (OSINT) services. In addition, Email Analyzer generates hash values for every attachment in the file, allowing you to perform a privacy-friendly analysis of these files. This can help you protect your organization from cyber attacks and other threats that may come through email.
![ost_email-analyzer](https://user-images.githubusercontent.com/44299200/210260918-1cbb819a-7b6f-42ec-8ca7-110e52b05a65.png)

### Domain monitoring
Domain Monitoring is a tool that helps you protect your organization from phishing attacks by allowing you to search for recently registered domains that match a specific pattern. This can help you identify potential threats before they occur. Using the URLScan.io API, the tool allows you to view screenshots of websites to see what is behind a domain without the need to visit the site and potentially expose yourself to danger. Additionally, with just a single click, you can check each domain and the IP it resolves to against multiple threat intelligence services to further protect your organization. For example, you can use the tool to search for domains that start with "google-" by using the search pattern "google-*".
![ost_domain-monitoring](https://user-images.githubusercontent.com/44299200/210261015-78bd8ccf-7797-45b5-98b4-faee76997477.png)

## Planned features for later versions
- Metadata viewer
- Generate hashes of files to analyse them in a privacy-friendly way.
- View and analyse PCAP files
- Export reports
- Save history and generate statistics

## Deploy from source
### Backend
#### Windows
```py -m uvicorn main:app --reload```

### Frontend
#### Linux
```uvicorn main:app --reload```

#### frontend
```npm start```
