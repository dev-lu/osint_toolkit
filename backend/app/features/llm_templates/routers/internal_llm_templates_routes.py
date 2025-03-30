from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.dependencies import get_db
from app.features.llm_templates.crud import get_templates as crud_get_templates
from app.features.llm_templates.crud import create_template as crud_create_template
from app.features.llm_templates.crud import update_template as crud_update_template
from app.features.llm_templates.crud import delete_template as crud_delete_template
from app.features.llm_templates.crud import get_template as crud_get_template
from app.features.llm_templates.schemas import AITemplate, AITemplateCreate, AITemplateUpdate, AITemplateExecute
from app.features.llm_templates.service import llm_templates_service
from app.core.settings.api_keys.crud import api_keys_settings_crud
from app.utils import llm_service
import json

router = APIRouter()


@router.post("/api/ai-templates", response_model=AITemplate, tags=["AI Templates"])
async def create_template(
    template: AITemplateCreate,
    db: Session = Depends(get_db)
):
    """Create a new AI template"""
    return crud_create_template(db, template)


@router.get("/api/ai-templates", response_model=List[AITemplate], tags=["AI Templates"])
async def get_templates(
    skip: int = 0,
    limit: int = 100,
    user_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all accessible templates"""
    return crud_get_templates(db, skip, limit, user_id)


@router.get("/api/ai-templates/{template_id}", response_model=AITemplate, tags=["AI Templates"])
async def get_template(template_id: str, db: Session = Depends(get_db)):
    """Get a specific template by ID"""
    template = crud_get_template(db, template_id)
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    return template


@router.put("/api/ai-templates/{template_id}", response_model=AITemplate, tags=["AI Templates"])
async def update_template(
    template_id: str,
    template_update: AITemplateUpdate,
    db: Session = Depends(get_db)
):
    """Update an existing template"""
    template = crud_update_template(db, template_id, template_update)
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    return template


@router.delete("/api/ai-templates/{template_id}", tags=["AI Templates"])
async def delete_template(template_id: str, db: Session = Depends(get_db)):
    """Delete a template"""
    success = crud_delete_template(db, template_id)
    if not success:
        raise HTTPException(status_code=404, detail="Template not found")
    return {"status": "success"}


@router.post("/api/ai-templates/execute/{template_id}", tags=["AI Templates"])
async def execute_template(
    template_id: str,
    execution_data: AITemplateExecute,
    db: Session = Depends(get_db)
):
    """Execute an AI template with provided payload data"""
    template = crud_get_template(db, template_id)
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    
    required_fields = {field['name'] for field in template.payload_fields if field.get('required', False)}
    provided_fields = set(execution_data.payload_data.keys())
    
    if not required_fields.issubset(provided_fields):
        missing_fields = required_fields - provided_fields
        raise HTTPException(
            status_code=400,
            detail=f"Missing required payload fields: {', '.join(missing_fields)}"
        )
    
    formatted_prompt = template.ai_agent_task
    
    # Check if each field is present in the prompt; if not, append it at the end
    for field_name, field_value in execution_data.payload_data.items():
        field_tag = f"<{field_name}>"
        if field_tag not in formatted_prompt:
            formatted_prompt += f"\n\n{field_tag}\n{field_value}\n</{field_name}>"
        else:
            # Replace existing tags with the field value
            formatted_prompt = formatted_prompt.replace(
                f"<{field_name}>", str(field_value)
            ).replace(
                f"</{field_name}>", ""
            )
    
    # Create LLM service
    llm_service_instance = llm_service.create_llm_service(db)
    
    # Use the model specified in the request or default to gpt-3.5
    model_id = execution_data.model_id if hasattr(execution_data, 'model_id') else "gpt-3.5"
    
    try:
        response = llm_service_instance.execute_prompt(
            model_id=model_id,
            system_prompt=template.ai_agent_role,
            user_prompt=formatted_prompt,
            temperature=execution_data.temperature if hasattr(execution_data, 'temperature') else 0.7,
            max_tokens=execution_data.max_tokens if hasattr(execution_data, 'max_tokens') else 1000
        )
        return {"result": response}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def clean_response(response_text: str) -> str:
    """
    Clean the LLM response by removing markdown code fences and extraneous text.
    This helper function strips leading/trailing whitespace and removes starting/ending
    markdown code block markers (e.g. ``` or ```json).
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


@router.post("/api/ai-templates/prompt-engineer", tags=["AI Templates"])
async def engineer_prompt(
    title: str = Body(..., embed=True),
    description: str = Body(..., embed=True),
    model_id: str = Body("gpt-4", embed=True),  # Default to GPT-4 for better prompt engineering
    db: Session = Depends(get_db)
):
    """
    Generate prompt configuration based on the provided title and description.
    The LLM will return a JSON object with the following keys:
      - ai_agent_role
      - ai_agent_task
      - payload_fields (a list of objects, each with name, description, required)
      - example_input_output (a markdown-formatted string)
    """
    
    prompt = (
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

    try:
        # Create LLM service
        llm_service_instance = llm_service.create_llm_service(db)
        
        response_text = llm_service_instance.execute_prompt(
            model_id=model_id,
            system_prompt="You are a helpful AI prompt engineer.",
            user_prompt=prompt,
            temperature=0.7,
            max_tokens=1500,
        )
        
        cleaned_response = clean_response(response_text)
        
        generated_data = json.loads(cleaned_response)
        
        required_keys = ["ai_agent_role", "ai_agent_task", "payload_fields", "example_input_output"]
        for key in required_keys:
            if key not in generated_data:
                raise HTTPException(status_code=500, detail=f"Missing key in generated data: {key}")
        
        return generated_data

    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse LLM response as JSON: {str(e)}")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))