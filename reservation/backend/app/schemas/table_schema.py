from pydantic import BaseModel


class Table_Validation(BaseModel):
    # id: Optional[int] = None
    table_name:str
    table_number: str
    capacity: int
    is_available:bool

    # class Config:
    #     from_attributes = True
