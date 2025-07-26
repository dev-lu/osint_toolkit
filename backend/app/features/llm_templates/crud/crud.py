import logging
from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from app.features.llm_templates.models import AITemplate
from app.features.llm_templates.schemas import AITemplateCreate, AITemplateUpdate

logger = logging.getLogger(__name__)


def get_template(db: Session, template_id: str) -> Optional[AITemplate]:
    """
    Retrieve a single AI template by ID.
    
    Args:
        db: Database session
        template_id: Unique identifier for the template
        
    Returns:
        AITemplate object if found, None otherwise
        
    Raises:
        SQLAlchemyError: If database operation fails
    """
    try:
        logger.debug(f"Retrieving template with ID: {template_id}")
        template = db.query(AITemplate).filter(AITemplate.id == template_id).first()
        
        if template:
            logger.debug(f"Template found: {template.title}")
        else:
            logger.debug(f"Template not found with ID: {template_id}")
            
        return template
        
    except SQLAlchemyError as e:
        logger.error(f"Database error retrieving template {template_id}: {str(e)}")
        raise


def get_templates(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    user_id: Optional[str] = None
) -> List[AITemplate]:
    """
    Retrieve multiple AI templates with pagination and user filtering.
    
    Args:
        db: Database session
        skip: Number of records to skip for pagination
        limit: Maximum number of records to return
        user_id: Optional user ID to filter templates (includes public templates)
        
    Returns:
        List of AITemplate objects
        
    Raises:
        SQLAlchemyError: If database operation fails
    """
    try:
        logger.debug(f"Retrieving templates: skip={skip}, limit={limit}, user_id={user_id}")
        
        query = db.query(AITemplate)
        
        if user_id:
            query = query.filter(
                (AITemplate.user_id == user_id) | (AITemplate.is_public == True)
            )
            
        templates = query.order_by(AITemplate.order_number.asc()).offset(skip).limit(limit).all()
        
        logger.info(f"Retrieved {len(templates)} templates")
        return templates
        
    except SQLAlchemyError as e:
        logger.error(f"Database error retrieving templates: {str(e)}")
        raise


def create_template(
    db: Session,
    template: AITemplateCreate,
    user_id: Optional[str] = None
) -> AITemplate:
    """
    Create a new AI template.
    
    Args:
        db: Database session
        template: Template data for creation
        user_id: Optional user ID to associate with the template
        
    Returns:
        Created AITemplate object
        
    Raises:
        SQLAlchemyError: If database operation fails
    """
    try:
        logger.info(f"Creating new template: {template.title}")
        
        db_template = AITemplate(
            **template.dict(),
            user_id=user_id
        )
        
        db.add(db_template)
        db.commit()
        db.refresh(db_template)
        
        logger.info(f"Template created successfully with ID: {db_template.id}")
        return db_template
        
    except SQLAlchemyError as e:
        logger.error(f"Database error creating template: {str(e)}")
        db.rollback()
        raise


def update_template(
    db: Session,
    template_id: str,
    template_update: AITemplateUpdate
) -> Optional[AITemplate]:
    """
    Update an existing AI template.
    
    Args:
        db: Database session
        template_id: ID of template to update
        template_update: Updated template data
        
    Returns:
        Updated AITemplate object if found, None otherwise
        
    Raises:
        SQLAlchemyError: If database operation fails
    """
    try:
        logger.info(f"Updating template: {template_id}")
        
        db_template = get_template(db, template_id)
        if not db_template:
            logger.warning(f"Template not found for update: {template_id}")
            return None
            
        update_data = template_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_template, key, value)
            
        db.add(db_template)
        db.commit()
        db.refresh(db_template)
        
        logger.info(f"Template updated successfully: {template_id}")
        return db_template
        
    except SQLAlchemyError as e:
        logger.error(f"Database error updating template {template_id}: {str(e)}")
        db.rollback()
        raise


def delete_template(db: Session, template_id: str) -> bool:
    """
    Delete an AI template.
    
    Args:
        db: Database session
        template_id: ID of template to delete
        
    Returns:
        True if template was deleted, False if not found
        
    Raises:
        SQLAlchemyError: If database operation fails
    """
    try:
        logger.info(f"Deleting template: {template_id}")
        
        template = get_template(db, template_id)
        if not template:
            logger.warning(f"Template not found for deletion: {template_id}")
            return False
            
        db.delete(template)
        db.commit()
        
        logger.info(f"Template deleted successfully: {template_id}")
        return True
        
    except SQLAlchemyError as e:
        logger.error(f"Database error deleting template {template_id}: {str(e)}")
        db.rollback()
        raise


def reorder_templates(
    db: Session,
    template_ids: List[str],
    start_order: int = 10,
    increment: int = 10
) -> List[AITemplate]:
    """
    Reorder templates by assigning new order numbers.
    
    Args:
        db: Database session
        template_ids: Ordered list of template IDs
        start_order: Starting order number
        increment: Amount to increment between each template
        
    Returns:
        List of updated AITemplate objects
        
    Raises:
        SQLAlchemyError: If database operation fails
    """
    try:
        logger.info(f"Reordering {len(template_ids)} templates")
        
        updated_templates = []
        current_order = start_order
        
        for template_id in template_ids:
            template = get_template(db, template_id)
            if template:
                template.order_number = current_order
                db.add(template)
                updated_templates.append(template)
                current_order += increment
            else:
                logger.warning(f"Template not found during reorder: {template_id}")
        
        db.commit()
        
        logger.info(f"Successfully reordered {len(updated_templates)} templates")
        return updated_templates
        
    except SQLAlchemyError as e:
        logger.error(f"Database error reordering templates: {str(e)}")
        db.rollback()
        raise
