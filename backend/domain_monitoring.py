import requests
import logging

# Fetch Urlscan API


def urlscanio(domain: str):
    try:
        url = f"https://urlscan.io/api/v1/search/?q=domain:{domain}"
        response = requests.get(url=url)
        response.raise_for_status()
        response_json = [dict(item, expanded=False)
                         for item in response.json()['results']]
        logging.info(
            f"Domain monitoring: {len(response_json)} results for {domain}")
        return response_json
    except requests.exceptions.RequestException as e:
        logging.error(f"Domain monitoring: Request error: {e}")
    except KeyError as e:
        logging.error(
            f"Domain monitoring: KeyError - 'results' key not found in the response: {e}")
    except Exception as e:
        logging.error(f"Domain monitoring: An unexpected error occurred: {e}")
    return []
