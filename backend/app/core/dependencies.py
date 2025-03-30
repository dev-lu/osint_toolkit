from app.core.database import SessionLocal
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
