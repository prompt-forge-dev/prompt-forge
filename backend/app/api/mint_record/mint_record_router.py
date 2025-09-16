from typing import Annotated, Any

from fastapi import APIRouter, Query

from app.api.shared.shared_models import PageQueryParams

from .mint_record_deps import MintRecordServiceDep
from .mint_record_models import MintRecordCreate, MintRecordPublic, MintRecordsPublic

router = APIRouter(prefix="/mint-records", tags=["mint-records"])


@router.post("", response_model=MintRecordPublic)
async def create_mint_record(
    mint_record_create: MintRecordCreate,
    mint_recrod_service: MintRecordServiceDep,
) -> Any:
    response = mint_recrod_service.create_mint_record(
        mint_record_create=mint_record_create,
    )

    return response


@router.get("", response_model=MintRecordsPublic)
async def get_mint_records(
    params: Annotated[PageQueryParams, Query()],
    mint_record_service: MintRecordServiceDep,
) -> Any:
    response = mint_record_service.get_mint_records(params=params)

    return response


@router.get("/{user_address}", response_model=MintRecordsPublic)
async def get_user_mint_records(
    user_address: str,
    params: Annotated[PageQueryParams, Query()],
    mint_record_service: MintRecordServiceDep,
) -> Any:
    response = mint_record_service.get_mint_records(
        user_address=user_address, params=params
    )

    return response
