from database.database import SessionLocal
from database import crud
import logging

logging.basicConfig(format='%(asctime)s - %(levelname)s - %(message)s',
                    datefmt='%B-%d-%Y %H:%M:%S',
                    level=logging.INFO)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_proxy():
    db = SessionLocal()
    proxy_enabled = crud.get_settings(db)[0].proxy_enabled
    proxystring = crud.get_settings(db)[0].proxy_string
    if proxy_enabled and proxystring:
        proxies = {
            'http': proxystring,
            'https': proxystring
        }
    else:
        proxies = None
    return proxies
