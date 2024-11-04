import requests
import json
import logging
from datetime import datetime


logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')


def handle_response(response):
    try:
        match response.status_code:
            case 200:
                try:
                    response_data = response.json()
                    response_text = response_data["choices"][0]["message"]["content"]
                    return response_text
                except (ValueError, KeyError, TypeError) as e:
                    logging.error(f"Error parsing JSON response: {e}")
                    return "Error: Invalid response format"
            case 401:
                logging.error("Error 401: Unauthorized")
                return "Error 401: Unauthorized"
            case 429:
                logging.error("Error 429: You exceeded your current quota, please check your plan and billing details.")
                return "Error 429: You exceeded your current quota, please check your plan and billing details."
            case _:
                logging.error(f"AI Assistant: An error occurred while receiving the response. Status Code: {response.status_code}")
                return f"Error: Received unexpected status code {response.status_code}"
    except Exception as e:
        logging.error(f"An error occurred while handling the response: {e}")
        return "Error: An unexpected error occurred"


def ask_prompt(input: str, apikey: str, prompt: str):
    endpoint = "https://api.openai.com/v1/chat/completions"
    prompts = {
        'loganalysis': (
            "Analyze the following log data in two parts. First, provide a detailed explanation of the log entries, "
            "including the significance of each entry. Then, conduct a thorough analysis to identify any indicators "
            "of malicious activity, specifying the type of potential threat and its implications: " +
            str(input)
        ),
        'emailanalysis': (
            "Carefully analyze the content of this email for potential phishing indicators. Identify and explain any "
            "red flags or warning signs, such as suspicious links, unusual sender addresses, or deceptive language. "
            "Provide a risk assessment and suggest protective actions: " +
            str(input)
        ),
        'codeexpert': (
            "Examine the following source code in detail. Provide a comprehensive explanation of its functionality, "
            "including the purpose of each key section. Highlight any areas of potential concern, such as vulnerabilities "
            "or inefficient code practices: " + str(input)
        ),
        'deobfuscator': (
            "Simplify the given obfuscated code and analyze it for potential security threats. Provide a clear, deobfuscated "
            "version of the code as a snippet. Additionally, list any indicators of compromise or suspicious elements you "
            "identify, explaining their potential impact and relevance in bullet points: " +
            str(input)
        ),
        'incidentreport': (
            "Review the following incident report. Summarize the key details of the incident, including the timeline, nature "
            "of the attack, and affected systems. Provide a thorough analysis of the incident's impact and suggest potential "
            "improvements to prevent future occurrences: " + str(input)
        ),
        'configreview': (
            "Analyze the provided configuration file for any security misconfigurations or best practice violations. "
            "Explain the significance of each finding and provide recommendations for secure configuration settings: " + str(input)
        ),
        'patchanalysis': (
            "Evaluate the given patch notes or update description. Identify the key security improvements or fixes included in the update. "
            "Assess the potential impact of these changes on system security and provide recommendations for deployment: " + str(input)
        ),
        'accesscontrol': (
            "Analyze the provided access control list (ACL) or permissions settings. Identify any potential security risks or misconfigurations. "
            "Provide recommendations for improving access control and ensuring proper security measures are in place: " + str(input)
        ),
    }

    # Model to use
    model = "gpt-3.5-turbo"

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {apikey}"
    }

    # Request data
    data = {
        "model": model,
        "messages": [
            {"role": "system", "content": (
                "You are an expert assistant specialized in cybersecurity. Your goal is to provide in-depth analysis, "
                "detailed explanations, and actionable insights to assist cybersecurity analysts in their work. "
                "Use technical language appropriate for experienced professionals in the field."
            )},
            {"role": "user", "content": prompts[prompt]}
        ],
        "temperature": 0.6,
        "max_tokens": 1000
    }

    response = requests.post(endpoint, headers=headers, data=json.dumps(data))
    return handle_response(response)
