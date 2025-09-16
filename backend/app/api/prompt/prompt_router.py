from typing import Any

from fastapi import APIRouter

from .prompt_deps import PromptServiceDep
from .prompt_model import PromptRequest, PromptResponse

router = APIRouter(prefix="/prompts", tags=["prompts"])


@router.post("/generate-image", response_model=PromptResponse)
async def generate_image(
    request: PromptRequest,
    prompt_service: PromptServiceDep,
) -> Any:
    """Generate a new image from user prompt."""
    response = await prompt_service.generate_image_from_prompt(request=request)

    return response
