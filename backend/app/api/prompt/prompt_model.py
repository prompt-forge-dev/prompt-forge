from pydantic import AnyUrl
from sqlmodel import Field, SQLModel


class PromptBase(SQLModel):
    prompt: str = Field(min_length=3, max_length=1024)


class PromptRequest(PromptBase):
    pass


class PromptResponse(PromptBase):
    image_cid: str
    metadata_uri: AnyUrl
