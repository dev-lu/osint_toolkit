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
