ai_assistant = dict(
    description="""
    I Assistant allows you to leverage the power of OpenAI's advanced GPT models. These cutting-edge large language models (LLMs) are designed to provide intelligent, context-aware responses, helping you with a wide range of tasks. 
    """
)

ai_assistant_la = dict(
    description="""### Log Analysis uses AI to interpret and analyze log data. Paste your logs into the input field and click "Send to OpenAI" to start the analysis.
\
Example:
```bash
127.0.0.1 - frank [10/Oct/2000:13:55:36 -0700] "GET /apache_pb.gif HTTP/1.0" 200 2326 "http://www.example.com/start.html" "Mozilla/4.08 [en] (Win98; I ;Nav)" 
```
    """
)

ai_assistant_pa = dict(
    description="""### Phishing Check uses AI to scrutinize email texts for potential phishing content. Paste the body of the email into the provided text box and click "Send to OpenAI".
\
Example:
> REQUEST FOR ASSISTANCE-STRICTLY CONFIDENTIAL  
> I am Dr. Bakare Tunde, the cousin of Nigerian Astronaut, Air Force Major Abacha Tunde. 
> He was the first African in space when he made a secret flight to the Salyut 6 space station in 1979. 
> He was on a later Soviet spaceflight, Soyuz T-16Z to the secret Soviet military space station Salyut 8T in 1989. 
> He was stranded there in 1990 when the Soviet Union was dissolved. 
> His other Soviet crew members returned to earth on the Soyuz T-16Z, but his place was taken up by return cargo. 
> There have been occasional Progrez supply flights to keep him going since that time. He is in good humor, but wants to come home.
    
    """
)

ai_assistant_ce = dict(
    description="""### Code Explain utilizes the advanced AI capabilities of OpenAI to provide detailed explanations of source code. Simply input your code, and the AI will help you understand its functionality.
\
Example:
```c
// Your First C++ Program

#include <iostream>

int main() {
    std::cout << "Hello World!";
    return 0;
}
```
    """
)

ai_assistant_cdo = dict(
    description="""### Code Deobfuscate uses AI to deobfuscate source code and extract possible Indicators of Compromise (IOCs). Simply paste your obfuscated code to get started.
\
Example:
```javascript
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('0("1, 2!");',3,3,'console|log|Hello|OSINT'.split('|'),0,{}));

```
    """
)

ai_assistant_inca = dict(
    description="""### Incident Review allows users to review detailed incident reports and generate comprehensive summaries.
\
Example:
```markdown
Date of Incident: May 20, 2024

Reported By: John Doe, IT Security Analyst

Summary
On May 20, 2024, at approximately 10:00 AM, an unauthorized access attempt was detected on the company’s primary database server. The intrusion was identified through anomalous activity alerts triggered by the Security Information and Event Management (SIEM) system.

Details
Description of the Incident
At 10:00 AM, the SIEM system flagged multiple failed login attempts to the database server from an external IP address (192.168.1.100). Following the failed attempts, a successful login was recorded using an administrative account.

Impact
Data Accessed: Customer records including names, addresses, and email addresses.
Systems Affected: Primary database server (DB1).
Downtime: No downtime reported, but increased server load was observed during the incident.
Actions Taken
Initial Response:

The compromised administrative account was immediately disabled.
Network access for the external IP address was blocked.
Investigation:

Log files were reviewed to trace the source and method of intrusion.
Affected systems were isolated for further analysis.
Mitigation:

All administrative passwords were reset.
Multi-Factor Authentication (MFA) was enforced for all administrative accounts.
Additional network monitoring was implemented to detect any further suspicious activity.
Resolution
The incident was resolved by 1:00 PM on the same day. No further unauthorized access attempts have been detected. A thorough security audit is scheduled to ensure all potential vulnerabilities are addressed.

Recommendations
Enhance Monitoring: Implement continuous monitoring and advanced threat detection systems.
User Training: Conduct regular security awareness training for employees.
Policy Review: Review and update the company’s security policies and incident response plan.
Conclusion
The prompt detection and response to the security incident minimized potential damage. Continued vigilance and proactive security measures are essential to protect the organization from future threats.
```
    """
)

