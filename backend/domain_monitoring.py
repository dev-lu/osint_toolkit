import requests
import json

# Fetch Urlscan API
def urlscanio(domain:str, proxies:dict = None):
    url = f"https://urlscan.io/api/v1/search/?q=domain:{domain}"
    response = requests.get(url = url, proxies = proxies)
    response_json = [dict(item, expanded=False) for item in response.json()['results']]
    return response_json