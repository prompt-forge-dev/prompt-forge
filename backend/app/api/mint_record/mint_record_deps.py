from typing import Annotated

from fastapi import Depends

from app.api.deps import SessionDep

from .mint_record_crud import MintRecordCrud
from .mint_record_service import MintRecordService


def get_mint_record_service(
    session: SessionDep,
) -> MintRecordService:
    mint_record_crud = MintRecordCrud(session)

    return MintRecordService(mint_recrod_crud=mint_record_crud)


MintRecordServiceDep = Annotated[MintRecordService, Depends(get_mint_record_service)]
