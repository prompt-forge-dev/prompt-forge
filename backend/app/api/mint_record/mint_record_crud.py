import logging

from sqlmodel import Session, desc, func, select

from app.api.shared.shared_models import PageQueryParams

from .mint_record_models import MintRecord, MintRecordCreate


class MintRecordCrud:
    def __init__(self, session: Session):
        self._logger = logging.getLogger(self.__class__.__name__)
        self._session = session

    def create_mint_record(
        self,
        *,
        mint_record_create: MintRecordCreate,
    ) -> MintRecord:
        db_obj = MintRecord.model_validate(
            mint_record_create,
            update={"metadata_uri": str(mint_record_create.metadata_uri)},
        )
        self._session.add(db_obj)
        self._session.commit()
        self._session.refresh(db_obj)

        return db_obj

    def get_mint_records(
        self,
        *,
        params: PageQueryParams,
        user_address: str | None = None,
    ) -> tuple[int, list[MintRecord]]:
        if user_address is None:
            count_statement = select(func.count()).select_from(MintRecord)
            count = self._session.exec(count_statement).one()
            statement = (
                select(MintRecord)
                .order_by(desc(MintRecord.timestamp))
                .offset(params.offset)
                .limit(params.limit)
            )
            mint_records = self._session.exec(statement).all()
        else:
            count_statement = (
                select(func.count())
                .select_from(MintRecord)
                .where(MintRecord.user_address == user_address)
            )
            count = self._session.exec(count_statement).one()
            statement = (
                select(MintRecord)
                .where(MintRecord.user_address == user_address)
                .order_by(desc(MintRecord.timestamp))
                .offset(params.offset)
                .limit(params.limit)
            )
            mint_records = self._session.exec(statement).all()

        return (count, mint_records)
