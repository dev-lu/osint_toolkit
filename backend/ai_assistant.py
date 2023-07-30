import requests
import json
import logging


def ask_prompt(input: str, apikey: str, prompt: str):
    endpoint = "https://api.openai.com/v1/completions"
    prompts = {
        'loganalysis': "Explain the following log data first and then Analyze it for any malicious activity: " + str(input),
        'emailanalysis': "Analyze the content of this email to identify red flags and warning signs that indicate it is a phishing attempt: " + str(input),
        'codeexpert': "Explain the following source code: " + str(input),
        'deobfuscater': "Give me a simplified version of the code below and extract possible indicators of compromise. Give me the answer in form of a code snippet and additional bulletpoints. " + str(input),
    }

    # Model to use
    model = "text-davinci-003"

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {apikey}"
    }

    # Request data
    data = {
        "prompt": prompts[prompt],
        "model": model,
        "temperature": 0.6,
        "max_tokens": 1000
    }

    response = requests.post(endpoint,
                             headers=headers,
                             data=json.dumps(data))
    match response.status_code:
        case 401: return "Error 401: Unauthorized"
        case 429: return "Error 429: You exceeded your current quota, please check your plan and billing details."
    if response.status_code == 200:
        response_data = response.json()
        response_text = response_data["choices"][0]["text"]
        return response_text
    else:
        logging.error(
            "AI Assistant: An error occured while receiving the response")
        return
