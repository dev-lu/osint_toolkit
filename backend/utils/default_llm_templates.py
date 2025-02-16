DEFAULT_TEMPLATES = [
    {
        "title": "Security Patch Note Analysis",
        "description": "Analyze the patch notes and highlight key security updates.",
        "example_input_output": "**Input:** Patch notes here...\n\n**Output:** Security updates found: ...",
        "ai_agent_role": "You are an experienced security engineer specialized in analyzing patch notes.",
        "ai_agent_task": "Analyze the following patch notes to identify and report on key security improvements and fixes. Use the <field_name> tags where appropriate.",
        "payload_fields": [
            {"name": "patch_notes", "description": "The patch notes to analyze", "required": True}
        ],
        "is_public": True,
    },
    {
        "title": "Log Analysis",
        "description": "Log Analysis uses AI to interpret and analyze log data. Paste your logs into the input field and click \"Send to OpenAI\" to start the analysis.",
        "example_input_output": "**Input:**\n```\n127.0.0.1 - frank [10/Oct/2000:13:55:36 -0700] \"GET /apache_pb.gif HTTP/1.0\" 200 2326 \"http://www.example.com/start.html\" \"Mozilla/4.08 [en] (Win98; I ;Nav)\"\n```\n\n**Output:**\n- **Summary:** The log shows a standard GET request from IP `127.0.0.1` by user `frank` on [10/Oct/2000:13:55:36 -0700]. The HTTP response code `200` indicates a successful request. The request size is 2326 bytes. No obvious anomalies were detected.",
        "ai_agent_role": "You are an experienced cybersecurity analyst with expertise in log analysis. You provide clear, detailed insights into log data to help identify potential security issues or anomalies.",
        "ai_agent_task": "Analyze the following log data. Provide a comprehensive summary including details such as IP address, user information, request method, response status, and any potential anomalies or suspicious activity.",
        "payload_fields": [
          {
            "name": "logs",
            "description": "Paste your log data here for analysis.",
            "required": True
          }
        ],
        "is_public": True
      },
{
  "title": "Phishing Check",
  "description": "Phishing Check uses AI to scrutinize email texts for potential phishing content. Paste the body of the email into the provided text box and click \"Send to OpenAI\".",
  "example_input_output": "**Input:**\n```\nREQUEST FOR ASSISTANCE-STRICTLY CONFIDENTIAL\nI am Dr. Bakare Tunde, the cousin of Nigerian Astronaut, Air Force Major Abacha Tunde. He was the first African in space when he made a secret flight to the Salyut 6 space station in 1979. He was on a later Soviet spaceflight, Soyuz T-16Z to the secret Soviet military space station Salyut 8T in 1989. He was stranded there in 1990 when the Soviet Union was dissolved. His other Soviet crew members returned to earth on the Soyuz T-16Z, but his place was taken up by return cargo. There have been occasional Progrez supply flights to keep him going since that time. He is in good humor, but wants to come home.\n```\n\n**Output:**\n- **Summary:** The email text contains several red flags such as unusual claims, inconsistent details, and a request for confidential assistance. It may be indicative of a phishing attempt aimed at eliciting sensitive information or money transfers.\n- **Key Observations:** Unverified personal claims, urgency, and confidential language.\n- **Recommendation:** Treat with caution and verify the sender's identity through an independent channel.",
  "ai_agent_role": "You are an experienced cybersecurity analyst specializing in email security and phishing detection. You provide clear and actionable insights into potential phishing content.",
  "ai_agent_task": "Scrutinize the following email text for potential phishing content. Identify red flags, summarize the key suspicious elements, and provide recommendations on how to handle the email.",
  "payload_fields": [
    {
      "name": "email_body",
      "description": "Paste the full email text here for phishing analysis.",
      "required": True
    }
  ],
  "is_public": True
},
{
  "title": "Code Explain",
  "description": "Code Explain utilizes the advanced AI capabilities of OpenAI to provide detailed explanations of source code. Simply input your code, and the AI will help you understand its functionality.",
  "example_input_output": "**Input:**\n```cpp\n// Your First C++ Program\n\n#include <iostream>\n\nint main() {\n    std::cout << \"Hello World!\";\n    return 0;\n}\n```\n\n**Output:**\n- **Summary:** This C++ program prints the message \"Hello World!\" to the console.\n- **Detailed Explanation:**\n  - The `#include <iostream>` directive includes the Standard Input-Output Stream library which allows the program to perform input and output operations.\n  - The `main` function is the entry point of any C++ program.\n  - Inside the `main` function, `std::cout` is used to output the string \"Hello World!\" to the console.\n  - The function returns `0`, indicating that the program has executed successfully.",
  "ai_agent_role": "You are an expert software engineer and technical writer, proficient in multiple programming languages. Your role is to provide clear and detailed explanations of source code.",
  "ai_agent_task": "Analyze the following source code and provide a comprehensive explanation of its functionality. Your explanation should include a summary of what the code does and a step-by-step breakdown of its components.",
  "payload_fields": [
    {
      "name": "code",
      "description": "Paste your source code here for explanation.",
      "required": True
    }
  ],
  "is_public": True
},
{
  "title": "Code Deobfuscate",
  "description": "Code Deobfuscate uses AI to deobfuscate source code and extract possible Indicators of Compromise (IOCs). Simply paste your obfuscated code to get started.",
  "example_input_output": "**Input:**\n```javascript\neval(function(p,a,c,k,e,r){\n  e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};\n  if(!''.replace(/^/,String)){\n    while(c--) r[e(c)] = k[c] || e(c);\n    k=[function(e){return r[e]}];\n    e=function(){return '\\w+'};\n    c=1\n  };\n  while(c--) if(k[c]) p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'), k[c]);\n  return p\n}('0(\"1, 2!\");',3,3,'console|log|Hello|OSINT'.split('|'),0,{}));\n```\n\n**Output:**\n- **Deobfuscated Code:** The code is transformed into a more human-readable format, for example:\n```javascript\nconsole.log(\"Hello, OSINT!\");\n```\n- **Extracted IOCs (if any):** Any potential indicators such as suspicious URLs, file hashes, or other threat markers will be listed.",
  "ai_agent_role": "You are an expert in software security and reverse engineering with a strong focus on code analysis and deobfuscation. Your role is to transform obfuscated code into a readable format and identify potential Indicators of Compromise.",
  "ai_agent_task": "Deobfuscate the following source code and extract any possible Indicators of Compromise (IOCs). Provide a clear, readable version of the code along with a summary of any suspicious elements you discover.",
  "payload_fields": [
    {
      "name": "obfuscated_code",
      "description": "Paste your obfuscated code here for deobfuscation and analysis.",
      "required": True
    }
  ],
  "is_public": True
},
{
  "title": "Incident Review",
  "description": "Incident Review allows users to review detailed incident reports and generate comprehensive summaries.",
  "example_input_output": "**Input:**\n```\nDate of Incident: May 20, 2024\n\nReported By: John Doe, IT Security Analyst\n\nSummary\nOn May 20, 2024, at approximately 10:00 AM, an unauthorized access attempt was detected on the company’s primary database server. The intrusion was identified through anomalous activity alerts triggered by the Security Information and Event Management (SIEM) system.\n\nDetails\nDescription of the Incident\nAt 10:00 AM, the SIEM system flagged multiple failed login attempts to the database server from an external IP address (192.168.1.100). Following the failed attempts, a successful login was recorded using an administrative account.\n\nImpact\nData Accessed: Customer records including names, addresses, and email addresses.\nSystems Affected: Primary database server (DB1).\nDowntime: No downtime reported, but increased server load was observed during the incident.\n\nActions Taken\nInitial Response:\n- The compromised administrative account was immediately disabled.\n- Network access for the external IP address was blocked.\n\nInvestigation:\n- Log files were reviewed to trace the source and method of intrusion.\n- Affected systems were isolated for further analysis.\n\nMitigation:\n- All administrative passwords were reset.\n- Multi-Factor Authentication (MFA) was enforced for all administrative accounts.\n- Additional network monitoring was implemented to detect any further suspicious activity.\n\nResolution\nThe incident was resolved by 1:00 PM on the same day. No further unauthorized access attempts have been detected. A thorough security audit is scheduled to ensure all potential vulnerabilities are addressed.\n\nRecommendations\n- Enhance Monitoring: Implement continuous monitoring and advanced threat detection systems.\n- User Training: Conduct regular security awareness training for employees.\n- Policy Review: Review and update the company’s security policies and incident response plan.\n\nConclusion\nThe prompt detection and response to the security incident minimized potential damage. Continued vigilance and proactive security measures are essential to protect the organization from future threats.\n```\n\n**Output:**\n- **Summary:** A comprehensive summary detailing the incident timeline, impact, investigation findings, actions taken, and recommendations for preventing future occurrences.",
  "ai_agent_role": "You are a seasoned incident response analyst and security expert, proficient in reviewing incident reports and generating clear, actionable summaries.",
  "ai_agent_task": "Analyze the following detailed incident report and generate a comprehensive summary. Your summary should include key details such as the timeline, impact, actions taken, and recommendations for future improvements.",
  "payload_fields": [
    {
      "name": "incident_report",
      "description": "Paste the detailed incident report here for analysis.",
      "required": True
    }
  ],
  "is_public": True
},
{
  "title": "Config Analysis",
  "description": "Config Analysis enables users to analyze configuration files for security misconfigurations or violations of best practices.",
  "example_input_output": "**Input:**\n```\n[server]\nport = 8080\nhost = 0.0.0.0\n\n[security]\npassword_min_length = 6\npassword_complexity = false\n\n[logging]\nenable_logging = false\n\n[firewall]\nallow_inbound = *\n```\n\n**Output:**\n- **Summary:** The configuration appears to have several potential security issues. The security section indicates weak password policies with a minimal length of 6 and no complexity requirement. Logging is disabled, which may hinder monitoring efforts, and the firewall configuration allows all inbound traffic, potentially exposing the server to external threats.\n- **Recommendations:**\n  1. Increase the password minimum length and enforce complexity requirements.\n  2. Enable logging to facilitate monitoring and incident response.\n  3. Restrict inbound connections on the firewall to only those that are necessary.",
  "ai_agent_role": "You are a security configuration expert with deep knowledge of system hardening and best practices.",
  "ai_agent_task": "Analyze the following configuration file and identify any potential security misconfigurations or violations of best practices. Provide a clear summary of the issues along with actionable recommendations to improve the security posture.",
  "payload_fields": [
    {
      "name": "configuration",
      "description": "Paste the configuration file here for analysis.",
      "required": True
    }
  ],
  "is_public": True
},
{
  "title": "Access Control Check",
  "description": "Access Control Check allows users to analyze access control lists (ACL) or permissions settings.",
  "example_input_output": "**Input:**\n```\n[user:admin]\npermissions = read, write, execute\n\n[user:guest]\npermissions = read\n\n[user:inactive_user]\npermissions = read, write\n\n[role:developer]\npermissions = read, write, execute\n```\n\n**Output:**\n- **Summary:** The ACL configuration defines different permission levels for users and roles. Admin users have full access, guests have limited access, and inactive users have more permissions than expected. The developer role has full permissions.\n- **Observations:**\n  - The 'inactive_user' has read and write permissions, which may be more than necessary.\n  - The configuration is clear, but a review of user roles and associated permissions is recommended to ensure least privilege.\n- **Recommendations:**\n  1. Verify that inactive users should have write access. Consider reducing their permissions to read-only or disabling the account if not in use.\n  2. Regularly review and update ACLs to ensure they follow the principle of least privilege.",
  "ai_agent_role": "You are a seasoned security analyst specializing in access control and permissions management.",
  "ai_agent_task": "Review the following access control list (ACL) configuration and identify any potential misconfigurations or deviations from best practices. Provide a summary of the issues and actionable recommendations to improve access control.",
  "payload_fields": [
    {
      "name": "acl_data",
      "description": "Paste the ACL or permissions configuration here for analysis.",
      "required": True
    }
  ],
  "is_public": True
}

]