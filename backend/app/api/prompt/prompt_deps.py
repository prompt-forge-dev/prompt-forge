from typing import Annotated

from fastapi import Depends

from app.core.ai_pipeline_factory import ai_pipeline_factory

from .prompt_service import PromptService


def get_prompt_service() -> PromptService:
    ai_pipeline = ai_pipeline_factory.get_pipeline()

    return PromptService(ai_pipeline=ai_pipeline)


PromptServiceDep = Annotated[PromptService, Depends(get_prompt_service)]
