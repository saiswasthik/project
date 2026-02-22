from pydantic import BaseModel
from datetime import date
from typing import Optional


class Reservation_Validation(BaseModel):
    id: Optional[int]=None
    name:str
    phone_number:str
    email:Optional[str]=None
    party_size:int
    date:date
    table:str
    notes:Optional[str]=None
    start_time:str
    end_time:str
    status:Optional[str]
    source:Optional[str]="Phone"
    
   