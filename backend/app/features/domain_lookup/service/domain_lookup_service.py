import requests
import logging
from fastapi import APIRouter, HTTPException
import httpx


async def urlscanio_async(domain: str):
    try:
        url = f"https://urlscan.io/api/v1/search/?q=domain:{domain}"
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()
            response_json = [dict(item, expanded=False) for item in data['results']]
            logging.info(
                f"Domain monitoring: {len(response_json)} results for {domain}")
            return response_json
    except httpx.RequestError as e:
        logging.error(f"Domain monitoring: Request error: {e}")
    except KeyError as e:
        logging.error(
            f"Domain monitoring: KeyError - 'results' key not found in the response: {e}")
    except Exception as e:
        logging.error(f"Domain monitoring: An unexpected error occurred: {e}")
    return []