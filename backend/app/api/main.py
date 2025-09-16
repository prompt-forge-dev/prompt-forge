from fastapi import APIRouter

from app.api.mint_record import mint_record_router
from app.api.prompt import prompt_router
from app.api.util import util_router

api_router = APIRouter()
api_router.include_router(util_router.router)
api_router.include_router(prompt_router.router)
api_router.include_router(mint_record_router.router)
