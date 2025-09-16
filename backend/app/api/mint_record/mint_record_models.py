import uuid
from datetime import UTC, datetime

from pydantic import AnyUrl
from sqlmodel import Field, SQLModel


class MintRecordBase(SQLModel):
    user_address: str
    prompt: str = Field(max_length=1024)
    image_cid: str = Field(max_length=64)
    metadata_uri: AnyUrl
    transaction_hash: str = Field(max_length=66)


class MintRecordCreate(MintRecordBase):
    signature: str


class MintRecord(MintRecordBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_address: str = Field(index=True)
    metadata_uri: str
    transaction_hash: str = Field(max_length=66, unique=True)
    timestamp: datetime = Field(default_factory=lambda: datetime.now(UTC))


class MintRecordPublic(MintRecordBase):
    id: uuid.UUID
    timestamp: datetime


class MintRecordsPublic(SQLModel):
    data: list[MintRecordPublic]
    count: int
