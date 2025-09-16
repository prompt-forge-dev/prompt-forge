from sqlmodel import Field, SQLModel


class PageQueryParams(SQLModel):
    current_page: int = Field(1, ge=1)
    page_size: int = Field(20, ge=1, le=100)

    @property
    def offset(self) -> int:
        return (self.current_page - 1) * self.page_size

    @property
    def limit(self) -> int:
        return self.page_size
