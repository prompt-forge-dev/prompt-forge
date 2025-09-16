import logging

from eth_account import Account
from eth_account.messages import encode_defunct
from fastapi import HTTPException

from app.api.shared.shared_models import PageQueryParams

from .mint_record_crud import MintRecordCrud
from .mint_record_models import MintRecordCreate, MintRecordPublic, MintRecordsPublic


class MintRecordService:
    def __init__(self, mint_recrod_crud: MintRecordCrud):
        self._logger = logging.getLogger(self.__class__.__name__)
        self._mint_record_crud = mint_recrod_crud

    def create_mint_record(
        self,
        *,
        mint_record_create: MintRecordCreate,
    ) -> MintRecordPublic:
        # 1. Construct original message
        message_to_sign = f"Mint record for {mint_record_create.user_address}, transaction hash {mint_record_create.transaction_hash}"
        encoded_message = encode_defunct(text=message_to_sign)

        # 2. Validate signature
        try:
            signer_address: str = Account.recover_message(
                encoded_message, signature=mint_record_create.signature
            )

            if signer_address.lower() != mint_record_create.user_address.lower():
                raise HTTPException(
                    status_code=403,
                    detail="Signature does not match the provided address",
                )
        except Exception as e:
            self._logger.exception("Invalid signature")

            raise HTTPException(status_code=400, detail=f"Invalid signature: {e}")

        # 3. Save the mint record
        db_mint_record = self._mint_record_crud.create_mint_record(
            mint_record_create=mint_record_create
        )

        return MintRecordPublic.model_validate(db_mint_record)

    def get_mint_records(
        self,
        *,
        params: PageQueryParams,
        user_address: str | None = None,
    ) -> MintRecordsPublic:
        count, db_mint_records = self._mint_record_crud.get_mint_records(
            params=params, user_address=user_address
        )

        return MintRecordsPublic(count=count, data=db_mint_records)
