import requests
import json


def ask_prompt(input: str, apikey: str, prompt: str, proxies:dict):
    endpoint = "https://api.openai.com/v1/completions"
    prompts = {
        'loganalysis': "Explain the following log data first and then Analyze it for any malicious activity: " + str(input),
        'emailanalysis': "Analyze the content of this email to identify red flags and warning signs that indicate it is a phishing attempt: " + str(input),
        'codeexpert': "Explain the following source code: " + str(input),
        'deobfuscater': "Simplify this code, make it human readable and extract possible indicators of compromise: " + str(input),
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
        "max_tokens":1000
    }

    response = requests.post(endpoint, 
                             headers=headers, 
                             data=json.dumps(data),
                             proxies=proxies)
    if response.status_code == 200:
        response_data = response.json()
        response_text = response_data["choices"][0]["text"]
        return response_text
    else:
        return "An error occurred"
