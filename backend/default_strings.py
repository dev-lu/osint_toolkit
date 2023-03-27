ai_assistant = dict(
    description="""
    AI Assistant allows you to use the power of ChatGPT.
    """
)

ai_assistant_la = dict(
    description="""### Log Analyzer can analyze log data with the powerful AI from OpenAI. Simply paste your logs here and click "Send to OpenAI".
\
Example:
```bash
127.0.0.1 - frank [10/Oct/2000:13:55:36 -0700] "GET /apache_pb.gif HTTP/1.0" 200 2326 "http://www.example.com/start.html" "Mozilla/4.08 [en] (Win98; I ;Nav)" 
```
    """
)

ai_assistant_pa = dict(
    description="""### Phishing Analyzer can analyze email texts with the AI from OpenAI. Simply paste your email body here and click "Send to OpenAI".
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
    description="""### Code Explainer can use the powerful AI of OpenAI to explain source code to you.
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
    description="""### Code Deobfuscator uses OpenAI to deobfuscate source code and extraxt possible IOCs for you.
\
Example:
```javascript
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('0("1, 2!");',3,3,'console|log|Hello|OSINT'.split('|'),0,{}));

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
  
      **Available IOCs you can analyze:**  
    - IP addresses -  
    - Domains -  
    - URLs -  
    - Email addresses -  
    - Hashes (md5, sha1, sha256) -  
    
    """
)

ioc_extractor = dict(
    description="""### IOC Extractor is a module that allows you to extract and organize indicators of compromise (IOCs) from unstructured files using regular expressions (Regex). The module automatically removes any duplicates, so you don't have to worry about sorting through the same IOCs multiple times. There are no complicated settings or features to worry about – just drop your file containing the IOCs into the tool and let it do the work for you. With a single click, you can analyze every detected IOC, saving you the time and effort of building Excel sheets to extract IOCs from files manually. Whether you are an experienced security professional or new to the field, IOC Extractor can help you quickly and easily identify potential threats to your organization. 
    """
)
