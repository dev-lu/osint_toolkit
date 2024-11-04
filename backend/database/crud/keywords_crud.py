from sqlalchemy.orm import Session
from database.models import Keyword


def get_keywords(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Keyword).offset(skip).limit(limit).all()


def create_keyword(db: Session, keyword: str):
    db_keyword = Keyword(keyword=keyword)
    db.add(db_keyword)
    db.commit()
    db.refresh(db_keyword)
    return db_keyword


def delete_keyword(db: Session, keyword_id: int):
    db_keyword = db.query(Keyword).filter(Keyword.id == keyword_id).first()
    if db_keyword:
        db.delete(db_keyword)
        db.commit()
        return True
    else:
        return False