ai_assistant_confreview = dict(
    description="""### Config Analysis enables users to analyze configuration files for security misconfigurations or violations of best practices.
\
Example:
```markdown
[server]
port = 8080
host = 0.0.0.0

[security]
password_min_length = 6
password_complexity = false

[logging]
enable_logging = false

[firewall]
allow_inbound = *
```
    """
)

ai_assistant_patchnotes = dict(
    description="""### Patchnote Review helps users evaluate patch notes or update descriptions for key security improvements or fixes. 
\
Example:
```markdown
Patch Notes - Version 1.2.3

Security Improvements
- Fixed a critical vulnerability (CVE-2024-1234) that allowed remote code execution.
- Updated encryption algorithms to more secure versions.
- Enhanced user authentication by adding support for multi-factor authentication (MFA).

Bug Fixes
- Resolved issue causing application crashes on startup.
- Improved performance of database queries.
```
    """
)

ai_assistant_acreview = dict(
    description="""### Access Control Check allows users to analyze access control lists (ACL) or permissions settings.
\
Example:
```markdown
[user:admin]
permissions = read, write, execute

[user:guest]
permissions = read

[user:inactive_user]
permissions = read, write

[role:developer]
permissions = read, write, execute
```
    """
)

domain_monitoring = dict(
    description="""### Domain Monitoring is a module that helps you protect your organization from phishing attacks by allowing you to search for recently registered domains that match a specific pattern. This can help you identify potential threats before they occur. Using the URLScan.io API, the module allows you to view screenshots of websites to see what is behind a domain without the need to visit the site and potentially expose yourself to danger. Additionally, with just a single click, you can check each domain and the IP it resolves to against multiple threat intelligence services to further protect your organization. 

```bash
For example, you can use the module to search for domains that start with "google-" by using the search pattern "google-*". 
```
    """
)

email_analyzer = dict(
    description="""### Email Analyzer is a module that allows you to analyze .eml files for potential threats. To use the module, simply drag an .eml file into it. The module will then parse the file and perform basic security checks to identify any potential risks. It also extracts all indicators of compromise (IOCs) from the file and makes it possible to analyze them using various open source intelligence (OSINT) services. In addition, Email Analyzer generates hash values for every attachment in the file, allowing you to perform a privacy-friendly analysis of these files. This can help you protect your organization from cyber attacks and other threats that may come through email. 
    """
)

ioc_analyzer = dict(
    description="""### IOC Analyzer is a module that helps you analyze various types of indicators of compromise (IOCs), including IP addresses, hashes, email addresses, domains, and URLs. It uses a variety of services, such as VirusTotal, AlienVault, and AbuseIPDB, as well as social media platforms like Twitter, to gather information about the IOCs you are interested in. The tool is able to automatically detect the type of IOC you are analyzing and uses the appropriate services to gather the most relevant information. This can help you identify potential threats and take the necessary steps to protect your organization from cyber attacks.  
\
**Available IOCs you can analyze:**  
    - IP addresses -  
    - Domains -  
    - URLs -  
    - Email addresses -  
    - Hashes (md5, sha1, sha256) -  
    - CVEs -  
    
     
    
    """
)

ioc_extractor = dict(
    description="""### IOC Extractor is a module that allows you to extract and organize indicators of compromise (IOCs) from unstructured files using regular expressions (Regex). The module automatically removes any duplicates, so you don't have to worry about sorting through the same IOCs multiple times. There are no complicated settings or features to worry about – just drop your file containing the IOCs into the tool and let it do the work for you. With a single click, you can analyze every detected IOC, saving you the time and effort of building Excel sheets to extract IOCs from files manually. Whether you are an experienced security professional or new to the field, IOC Extractor can help you quickly and easily identify potential threats to your organization. 
    """
)
