import logging
import json
import asyncio
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Body, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from pydantic import BaseModel, ValidationError

from app.core.dependencies import get_db
from app.features.llm_templates.crud import (
    get_templates as crud_get_templates,
    create_template as crud_create_template,
    update_template as crud_update_template,
    delete_template as crud_delete_template,
    get_template as crud_get_template,
    reorder_templates as crud_reorder_templates
)
from app.features.llm_templates.schemas import (
    AITemplate, AITemplateCreate, AITemplateUpdate, AITemplateExecute
)
from app.features.llm_templates.service.llm_templates_service import LLMTemplateService
from app.features.llm_templates.utils.web_fetcher import fetch_web_contexts, format_web_contexts_for_prompt
from app.utils import llm_service

logger = logging.getLogger(__name__)
router = APIRouter()


class TemplateOrderUpdate(BaseModel):
    """Schema for template reordering requests."""
    template_ids: List[str]


class PromptEngineerRequest(BaseModel):
    """Schema for prompt engineering requests."""
    title: str
    description: str
    model_id: str = "gpt-4"


def _parse_json_field(field_data: Any, field_name: str) -> List[Dict[str, Any]]:
    """
    Parse JSON field data with error handling.
    
    Args:
        field_data: Raw field data (string or dict/list)
        field_name: Name of the field for error messages
        
    Returns:
        Parsed data as list of dictionaries
        
    Raises:
        HTTPException: If parsing fails
    """
    if isinstance(field_data, str):
        try:
            return json.loads(field_data)
        except (json.JSONDecodeError, TypeError) as e:
            logger.error(f"Failed to parse {field_name}: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Template {field_name} contains invalid JSON"
            )
    return field_data or []


def _validate_required_payload_fields(
    payload_fields: List[Dict[str, Any]], 
    provided_data: Dict[str, str]
) -> None:
    """
    Validate that all required payload fields are provided.
    
    Args:
        payload_fields: List of field definitions
        provided_data: User-provided payload data
        
    Raises:
        HTTPException: If required fields are missing
    """
    required_fields = {
        field["name"] for field in payload_fields 
        if field.get("required", False)
    }
    provided_fields = set(provided_data.keys())
    
    if not required_fields.issubset(provided_fields):
        missing = required_fields - provided_fields
        logger.warning(f"Missing required payload fields: {missing}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Missing required payload fields: {', '.join(missing)}"
        )


def _build_template_prompt(
    template: AITemplate,
    payload_data: Dict[str, str],
    web_content: str = "",
    static_content: str = ""
) -> str:
    """
    Build the complete prompt from template and payload data.
    
    Args:
        template: AI template object
        payload_data: User payload data
        web_content: Fetched web content
        static_content: Static context content
        
    Returns:
        Complete formatted prompt
    """
    formatted_prompt = template.ai_agent_task
    
    # Replace payload data placeholders
    for name, value in payload_data.items():
        tag_open = f"<{name}>"
        tag_close = f"</{name}>"
        
        if tag_open in formatted_prompt:
            formatted_prompt = (
                formatted_prompt
                .replace(tag_open, str(value))
                .replace(tag_close, "")
            )
        else:
            formatted_prompt += f"\n\n{tag_open}\n{value}\n{tag_close}"
    
    if static_content:
        formatted_prompt += f"\n\n# Static Context\n\n{static_content}"
    
    if web_content:
        formatted_prompt += f"\n\n# Web Context\n\n{web_content}"
    
    return formatted_prompt


def _format_static_contexts(static_contexts: List[Dict[str, Any]]) -> str:
    """
    Format static contexts for prompt inclusion.
    
    Args:
        static_contexts: List of static context objects
        
    Returns:
        Formatted static content string
    """
    if not static_contexts:
        return ""
    
    content_parts = []
    for context in static_contexts:
        name = context.get('name', 'Context')
        content = context.get('content', '')
        description = context.get('description', '')
        
        context_part = f"## {name}"
        if description:
            context_part += f"\n{description}"
        context_part += f"\n\n{content}"
        content_parts.append(context_part)
    
    return "\n\n---\n\n".join(content_parts)


