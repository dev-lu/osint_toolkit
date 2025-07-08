from sqlalchemy.orm import Session
from typing import Optional, List, Dict
from app.features.llm_templates.models import AITemplate
from app.features.llm_templates.schemas import AITemplateCreate, AITemplateUpdate

def get_template(db: Session, template_id: str) -> Optional[AITemplate]:
    return db.query(AITemplate).filter(AITemplate.id == template_id).first()

def get_templates(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    user_id: Optional[str] = None
) -> List[AITemplate]:
    query = db.query(AITemplate)
    if user_id:
        query = query.filter(
            (AITemplate.user_id == user_id) | (AITemplate.is_public == True)
        )
    return query.offset(skip).limit(limit).all()

def create_template(
    db: Session,
    template: AITemplateCreate,
    user_id: Optional[str] = None
) -> AITemplate:
    db_template = AITemplate(
        **template.dict(),
        user_id=user_id
    )
    db.add(db_template)
    db.commit()
    db.refresh(db_template)
    return db_template

def update_template(
    db: Session,
    template_id: str,
    template_update: AITemplateUpdate
) -> Optional[AITemplate]:
    db_template = get_template(db, template_id)
    if db_template:
        for key, value in template_update.dict(exclude_unset=True).items():
            setattr(db_template, key, value)
        db.add(db_template)
        db.commit()
        db.refresh(db_template)
    return db_template

def delete_template(db: Session, template_id: str) -> bool:
    template = get_template(db, template_id)
    if template:
        db.delete(template)
        db.commit()
        return True
    return False

def reorder_templates(
    db: Session,
    template_ids: List[str],
    start_order: int = 10,
    increment: int = 10
) -> List[AITemplate]:
    """
    Reorder a list of templates by assigning new order numbers
    
    Args:
        db: Database session
        template_ids: Ordered list of template IDs
        start_order: Starting order number
        increment: Amount to increment between each template
        
    Returns:
        List of updated AITemplate objects
    """
    updated_templates = []
    current_order = start_order
    
    for template_id in template_ids:
        template = get_template(db, template_id)
        if template:
            template.order_number = current_order
            db.add(template)
            updated_templates.append(template)
            current_order += increment
    
    db.commit()
    return updated_templates