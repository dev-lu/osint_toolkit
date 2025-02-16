import requests
import json
import logging
from typing import Optional

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def execute_prompt(
    ai_agent_role: str,
    ai_agent_task: str,
    api_key: str,
    model: str = "gpt-3.5-turbo",
    temperature: float = 0.6,
    max_tokens: int = 1000
) -> Optional[str]:
    """Execute a prompt using OpenAI's API"""
    endpoint = "https://api.openai.com/v1/chat/completions"
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    
    data = {
        "model": model,
        "messages": [
            {"role": "system", "content": ai_agent_role},
            {"role": "user", "content": ai_agent_task}
        ],
        "temperature": temperature,
        "max_tokens": max_tokens
    }
    
    try:
        response = requests.post(endpoint, headers=headers, data=json.dumps(data))
        return handle_response(response)
    except Exception as e:
        logging.error(f"Error executing prompt: {e}")
        raise Exception(f"Failed to execute prompt: {str(e)}")

def handle_response(response: requests.Response) -> str:
    """Handle the API response and extract the content"""
    try:
        match response.status_code:
            case 200:
                try:
                    response_data = response.json()
                    return response_data["choices"][0]["message"]["content"]
                except (ValueError, KeyError, TypeError) as e:
                    logging.error(f"Error parsing JSON response: {e}")
                    raise Exception("Invalid response format")
            case 401:
                logging.error("Error 401: Unauthorized")
                raise Exception("Unauthorized")
            case 429:
                logging.error("Error 429: Rate limit exceeded")
                raise Exception("Rate limit exceeded")
            case _:
                logging.error(f"Unexpected status code: {response.status_code}")
                raise Exception(f"Unexpected status code: {response.status_code}")
    except Exception as e:
        logging.error(f"Error handling response: {e}")
        raise Exception(f"Error handling response: {str(e)}")