@router.post("/api/ai-templates", response_model=AITemplate, tags=["AI Templates"])
async def create_template(
    template: AITemplateCreate,
    db: Session = Depends(get_db)
):
    """Create a new AI template."""
    try:
        logger.info(f"Creating new template: {template.title}")
        result = crud_create_template(db, template)
        logger.info(f"Template created successfully: {result.id}")
        return result
        
    except SQLAlchemyError as e:
        logger.error(f"Database error creating template: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create template due to database error"
        )
    except Exception as e:
        logger.error(f"Unexpected error creating template: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )


@router.get("/api/ai-templates", response_model=List[AITemplate], tags=["AI Templates"])
async def get_templates(
    skip: int = 0,
    limit: int = 100,
    user_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all accessible templates with pagination."""
    try:
        logger.debug(f"Retrieving templates: skip={skip}, limit={limit}")
        templates = crud_get_templates(db, skip, limit, user_id)
        logger.info(f"Retrieved {len(templates)} templates")
        return templates
        
    except SQLAlchemyError as e:
        logger.error(f"Database error retrieving templates: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve templates due to database error"
        )


@router.get("/api/ai-templates/{template_id}", response_model=AITemplate, tags=["AI Templates"])
async def get_template(template_id: str, db: Session = Depends(get_db)):
    """Get a specific template by ID."""
    try:
        logger.debug(f"Retrieving template: {template_id}")
        template = crud_get_template(db, template_id)
        
        if not template:
            logger.warning(f"Template not found: {template_id}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Template not found"
            )
        
        return template
        
    except HTTPException:
        raise
    except SQLAlchemyError as e:
        logger.error(f"Database error retrieving template: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve template due to database error"
        )


@router.put("/api/ai-templates/{template_id}", response_model=AITemplate, tags=["AI Templates"])
async def update_template(
    template_id: str,
    template_update: AITemplateUpdate,
    db: Session = Depends(get_db)
):
    """Update an existing template."""
    try:
        logger.info(f"Updating template: {template_id}")
        template = crud_update_template(db, template_id, template_update)
        
        if not template:
            logger.warning(f"Template not found for update: {template_id}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Template not found"
            )
        
        logger.info(f"Template updated successfully: {template_id}")
        return template
        
    except HTTPException:
        raise
    except SQLAlchemyError as e:
        logger.error(f"Database error updating template: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update template due to database error"
        )


@router.delete("/api/ai-templates/{template_id}", tags=["AI Templates"])
async def delete_template(template_id: str, db: Session = Depends(get_db)):
    """Delete a template."""
    try:
        logger.info(f"Deleting template: {template_id}")
        success = crud_delete_template(db, template_id)
        
        if not success:
            logger.warning(f"Template not found for deletion: {template_id}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Template not found"
            )
        
        logger.info(f"Template deleted successfully: {template_id}")
        return {"status": "success", "message": "Template deleted successfully"}
        
    except HTTPException:
        raise
    except SQLAlchemyError as e:
        logger.error(f"Database error deleting template: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete template due to database error"
        )


@router.post("/api/ai-templates/execute/{template_id}", tags=["AI Templates"])
async def execute_template(
    template_id: str,
    execution_data: AITemplateExecute,
    db: Session = Depends(get_db)
):
    """Execute an AI template with provided payload data."""
    try:
        logger.info(f"Executing template: {template_id}")
        
        template = crud_get_template(db, template_id)
        if not template:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Template not found"
            )
        
        payload_fields = _parse_json_field(template.payload_fields, "payload_fields")
        _validate_required_payload_fields(payload_fields, execution_data.payload_data)
        
        web_contexts = _parse_json_field(template.web_contexts, "web_contexts")
        static_contexts = _parse_json_field(template.static_contexts, "static_contexts")
        
        web_content_text = ""
        if web_contexts:
            try:
                logger.debug(f"Fetching {len(web_contexts)} web contexts")
                fetched_contexts = await fetch_web_contexts(web_contexts)
                web_content_text = format_web_contexts_for_prompt(fetched_contexts)
                logger.debug("Web contexts fetched successfully")
            except Exception as e:
                logger.warning(f"Failed to fetch web contexts: {str(e)}")
                web_content_text = f"<!-- Warning: Failed to fetch web contexts: {str(e)} -->"
        
        static_content_text = _format_static_contexts(static_contexts)
        
        formatted_prompt = _build_template_prompt(
            template=template,
            payload_data=execution_data.payload_data,
            web_content=web_content_text,
            static_content=static_content_text
        )
        
        llm = llm_service.create_llm_service(db)
        
        model_id = execution_data.override_model or template.model or "gpt-3.5-turbo"
        temperature = execution_data.override_temperature
        if temperature is None:
            temperature = template.temperature or 0.7
        
        logger.info(f"Executing with model: {model_id}, temperature: {temperature}")
        
        result = llm.execute_prompt(
            model_id=model_id,
            system_prompt=template.ai_agent_role,
            user_prompt=formatted_prompt,
            temperature=temperature,
            max_tokens=1000
        )
        
        logger.info(f"Template executed successfully: {template_id}")
        return {"result": result}
        
    except HTTPException:
        raise
    except ValidationError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Validation error: {str(e)}"
        )
    except ValueError as e:
        logger.error(f"Value error during execution: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Unexpected error during template execution: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Template execution failed: {str(e)}"
        )


@router.post("/api/ai-templates/prompt-engineer", tags=["AI Templates"])
async def engineer_prompt(
    request: PromptEngineerRequest,
    db: Session = Depends(get_db)
):
    """Generate prompt configuration based on title and description."""
    try:
        logger.info(f"Engineering prompt for: {request.title}")
        
        prompt = _build_prompt_engineering_prompt(request.title, request.description)
        
        llm_service_instance = llm_service.create_llm_service(db)
        
        response_text = llm_service_instance.execute_prompt(
            model_id=request.model_id,
            system_prompt="You are a helpful AI prompt engineer.",
            user_prompt=prompt,
            temperature=0.7,
            max_tokens=1500,
        )
        
        cleaned_response = _clean_llm_response(response_text)
        generated_data = json.loads(cleaned_response)
        
        required_keys = ["ai_agent_role", "ai_agent_task", "payload_fields", "example_input_output"]
        for key in required_keys:
            if key not in generated_data:
                raise ValueError(f"Missing key in generated data: {key}")
        
        logger.info("Prompt engineering completed successfully")
        return generated_data
        
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse LLM response as JSON: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to parse LLM response as JSON: {str(e)}"
        )
    except ValueError as e:
        logger.error(f"Value error during prompt engineering: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Unexpected error during prompt engineering: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/api/ai-templates/reorder", tags=["AI Templates"])
async def reorder_templates(
    order_update: TemplateOrderUpdate,
    db: Session = Depends(get_db)
):
    """Update the order of templates based on the provided list."""
    try:
        logger.info(f"Reordering {len(order_update.template_ids)} templates")
        
        updated_templates = crud_reorder_templates(db, order_update.template_ids)
        
        logger.info(f"Successfully reordered {len(updated_templates)} templates")
        return {
            "status": "success",
            "updated_count": len(updated_templates),
            "message": f"Successfully reordered {len(updated_templates)} templates"
        }
        
    except SQLAlchemyError as e:
        logger.error(f"Database error reordering templates: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to reorder templates due to database error"
        )
    except Exception as e:
        logger.error(f"Unexpected error reordering templates: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


def _build_prompt_engineering_prompt(title: str, description: str) -> str:
    """
    Build the prompt for prompt engineering functionality.
    
    Args:
        title: Template title
        description: Template description
        
    Returns:
        Complete prompt engineering prompt
    """
    return (
        "You are a world-class prompt engineer with deep expertise in crafting high-quality, structured prompts for large language models. "
        "Your task is to generate a complete, well-organized prompt based on a brief title and description. "
        "The output must be a single valid JSON object with the following keys: ai_agent_role, ai_agent_task, payload_fields, and example_input_output. "
        "Do not include any additional commentary, markdown formatting, or code fences in your output.\n\n"
        
        "You are given the following information:\n"
        f"Title: <title>{title}</title>\n"
        f"Description: <description>{description}</description>\n\n"
        
        "Your output must include the following sections:\n\n"
        
        "1. ai_agent_role: A clear and directive persona. For example, if the task involves analyzing patch notes, the system prompt should be: "
        "\"You are an experienced security engineer specialized in evaluating patch notes for key security improvements and fixes.\" "
        "Avoid casual introductions; use a professional and expert tone.\n\n"
        
        "2. ai_agent_task: Detailed, step-by-step instructions for the task. For example, for patch note analysis, instruct the model to: "
        "\"Analyze the following patch notes to identify and report on critical security updates, fixes, and improvements.\" "
        "Include clear directions on how to handle the input, what the expected output is, and any intermediate steps if needed. "
        "Use <field_name> tags to indicate placeholders where the user's payload data will be inserted.\n\n"
        
        "3. payload_fields: A list of fields that the end user must provide. For each field, include an object with the keys: "
        "name (string), description (string), and required (boolean). The required flag should be true if the field is mandatory.\n\n"
        
        "4. example_input_output: Provide a markdown-formatted example that demonstrates sample input and the expected output format. "
        "Ensure that the example clearly reflects the instructions provided in ai_agent_task.\n\n"
        
        "IMPORTANT: Return only a valid JSON object with the exact keys specified. Do not include any markdown formatting, code fences, or additional text.\n\n"
        
        "The JSON format to follow is: { \"ai_agent_role\": \"String\", \"ai_agent_task\": \"String\", \"payload_fields\": [ { \"name\": \"String\", \"description\": \"String\", \"required\": true } ], \"example_input_output\": \"String\" }"
    )


def _clean_llm_response(response_text: str) -> str:
    """
    Clean the LLM response by removing markdown code fences and extraneous text.
    
    Args:
        response_text: Raw LLM response
        
    Returns:
        Cleaned response text
    """
    response_text = response_text.strip()
    
    if response_text.startswith("```"):
        lines = response_text.splitlines()
        # Remove the first line if it starts with ```
        if lines and lines[0].startswith("```"):
            lines = lines[1:]
        # Remove the last line if it starts with ```
        if lines and lines[-1].startswith("```"):
            lines = lines[:-1]
        response_text = "\n".join(lines).strip()
    
    return response_text
